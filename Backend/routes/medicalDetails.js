const express = require('express');
const router = express.Router();
const { saveAppointment, getAppointmentsByEmail, deleteAppointment } = require('../controllers/appointment');
const { authenticateDoctorToken, getAllAppointments } = require('../controllers/doctorAuth');

// POST: Save an appointment
router.post('/appointments', saveAppointment);

// GET: Fetch appointments by email
router.get('/appointments', getAppointmentsByEmail);
router.delete('/appointments/:id', deleteAppointment);

router.get("/doctor/allappointments", authenticateDoctorToken, getAllAppointments);


module.exports = router;
