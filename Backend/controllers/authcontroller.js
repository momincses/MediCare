const Student = require("../models/student");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

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
