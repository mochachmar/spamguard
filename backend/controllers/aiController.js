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
      Anda adalah detektif siber profesional. Tugas Anda adalah menganalisis pesan dan mengembalikan hasil HANYA dalam format JSON valid.
      
      ### PERATURAN KETAT OUTPUT:
      1. JANGAN GUNAKAN ANGKA/NOMOR APAPUN dalam analisis atau rekomendasi
      2. HINDARI: [1], (2), 3., 4,5,6 atau format bernomor lainnya
      3. JANGAN GUNAKAN KURUNG SIKU KOSONG [] DI MANA PUN
      4. Gunakan bahasa natural seperti manusia bicara
      5. Jangan sertakan referensi pencarian
      
      ### STRUKTUR JSON:
      {
        "status": "Fraud/SPAM/Hoax|PROMO (Bukan Spam)|Normal (Bukan Spam)|MENCURIGAKAN",
        "tingkat_akurasi": "string",
        "analisis": ["poin analisis 1", "poin analisis 2"],
        "rekomendasi": ["saran 1", "saran 2"]
      }
      
      ### CONTOH OUTPUT YANG BENAR:
      {
        "status": "Fraud/SPAM/Hoax",
        "tingkat_akurasi": "Tinggi (98%)",
        "analisis": [
          "Penawaran gaji tidak realistis tanpa proses seleksi",
          "Email menggunakan domain publik untuk perusahaan"
        ],
        "rekomendasi": [
          "Jangan klik tautan mencurigakan",
          "Verifikasi melalui saluran resmi"
        ]
      }
      
      ---
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

    return parsedData;

  } catch (error) {
    console.error('AI Generation Core Error:', error);
    return { error: 'Gagal menghasilkan analisis dari AI.' };
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

  // Simpan jika termasuk kategori spam
  const spamCategories = ['Fraud/SPAM/Hoax', 'MENCURIGAKAN'];
  if (spamCategories.includes(generatedData.status)) {
    const source = 'web';
    
    // Tentukan kategori spesifik
    let specificCategory = 'SPAM';
    if (generatedData.analisis.some(a => a.includes('phishing'))) specificCategory = 'Fraud';
    if (generatedData.analisis.some(a => a.includes('hoax'))) specificCategory = 'Hoax';
    if (generatedData.status === 'MENCURIGAKAN') specificCategory = 'Mencurigakan';

    // Tentukan fraud type
    let fraudType = 'Other';
    if (generatedData.analisis.some(a => a.includes('phishing'))) fraudType = 'Phishing';
    if (generatedData.analisis.some(a => a.includes('malware'))) fraudType = 'Malware';
    if (generatedData.analisis.some(a => a.includes('scam'))) fraudType = 'Scams';

    await createMessage({
      content: prompt,
      category: specificCategory,
      fraudType,
      imageUrl,
      source
    });

    // Simpan log analisis
    await AnalysisLog.create({
      isSpam: spamCategories.includes(generatedData.status),
      accuracy: parseFloat(generatedData.tingkat_akurasi),
      source: 'web'
    });
  }

  res.status(200).json(generatedData);
};

module.exports = {
  generateContentForAPI,
  generateFullAnalysis,
};