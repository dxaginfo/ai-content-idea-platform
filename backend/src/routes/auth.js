const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// Import controllers
const {
  register,
  login,
  getMe,
  updateProfile,
  updatePassword,
  updatePreferences,
  forgotPassword,
  resetPassword,
} = require('../controllers/auth');

// Register route
router.post('/register', register);

// Login route
router.post('/login', login);

// Get current user route
router.get('/me', protect, getMe);

// Update user profile
router.put('/me', protect, updateProfile);

// Update user password
router.put('/password', protect, updatePassword);

// Update user preferences
router.put('/preferences', protect, updatePreferences);

// Forgot password route
router.post('/forgot-password', forgotPassword);

// Reset password route
router.put('/reset-password/:resetToken', resetPassword);

module.exports = router;