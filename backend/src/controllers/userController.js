const prisma = require("../config/db");

const getAllUsers = async (req, res) => {
  res.json({ mensaje: "Aquí listaremos a los usuarios" });
};

module.exports = { getAllUsers };
