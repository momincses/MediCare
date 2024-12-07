const mongoose = require("mongoose");

// Doctor Schema
// Ye schema doctor ke details ko define karta hai (email, password)
const doctorSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, // Email field lazmi hai
    unique: true,   // Email unique hona chahiye, har doctor ka email alag hona chahiye
  },
  password: { 
    type: String, 
    required: true, // Password field bhi lazmi hai
  },
});

// Doctor model ko "Doctor" naam se banaya gaya hai
const Doctor = mongoose.model("Doctor", doctorSchema);

// Model ko export karte hain taake dusre files mein use kiya ja sake
module.exports = Doctor;
