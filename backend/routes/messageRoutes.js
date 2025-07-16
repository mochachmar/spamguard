const express = require('express');
const { getMessages, createMessage } = require('../controllers/messageControllers');

const router = express.Router();

router.get('/', getMessages);
router.post('/create', createMessage);

module.exports = router;