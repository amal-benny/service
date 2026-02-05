const express = require('express');
const router = express.Router();
const { createService, getServices, updateService, deleteService } = require('../controllers/serviceController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', getServices);
router.post('/', protect, authorize('PROVIDER'), upload.single('image'), createService);
router.put('/:id', protect, authorize('PROVIDER'), updateService);
router.delete('/:id', protect, authorize('PROVIDER'), deleteService);

module.exports = router;
