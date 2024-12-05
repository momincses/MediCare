const Appointment = require('../models/appointment');

// Save Appointment
exports.saveAppointment = async (req, res) => {
  const { name, registrationNo, emailId, departmentName, year, visitDate } = req.body;

  // Validate fields
  if (!name || !registrationNo || !emailId || !departmentName || !year || !visitDate) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const newAppointment = new Appointment({
      name,
      registrationNo,
      emailId,
      departmentName,
      year,
      visitDate,
    });

    const savedAppointment = await newAppointment.save();
    res.status(201).json({ message: "Appointment saved successfully!", appointment: savedAppointment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error saving appointment.", error: error.message });
  }
};

// Fetch Appointments by Email
exports.getAppointmentsByEmail = async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  try {
    const appointments = await Appointment.find({ emailId: email }).sort({ visitDate: -1 });
    res.status(200).json({ message: "Appointments fetched successfully!", appointments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching appointments.", error: error.message });
  }
};

exports.deleteAppointment = async (req, res) => {
    const { id } = req.params;
  
    try {
      const deletedAppointment = await Appointment.findByIdAndDelete(id);
  
      if (!deletedAppointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }
  
      res.json({ message: "Appointment deleted successfully!" });
    } catch (err) {
      res.status(500).json({ message: "Server error: Unable to delete appointment" });
    }
  };
  