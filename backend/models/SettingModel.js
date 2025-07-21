const mongoose = require('mongoose');

const SettingSchema = new mongoose.Schema({
  minCharLength: {
    type: Number,
    default: 20
  },
  activeHours: {
    start: { 
      type: Number, 
      default: 8,
      min: 0,
      max: 23
    },
    end: { 
      type: Number, 
      default: 17,
      min: 0,
      max: 23
    }
  }
});

module.exports = mongoose.model('Setting', SettingSchema);