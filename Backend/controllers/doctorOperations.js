const MedicalDetails = require("../models/allotedLeave"); // Students ke leave details ka model
const teachers = require("../models/teachers"); // Teachers ke details ka model
const Teacher = require("../models/teachers"); // Teacher model import kar rahe hain
const nodemailer = require("nodemailer"); // Nodemailer emails bhejne ke liye
const Appointment = require('../models/appointment'); // Appointments ka model

// Nodemailer ka configuration
const transporter = nodemailer.createTransport({
  service: "Gmail", // Gmail ya koi aur email service use karen
  auth: {
    user: process.env.EMAIL, // Apna email ID
    pass: process.env.EMAIL_PASSWORD, // Apna email password
  },
});

/**
 * Yeh function saare appointments retrieve karne ke liye hota hai.
 * Database se saare appointments fetch karta hai aur unhe response me bhejta hai.
 * Agar koi error aaye toh server error ka response deta hai.
 */
exports.getAllAppointments = async (req, res) => {
  try {
    // Database se saare appointments fetch karte hain
    const appointments = await Appointment.find();

    // Response me appointments bhejte hain
    res.status(200).json({ appointments });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Yeh function ek specific date ke appointments fetch karta hai.
 * Client se date leke us din ke saare appointments database se retrieve karta hai.
 * Agar appointments mil jaate hain toh unhe return karta hai, nahi toh empty array deta hai.
 */
// In controllers/doctorOperations.js (or wherever you keep it)
exports.getAppointmentsByDate = async (req, res) => {
  const { date } = req.query; // e.g. "2025-04-18"

  if (!date) {
    return res.status(400).json({ error: "Date query parameter is required." });
  }

  try {
    // Build an exact UTC‐midnight range for that calendar day:
    const startOfDay = new Date(date);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setUTCHours(23, 59, 59, 999);

    // (Optional) Log what you’re querying, for debugging:
    console.log(
      `Querying appointments from ${startOfDay.toISOString()} ` +
      `through ${endOfDay.toISOString()}`
    );

    // Fetch them
    const appointments = await Appointment.find({
      visitDate: { $gte: startOfDay, $lte: endOfDay }
    });

    console.log(`Found ${appointments.length} appointment(s)`);
    return res.status(200).json({ appointments });
  } catch (error) {
    console.error("Error fetching appointments by date:", error);
    return res.status(500).json({ error: "Server error. Please try again later." });
  }
};



// PATCH /appointments/:id/status
// Is function doctor appointment accept ya reject kar sakta hai.
exports.updateAppointmentStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['pending', 'accepted', 'rejected'].includes(status)) {
    return res.status(400).json({ message: "Invalid status value." });
  }

  try {
    const updated = await Appointment.findByIdAndUpdate(id, { appointmentStatus: status }, { new: true });
    if (!updated) return res.status(404).json({ message: "Appointment not found." });

    res.json({ message: "Status updated.", appointment: updated });
  } catch (err) {
    res.status(500).json({ message: "Failed to update appointment status." });
  }
};

/**
 * Yeh function ek student ke liye leave allocate karta hai aur teachers ko email notification bhejta hai.
 * Agar student pehle se exist kare, toh uske record ko update karta hai. Naya student ho toh naye record ke saath save karta hai.
 * Department aur year ke teachers ke emails find karke notification bhejta hai.
 */
exports.allocateLeave = async (req, res) => {
  const {
    studentId,
    studentName,
    registrationNo,
    studentDepartment,
    studentYear,
    fromDate,
    toDate,
    reason,
    email,
  } = req.body;

  // Validate required fields
  if (!studentId || !fromDate || !toDate) {
    return res.status(400).json({
      error: "Required fields missing: studentId, fromDate, or toDate.",
    });
  }

  try {
    let student = await MedicalDetails.findById(studentId);

    // If not found by ID, try finding by registrationNo or email
    if (!student) {
      if (!studentName || !registrationNo || !studentDepartment || !studentYear || !email) {
        return res.status(400).json({
          error: "Required fields missing for new student: name, registrationNo, department, year, or email.",
        });
      }

      student = await MedicalDetails.findOne({
        $or: [{ registrationNo }, { email }],
      });

      // If student still not found, create new
      if (!student) {
        student = new MedicalDetails({
          _id: studentId,
          studentId,
          studentName,
          registrationNo,
          studentDepartment,
          studentYear,
          email,
          allottedLeaves: [],
        });
      }
    }

    // Add leave to the student's allottedLeaves
    student.allottedLeaves.push({ fromDate, toDate, reason });

    await student.save();

    // Fetch relevant teachers
    const year = typeof studentYear === "string" ? parseInt(studentYear) : studentYear;
    const department = studentDepartment.trim();

    const teachersList = await Teacher.findOne({ department, year });

    if (teachersList && teachersList.teachers.length > 0) {
      const emailPromises = teachersList.teachers.map((teacher) => {
        const mailOptions = {
          from: "MediCare",
          to: teacher.email,
          subject: `Leave Notification for ${studentName}`,
          text: `
Dear ${teacher.name},

A leave has been allocated for a student in your department and year:

Student Name: ${studentName}
Registration No: ${registrationNo}
Department: ${studentDepartment}
Year: ${studentYear}
From Date: ${fromDate}
To Date: ${toDate}
Reason: ${reason}

Thank you,
Admin Team
          `,
        };

        return transporter.sendMail(mailOptions);
      });

      await Promise.all(emailPromises);
      console.log("Emails sent to teachers.");
    } else {
      console.warn(`No teachers found for department: ${studentDepartment} and year: ${studentYear}`);
    }

    res.status(200).json({
      message: "Leave allocated and email notifications sent successfully.",
    });
  } catch (error) {
    console.error("Error allocating leave:", error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
};

