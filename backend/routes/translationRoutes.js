const express = require('express');
const router = express.Router();
const {
  createTranslation,
  getTranslations,
  updateTranslationStatus,
  addComment
} = require('../controllers/translationController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .post(authorize('admin', 'po', 'dev'), createTranslation);

router.route('/string/:stringId')
  .get(getTranslations);

router.route('/:id/status')
  .put(authorize('admin', 'po'), updateTranslationStatus);

router.route('/:id/comments')
  .post(authorize('admin', 'po', 'dev'), addComment);

module.exports = router; 