const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Define user-related routes
router.get("/", authController.getAuth);

module.exports = router;
