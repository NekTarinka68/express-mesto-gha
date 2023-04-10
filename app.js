const express = require('express');
const mongoose = require('mongoose');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { notFoundError } = require('./utils/errors');

const app = express();

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: '643336a78cfbff0cbcaf3cee',
  };
  next();
});

app.use('/', usersRouter);
app.use('/', cardsRouter);
app.use('*', (req, res) => {
  res.status(notFoundError).send({ message: 'Страница не найдена' });
});

app.listen(PORT);