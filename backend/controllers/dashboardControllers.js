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
      { $match: { accuracy: { $ne: null, $gt: 0 } } },
      { $group: { _id: null, avgAccuracy: { $avg: "$accuracy" } } }
    ]);
    const modelAccuracy = accuracyStats[0]?.avgAccuracy || 0;

    // Hitung perubahan 30 hari
    const now = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    // Total pesan 30 hari terakhir
    const totalLast30Days = await AnalysisLog.countDocuments({
      timestamp: { $gte: thirtyDaysAgo }
    });

    // Total pesan periode sebelumnya (30-60 hari lalu)
    const totalPrevious30Days = await AnalysisLog.countDocuments({
      timestamp: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo }
    });

    // Hitung persentase perubahan
    let totalChange = 0;
    if (totalPrevious30Days > 0) {
      totalChange = ((totalLast30Days - totalPrevious30Days) / totalPrevious30Days) * 100;
    }

    // Trend spam 30 hari terakhir
    const spamTrend = await AnalysisLog.aggregate([
      { 
        $match: { 
          timestamp: { $gte: thirtyDaysAgo },
          isSpam: true 
        } 
      },
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
      totalChange,
      spamTrend,
      fraudDistribution
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};