const router = require('express').Router();
const {
  getUsers, getUserId, updateUser, updateAvatar, getUser,
} = require('../controllers/users');
const {
  updateProfileValidation, updateAvatarValidation, userIdValidation,
} = require('../middlewares/validation');

router.get('/users', getUsers);
router.get('/users/me', getUser);
router.get('/users/:userId', userIdValidation, getUserId);
router.patch('/users/me', updateProfileValidation, updateUser);
router.patch('/users/me/avatar', updateAvatarValidation, updateAvatar);

module.exports = router;
