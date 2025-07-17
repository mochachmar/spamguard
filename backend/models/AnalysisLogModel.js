const mongoose = require('mongoose');

const AnalysisLogSchema = new mongoose.Schema({
  isSpam: Boolean,
  accuracy: Number,
  source: {
    type: String,
    enum: ['web', 'telegram'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('AnalysisLog', AnalysisLogSchema);