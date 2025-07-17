const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    index: true 
  },
  content: {
    type: String,
    required: true,
    text: true 
  },
  category: {
    type: String,
    required: true,
    enum: ['Fraud', 'SPAM', 'Hoax', 'Mencurigakan'],
    index: true 
  },
  fraudType: {
    type: String,
    required: true,
    enum: ['Phishing', 'Malware', 'Scams', 'Other'],
    default: 'Other'
  },
  detectionDate: {
    type: Date,
    default: Date.now,
    index: true 
  },
  imageUrl: String,
  source: {
    type: String,
    required: true,
    enum: ['telegram', 'web']
  }
});

MessageSchema.index({ category: 1, fraudType: 1 });
MessageSchema.index({ detectionDate: -1 });

module.exports = mongoose.model('Message', MessageSchema);