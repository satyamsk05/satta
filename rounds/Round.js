const mongoose = require('mongoose');

const RoundSchema = new mongoose.Schema({
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: {
    type: Date,
    required: true
  },
  winningNumber: {
    type: Number,
    default: null
  },
  status: {
    type: String,
    enum: ['active', 'closed'],
    default: 'active'
  }
});

module.exports = mongoose.model('Round', RoundSchema);
