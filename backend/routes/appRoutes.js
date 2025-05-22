const express = require('express');
const router = express.Router();
const {
  createApp,
  getApps,
  getApp,
  updateApp,
  deleteApp
} = require('../controllers/appController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .post(authorize('admin', 'po'), createApp)
  .get(getApps);

router.route('/:id')
  .get(getApp)
  .put(authorize('admin', 'po'), updateApp)
  .delete(authorize('admin'), deleteApp);

module.exports = router; 