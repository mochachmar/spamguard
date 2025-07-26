const Message = require('../models/MessageModel');

const getMessages = async (req, res) => {
  try {
    const { category, fraudType, date, search } = req.query;
    
    let query = {};
    
    if (category) query.category = category;
    if (fraudType) query.fraudType = fraudType;
    if (date) {
      const startDate = new Date(date);
      startDate.setUTCHours(0, 0, 0, 0);
      
      const endDate = new Date(date);
      endDate.setUTCHours(23, 59, 59, 999);
      
      query.detectionDate = { $gte: startDate, $lte: endDate };
    }
    if (search) {
      query.$text = { $search: search };
    }
    
    const messages = await Message.find(query).sort({ detectionDate: -1 });
    
    const formattedMessages = messages.map(msg => ({
      id: msg.id, 
      category: msg.category,
      fraudType: msg.fraudType,
      date: msg.detectionDate.toISOString().split('T')[0],
      content: msg.content,
      imageUrl: msg.imageUrl
    }));

    res.json(formattedMessages);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const createMessage = async (messageData) => {
  try {
    const validCategories = ['Fraud', 'SPAM', 'Hoax', 'Mencurigakan'];
    if (!validCategories.includes(messageData.category)) {
      messageData.category = 'Mencurigakan';
    }

    const validFraudTypes = ['Phishing', 'Malware', 'Scams', 'Other'];
    if (!validFraudTypes.includes(messageData.fraudType)) {
      messageData.fraudType = 'Other';
    }

    const prefix = messageData.source === 'telegram' ? 'TG' : 'WEB';
    const count = await Message.countDocuments({ source: messageData.source });
    const id = `${prefix}${(count + 1).toString().padStart(4, '0')}`;

    const newMessage = new Message({
      id,
      content: messageData.content,
      category: messageData.category,
      fraudType: messageData.fraudType,
      imageUrl: messageData.imageUrl,
      source: messageData.source
    });
    
    await newMessage.save();
    return newMessage;
  } catch (err) {
    console.error('Error menyimpan pesan:', err.message);
    throw err;
  }
};

const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMessage = await Message.findOneAndDelete({ id });
    
    if (!deletedMessage) {
      return res.status(404).json({ message: 'Pesan tidak ditemukan' });
    }
    
    res.json({ message: 'Pesan berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getMessages,
  createMessage,
  deleteMessage
};