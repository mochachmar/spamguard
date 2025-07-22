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
  },
  botActions: {
    deleteMessage: { type: Boolean, default: false },
    blockUser: { type: Boolean, default: false },
    deleteAllMessages: { type: Boolean, default: false },
    reportToTelegram: { type: Boolean, default: false },
    restrictUser: { type: Boolean, default: false }
  },
  enableMessageNotifications: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('Setting', SettingSchema);