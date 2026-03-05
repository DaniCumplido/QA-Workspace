const express = require("express");
const router = express.Router();
const projectController = require("../controllers/project.controller");
const { authenticate, checkRole } = require("../middlewares/authMiddleware");
const testController = require("../controllers/test.controller")

router.get("/", authenticate, projectController.getAllProjects);
router.post(
  "/",
  authenticate,
  checkRole(["ADMIN", "MANAGER"]),
  projectController.createProject,
);
router.get("/:projectId/tests", authenticate, testController.getAllProjectTests);
router.post("/:projectId/tests", authenticate, testController.createTest);
router.patch("/:projectId/tests/:testId", authenticate, testController.updateTestStatus);
// router.get("/:projectId/incidents", authenticate);
// router.post("/:projectId/incidents", authenticate);

module.exports = router;
