const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const isEmail = require('validator/lib/isEmail');
const AuthError = require('../utils/AuthError');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [2, 'Минимальная длина поля "Имя" - 2 символа'],
    maxlength: [30, 'Максимальная длина поля "Имя" - 30 символов'],
    required: [true, 'Поле "Имя" должно быть заполнено'],
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Поле "Email" должно быть заполнено'],
    validate: {
      validator: (email) => isEmail(email),
      message: 'Поле "email" заполненно некорректно',
    },
  },
  password: {
    type: String,
    required: [true, 'Поле "Пароль" должно быть заполнено'],
    select: false,
  },
}, { versionKey: false });

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new AuthError('Неправильные пароль или почта'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new AuthError('Неправильные пароль или почта'));
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
