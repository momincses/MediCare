const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Student Schema
// Ye schema student ki details ko define karta hai (name, email, password, verification status)
const studentSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, // Name lazmi hai
  },
  email: { 
    type: String, 
    required: true, // Email bhi lazmi hai
    unique: true,   // Email unique hona chahiye, har student ka email alag hona chahiye
  },
  password: { 
    type: String, 
    required: true, // Password bhi lazmi hai
  },
  isVerified: { 
    type: Boolean, 
    default: false, // Verification ka status, default false hoga
  },
  verificationToken: { 
    type: String, 
    // Ye token verification ke liye use hota hai jab student ko verify karte hain
  },
});

// Hash password before saving (before saving the student, password ko hash karte hain)
studentSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Agar password modify nahi hua toh next function call karo
  this.password = await bcrypt.hash(this.password, 10); // Password ko hash karte hain using bcrypt
  next(); // Proceed to save the student after hashing the password
});

// Model ko export karte hain taake dusre files mein use kiya ja sake
module.exports = mongoose.model("Student", studentSchema);
