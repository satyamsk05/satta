const express = require('express');
const router = express.Router();
const Round = require('../rounds/Round');
const Prediction = require('../games/Prediction');
const User = require('../users/User');
const { startRoundAutomatically, closeRoundAutomatically } = require('../games/gameEngine');

// Start a new round manually
router.post('/rounds', async (req, res) => {
  try {
    // Force close active rounds first (safety check)
    await Round.updateMany({ status: 'active' }, { status: 'closed', winningNumber: 0 });

    const newRound = await startRoundAutomatically();
    res.status(201).json({ message: 'New round started!', round: newRound });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Close a round manually & declare result
router.post('/rounds/:id/close', async (req, res) => {
  try {
    const roundId = req.params.id;
    
    // If a manual winning number is provided, process manual wins
    if (req.body.winningNumber !== undefined) {
      const winningNumber = parseInt(req.body.winningNumber);
      const round = await Round.findById(roundId);
      if (!round) return res.status(404).json({ message: 'Round not found!' });

      round.winningNumber = winningNumber;
      round.status = 'closed';
      await round.save();

      const predictions = await Prediction.find({ roundId });
      for (const pred of predictions) {
        if (pred.number === winningNumber) {
          pred.status = 'win';
          const winnings = pred.points * 9;
          await User.findByIdAndUpdate(pred.userId, { $inc: { walletBalance: winnings } });
        } else {
          pred.status = 'lose';
        }
        await pred.save();
      }

      // Notify clients
      if (global.io) {
        global.io.emit('round_closed', {
          id: roundId,
          winningNumber,
          message: `Round closed manually! Winner is ${winningNumber}`
        });
      }

      return res.json({ message: 'Round closed manually!', round, winningNumber });
    }

    // Default auto close logic
    await closeRoundAutomatically(roundId);
    res.json({ message: 'Round closed automatically!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Modify Wallet points directly (Admin Feature)
router.post('/users/:id/wallet', async (req, res) => {
  try {
    const { amount } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found!' });

    user.walletBalance += parseInt(amount);
    await user.save();

    // Notify clients about balance update
    if (global.io) {
      global.io.emit('balance_updated', { userId: user._id, walletBalance: user.walletBalance });
    }

    res.json({ message: 'Wallet balance updated!', walletBalance: user.walletBalance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete User completely (Admin Feature)
router.delete('/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    await Prediction.deleteMany({ userId: req.params.id });
    res.json({ message: 'User and their prediction history deleted.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Reset Database (Safety Reset Feature)
router.post('/system/reset', async (req, res) => {
  try {
    await Prediction.deleteMany({});
    await Round.deleteMany({});
    await User.updateMany({}, { walletBalance: 1000 });
    res.json({ message: 'System database reset successfully. User wallets set to 1000.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
