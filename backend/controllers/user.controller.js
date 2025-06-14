import { StatusCodes } from 'http-status-codes';
import ApiError from '../utils/apiError.js';
import User from '../models/User.js';

// Helper function to filter object fields
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

// Get current user's profile
export const getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

// Update current user's profile
export const updateMe = async (req, res, next) => {
  try {
    // 1) Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
      return next(
        new ApiError(
          'This route is not for password updates. Please use /update-password.',
          StatusCodes.BAD_REQUEST
        )
      );
    }

    // 2) Filtered out unwanted fields that are not allowed to be updated
    const filteredBody = filterObj(
      req.body,
      'firstName',
      'lastName',
      'email',
      'phone',
      'photo'
    );

    // 3) Update user document
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      filteredBody,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(StatusCodes.OK).json({
      status: 'success',
      data: {
        user: updatedUser,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Delete current user (set active to false)
export const deleteMe = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { active: false });

    res.status(StatusCodes.NO_CONTENT).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

// Complete user onboarding
export const completeOnboarding = async (req, res, next) => {
  try {
    const { company, preferences } = req.body;

    // Update user with onboarding data
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        company: {
          name: company.name,
          industry: company.industry,
          size: company.size,
        },
        preferences: {
          theme: preferences.theme || 'light',
          layout: preferences.layout || 'default',
        },
        isOnboarded: true,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(StatusCodes.OK).json({
      status: 'success',
      data: {
        user: updatedUser,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update user preferences
export const updateUserPreferences = async (req, res, next) => {
  try {
    const { theme, layout } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        preferences: {
          theme: theme || req.user.preferences.theme,
          layout: layout || req.user.preferences.layout,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(StatusCodes.OK).json({
      status: 'success',
      data: {
        user: updatedUser,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get all users (admin only)
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    res.status(StatusCodes.OK).json({
      status: 'success',
      results: users.length,
      data: {
        users,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get user by ID
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(
        new ApiError('No user found with that ID', StatusCodes.NOT_FOUND)
      );
    }

    res.status(StatusCodes.OK).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update user (admin only)
export const updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return next(
        new ApiError('No user found with that ID', StatusCodes.NOT_FOUND)
      );
    }


    res.status(StatusCodes.OK).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Delete user (admin only)
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return next(
        new ApiError('No user found with that ID', StatusCodes.NOT_FOUND)
      );
    }

    res.status(StatusCodes.NO_CONTENT).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
