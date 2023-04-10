const mongoose = require('mongoose');
const Card = require('../models/card');
const { badRequestError, notFoundError, internalServerError } = require('../utils/errors');

const getCards = (req, res) => Card.find({})
  .then((cards) => {
    res.status(200).send({ cards });
  })
  .catch(() => {
    res.status(internalServerError).send({ message: 'Ошибка сервера' });
  });

const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send(card))
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(badRequestError).send({ message: 'Переданы некорректные данные при создании карточки' });
        return;
      }
      res.status(internalServerError).send({ message: 'Ошибка сервера' });
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId).orFail()
    .then((card) => res.send({ data: card }))
    .catch((error) => {
      if (error instanceof mongoose.Error.CastError) {
        res.status(badRequestError).send({ message: 'Переданы некорректные данные при удалении карточки' });
        return;
      }
      if (error instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(notFoundError).send({ message: 'Карточка не найдена' });
        return;
      }
      res.status(internalServerError).send({ message: 'Ошибка сервера' });
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  ).orFail()
    .then((card) => res.send(card))
    .catch((error) => {
      if (error instanceof mongoose.Error.CastError) {
        res.status(badRequestError).send({ message: 'Пользователь не найден' });
        return;
      }
      if (error instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(notFoundError).send({ message: 'Карточка не найдена' });
        return;
      }
      res.status(internalServerError).send({ message: 'Ошибка сервера' });
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  ).orFail()
    .then((card) => res.send(card))
    .catch((error) => {
      if (error instanceof mongoose.Error.CastError) {
        res.status(badRequestError).send({ message: 'Пользователь не найден' });
        return;
      }
      if (error instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(notFoundError).send({ message: 'Карточка не найдена' });
        return;
      }
      res.status(internalServerError).send({ message: 'Ошибка сервера' });
    });
};

module.exports = {
  createCard, deleteCard, getCards, likeCard, dislikeCard,
};
