let users = [
  { id: 1, username: 'alice', password: 'secret1' },
  { id: 2, username: 'bob', password: 'secret2' },
];

let nextId = 3;

const UserModel = {
  findAll() {
    return users;
  },

  findById(id) {
    return users.find((u) => u.id === Number(id));
  },

  create({ username, password }) {
    const user = { id: nextId++, username, password };
    users.push(user);
    return user;
  },

  update(id, { username, password }) {
    const user = this.findById(id);
    if (!user) return null;
    if (username) user.username = username;
    if (password) user.password = password;
    return user;
  },

  remove(id) {
    const index = users.findIndex((u) => u.id === Number(id));
    if (index === -1) return false;
    users.splice(index, 1);
    return true;
  },
};

module.exports = UserModel;
