const express = require('express');
const router = express.Router();
const { authenticateDoctorToken } = require('../controllers/doctorAuth');
const {
  allocateLeave,
  updateAppointmentStatus,
  getAllAppointments,
  getAppointmentsByDate, 
} = require('../controllers/doctorOperations');

//  Fetch all appointments
router.get("/doctor/allappointments", authenticateDoctorToken, getAllAppointments);

//  Fetch appointments by specific date
router.get("/doctor/appointments/by-date", authenticateDoctorToken, getAppointmentsByDate);

//  Allocate the leaves to student and send email 
router.post("/doctor/allocateleave", allocateLeave);

//  Update appointment status (accepted, rejected, pending)
router.patch("/doctor/appointment/:id/status", authenticateDoctorToken, updateAppointmentStatus);

module.exports = router;
