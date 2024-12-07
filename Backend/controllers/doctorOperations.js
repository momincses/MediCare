const MedicalDetails = require("../models/allotedLeave");
const teachers = require("../models/teachers");
const Teacher = require("../models/teachers"); // Import the teacher model
const nodemailer = require("nodemailer"); // Import Nodemailer for sending emails

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "Gmail", // Change to your email service
  auth: {
    user: process.env.EMAIL, // Add your email here
    pass: process.env.EMAIL_PASSWORD, // Add your email password here
  },
});

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
    reason,
    email,
  } = req.body;

  console.log(studentId);

  // Validate the required fields
  if (!studentId || !fromDate || !toDate) {
    return res
      .status(400)
      .json({ error: "Missing required fields: studentId, fromDate, or toDate." });
  }

  try {
    // Try to find the student by ID
    let student = await MedicalDetails.findById(studentId);

    if (!student) {
      // If student does not exist, validate all necessary fields
      if (!studentName || !registrationNo || !studentDepartment || !studentYear || !email) {
        return res.status(400).json({
          error: "Missing required fields for new student: studentName, registrationNo, studentDepartment, or studentYear.",
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
        email,
        allottedLeaves: [],
      });
    }

    // Add the leave to the student's allottedLeaves array
    student.allottedLeaves.push({ fromDate, toDate, reason });

    // Save the updated or newly created document
    await student.save();

    // Fetch teachers for the specific department and year
    console.log(`Fetching teachers for department: ${studentDepartment} and year: ${studentYear}`);
    
    // Convert studentYear to number if it's a string
    const year = typeof studentYear === 'string' ? parseInt(studentYear) : studentYear;

    // Ensure the department is a string and matching the case exactly
    const department = studentDepartment.trim();

    console.log("department : ", department, typeof department);
    console.log("year : ", year, typeof year);

    const teachersList = await Teacher.findOne({
      department: department,
      year: year,
    });

    console.log(teachersList); // Log the fetched teachers for debugging

    if (teachersList && teachersList.teachers.length > 0) {
      // Prepare email notifications
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

      // Send emails
      await Promise.all(emailPromises);

      console.log("Emails sent to teachers.");
    } else {
      console.warn(
        `No teachers found for department: ${studentDepartment} and year: ${studentYear}`
      );
    }

    res.status(200).json({ message: "Leave allocated and email notifications sent successfully." });
  } catch (error) {
    console.error("Error allocating leave:", error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
};
