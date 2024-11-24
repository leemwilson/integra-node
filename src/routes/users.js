const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");

// Define user-related routes
router.get("/", usersController.getAllUsers);
router.post("/login", usersController.login); // Add the login route

module.exports = router;
