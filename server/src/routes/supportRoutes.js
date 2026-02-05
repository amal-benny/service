const express = require('express');
const router = express.Router();
const { createSupportMessage, getUserSupportMessages } = require('../controllers/supportController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', createSupportMessage);
router.get('/my-messages', protect, getUserSupportMessages);

module.exports = router;
