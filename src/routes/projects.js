const express = require("express");
const router = express.Router();
const projectsController = require("../controllers/projectsController");

// Define user-related routes
router.get("/", projectsController.getAllProjects);

module.exports = router;
