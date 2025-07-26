const express = require('express');
const { getMessages, createMessage, deleteMessage, updateMessage } = require('../controllers/messageControllers');

const router = express.Router();

router.get('/', (req, res) => {
  getMessages(req, res);
});
router.post('/create', createMessage);
router.delete('/:id', deleteMessage);
router.put('/:id', updateMessage);

module.exports = router;