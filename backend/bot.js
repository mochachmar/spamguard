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
      return analyzeMessage(chatId, text, filename, msg);
    } catch (error) {
      console.error('OCR Error:', error);
      return bot.sendMessage(chatId, '❌ Gagal membaca teks di gambar. Pastikan gambar jelas dan mengandung teks.');
    }
  }

  if (msg.text) {
    return analyzeMessage(chatId, msg.text, null, msg);
  }

  bot.sendMessage(chatId, 'Selamat datang di Bot SpamGuard by QUASAR 😊 Kirim pesan teks atau gambar untuk dianalisis ya 😉');
});

async function analyzeMessage(chatId, userInput, imageFilename = null, msg) {
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
      const userId = msg.from.id;
      const messageId = msg.message_id;
      const userName = msg.from.first_name || msg.from.username || 'pengguna';
      const groupName = msg.chat.title || 'grup ini';

      if (settings?.enableMessageNotifications) {
        try {
          const adminId = process.env.ADMIN_ID;
          if (adminId) {
            const source = imageFilename ? 'gambar' : 'teks';
            const notification = `🚨 PESAN SPAM TERDETEKSI!\n\n` +
              `• Jenis: ${analysis.status} (${analysis.fraudType})\n` +
              `• Akurasi: ${analysis.tingkat_akurasi}\n` +
              `• Sumber: ${source}\n` +
              `• Grup: ${groupName}\n` +
              `• Pengirim: ${userName}\n\n` +
              `Pesan: ${userInput.substring(0, 200)}...`;
            
            bot.sendMessage(adminId, notification);
          }
        } catch (error) {
          console.error('Gagal mengirim notifikasi:', error);
        }
      }

      if (isGroup && settings?.botActions) {
        const { botActions } = settings;

        if (botActions.deleteMessage) {
          try {
            await bot.deleteMessage(chatId, messageId);
            console.log(`✅ Deleted spam message from ${userName}`);
          } catch (error) {
            console.error('Delete message error:', error);
          }
        }

        if (botActions.blockUser) {
          await sendActionNotification(chatId, 'blockUser', userName, groupName, userId);
        }
        
        if (botActions.deleteAllMessages) {
          await sendActionNotification(chatId, 'deleteAllMessages', userName, groupName, userId);
        }
        
        if (botActions.reportToTelegram) {
          await sendActionNotification(chatId, 'reportToTelegram', userName, groupName, userId);
        }
        
        if (botActions.restrictUser) {
          await sendActionNotification(chatId, 'restrictUser', userName, groupName, userId);
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

async function sendActionNotification(chatId, actionType, userName, groupName, userId) {
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
        [{ 
          text: 'Ya', 
          callback_data: `confirm_${actionType}_${userId}_${chatId}_${userName}_${groupName}` 
        }],
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
    const [_, actionType, userId, targetChatId, userName, groupName] = data.split('_');
    
    try {
      switch(actionType) {
        case 'blockUser':
          await bot.banChatMember(targetChatId, userId);
          await bot.sendMessage(chatId, `✅ Pengguna ${userName} telah diblokir dari grup ${groupName}`);
          break;
          
        case 'deleteAllMessages':
          await bot.sendMessage(chatId, `⚠️ Silakan hapus manual semua pesan dari ${userName} di grup ${groupName}`);
          break;
          
        case 'reportToTelegram':
          await bot.sendMessage(chatId, `⚠️ Silakan laporkan ${userName} secara manual melalui menu report Telegram`);
          break;
          
        case 'restrictUser':
          const untilDate = Math.floor(Date.now() / 1000) + 60 * 60 * 24; 
          await bot.restrictChatMember(targetChatId, userId, {
            can_send_messages: false,
            until_date: untilDate
          });
          await bot.sendMessage(chatId, `✅ Akses ${userName} telah dibatasi di grup ${groupName} selama 24 jam`);
          break;
      }
      
      await bot.answerCallbackQuery(callbackQuery.id, { text: 'Tindakan berhasil dilakukan!' });
    } catch (error) {
      console.error(`Error melakukan tindakan ${actionType}:`, error);
      await bot.answerCallbackQuery(callbackQuery.id, { text: 'Gagal melakukan tindakan' });
      await bot.sendMessage(chatId, `❌ Gagal melakukan tindakan ${actionType} pada ${userName}`);
    }
  } else if (data === 'cancel_action') {
    await bot.answerCallbackQuery(callbackQuery.id, { text: 'Tindakan dibatalkan' });
    await bot.sendMessage(chatId, 'Tindakan telah dibatalkan');
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