const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const BadRequestError = require('../utils/BadRequestError');
const NotFoundError = require('../utils/NotFoundError');
const ConflictError = require('../utils/ConflictError');

const userModel = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

const createUser = (req, res, next) => {
  const {
    name, email,
  } = req.body;

  bcrypt.hash(req.body.password, 10)
    .then((hash) => userModel.create({
      name, email, password: hash,
    }))
    .then((user) => res.status(201).send({
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким email существует'));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return userModel.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, `${NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key'}`, { expiresIn: '7d' });

      res.send({ token });
    })
    .catch(next);
};

const getUserInfo = (req, res, next) => {
  userModel.findById(req.user._id)
    .orFail(new NotFoundError('Пользователь с данным id не найден'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else if (err.code === 'Пользователь с данным id не найден') {
        next(new NotFoundError('Пользователь с данным id не найден'));
      } else {
        next(err);
      }
    });
};

const updateUserInfo = (req, res, next) => {
  const { name, email } = req.body;

  userModel.findByIdAndUpdate(
    req.user._id,
    { name, email },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(new NotFoundError('Пользователь с данным id не найден'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else if (err.code === 'Пользователь с данным id не найден') {
        next(new NotFoundError('Пользователь с данным id не найден'));
      } else if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким email существует'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  createUser,
  login,
  getUserInfo,
  updateUserInfo,
};
