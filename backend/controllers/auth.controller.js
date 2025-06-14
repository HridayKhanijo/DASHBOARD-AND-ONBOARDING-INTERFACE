import crypto from 'crypto';
import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import ApiError from '../utils/apiError.js';
import { StatusCodes } from 'http-status-codes';
import sendEmail from '../services/email.service.js';

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  };

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

export const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, passwordConfirm } = req.body;

    // 1) Check if passwords match
    if (password !== passwordConfirm) {
      return next(
        new ApiError('Passwords do not match', StatusCodes.BAD_REQUEST)
      );
    }

    // 2) Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(
        new ApiError('Email already in use', StatusCodes.BAD_REQUEST)
      );
    }

    // 3) Create new user
    const newUser = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password,
    });

    // 4) Generate email verification token
    const emailVerificationToken = newUser.createEmailVerificationToken();
    await newUser.save({ validateBeforeSave: false });

    // 5) Send verification email (in production)
    if (process.env.NODE_ENV === 'production') {
      const verificationUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/verify-email/${emailVerificationToken}`;
      
      await sendEmail({
        email: newUser.email,
        subject: 'Verify your email address',
        template: 'email-verification',
        context: {
          name: newUser.firstName,
          verificationUrl,
        },
      });
    }

    // 6) Log the user in, send JWT
    createSendToken(newUser, StatusCodes.CREATED, res);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
      return next(
        new ApiError('Please provide email and password', StatusCodes.BAD_REQUEST)
      );
    }

    // 2) Check if user exists && password is correct
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(
        new ApiError('Incorrect email or password', StatusCodes.UNAUTHORIZED)
      );
    }

    // 3) Check if user is active
    if (!user.active) {
      return next(
        new ApiError('This account has been deactivated', StatusCodes.FORBIDDEN)
      );
    }

    // 4) Update last login
    user.lastLogin = Date.now();
    await user.save({ validateBeforeSave: false });

    // 5) If everything ok, send token to client
    createSendToken(user, StatusCodes.OK, res);
  } catch (error) {
    next(error);
  }
};

export const protect = async (req, res, next) => {
  try {
    // 1) Getting token and check if it's there
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return next(
        new ApiError(
          'You are not logged in! Please log in to get access.',
          StatusCodes.UNAUTHORIZED
        )
      );
    }


    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(
        new ApiError(
          'The user belonging to this token no longer exists.',
          StatusCodes.UNAUTHORIZED
        )
      );
    }


    // 4) Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next(
        new ApiError(
          'User recently changed password! Please log in again.',
          StatusCodes.UNAUTHORIZED
        )
      );
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    res.locals.user = currentUser;
    next();
  } catch (error) {
    next(error);
  }
};

// Restrict certain routes to specific roles
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'lead-guide']. role='user'
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(
          'You do not have permission to perform this action',
          StatusCodes.FORBIDDEN
        )
      );
    }
    next();
  };
};

export const forgotPassword = async (req, res, next) => {
  try {
    // 1) Get user based on POSTed email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(
        new ApiError('There is no user with that email address.', 404)
      );
    }

    // 2) Generate the random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // 3) Send it to user's email
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/auth/reset-password/${resetToken}`;

    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      template: 'password-reset',
      context: {
        name: user.firstName,
        resetURL,
      },
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new ApiError(
        'There was an error sending the email. Try again later!',
        500
      )
    );
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    // 1) Get user based on the token
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    // 2) If token has not expired, and there is user, set the new password
    if (!user) {
      return next(new ApiError('Token is invalid or has expired', 400));
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // 3) Update changedPasswordAt property for the user
    // 4) Log the user in, send JWT
    createSendToken(user, 200, res);
  } catch (error) {
    next(error);
  }
};

export const updatePassword = async (req, res, next) => {
  try {
    // 1) Get user from collection
    const user = await User.findById(req.user.id).select('+password');

    // 2) Check if POSTed current password is correct
    if (
      !(await user.correctPassword(
        req.body.currentPassword,
        user.password
      ))
    ) {
      return next(
        new ApiError('Your current password is wrong.', 401)
      );
    }

    // 3) If so, update password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();

    // 4) Log user in, send JWT
    createSendToken(user, 200, res);
  } catch (error) {
    next(error);
  }
};
