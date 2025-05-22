const express = require('express');
const router = express.Router();
const {
  createString,
  getStrings,
  updateStringStatus,
  deleteString
} = require('../controllers/stringController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .post(authorize('admin', 'po', 'dev'), createString);

router.route('/app/:appId')
  .get(getStrings);

router.route('/:id/status')
  .put(authorize('admin', 'po'), updateStringStatus);

router.route('/:id')
  .delete(authorize('admin'), deleteString);

module.exports = router; 