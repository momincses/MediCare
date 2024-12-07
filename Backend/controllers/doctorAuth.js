const Doctor = require("../models/doctor"); // Doctor ka model, jo database me doctor ka data manage karta hai
const jwt = require("jsonwebtoken"); // Token create aur verify karne ke liye
const Appointment = require("../models/appointment"); // Appointment ka model, jo database me appointment ka data manage karta hai

/**
 * Yeh function JWT token ko validate karta hai jo doctor ke liye hota hai.
 * Agar token valid ho, toh decoded doctor ka data request me attach karte hain aur next middleware ko call karte hain.
 * Agar token missing ho ya invalid ho, toh error response bhejte hain.
 */
exports.authenticateDoctorToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Token format: "Bearer <token>"

  if (!token) {
    return res.status(401).json({ error: "Access denied, token is missing!" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, doctor) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" });
    }
    req.doctor = doctor; // Doctor ka data request object me attach karte hain
    next(); // Next middleware ya route handler ko call karte hain
  });
};

/**
 * Yeh function doctor ko login karne ke liye hota hai.
 * Email aur password ko verify karta hai aur JWT token generate karta hai agar login successful ho.
 * Agar email ya password galat ho toh error response bhejte hain.
 */
exports.loginDoctor = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validation: Email aur password required hain
    if (!email || !password) {
      return res.status(400).json({ error: "Email aur password dena zaroori hai" });
    }

    // Doctor ko email se dhoondte hain
    const doctor = await Doctor.findOne({ email });
    if (!doctor) {
      return res.status(404).json({ error: "Doctor nahi mila" });
    }

    // Password verify karte hain (abhi plain-text password ka comparison ho raha hai)
    if (doctor.password !== password) {
      return res.status(400).json({ error: "Invalid email ya password" });
    }

    // JWT token generate karte hain
    const token = jwt.sign(
      { id: doctor._id, email: doctor.email }, // Token me doctor ka data
      process.env.JWT_SECRET, // Secret key
      { expiresIn: "1h" } // Token ek ghante baad expire hoga
    );

    // Login successful response ke saath token bhejte hain
    res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Yeh function saare appointments retrieve karne ke liye hota hai.
 * Database se saare appointments fetch karta hai aur unhe response me bhejta hai.
 * Agar koi error aaye toh server error ka response deta hai.
 */
exports.getAllAppointments = async (req, res) => {
  try {
    // Database se saare appointments fetch karte hain
    const appointments = await Appointment.find();

    // Response me appointments bhejte hain
    res.status(200).json({ appointments });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ error: "Server error" });
  }
};
