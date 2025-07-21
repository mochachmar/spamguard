const mongoose = require('mongoose');
const Setting = require('../models/SettingModel'); 

require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('🌐 Berhasil terhubung ke database MongoDB');
    
    const settingCount = await Setting.countDocuments();
    if (settingCount === 0) {
      await Setting.create({
        minCharLength: 20,
        activeHours: { start: 8, end: 17 }
      });
      console.log('⚙️ Setting default berhasil dibuat');
    }
  } catch (err) {
    console.error(err.message);
    process.exit(1); 
  }
};

module.exports = connectDB;