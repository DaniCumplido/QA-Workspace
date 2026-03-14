const express = require("express");
const router = express.Router();
const projectController = require("../controllers/project.controller");
const { authenticate, checkRole } = require("../middlewares/authMiddleware");
const testController = require("../controllers/test.controller");
const issueController = require("../controllers/incidents.controller");
const dashboardController = require("../controllers/dashboard.controller");

router.get("/", authenticate, projectController.getAllProjects);
router.post(
  "/",
  authenticate,
  checkRole(["ADMIN", "MANAGER"]),
  projectController.createProject,
);
router.patch(
  "/:projectId/status",
  authenticate,
  checkRole(["ADMIN", "MANAGER"]),
  projectController.updateProjectStatus,
);

router.get(
  "/:projectId/dashboard",
  authenticate,
  dashboardController.getProjectDashboard,
);

router.get(
  "/:projectId/tests",
  authenticate,
  testController.getAllProjectTests,
);
router.post("/:projectId/tests", authenticate, testController.createTest);
router.patch(
  "/:projectId/tests/:testId",
  authenticate,
  testController.updateTestStatus,
);

router.get("/:projectId/issues", authenticate, issueController.getAllIssues);
router.post("/:projectId/issues", authenticate, issueController.createIssue);
router.patch(
  "/:projectId/issues/:issueId",
  authenticate,
  issueController.updateIssue,
);

module.exports = router;
