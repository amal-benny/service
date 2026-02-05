const express = require('express');
const router = express.Router();
const { getAllUsers, verifyProvider, getSupportMessages, updateSupportStatus } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('ADMIN'));

router.get('/users', getAllUsers);
router.put('/verify/:id', verifyProvider);
router.get('/support', getSupportMessages);
router.put('/support/:id', updateSupportStatus);

module.exports = router;
