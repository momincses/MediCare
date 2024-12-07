const mongoose = require("mongoose");

// Leave Schema
// Ye schema ek leave ka structure define karta hai (fromDate, toDate, reason).
const leaveSchema = new mongoose.Schema({
  fromDate: { type: Date, required: true }, // Leave ki shuru hone ki tareekh
  toDate: { type: Date, required: true },   // Leave ki khatam hone ki tareekh
  reason: { type: String },                // Optional: Leave ka reason save karte hain
});

// Medical Details Schema
// Is schema mein ek student ke medical details aur uske leaves ko store karte hain.
const medicalDetailsSchema = new mongoose.Schema({
  studentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Student", 
    required: true, // Har student ka ek unique ID hona zaroori hai
  },
  yourAppointment: { 
    type: Date, 
  }, // Next appointment ki date store karte hain
  allottedLeaves: [leaveSchema], // Ek array jo sab leaves ko save karega (current aur past)
  studentYear: { 
    type: Number, 
    required: true, // Student ka current year (e.g., 1st, 2nd, etc.)
  },
  studentDepartment: { 
    type: String, 
    required: true, // Student ka department (e.g., CS, ME)
  },
  studentName: { 
    type: String, 
    required: true, // Student ka naam
  },
  registrationNo: { 
    type: String, 
    unique: true, 
    required: true, // Har student ka ek unique registration number
  },
  email: { 
    type: String, 
    unique: true, 
    required: true, // Har student ka ek unique email hona zaroori hai
  },
});

// Model ko export karte hain
// Ye schema ko "MedicalDetails" naam ke model ke taur par export karte hain.
module.exports = mongoose.model("MedicalDetails", medicalDetailsSchema);
