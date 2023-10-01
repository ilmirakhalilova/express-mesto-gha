const router = require('express').Router(); // импортируем модель
const {
  findAllUsers,
  findUserById,
  updateUser,
  updateAvatar,
  getUserInfo,
} = require('../controllers/users');

router.get('/', findAllUsers);
router.get('/:userId', findUserById);
router.patch('/me', updateUser); // обновляет профиль
router.patch('/me/avatar', updateAvatar); // обновляет аватар
router.get('/me', getUserInfo); // возвращает информацию о текущем пользователе

module.exports = router;
