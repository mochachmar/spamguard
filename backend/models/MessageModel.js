const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true // Pastikan id unik
  },
  content: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Fraud', 'SPAM', 'Hoax', 'Mencurigakan']
  },
  fraudType: {
    type: String,
    enum: ['Phishing', 'Malware', 'Scams', 'Other'],
    default: 'Other'
  },
  detectionDate: {
    type: Date,
    default: Date.now
  },
  imageUrl: {
    type: String,
    default: null
  },
  source: {
    type: String,
    enum: ['telegram', 'web'],
    required: true
  }
});

module.exports = mongoose.model('Message', MessageSchema);