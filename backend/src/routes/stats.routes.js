const express = require("express");
const router = express.Router();
// Añade las llaves aquí:
const { getGlobalStats } = require("../controllers/stats.controller");
const { authenticate } = require("../middlewares/authMiddleware");

// Ahora getGlobalStats sí es una función y no dará error
router.get("/global", authenticate, getGlobalStats);

module.exports = router;