const BadRequestError = require('../utils/BadRequestError');
const NotFoundError = require('../utils/NotFoundError');
const ForbiddenError = require('../utils/ForbiddenError');

const movieModel = require('../models/movie');

const getUserMovies = (req, res, next) => {
  movieModel.find({ owner: req.user._id })
  .then((movies) => {
    return res.status(200).send(movies);
  })
  .catch(next);
};

const createMovie = (req, res, next) => {
  const owner = req.user._id;

  movieModel.create({ owner, ...req.body })
  .then((movie) => {
    return res.status(200).send(movie);
  })
  .catch((err) => {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      next(new BadRequestError('Переданы некорректные данные'));
    } else {
      next(err);
    }
  });
};

const deleteMovie = (req, res, next) => {
  const { movieId } = req.params;

  movieModel.findById(movieId)
  .orFail(() => {
    throw new NotFoundError('Фильм с данным id не найден');
  })
  .then((movie) => {
    if (movie.owner.toString() === req.user._id) {
      movieModel.findByIdAndRemove(movieId)
      .then(() => {
        return res.status(200).send(movie);
      });
    } else {
      throw new ForbiddenError('Нет доступа для удаления фильма');
    }
  })
  .catch(next);
};

module.exports = {
  getUserMovies,
  createMovie,
  deleteMovie,
};
