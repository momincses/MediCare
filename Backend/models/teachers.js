const mongoose = require("mongoose");

const departmentTeacherSchema = new mongoose.Schema({
  department: {
    type: String,
    required: true, // Example: "Computer Science", "Mechanical Engineering"
  },
  year: {
    type: Number,
    required: true, // Example: 1 for 1st year, 2 for 2nd year
  },
  teachers: [
    {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        unique: true, // Ensures no duplicate email across teachers
      },
    },
  ],
});

module.exports = mongoose.model("Teacher", departmentTeacherSchema);
