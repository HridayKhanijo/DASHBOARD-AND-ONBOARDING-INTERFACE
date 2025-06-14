import express from 'express';
import {
  register,
  login,
  protect,
  forgotPassword,
  resetPassword,
  updatePassword,
} from '../controllers/auth.controller.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.patch('/reset-password/:token', resetPassword);

// Protected routes (require authentication)
router.use(protect);

// Update password for logged-in users
router.patch('/update-password', updatePassword);

// Email verification (to be implemented)
router.get('/verify-email/:token', async (req, res) => {
  try {
    // Implementation for email verification
    res.status(200).json({
      status: 'success',
      message: 'Email verification will be implemented here',
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
});

export default router;
