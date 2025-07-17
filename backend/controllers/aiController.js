const { GoogleGenerativeAI } = require('@google/generative-ai');
const { createMessage } = require('./messageControllers');
const AnalysisLog = require('../models/AnalysisLogModel');

require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const cleanText = (text) => {
  return text
    .replace(/\s*\[\d+\]\s*/g, '')     
    .replace(/\s*\(\d+\)\s*/g, '')     
    .replace(/\d+(,\s*\d+)+/g, '')     
    .replace(/\d+\.\s*/g, '')          
    .replace(/\b\d+\s*-\s*\d+\b/g, '') 
    .replace(/\s{2,}/g, ' ')           
    .trim();
};

const generateFullAnalysis = async (userInput) => {
  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash', 
      tools: [{ googleSearch: {} }]
    });

    const prompt = `
    Anda adalah sistem deteksi spam tingkat lanjut. Analisis pesan berikut:

    ### INSTRUKSI:
    1. Tentukan kategori: 
      - Fraud (Penipuan)
      - SPAM (Promosi massal)
      - Hoax (Berita palsu)
      - Mencurigakan (Tidak jelas)
      - PROMO (Promo resmi)
      - Normal (Biasa)

    2. Untuk Fraud, tentukan jenis:
      - Phishing: Minta info login/data sensitif
      - Malware: Berisi tautan/file berbahaya
      - Scams: Penipuan uang/hadiah
      - Other: Penipuan lain

    3. Berikan analisis singkat
    4. Berikan rekomendasi

    ### CONTOH FRAUD PHISHING:
    {
      "status": "Fraud",
      "fraudType": "Phishing",
      "tingkat_akurasi": "Tinggi (98%)",
      "analisis": [
        "Meminta verifikasi akun dengan tautan eksternal",
        "Menggunakan logo resmi palsu"
      ],
      "rekomendasi": [
        "Jangan klik tautan",
        "Verifikasi langsung ke situs resmi"
      ]
    }

    ### CONTOH SPAM:
    {
      "status": "SPAM",
      "fraudType": "Other",
      "tingkat_akurasi": "Tinggi (95%)",
      "analisis": [
        "Promosi produk massal tanpa personalisasi",
        "Tidak mengandung ancaman langsung"
      ],
      "rekomendasi": [
        "Mark as spam",
        "Hapus pesan"
      ]
    }

    ### PESAN UNTUK DIANALISIS:
    """
    ${userInput}
    """
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    const rawText = response.text();
    const startIndex = rawText.indexOf('{');
    const endIndex = rawText.lastIndexOf('}');
    
    if (startIndex === -1 || endIndex === -1) {
      throw new Error("Respons AI tidak mengandung JSON yang valid.");
    }
    
    const jsonText = rawText.substring(startIndex, endIndex + 1);
    const parsedData = JSON.parse(jsonText);

    if (Array.isArray(parsedData.analisis)) {
      parsedData.analisis = parsedData.analisis.map(cleanText);
    }
    
    if (Array.isArray(parsedData.rekomendasi)) {
      parsedData.rekomendasi = parsedData.rekomendasi.map(cleanText);
    }

    if (!parsedData.fraudType) {
      parsedData.fraudType = 'Other';
    }

    return parsedData;

  } catch (error) {
    console.error('AI Generation Core Error:', error);
    return { 
      error: 'Gagal menghasilkan analisis dari AI.',
      status: 'MENCURIGAKAN',
      fraudType: 'Other'
    };
  }
};

const generateContentForAPI = async (req, res) => {
  const { prompt, imageUrl } = req.body;
  if (!prompt) {
    return res.status(400).json({ message: 'Prompt dibutuhkan' });
  }
  const generatedData = await generateFullAnalysis(prompt);
  if (generatedData.error) {
    return res.status(500).json({ message: generatedData.error });
  }

  let accuracyValue = 0;
  const accuracyMatch = generatedData.tingkat_akurasi.match(/\d+(\.\d+)?/);
  if (accuracyMatch) {
    accuracyValue = parseFloat(accuracyMatch[0]);
  }

  await AnalysisLog.create({
    isSpam: ['Fraud', 'SPAM', 'Hoax', 'Mencurigakan'].includes(generatedData.status),
    accuracy: accuracyValue,
    source: 'web'
  });

  const spamCategories = ['Fraud', 'SPAM', 'Hoax', 'Mencurigakan'];
  if (spamCategories.includes(generatedData.status)) {
    const source = 'web';

    await createMessage({
      content: prompt,
      category: generatedData.status,
      fraudType: generatedData.fraudType || 'Other',
      imageUrl,
      source
    });
  }

  res.status(200).json(generatedData);
};

module.exports = {
  generateContentForAPI,
  generateFullAnalysis,
};