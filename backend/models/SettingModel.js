const mongoose = require('mongoose');

const SettingSchema = new mongoose.Schema({
  minCharLength: {
    type: Number,
    default: 20
  },
  activeHours: {
    start: { type: Number, default: 8 },
    end: { type: Number, default: 17 }
  }
});

module.exports = mongoose.model('Setting', SettingSchema);