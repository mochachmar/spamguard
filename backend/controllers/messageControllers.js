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

const createMessage = async (messageData) => {
  try {
    // Generate ID unik
    const prefix = messageData.source === 'telegram' ? 'TG' : 'WEB';
    const count = await Message.countDocuments({ source: messageData.source });
    const id = `${prefix}${(count + 1).toString().padStart(3, '0')}`;

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
    console.error('Save spam error:', err.message);
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