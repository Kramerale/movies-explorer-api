const router = require('express').Router();

const usersRouter = require('./users');
const moviesRouter = require('./movies');
const signInRouter = require('./signin');
const signUpRouter = require('./signup');
const auth = require('../middlewares/auth');
const NotFoundError = require('../utils/NotFoundError');

router.use('/signin', signInRouter);
router.use('/signup', signUpRouter);

router.use(auth);

router.use('/users', usersRouter);
router.use('/movies', moviesRouter);

router.use((req, res, next) => {
  next(new NotFoundError(`По адресу ${req.path} ничего не найдено`));
});

module.exports = router;
