const Student = require("../models/student");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const bcrypt = require("bcrypt") 
const jwt = require("jsonwebtoken");


exports.registerStudent = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  try {
    // Validation
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (!/^[0-9]{4}[a-zA-Z]{3,5}[0-9]{1,5}@sggs\.ac\.in$/.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters long" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    // Check if email already exists
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ error: "User with this email already exists" });
    }

    // Generate a verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Create a new student
    const student = new Student({
      name,
      email,
      password,
      verificationToken,
    });
    await student.save();

    // Send verification email
    console.log(process.env.BASE_URL)

    const verificationUrl = `${process.env.BASE_URL}/api/auth/verify?token=${verificationToken}`;
    await sendEmail(
      email,
      "Verify Your Email",
      `<h2>Hello, ${name}</h2>
      <p>Please verify your email by clicking the link below:</p>
      <a href="${verificationUrl}">Verify Email</a>`
    );

    res.status(201).json({
      message: "Registration successful. Please check your email to verify your account.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.verifyEmail = async (req, res) => {
  const { token } = req.query;

  try {
    const student = await Student.findOne({ verificationToken: token });

    if (!student) {
      console.log(token)
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    student.isVerified = true;
    student.verificationToken = null;
    await student.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.loginStudent = async (req, res) => {
  const { role, email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ error: "Please provide both email and password" });
    }

    // Check if user exists
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(404).json({ error: "User not found" });
    }
    else{
      console.log("student not found")
    }

    // Check if email is verified
    if (!student.isVerified) {
      return res.status(400).json({ error: "Please verify your email to login" });
    }
    else{
      console.log("email not varified")
    }

    // Validate the Password
    const isPasswordValid = await bcrypt.compare(password, student.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid email or password" });
    }else{
      console.log("password not validated")
    }

    // Create JWT token
    const token = jwt.sign(
      { id: student._id, email: student.email, name: student.name },
      process.env.JWT_SECRET, // Replace with your secret key
      { expiresIn: "1h" } // Token will expire in 1 hour
    );
    console.log("problem near jwt")
    console.log(token)
    console.log(process.env.JWT_SECRET)

    // Login successful, return token
    res.status(200).json({
      message: "Login successful",
      token, // Include the token in the response
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Middleware to check JWT token
exports.authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Expecting "Bearer <token>"

  if (!token) {
    return res.status(401).json({ error: "Access denied, token is missing!" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" });
    }
    req.user = user; // Attach the decoded user to the request object
    next();
  });
};

exports.fetchStudent = async (req, res) => {
  try {
    // Use the authenticateToken middleware to secure this route
    const { email } = req.user; // Email from decoded token (already attached by middleware)

    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({ student });
  } catch (error) {
    console.error("Error fetching student by email:", error);
    res.status(500).json({ message: "Server error" });
  }
};