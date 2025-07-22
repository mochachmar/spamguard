const Setting = require('../models/SettingModel');

exports.getSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = new Setting();
      await settings.save();
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const { minCharLength, activeHours, botActions } = req.body;
    let settings = await Setting.findOne();
    
    if (!settings) {
      settings = new Setting();
    }

    if (minCharLength !== undefined) {
      settings.minCharLength = minCharLength;
    }

    if (activeHours) {
      settings.activeHours = {
        start: activeHours.start,
        end: activeHours.end
      };
    }

    if (botActions) {
      settings.botActions = {
        deleteMessage: botActions.deleteMessage || false,
        blockUser: botActions.blockUser || false,
        deleteAllMessages: botActions.deleteAllMessages || false,
        reportToTelegram: botActions.reportToTelegram || false,
        restrictUser: botActions.restrictUser || false
      };
    }

    await settings.save();
    res.json(settings);
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ error: error.message });
  }
};