const express = require("express");
const { registerStudent, verifyEmail } = require("../controllers/authController");

const router = express.Router();

// Registration route
router.post("/register", registerStudent);

// Email verification route
router.get("/verify/:token", verifyEmail);

module.exports = router;
