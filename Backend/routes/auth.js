const express = require("express");
const { loginStudent, verifyEmail, registerStudent, fetchStudent, authenticateToken } = require("../controllers/authcontroller");

const router = express.Router();

// Registration route
router.post("/register", registerStudent);

// Email verification route
router.get("/verify", verifyEmail);

//Login route
router.post("/login", loginStudent);

//student data fetching
router.get("/fetchStudent", authenticateToken,fetchStudent);

module.exports = router;
 