import express from 'express';
import { protect, restrictTo } from '../controllers/auth.controller.js';
import {
  getMe,
  updateMe,
  deleteMe,
  completeOnboarding,
  updateUserPreferences,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
} from '../controllers/user.controller.js';

const router = express.Router();

// Protect all routes after this middleware
router.use(protect);

// User profile routes
router.get('/me', getMe, getUser);
router.patch('/update-me', updateMe);
router.delete('/delete-me', deleteMe);

// Onboarding routes
router.patch('/complete-onboarding', completeOnboarding);
router.patch('/preferences', updateUserPreferences);

// Admin routes (restricted to admin users)
router.use(restrictTo('admin'));

router.route('/')
  .get(getAllUsers);

router.route('/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

export default router;
