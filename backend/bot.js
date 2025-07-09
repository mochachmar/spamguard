const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

const { generateTextFromAI } = require('./controllers/aiController');

const token = process.env.TELEGRAM_BOT_TOKEN;

const bot = new TelegramBot(token, { polling: true });

console.log('🤖 Bot Telegram siap menerima pesan...');

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const userInput = msg.text;

  if (userInput === '/start') {
    bot.sendMessage(chatId, 'Halo! Kirimkan saya pertanyaan apa saja, dan saya akan mencoba menjawabnya dengan bantuan AI.');
    return;
  }

  bot.sendMessage(chatId, '🤖 AI sedang berpikir, mohon tunggu...');

  try {
    const aiResponse = await generateTextFromAI(userInput);

    bot.sendMessage(chatId, aiResponse);
  } catch (error) {
    console.error('Telegram Bot Error:', error);
    bot.sendMessage(chatId, 'Waduh, sepertinya ada sedikit masalah di sistem saya.');
  }
});