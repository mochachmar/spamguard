const Message = require('../models/MessageModel');
const AnalysisLog = require('../models/AnalysisLogModel'); 

exports.getDashboardStats = async (req, res) => {
  try {
    const totalProcessed = await AnalysisLog.countDocuments();
    
    const spamDetected = await Message.countDocuments({});

    const accuracyStats = await AnalysisLog.aggregate([
      { $match: { accuracy: { $ne: null, $gt: 0 } } },
      { $group: { _id: null, avgAccuracy: { $avg: "$accuracy" } } }
    ]);
    const modelAccuracy = accuracyStats[0]?.avgAccuracy || 0;

    const now = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const spamLast30Days = await Message.countDocuments({
      detectionDate: { $gte: thirtyDaysAgo }
    });

    const spamPrevious30Days = await Message.countDocuments({
      detectionDate: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo }
    });

    let spamChange = 0;
    if (spamPrevious30Days > 0) {
      spamChange = ((spamLast30Days - spamPrevious30Days) / spamPrevious30Days) * 100;
    }

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

    const fraudDistribution = await Message.aggregate([
      { $match: { detectionDate: { $gte: thirtyDaysAgo } } },
      { $group: { _id: "$fraudType", count: { $sum: 1 } } }
    ]);

    res.json({
      totalProcessed,
      spamDetected,
      modelAccuracy,
      spamChange,
      spamTrend,
      fraudDistribution
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};