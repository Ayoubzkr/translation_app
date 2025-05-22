const express = require('express');
const router = express.Router();
const { getStats } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// Toutes les routes sont protégées et nécessitent le rôle admin
router.use(protect);
router.use(authorize('admin'));

// Route pour les statistiques
router.get('/stats', getStats);

module.exports = router; 