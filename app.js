require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const helmet = require('helmet');
const cors = require('cors');

const appRouter = require('./routes/index');
const { login, createUser } = require('./controllers/users');
const { loginValidation, createUserValidation } = require('./middlewares/validation');
const auth = require('./middlewares/auth');
const handleError = require('./middlewares/handleError');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/bitfilmsdb', {
  useNewUrlParser: true,
});

const app = express();

app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: 'https://kramerale.diploma.nomoredomainsmonster.ru',
}));

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', loginValidation, login);
app.post('/signup', createUserValidation, createUser);

app.use(auth);

app.use(appRouter);

app.use(errorLogger);

app.use(errors());

app.use(handleError); // всегда в самом конце

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
