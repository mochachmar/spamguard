const TelegramBot = require('node-telegram-bot-api');
const { generateFullAnalysis } = require('./controllers/aiController'); 
const Tesseract = require('tesseract.js'); 
const { createMessage } = require('./controllers/messageControllers');

require('dotenv').config();

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

console.log('🤖 Bot Telegram siap menerima pesan');

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
      const fileUrl = await bot.getFileLink(fileId);
      
      bot.sendMessage(chatId, '🖼️ Menganalisis gambar...');
      
      const { data: { text } } = await Tesseract.recognize(
        fileUrl,
        'ind', 
      );
      
      if (!text.trim()) throw new Error('Tidak ada teks terdeteksi');

      // Simpan gambar
      const filename = `TG-${Date.now()}.jpg`;
      const imagePath = path.join(__dirname, 'uploads', 'images', filename);
      fs.writeFileSync(imagePath, imageBuffer);
      
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