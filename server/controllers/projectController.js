const Project = require("../models/Project");
const User = require("../models/User");

// @desc    Get all projects (Admin sees all they created, Member sees assigned)

exports.getTasks = async (req, res) => {
  try {
    // If the route is /project/:projectId, use req.params.projectId
    const tasks = await Task.find({ project: req.params.projectId }).populate(
      "assignedTo",
      "name email",
    );

    res.status(200).json({ success: true, data: tasks });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Get single project
// server/controllers/projectController.js
exports.getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("admin", "name email") // Swaps Admin ID for Name object
      .populate("members", "name email"); // Swaps Member IDs for Name objects

    if (!project) return res.status(404).json({ success: false });

    res.status(200).json({ success: true, data: project });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @route   GET /api/projects
exports.getProjects = async (req, res) => {
  try {
    let query;

    if (req.user.role === "Admin") {
      // Admins see projects they manage
      query = Project.find({ admin: req.user.id });
    } else {
      // Members see projects where they are in the 'members' array
      query = Project.find({ members: req.user.id });
    }

    const projects = await query
      .populate("admin", "name email")
      .populate("members", "name email");

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Create new project
// @route   POST /api/projects
exports.createProject = async (req, res) => {
  try {
    // Add the current logged-in user as the admin
    req.body.admin = req.user.id;

    // Create the project with name, description, admin, and members
    const project = await Project.create(req.body);

    res.status(201).json({
      success: true,
      data: project,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Add member to project
// @route   PUT /api/projects/:id/add-member
exports.addMember = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    // Check if the current user is the admin of this project
    if (project.admin.toString() !== req.user.id && req.user.role !== "Admin") {
      return res.status(401).json({
        success: false,
        message: "Not authorized to edit this project",
      });
    }

    // Add member ID to the array if not already present
    if (!project.members.includes(req.body.memberId)) {
      project.members.push(req.body.memberId);
      await project.save();
    }

    res.status(200).json({ success: true, data: project });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
