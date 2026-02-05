const express = require('express');
const router = express.Router();
const { updateProfile, getProviderById, getProviders } = require('../controllers/providerController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.put('/profile', protect, authorize('PROVIDER'), updateProfile);
router.get('/:id', getProviderById);
router.get('/', getProviders);

module.exports = router;
