const express = require('express');
const router = express.Router();
const { generateContentForAPI } = require('../controllers/aiController');

router.get('/', (req, res) => res.send('Example Route is working!'));
router.post('/generate', generateContentForAPI);

module.exports = router;