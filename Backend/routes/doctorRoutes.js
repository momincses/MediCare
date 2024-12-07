const express = require('express');
const router = express.Router();
const { authenticateDoctorToken, getAllAppointments } = require('../controllers/doctorAuth');
const { allocateLeave } = require('../controllers/doctorOperations');

//fetch all appointments here
router.get("/doctor/allappointments", authenticateDoctorToken, getAllAppointments);

// Alllocate the leaves to student and send email 
router.post("/doctor/allocateleave", allocateLeave);


module.exports = router;
