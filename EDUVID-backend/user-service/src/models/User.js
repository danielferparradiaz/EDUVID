const users = [];

function createUser(user) {
  users.push(user);
  return user;
}

function getUserById(id) {
  return users.find(u => u.id === id);
}

function getAllUsers() {
  return users;
}

module.exports = { createUser, getUserById, getAllUsers };
