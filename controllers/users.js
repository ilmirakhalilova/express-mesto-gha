const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const IncorrectDataError = require('../errors/incorrect-data-error');
const CodeNotFoundError = require('../errors/code-not-found-error');
const ConflictError = require('../errors/conflict-error');

// const ERROR_CODE_INCORRECT_DATA = 400;
// const ERROR_CODE_NOT_FOUND = 404;
// const ERROR_CODE_DEFAULT = 500;

module.exports.findAllUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    // .catch((err) => res.status(ERROR_CODE_DEFAULT)
    // .send({ message: `На сервере произошла ошибка: ${err.message}` }));
    .catch(next);
};

module.exports.findUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден.');
        // res.status(ERROR_CODE_NOT_FOUND)
        // .send({ message: 'Пользователь по указанному _id не найден.' });
        // return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new IncorrectDataError('Переданы некорректные данные.'));
        // res.status(ERROR_CODE_INCORRECT_DATA)
        // .send({ message: `Произошла ошибка: ${err.message}` });
        // return;
      } else {
        next(err);
      }
      // res.status(ERROR_CODE_DEFAULT)
      // .send({ message: `На сервере произошла ошибкаqqqqqqq: ${err.message}` });
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже зарегистрирован.'));
      } else if (err.name === 'ValidationError') {
        next(new IncorrectDataError('Переданы некорректные данные при создании пользователя.'));
      } else {
        next(err);
      }
    });
  // .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден.');
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new IncorrectDataError("Переданы некорректные данные при обновлении профиля."));
      } else {
        next(err);
      }
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден.');
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new IncorrectDataError('Переданы некорректные данные при обновлении аватара.'));
      } else {
        next(err);
      }
    });
};

module.exports.getUserInfo = (req, res, next) => {
  console.log('qwerty');
  console.log(req.user._id);
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден.hhhhhhh');
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new IncorrectDataError('Переданы некорректные.'));
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new CodeNotFoundError('Неправильные почта или пароль.');
        // return Promise.reject(new Error('Неправильные почта или пароль'));
        // res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Неправильные почта или пароль.' });
        // return;
      }
      bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            // хеши не совпали — отклоняем промис
            throw new CodeNotFoundError('Неправильные почта или пароль.');
            // return Promise.reject(new Error('Неправильные почта или пароль'));
            // res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Неправильные почта или пароль.' });
            // return;
          }
          // аутентификация успешна
          const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
          res.status(200).cookie('jwt', token, { httpOnly: true }).send({ token });
        })
        .catch(next);
    })
    .catch(next);
};
