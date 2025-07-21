const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../controllers/settingControllers');

router.get('/settings', getSettings);
router.put('/update/settings', updateSettings);

module.exports = router;