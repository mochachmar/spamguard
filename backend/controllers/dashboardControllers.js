const Message = require('../models/MessageModel');
const AnalysisLog = require('../models/AnalysisLogModel'); // Model baru

exports.getDashboardStats = async (req, res) => {
  try {
    // Total pesan (spam + non-spam)
    const totalProcessed = await AnalysisLog.countDocuments();
    
    // Pesan spam terdeteksi (hanya kategori spam)
    const spamDetected = await Message.countDocuments({
      category: { $in: ['Fraud', 'SPAM', 'Hoax', 'Mencurigakan'] }
    });

    // Rata-rata akurasi model
    const accuracyStats = await AnalysisLog.aggregate([
      { $match: { accuracy: { $ne: null } } },
      { $group: { _id: null, avgAccuracy: { $avg: "$accuracy" } } }
    ]);
    const modelAccuracy = accuracyStats[0]?.avgAccuracy || 0;

    // Trend spam 30 hari terakhir
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const spamTrend = await AnalysisLog.aggregate([
      { $match: { timestamp: { $gte: thirtyDaysAgo }, isSpam: true } },
      { 
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    // Distribusi tipe penipuan
    const fraudDistribution = await Message.aggregate([
      { $match: { detectionDate: { $gte: thirtyDaysAgo } } },
      { $group: { _id: "$fraudType", count: { $sum: 1 } } }
    ]);

    res.json({
      totalProcessed,
      spamDetected,
      modelAccuracy,
      spamTrend,
      fraudDistribution
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};