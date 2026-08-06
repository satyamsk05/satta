const express = require('express');
const router = express.Router();
const Round = require('../rounds/Round');
const Prediction = require('./Prediction');
const User = require('../users/User');
const authenticateToken = require('../auth/authMiddleware');

// Get active round
router.get('/active-round', async (req, res) => {
  try {
    const activeRound = await Round.findOne({ status: 'active' });
    if (!activeRound) return res.status(404).json({ message: 'No active round found!' });
    res.json(activeRound);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Submit a prediction
router.post('/predict', authenticateToken, async (req, res) => {
  try {
    const { roundId, number, points } = req.body;
    const user = await User.findById(req.user.id);
    const round = await Round.findById(roundId);

    if (!round) return res.status(404).json({ message: 'Round not found!' });
    if (round.status !== 'active') return res.status(400).json({ message: 'Round is already closed!' });
    if (user.walletBalance < points) return res.status(400).json({ message: 'Insufficient points!' });

    // Deduct points
    user.walletBalance -= points;
    await user.save();

    const prediction = new Prediction({
      userId: user._id,
      roundId: round._id,
      number: parseInt(number),
      points: parseInt(points)
    });

    await prediction.save();
    res.status(201).json({ message: 'Prediction submitted!', prediction, walletBalance: user.walletBalance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get recent history
router.get('/history', async (req, res) => {
  try {
    const history = await Round.find({ status: 'closed' }).sort({ endTime: -1 }).limit(10);
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
