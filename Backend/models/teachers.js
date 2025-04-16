const mongoose = require("mongoose");

// Department Teacher Schema
// Ye schema department aur teachers ki details ko define karta hai
const departmentTeacherSchema = new mongoose.Schema({
  department: {
    type: String,
    required: true, // Department ka naam zaroori hai, jaise "Computer Science", "Mechanical Engineering"
  },
  year: {
    type: Number,
    required: true, // Year ki value zaroori hai, jaise 1st year ke liye 1, 2nd year ke liye 2
  },
  teachers: [
    {
      name: {
        type: String,
        required: true, // Teacher ka naam zaroori hai
      },
      email: {
        type: String,
        required: true // Teacher ka email zaroori hai
        // unique: true, // Email unique hona chahiye, taake koi duplicate na ho
      },
    },
  ],
});

// Model ko export karte hain taake dusre files mein use kiya ja sake
module.exports = mongoose.model("Teacher", departmentTeacherSchema);
