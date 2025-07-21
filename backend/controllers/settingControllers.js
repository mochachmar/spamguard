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
    const { minCharLength, activeHours } = req.body;
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

    await settings.save();
    res.json(settings);
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ error: error.message });
  }
};