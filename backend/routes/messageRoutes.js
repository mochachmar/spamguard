const express = require('express');
const { getMessages, createMessage, deleteMessage } = require('../controllers/messageControllers');

const router = express.Router();

router.get('/', getMessages);
router.post('/create', createMessage);
router.delete('/:id', deleteMessage);

module.exports = router;