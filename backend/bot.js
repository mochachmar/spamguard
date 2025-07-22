const TelegramBot = require('node-telegram-bot-api');
const { generateFullAnalysis } = require('./controllers/aiController'); 
const Tesseract = require('tesseract.js'); 
const { createMessage } = require('./controllers/messageControllers');
const https = require('https');
const fs = require('fs');
const path = require('path');
const AnalysisLog = require('./models/AnalysisLogModel');
const Setting = require('./models/SettingModel');

require('dotenv').config();

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

console.log('🤖 Bot Telegram siap menerima pesan');

const downloadImage = (url, dest) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {}); 
      reject(err);
    });
  });
};

const uploadDir = path.join(__dirname, 'uploads', 'images');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;

  const isActive = await isWithinActiveHours();
  if (!isActive) {
    const settings = await Setting.findOne();
    const start = settings?.activeHours?.start ?? 8;
    const end = settings?.activeHours?.end ?? 17;
    return bot.sendMessage(
      chatId,
      `⏰ Bot hanya aktif pukul ${start}:00 - ${end}:00`
    );
  }

  if (msg.text === '/start') {
    return bot.sendMessage(
      chatId,
      '🔍 Kirimkan pesan teks/gambar untuk analisis deteksi penipuan!\nSaya akan cek: Fraud, Spam, Promo, atau Pesan Normal.'
    );
  }
  
  if (msg.text) {
    const settings = await Setting.findOne();
    const minChar = settings?.minCharLength ?? 20;
    if (msg.text.length < minChar) {
      return;
    }
  }

  if (msg.photo) {
    try {
      const fileId = msg.photo[msg.photo.length - 1].file_id;
      const file = await bot.getFile(fileId);
      const fileUrl = `https://api.telegram.org/file/bot${token}/${file.file_path}`;

      bot.sendMessage(chatId, '🖼️ Menganalisis gambar...');

      const filename = `TG-${Date.now()}.jpg`;
      const destPath = path.join(uploadDir, filename);
      await downloadImage(fileUrl, destPath);
      
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

  bot.sendMessage(chatId, 'Selamat datang di Bot SpamGuard by QUASAR 😊 Kirim pesan teks atau gambar untuk dianalisis ya 😉');
});

async function analyzeMessage(chatId, userInput, imageFilename = null) {
  try {
    bot.sendMessage(chatId, '🤖 Sedang menganalisis...');
    
    const analysis = await generateFullAnalysis(userInput);

    let accuracyValue = 0;
    const accuracyMatch = analysis.tingkat_akurasi.match(/\d+(\.\d+)?/);
    if (accuracyMatch) {
      accuracyValue = parseFloat(accuracyMatch[0]);
    }
    
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

    await AnalysisLog.create({
      isSpam: ['Fraud', 'SPAM', 'Hoax', 'Mencurigakan'].includes(analysis.status),
      accuracy: accuracyValue,
      source: 'telegram'
    });

    const spamCategories = ['Fraud', 'SPAM', 'Hoax', 'Mencurigakan'];
    if (spamCategories.includes(analysis.status)) {
      await createMessage({
        content: userInput,
        category: analysis.status,
        fraudType: analysis.fraudType || 'Other',
        imageUrl: imageFilename,
        source: 'telegram'
      });

  const settings = await Setting.findOne();
  const isGroup = msg.chat.type !== 'private';
  
  if (isGroup && settings?.botActions) {
    const { botActions } = settings;
    const userId = msg.from.id;
    const chatId = msg.chat.id;
    const messageId = msg.message_id;
    const userName = msg.from.first_name || msg.from.username || 'pengguna';

    if (botActions.deleteMessage) {
      try {
        await bot.deleteMessage(chatId, messageId);
        console.log(`✅ Deleted spam message from ${userName}`);
      } catch (error) {
        console.error('Delete message error:', error);
      }
    }

    if (botActions.blockUser) {
      try {
        await bot.banChatMember(chatId, userId);
        console.log(`✅ Banned spam user: ${userName}`);
        
        const adminId = process.env.ADMIN_ID;
        if (adminId) {
          bot.sendMessage(
            adminId,
            `🚫 Pengguna ${userName} telah diblokir di grup ${msg.chat.title} karena spam`
          );
        }
      } catch (error) {
        console.error('Block user error:', error);
      }
    }

    if (botActions.restrictUser) {
      try {
        const untilDate = Math.floor(Date.now() / 1000) + 60 * 60 * 24; 
        await bot.restrictChatMember(chatId, userId, {
          can_send_messages: false,
          until_date: untilDate
        });
        console.log(`✅ Restricted user: ${userName}`);
      } catch (error) {
        console.error('Restrict user error:', error);
      }
    }

    // 4. Hapus semua pesan (beta)
    if (botActions.deleteAllMessages) {
      try {
        // Catatan: Telegram tidak menyediakan API untuk menghapus semua pesan
        // Solusi alternatif: kirim notifikasi ke admin
        const adminId = process.env.ADMIN_ID;
        if (adminId) {
          bot.sendMessage(
            adminId,
            `⚠️ HAPUS SEMUA PESAN DARI ${userName} DI GRUP ${msg.chat.title}\n` +
            `Silakan hapus manual semua pesan dari pengguna ini di grup.`
          );
        }
      } catch (error) {
        console.error('Delete all messages error:', error);
      }
    }

    // 5. Laporkan ke Telegram (beta)
    if (botActions.reportToTelegram) {
      try {
        // Catatan: Tidak ada API langsung untuk melaporkan
        // Solusi alternatif: kirim notifikasi ke admin
        const adminId = process.env.ADMIN_ID;
        if (adminId) {
          bot.sendMessage(
            adminId,
            `⚠️ LAPORKAN PENGIRIM SPAM: ${userName} DI GRUP ${msg.chat.title}\n` +
            `Silakan laporkan pengguna ini melalui menu report di Telegram.`
          );
        }
      } catch (error) {
        console.error('Report to Telegram error:', error);
      }
    }
  }
    }

  } catch (error) {
    console.error('Analysis Error:', error);
    
    await createMessage({
      content: userInput,
      category: 'Mencurigakan',
      fraudType: 'Other',
      imageUrl: imageFilename,
      source: 'telegram'
    });
    
    bot.sendMessage(chatId, '⚠️ Gagal menganalisis pesan. Pesan telah dicatat sebagai mencurigakan.');
  }
}

async function sendActionNotification(chatId, actionType, userName, groupName) {
  const actions = {
    blockUser: `🚫 Anda akan memblokir ${userName} di grup ${groupName}.`,
    deleteAllMessages: `🧹 Anda akan menghapus semua pesan dari ${userName} di grup ${groupName}.`,
    reportToTelegram: `⚠️ Anda akan melaporkan ${userName} ke Telegram.`,
    restrictUser: `⛔ Anda akan membatasi akses ${userName} di grup ${groupName}.`
  };

  const message = actions[actionType] || 'Tindakan admin akan dilakukan.';
  
  const options = {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Ya', callback_data: `confirm_${actionType}` }],
        [{ text: 'Tidak', callback_data: 'cancel_action' }]
      ]
    }
  };

  await bot.sendMessage(chatId, message, options);
}

bot.on('callback_query', async (callbackQuery) => {
  const { data, message } = callbackQuery;
  const chatId = message.chat.id;

  if (data.startsWith('confirm_')) {
    const actionType = data.split('_')[1];
    await bot.answerCallbackQuery(callbackQuery.id, { text: 'Tindakan dikonfirmasi!' });
  } else if (data === 'cancel_action') {
    await bot.answerCallbackQuery(callbackQuery.id, { text: 'Tindakan dibatalkan' });
  }
});

async function isWithinActiveHours() {
  const settings = await Setting.findOne();
  if (!settings) return true;

  const now = new Date();
  const currentHour = now.getHours();
  return currentHour >= settings.activeHours.start && currentHour < settings.activeHours.end;
}

function getStatusEmoji(status) {
  const emojis = {
    'Fraud': '😱',
    'SPAM': '😱',
    'Hoax': '😱',
    'PROMO': '🤩',
    'Normal': '😉',
    'Mencurigakan': '🧐'
  };
  return emojis[status] || '😐';
}