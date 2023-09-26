const router = require('express').Router(); // импортируем модель
const {
  findAllUsers,
  findUserById,
  createUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

router.get('/', findAllUsers);
router.get('/:userId', findUserById);
router.post('/', createUser);
router.patch('/me', updateUser); // обновляет профиль
router.patch('/me/avatar', updateAvatar); // обновляет аватар

module.exports = router;
