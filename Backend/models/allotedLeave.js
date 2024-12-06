const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema({
  fromDate: { type: Date, required: true },
  toDate: { type: Date, required: true },
  reason: { type: String }, // Optional: To store the reason for leave
});

const medicalDetailsSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  yourAppointment: { type: Date }, // Next appointment date
  allottedLeaves: [leaveSchema], // Array to store all current and past leave ranges
  studentYear: { type: Number, required: true },
  studentDepartment: { type: String, required: true },
  studentName: { type: String, required: true },
  registrationNo: { type: String, unique: true, required: true },
});

module.exports = mongoose.model("MedicalDetails", medicalDetailsSchema);
