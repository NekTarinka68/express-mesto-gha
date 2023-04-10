const mongoose = require('mongoose');
const User = require('../models/user');
const { badRequestError, notFoundError, internalServerError } = require('../utils/errors');

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(200).send({ user }))
    .catch(() => {
      res.status(badRequestError).send({ message: 'Переданы некорректные данные при создании пользователя.' });
    });
};

const getUserId = (req, res) => {
  User.findById(req.params.id).orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(notFoundError).send({ message: 'Пользователь не найден.' });
        return;
      }
      res.status(internalServerError).send({ message: 'Ошибка сервера' });
    });
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(() => {
      res.status(internalServerError).send({ message: 'Ошибка сервера' });
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true }).orFail()
    .then((updatedUser) => res.send(updatedUser))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(badRequestError).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      }
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(notFoundError).send({ message: 'Пользователь не найден.' });
      }
      res.status(internalServerError).send({ message: 'Ошибка сервера' });
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true }).orFail()
    .then((updatedAvatar) => res.send(updatedAvatar))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(badRequestError).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
      }
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(notFoundError).send({ message: 'Пользователь с указанным _id не найден.' });
      }
      res.status(internalServerError).send({ message: 'Ошибка сервера' });
    });
};

module.exports = { createUser, getUserId, getUsers, updateUser, updateAvatar };