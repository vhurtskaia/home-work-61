const express = require('express');
const router = express.Router();

const authenticate = require('../middlewares/auth');
const { validateUserInput, validateUserId } = require('../middlewares/validate');
const {
  getUsers,
  createUser,
  getUserById,
  updateUser,
} = require('../controllers/userController');

router.get('/', authenticate, getUsers);

router.post('/', authenticate, validateUserInput, createUser);

router.get('/:userId', authenticate, validateUserId, getUserById);

router.put('/:userId', authenticate, validateUserId, validateUserInput, updateUser);

module.exports = router;
