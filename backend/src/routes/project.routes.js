const express = require("express");
const router = express.Router();
const projectController = require("../controllers/project.controller");
const { authenticate, checkRole } = require("../middlewares/authMiddleware");

router.get("/", authenticate, projectController.getAllProjects );
router.post("/", authenticate, checkRole(['ADMIN', 'MANAGER']), projectController.createProject );

module.exports = router