const express = require("express");
const {
  getProjects,
  getProject, // <--- Make sure this is imported
  createProject,
  addMember,
} = require("../controllers/projectController");

const router = express.Router();

const { protect, authorize } = require("../middleware/auth");

router.use(protect);

router.route("/").get(getProjects).post(authorize("Admin"), createProject);

// THIS IS THE MISSING PIECE
router.route("/:id").get(getProject);

router.put("/:id/add-member", authorize("Admin"), addMember);

module.exports = router;
