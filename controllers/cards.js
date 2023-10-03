const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-err');
const IncorrectDataError = require('../errors/incorrect-data-error');
const ForbiddenError = require('../errors/forbidden-error');

// const ERROR_CODE_INCORRECT_DATA = 400;
// const ERROR_CODE_NOT_FOUND = 404;
// const ERROR_CODE_DEFAULT = 500;

module.exports.findAllCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new IncorrectDataError('Переданы некорректные данные при создании карточки.'));
        // res.status(ERROR_CODE_INCORRECT_DATA)
        // .send({ message: 'Переданы некорректные данные при создании карточки.' });
      } else {
        next(err);
        // res.status(ERROR_CODE_DEFAULT)
        // .send({ message: `На сервере произошла ошибка: ${err.message}` });
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным _id не найдена.');
        // res.status(ERROR_CODE_NOT_FOUND)
        // .send({ message: 'Карточка с указанным _id не найдена.' });
        // return;
      }
      if (!card.owner.equals(req.user._id)) {
        throw new ForbiddenError('Доступ запрещен.');
        // res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Доступ запрещен.' });
        // return;
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new IncorrectDataError('Переданы некорректные данные при удалении карточки.'));
        // res.status(ERROR_CODE_INCORRECT_DATA)
        // .send({ message: 'Переданы некорректные данные при удалении карточки.' });
      } else {
        next(err);
        // res.status(ERROR_CODE_DEFAULT)
        // .send({ message: `На сервере произошла ошибка: ${err.message}` });
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Передан несуществующий _id карточки.');
        // res.status(ERROR_CODE_NOT_FOUND)
        // .send({ message: 'Передан несуществующий _id карточки.' });
        // return;
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new IncorrectDataError('Переданы некорректные данные для постановки/снятии лайка.'));
        // res.status(ERROR_CODE_INCORRECT_DATA)
        // .send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' });
      } else {
        next(err);
        // res.status(ERROR_CODE_DEFAULT)
        // .send({ message: `На сервере произошла ошибка: ${err.message}` });
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Передан несуществующий _id карточки.');
        // res.status(ERROR_CODE_NOT_FOUND)
        // .send({ message: 'Передан несуществующий _id карточки.' });
        // return;
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new IncorrectDataError('Переданы некорректные данные для постановки/снятии лайка.'));
        // res.status(ERROR_CODE_INCORRECT_DATA)
        // .send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' });
      } else {
        next(err);
        // res.status(ERROR_CODE_DEFAULT)
        // .send({ message: `На сервере произошла ошибка: ${err.message}` });
      }
    });
};
