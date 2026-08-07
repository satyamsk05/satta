const express = require('express');
const router = express.Router();
const User = require('../users/User');
const authenticateToken = require('../auth/authMiddleware');

// Get Profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found!' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
