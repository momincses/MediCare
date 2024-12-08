const express = require("express");
const { loginStudent, verifyEmail, registerStudent, fetchStudent, authenticateToken } = require("../controllers/authcontroller");
const { loginDoctor } = require("../controllers/doctorAuth");

const router = express.Router();

// Registration route
// http://localhost5000/api/auth/register 
router.post("/register", registerStudent);

// Email verification route
// http://localhost5000/api/auth/verify 
router.get("/verify", verifyEmail);

//Login route
// http://localhost5000/api/auth/login 
router.post("/login", loginStudent);

//student data fetching
// http://localhost5000/api/auth/fetchStudent 
router.get("/fetchStudent", authenticateToken,fetchStudent);


//login doctor
// http://localhost5000/api/auth/doctor/login 
router.post("/doctor/login", loginDoctor);

module.exports = router;
 