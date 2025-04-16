const Appointment = require('../models/appointment'); // Appointments ka model
const MedicalDetails = require("../models/allotedLeave"); // Medical leaves ka model

/**
 * Save Appointment
 * Ye function ek student ka appointment save karta hai aur uski details database mein store karta hai.
 */
exports.saveAppointment = async (req, res) => {
  const { name, registrationNo, emailId, departmentName, year, visitDate, appointmentStatus  } = req.body;

  // Required fields ki validation
  if (!name || !registrationNo || !emailId || !departmentName || !year || !visitDate) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    // Appointment object banate hain aur database mein save karte hain
    const newAppointment = new Appointment({
      name,
      registrationNo,
      emailId,
      departmentName,
      year,
      visitDate,
      appointmentStatus: appointmentStatus || "pending", 
    });

    const savedAppointment = await newAppointment.save(); // Save operation
    res.status(201).json({ message: "Appointment saved successfully!", appointment: savedAppointment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error saving appointment.", error: error.message });
  }
};



/**
 * Get Appointments By Email
 * Is function ka kaam hai student ka email use karke appointments fetch karna.
 */
exports.getAppointmentsByEmail = async (req, res) => {
  const { email } = req.query;

  // Email ka hona zaroori hai
  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  try {
    // Email ke basis par appointments retrieve karte hain
    const appointments = await Appointment.find({ emailId: email }).sort({ visitDate: -1 });
    res.status(200).json({ message: "Appointments fetched successfully!", appointments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching appointments.", error: error.message });
  }
};

/**
 * Delete Appointment
 * Is function ka kaam hai appointment ko delete karna, agar woh exist karta ho.
 */
exports.deleteAppointment = async (req, res) => {
  const { id } = req.params;

  try {
    // Appointment ID ke basis par delete karte hain
    const deletedAppointment = await Appointment.findByIdAndDelete(id);

    if (!deletedAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json({ message: "Appointment deleted successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Server error: Unable to delete appointment" });
  }
};

/**
 * Get Allocated Leaves
 * Ye function ek student ke allocated leaves ko email ke zariye fetch karta hai.
 */
exports.getAllocatedLeaves = async (req, res) => {
  const { email } = req.query;

  try {
    // Email se student ke medical details find karte hain
    const medicalDetails = await MedicalDetails.findOne({ email });

    // Agar leaves nahi hain toh error message
    if (!medicalDetails || !medicalDetails.allottedLeaves || medicalDetails.allottedLeaves.length === 0) {
      return res.status(404).json({ message: "No leaves allocated for this student." });
    }

    // Leaves return karte hain
    res.status(200).json({ leaves: medicalDetails.allottedLeaves });
  } catch (error) {
    console.error("Error fetching allocated leaves:", error);
    res.status(500).json({ message: "Error fetching allocated leaves." });
  }
};
