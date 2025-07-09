const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * @param {string} prompt 
 * @returns {Promise<string>} 
 */
 
const generateTextFromAI = async (prompt) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('AI Generation Core Error:', error);
    return 'Maaf, terjadi kesalahan saat berkomunikasi dengan AI.';
  }
};

const generateContentForAPI = async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ message: 'Prompt is required' });
  }

  const generatedText = await generateTextFromAI(prompt);

  res.status(200).json({ generatedText });
};

module.exports = {
  generateTextFromAI,
  generateContentForAPI,
};