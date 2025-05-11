// Required modules and models
const Student = require("../models/student"); // Student ka data manage karne ka model
const sendEmail = require("../utils/sendEmail"); // Emails bhejne ka function
const crypto = require("crypto"); // Tokens generate karne ke liye
const bcrypt = require("bcrypt"); // Password hash aur validate karne ke liye
const jwt = require("jsonwebtoken"); // JSON Web Token banane aur verify karne ke liye

/**
 * Yeh function student ko register karta hai.
 * Isme email, password aur name ko validate karte hain.
 * Agar sab kuch theek ho toh student ko database me save karte hain.
 * Phir ek verification token generate kar ke email bhejte hain.
 */
exports.registerStudent = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  try {
    // Validation: Agar koi required field miss ho toh error bhejte hain
    if (!password || !confirmPassword) {
      return res.status(400).json({ error: "Sab fields fill karna zaroori hai" });
    }

    // Email ka format chename || !email || !ck karte hain
    if (!/^[0-9]{4}[a-zA-Z]{3,5}[0-9]{1,5}@sggs\.ac\.in$/.test(email)) {
      return res.status(400).json({ error: "Email format sahi nahi hai" });
    }

    // Password ka length check karte hain
    if (password.length < 6) {
      return res.status(400).json({ error: "Password kam se kam 6 characters ka hona chahiye" });
    }

    // Passwords match karne chahiye
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords match nahi kar rahe" });
    }

    // Check karte hain agar student ka email pehle se registered hai
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ error: "Is email se student pehle se registered hai" });
    }

    // Verification token generate karte hain
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Naya student create karte hain aur database me save karte hain
    const student = new Student({
      name,
      email,
      password,
      verificationToken,
    });
    await student.save();

    // Email verify karne ka URL banate hain aur send karte hain
    const verificationUrl = `${process.env.BASE_URL}/api/auth/verify?token=${verificationToken}`;
    await sendEmail(
      email,
      "Verify Your Email",
      `<h2>Hello, ${name}</h2>
      <p>Please verify your email by clicking the link below:</p>
      <a href="${verificationUrl}">Verify Email</a>`
    );

    // Response bhejte hain
    res.status(201).json({
      message: "Registration successful. Please check your email to verify your account.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Yeh function email verification ke liye hota hai.
 * Token ko verify karta hai, agar valid hota hai toh student ko verified mark karte hain.
 */
exports.verifyEmail = async (req, res) => {
  const { token } = req.query;

  try {
    // Token se student dhoondte hain
    const student = await Student.findOne({ verificationToken: token });

    if (!student) {
      return res.status(400).json({ error: "Invalid ya expired token" });
    }

    // Student ko verified karte hain
    student.isVerified = true;
    student.verificationToken = null;
    await student.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Yeh function student login handle karta hai.
 * Email aur password ko verify karta hai aur JWT token generate karta hai agar login successful ho.
 */
exports.loginStudent = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validation: Email aur password required hain
    if (!email || !password) {
      return res.status(400).json({ error: "Email aur password dena zaroori hai" });
    }

    // Check karte hain agar student exist karta hai ya nahi
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(404).json({ error: "Student nahi mila" });
    }

    // Agar email verified nahi hai toh login nahi ho sakta
    if (!student.isVerified) {
      return res.status(400).json({ error: "Email verify karna zaroori hai login ke liye" });
    }

    // Password ko verify karte hain
    const isPasswordValid = await bcrypt.compare(password, student.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid email ya password" });
    }

    // JWT token generate karte hain
    const token = jwt.sign(
      { id: student._id, email: student.email, name: student.name },
      process.env.JWT_SECRET, // Secret key ko replace karein
      { expiresIn: "1h" } // Token expire hoga 1 hour baad
    );

    // Login successful hone par response bhejte hain
    res.status(200).json({
      message: "Login successful",
      token, // Token response me bhejte hain
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Yeh middleware function JWT token ko validate karta hai.
 * Agar token valid hota hai, toh user ki info request object mein attach karte hain.
 */
exports.authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Token "Bearer <token>" format mein expect karte hain

  if (!token) {
    return res.status(401).json({ error: "Token missing hai, access denied!" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" });
    }
    req.user = user; // User ki information request object mein save karte hain
    next();
  });
};

/**
 * Yeh function student ki details fetch karne ke liye hota hai.
 * Token ko validate karte hain aur phir student ke email se uski details retrieve karte hain.
 */
exports.fetchStudent = async (req, res) => {
  try {
    // Token se student ki email milti hai
    const { email } = req.user; // Token se decoded email milti hai

    // Student ko email se dhoondte hain
    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(404).json({ message: "Student nahi mila" });
    }

    // Student ki details response mein bhejte hain
    res.status(200).json({ student });
  } catch (error) {
    console.error("Error fetching student by email:", error);
    res.status(500).json({ message: "Server error" });
  }
};
