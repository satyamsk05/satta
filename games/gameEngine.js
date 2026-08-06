const mongoose = require('mongoose');
const Round = require('../rounds/Round');
const Prediction = require('./Prediction');
const User = require('../users/User');

let ioInstance = null;
let autoGameInterval = null;

// Initialize WebSockets and Auto Game Loop
const initGameEngine = (io) => {
  ioInstance = io;

  // Run scheduler every 5 seconds to manage rounds automatically
  if (!autoGameInterval) {
    autoGameInterval = setInterval(async () => {
      try {
        const activeRound = await Round.findOne({ status: 'active' });
        
        // If there's an active round and its end time has passed, close it automatically!
        if (activeRound && new Date() >= new Date(activeRound.endTime)) {
          console.log(`[Auto-Game] Auto-closing round: ${activeRound._id}`);
          await closeRoundAutomatically(activeRound._id);
        }

        // If there is no active round, start a new one automatically!
        const activeCheck = await Round.findOne({ status: 'active' });
        if (!activeCheck) {
          console.log(`[Auto-Game] Starting a new automated round...`);
          await startRoundAutomatically();
        }
      } catch (err) {
        console.error(`[Auto-Game Engine Error]: ${err.message}`);
      }
    }, 5000);
  }
};

// Start Round Logic
const startRoundAutomatically = async () => {
  try {
    const newRound = new Round({
      endTime: new Date(Date.now() + 60000) // 1 Minute Round Duration
    });
    await newRound.save();

    console.log(`[Auto-Game] New round started: ${newRound._id}`);

    // Broadcast to all connected clients (Mobile App & Admin Panel)
    if (ioInstance) {
      ioInstance.emit('new_round', {
        id: newRound._id,
        endTime: newRound.endTime
      });
    }
    return newRound;
  } catch (err) {
    console.error('Error starting round automatically:', err);
  }
};

// Close Round Logic
const closeRoundAutomatically = async (roundId) => {
  try {
    const round = await Round.findById(roundId);
    if (!round || round.status === 'closed') return;

    // Pick a random number between 0 and 9 as the winning result
    const winningNumber = Math.floor(Math.random() * 10);
    round.winningNumber = winningNumber;
    round.status = 'closed';
    await round.save();

    // Process all bets / predictions
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

    console.log(`[Auto-Game] Round ${roundId} closed. Winning Number: ${winningNumber}`);

    // Broadcast the result to everyone
    if (ioInstance) {
      ioInstance.emit('round_closed', {
        id: roundId,
        winningNumber,
        message: `Round closed! Winner is ${winningNumber}`
      });
    }
  } catch (err) {
    console.error('Error closing round automatically:', err);
  }
};

module.exports = {
  initGameEngine,
  startRoundAutomatically,
  closeRoundAutomatically
};
