const express = require('express');
const router = express.Router();
const { saveAppointment, getAppointmentsByEmail, deleteAppointment, getAllocatedLeaves } = require('../controllers/appointment');
const { authenticateDoctorToken, getAllAppointments } = require('../controllers/doctorAuth');
const { allocateLeave } = require('../controllers/doctorOperations');

// POST: Save an appointment
router.post('/appointments', saveAppointment);

// GET: Fetch appointments by email
router.get('/appointments', getAppointmentsByEmail);
router.delete('/appointments/:id', deleteAppointment);
router.get("/allocatedLeaves", getAllocatedLeaves);

router.get("/doctor/allappointments", authenticateDoctorToken, getAllAppointments);
router.post("/doctor/allocateleave", allocateLeave);


module.exports = router;
