const TelegramBot = require('node-telegram-bot-api');
const { generateFullAnalysis } = require('./controllers/aiController'); 
const Tesseract = require('tesseract.js'); 
const { createMessage } = require('./controllers/messageControllers');
const https = require('https');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

console.log('🤖 Bot Telegram siap menerima pesan');

// Fungsi untuk mengunduh gambar
const downloadImage = (url, dest) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {}); // Hapus file jika error
      reject(err);
    });
  });
};

// Pastikan folder uploads/images ada
const uploadDir = path.join(__dirname, 'uploads', 'images');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;

  if (msg.text === '/start') {
    return bot.sendMessage(
      chatId,
      '🔍 Kirimkan pesan teks/gambar untuk analisis deteksi penipuan!\nSaya akan cek: Fraud, Spam, Promo, atau Pesan Normal.'
    );
  }

  if (msg.photo) {
    try {
      const fileId = msg.photo[msg.photo.length - 1].file_id;
      const file = await bot.getFile(fileId);
      const fileUrl = `https://api.telegram.org/file/bot${token}/${file.file_path}`;

      bot.sendMessage(chatId, '🖼️ Menganalisis gambar...');

      // Unduh gambar
      const filename = `TG-${Date.now()}.jpg`;
      const destPath = path.join(uploadDir, filename);
      await downloadImage(fileUrl, destPath);
      
      // Proses OCR
      const { data: { text } } = await Tesseract.recognize(
        destPath,
        'ind', 
      );
      
      if (!text.trim()) throw new Error('Tidak ada teks terdeteksi');
      return analyzeMessage(chatId, text, filename);
    } catch (error) {
      console.error('OCR Error:', error);
      return bot.sendMessage(chatId, '❌ Gagal membaca teks di gambar. Pastikan gambar jelas dan mengandung teks.');
    }
  }

  if (msg.text) {
    return analyzeMessage(chatId, msg.text);
  }

  bot.sendMessage(chatId, '⚠️ Kirim pesan teks atau gambar untuk dianalisis');
});

async function analyzeMessage(chatId, userInput, imageFilename = null) {
  try {
    bot.sendMessage(chatId, '🤖 Sedang menganalisis...');
    
    const analysis = await generateFullAnalysis(userInput);
    
    let response = `*Status Deteksi:* ${getStatusEmoji(analysis.status)} ${analysis.status}\n`;
    response += `*Tingkat Akurasi:* ${analysis.tingkat_akurasi}\n\n`;
    response += '*Analisis AI:*\n';
    
    analysis.analisis.forEach((point, i) => {
      response += `${i+1}. ${point}\n`;
    });
    
    response += '\n*Rekomendasi:*\n';
    analysis.rekomendasi.forEach((rec, i) => {
      response += `${i+1}. ${rec}\n`;
    });
    
    bot.sendMessage(chatId, response, { parse_mode: 'Markdown' });
    
    // Simpan jika termasuk spam
    const spamCategories = ['Fraud/SPAM/Hoax', 'MENCURIGAKAN'];
    if (spamCategories.includes(analysis.status)) {
      let specificCategory = 'SPAM';
      if (analysis.analisis.some(a => a.includes('phishing'))) specificCategory = 'Fraud';
      if (analysis.analisis.some(a => a.includes('hoax'))) specificCategory = 'Hoax';
      if (analysis.status === 'MENCURIGAKAN') specificCategory = 'Mencurigakan';

      let fraudType = 'Other';
      if (analysis.analisis.some(a => a.includes('phishing'))) fraudType = 'Phishing';
      if (analysis.analisis.some(a => a.includes('malware'))) fraudType = 'Malware';
      if (analysis.analisis.some(a => a.includes('scam'))) fraudType = 'Scams';

      await createMessage({
        content: userInput,
        category: specificCategory,
        fraudType,
        imageUrl: imageFilename,
        source: 'telegram'
      });
    }

  } catch (error) {
    console.error('Analysis Error:', error);
    bot.sendMessage(chatId, '⚠️ Gagal menganalisis pesan. Silakan coba lagi.');
  }
}

function getStatusEmoji(status) {
  const emojis = {
    'Fraud/SPAM/Hoax': '😱',
    'PROMO (Bukan Spam)': '🤩',
    'Normal (Bukan Spam)': '😉',
    'MENCURIGAKAN': '🧐'
  };
  return emojis[status] || '😐';
}