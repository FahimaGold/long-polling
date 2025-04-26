const express = require('express');
const router = express.Router();
const {poll, sendMessage} = require('../controllers/pollingController');

router.get('/:clientId', poll);
router.post('/send', sendMessage);

module.exports = router;