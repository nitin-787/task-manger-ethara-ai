const Task = require("../models/Task");
const Project = require("../models/Project");

// @desc    Get tasks for a specific project
// @route   GET /api/tasks/:projectId
exports.getTasks = async (req, res) => {
  try {
    // It must be req.params.projectId because that's what we named it in the route
    const tasks = await Task.find({ project: req.params.projectId }).populate(
      "assignedTo",
      "name email",
    );

    res.status(200).json({ success: true, data: tasks });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
// @desc    Create a task (Admin only)
// @route   POST /api/tasks
exports.createTask = async (req, res) => {
  try {
    const { project, assignedTo } = req.body;

    // 1. Fetch the project to see who is allowed to be there
    const projectDoc = await Project.findById(project);

    if (!projectDoc) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    // 2. Validation: Is the person being assigned actually in this project?
    const isMember = projectDoc.members.includes(assignedTo);
    const isAdmin = projectDoc.admin.toString() === assignedTo;

    if (assignedTo && !isMember && !isAdmin) {
      return res.status(400).json({
        success: false,
        message:
          "Assignment Failed: This user is not a member of this project. Add them to the project first.",
      });
    }

    // 3. Create the task if validation passes
    const task = await Task.create(req.body);

    res.status(201).json({ success: true, data: task });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Update task status (Admin or Assigned Member)
// @route   PUT /api/tasks/:id
exports.updateTask = async (req, res) => {
  try {
    // Populate the project to get the Admin's ID for comparison
    let task = await Task.findById(req.params.id).populate("project");

    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    const currentUserId = req.user.id.toString();
    const projectAdminId = task.project.admin.toString();
    // Use optional chaining in case task is unassigned
    const assignedMemberId = task.assignedTo?.toString();

    // Verification Logic
    const isAdmin = currentUserId === projectAdminId;
    const isAssigned = currentUserId === assignedMemberId;

    if (!isAdmin && !isAssigned) {
      return res.status(401).json({
        success: false,
        message:
          "Unauthorized: Only the Admin or Assigned Member can change this.",
      });
    }

    task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: task });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
