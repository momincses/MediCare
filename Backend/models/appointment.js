const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  registrationNo: { type: String, required: true },
  emailId: { type: String, required: true },
  departmentName: { type: String, required: true },
  year: { type: String, required: true },
  visitDate: { type: Date, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
