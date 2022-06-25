const express = require('express');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const router = new express.Router();
const userController = require('../controllers/userController');

router.post('/users', userController.createUser);
router.post('/users/login', userController.loginUser);
router.post('/users/logout', auth, userController.logoutUser);
router.post('/users/logoutAll', auth, userController.logoutAllUser);
router.get('/users/me', auth, userController.getUser);
router.get('/users/:id', userController.getUserById);
router.patch('/users/me', auth, userController.updateUserInfo);
router.delete('/users/me', auth, userController.deleteUser);

router.post(
  '/users/me/avatar',
  upload.single('avatar'),
  auth,
  userController.uploadUserAvatar
);
router.delete('/users/me/avatar', auth, userController.deleteUserAvatar);
router.get('/users/me/avatar', auth, userController.getUserAvatar);
router.get('/users/:id/avatar', userController.getUserAvatarById);

module.exports = router;
