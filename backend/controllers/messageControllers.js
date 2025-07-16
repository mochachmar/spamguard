const Message = require('../models/MessageModel');

const getMessages = async (req, res) => {
  try {
    const messages = await Message.find();
    
    const formattedMessages = messages.map(msg => ({
      id: msg.id, // Gunakan id kustom
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

const createMessage = async (req, res) => {
  const { id, content, category, fraudType, imageUrl, source } = req.body;
  
  try {
    const newMessage = new Message({
      id,
      content,
      category,
      fraudType,
      imageUrl,
      source
    });
    
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  getMessages,
  createMessage
};