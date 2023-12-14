const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: [true, 'Поле "Страна" должно быть заполнено'],
  },
  director: {
    type: String,
    required: [true, 'Поле "Режиссёр" должно быть заполнено'],
  },
  duration: {
    type: Number,
    required: [true, 'Поле "Длительность" должно быть заполнено'],
  },
  year: {
    type: String,
    required: [true, 'Поле "Год" должно быть заполнено'],
  },
  description: {
    type: String,
    required: [true, 'Поле "Описание" должно быть заполнено'],
  },
  image: {
    type: String,
    required: [true, 'Поле "Постер" должно быть заполнено'],
  },
  trailerLink: {
    type: String,
    required: [true, 'Поле "Ссылка на трейлер" должно быть заполнено'],
  },
  thumbnail: {
    type: String,
    required: [true, 'Поле "Мини-постер" должно быть заполнено'],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: [true, 'Поле "owner" должно быть заполнено'],
  },
  movieId: {
    type: Number,
    required: [true, 'Поле "ID фильма" должно быть заполнено'],
  },
  nameRU: {
    type: String,
    required: [true, 'Поле "Название на русском" должно быть заполнено'],
  },
  nameEN: {
    type: String,
    required: [true, 'Поле "Название на английском" должно быть заполнено'],
  },
}, { versionKey: false });

module.exports = mongoose.model('movie', movieSchema);
