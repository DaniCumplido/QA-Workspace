const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { authenticate, checkRole } = require("../middlewares/authMiddleware");

router.get("/", authenticate, checkRole(['ADMIN']), userController.getAllUsers);
router.post("/", authenticate, checkRole(['ADMIN']), userController.createUser);
router.get("/:email", userController.validateEmail)

module.exports = router;
