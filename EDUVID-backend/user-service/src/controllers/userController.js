const { createUser, getUserById, getAllUsers } = require("../models/User");

exports.register = (req, res) => {
  const { id, name, email } = req.body;
  const newUser = createUser({ id, name, email });
  res.status(201).json(newUser);
};

exports.getProfile = (req, res) => {
  const user = getUserById(req.user.sub); // "sub" viene del JWT firmado por auth-service
  if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
  res.json(user);
};

exports.listUsers = (req, res) => {
  res.json(getAllUsers());
};
