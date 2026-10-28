const UserModel = require('../src/models/userModel');

function getUsers(req, res) {
  const users = UserModel.findAll();
  const list = users.map((u) => `#${u.id} ${u.username}`).join('\n');
  res.type('text/plain').send(`Список користувачів:\n${list}`);
}

function createUser(req, res) {
  const { username, password } = req.body;
  const user = UserModel.create({ username, password });
  res.status(201).type('text/plain').send(`Користувача створено: #${user.id} ${user.username}`);
}

function getUserById(req, res, next) {
  const user = UserModel.findById(req.params.userId);
  if (!user) {
    const err = new Error(`User with id ${req.params.userId} not found`);
    err.status = 404;
    return next(err);
  }
  res.type('text/plain').send(`Користувач #${user.id}: ${user.username}`);
}

function updateUser(req, res, next) {
  const user = UserModel.update(req.params.userId, req.body);
  if (!user) {
    const err = new Error(`User with id ${req.params.userId} not found`);
    err.status = 404;
    return next(err);
  }
  res.type('text/plain').send(`Користувача оновлено: #${user.id} ${user.username}`);
}

module.exports = { getUsers, createUser, getUserById, updateUser };
