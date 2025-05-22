const express = require('express');
const router = express.Router();
const {
  getUsers,
  createUser,
  deleteUser,
  updateUser
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

// Toutes les routes sont protégées et nécessitent le rôle admin
router.use(protect);
router.use(authorize('admin'));

router.route('/')
  .get(getUsers)
  .post(createUser);

router.route('/:id')
  .put(updateUser)
  .delete(deleteUser);

module.exports = router; 