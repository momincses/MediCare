const Doctor = require("../models/doctor");
const jwt = require("jsonwebtoken");
const Appointment = require("../models/appointment");

exports.authenticateDoctorToken = (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1]; // Expecting "Bearer <token>"
  
    if (!token) {
      return res.status(401).json({ error: "Access denied, token is missing!" });
    }
  
    jwt.verify(token, process.env.JWT_SECRET, (err, doctor) => {
      if (err) {
        return res.status(403).json({ error: "Invalid token" });
      }
      req.doctor = doctor; // Attach the decoded doctor to the request object
      next();
    });
  };
  


exports.loginDoctor = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Validation
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }
  
      // Check if doctor exists
      const doctor = await Doctor.findOne({ email });
      if (!doctor) {
        return res.status(404).json({ error: "Doctor not found" });
      }
  
      // Verify the password (plain-text for now)
      if (doctor.password !== password) {
        return res.status(400).json({ error: "Invalid email or password" });
      }
  
      // Create JWT token
      const token = jwt.sign(
        { id: doctor._id, email: doctor.email },
        process.env.JWT_SECRET, // Replace with your secret key
        { expiresIn: "1h" } // Token will expire in 1 hour
      );
  
      res.status(200).json({
        message: "Login successful",
        token, // Include the token in the response
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  };


// Fetch all appointments for doctors
exports.getAllAppointments = async (req, res) => {
  try {
    // Retrieve all appointments from the database
    const appointments = await Appointment.find();

    // Send appointments as response
    res.status(200).json({ appointments });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ error: "Server error" });
  }
};
