const mongoose = require('mongoose');
const Card = require('../models/card');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

const getCards = (res, next) => Card.find({})
  .then((cards) => {
    res.status(200).send(cards);
  })
  .catch((error) => next(error));

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      if (!card) {
        next(new BadRequestError('Переданы некорректные данные при создании карточки'));
      }
      res.send({ data: card });
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError('Переданы некорректные данные при создании карточки'));
      }
      next(error);
    });
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }
      if (card.owner.toHexString() !== req.user._id) {
        throw new ForbiddenError('Отказано в доступе');
      }
      Card.findByIdAndRemove(req.params.cardId)
        .then((removingCard) => res.send(removingCard));
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Переданы некорректные данные при удалении карточки'));
      }
      next(error);
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }
      return res.send({ data: card });
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Переданы некорректные данные'));
      }
      next(error);
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  ).orFail(() => {
    throw new NotFoundError('Карточка не найдена');
  })
    .then((card) => res.send(card))
    // eslint-disable-next-line consistent-return
    .catch((error) => {
      if (error instanceof mongoose.Error.CastError) {
        return next(new BadRequestError('Пользователь не найден'));
      }
      next(error);
    });
};

module.exports = {
  createCard, deleteCard, getCards, likeCard, dislikeCard,
};
