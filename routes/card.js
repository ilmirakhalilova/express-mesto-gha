const router = require('express').Router();// импортируем модель
const {
  findAllCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.get('/', findAllCards);
router.post('/', createCard);
router.delete('/:cardId', deleteCard);
router.put('/:cardId/likes', likeCard); // поставить лайк карточке
router.delete('/:cardId/likes', dislikeCard); // убрать лайк с карточки

module.exports = router;
