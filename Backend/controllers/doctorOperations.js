const MedicalDetails = require("../models/allotedLeave");

// Controller to allocate leave
exports.allocateLeave = async (req, res) => {
    const { 
        studentId, 
        studentName, 
        registrationNo, 
        studentDepartment, 
        studentYear, 
        fromDate, 
        toDate, 
        reason 
    } = req.body;
    
    console.log(studentId);
  // Validate the required fields
  if (!studentId || !fromDate || !toDate) {
    return res.status(400).json({ error: "Missing required fields: studentId, fromDate, or toDate." });
  }

  try {
    // Try to find the student by ID
    let student = await MedicalDetails.findById(studentId);

    if (!student) {
      // If student does not exist, validate all necessary fields
      if (!studentName || !registrationNo || !studentDepartment || !studentYear) {
        return res.status(400).json({ 
          error: "Missing required fields for new student: studentName, registrationNo, studentDepartment, or studentYear." 
        });
      }

      // Create a new instance for the student
      student = new MedicalDetails({
        _id: studentId,
        studentId,
        studentName,
        registrationNo,
        studentDepartment,
        studentYear,
        allottedLeaves: [],
      });
    }

    // Add the leave to the student's allottedLeaves array
    student.allottedLeaves.push({ fromDate, toDate, reason });

    // Save the updated or newly created document
    await student.save();

    res.status(200).json({ message: "Leave allocated successfully." });
  } catch (error) {
    console.error("Error allocating leave:", error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
};
