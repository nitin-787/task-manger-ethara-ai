// server/routes/tasks.js
const express = require("express");
const router = express.Router();
const { getTasks, updateTask } = require("../controllers/taskController");
const { protect } = require("../middleware/auth");

router.use(protect);

// 1. Get tasks for a specific project
router.get("/project/:projectId", getTasks);

// 2. Update a specific task by its own ID
router.put("/:id", updateTask);

module.exports = router;
