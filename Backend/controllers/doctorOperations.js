const MedicalDetails = require("../models/allotedLeave"); // Students ke leave details ka model
const teachers = require("../models/teachers"); // Teachers ke details ka model
const Teacher = require("../models/teachers"); // Teacher model import kar rahe hain
const nodemailer = require("nodemailer"); // Nodemailer emails bhejne ke liye

// Nodemailer ka configuration
const transporter = nodemailer.createTransport({
  service: "Gmail", // Gmail ya koi aur email service use karen
  auth: {
    user: process.env.EMAIL, // Apna email ID
    pass: process.env.EMAIL_PASSWORD, // Apna email password
  },
});

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

  console.log(studentId);

  // Required fields ki validation
  if (!studentId || !fromDate || !toDate) {
    return res
      .status(400)
      .json({ error: "Required fields missing: studentId, fromDate, or toDate." });
  }

  try {
    // Student ID ke basis pe find karte hain
    let student = await MedicalDetails.findById(studentId);

    if (!student) {
      // Agar student nahi mila toh naye student ke fields validate karte hain
      if (!studentName || !registrationNo || !studentDepartment || !studentYear || !email) {
        return res.status(400).json({
          error: "Required fields missing for new student: name, registrationNo, department, year, or email.",
        });
      }

      // Naye student ka record banate hain
      student = new MedicalDetails({
        _id: studentId,
        studentId,
        studentName,
        registrationNo,
        studentDepartment,
        studentYear,
        email,
        allottedLeaves: [], // Leave records empty honge initially
      });
    }

    // Leave ko allottedLeaves array me add karte hain
    student.allottedLeaves.push({ fromDate, toDate, reason });

    // Updated ya naya record save karte hain
    await student.save();

    // Teachers ke details fetch karte hain specific department aur year ke liye
    console.log(`Fetching teachers for department: ${studentDepartment} and year: ${studentYear}`);

    const year = typeof studentYear === "string" ? parseInt(studentYear) : studentYear; // Year ko number me convert karte hain
    const department = studentDepartment.trim(); // Department ka name sanitize karte hain

    console.log("department : ", department, typeof department);
    console.log("year : ", year, typeof year);

    const teachersList = await Teacher.findOne({
      department: department,
      year: year,
    });

    console.log(teachersList); // Debug ke liye fetched teachers ko log karte hain

    if (teachersList && teachersList.teachers.length > 0) {
      // Teachers ko email bhejne ke liye options banate hain
      const emailPromises = teachersList.teachers.map((teacher) => {
        const mailOptions = {
          from: "MediCare", // Email ka sender name
          to: teacher.email, // Teacher ka email
          subject: `Leave Notification for ${studentName}`, // Email ka subject
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

        return transporter.sendMail(mailOptions); // Email bhejne ka function
      });

      // Saare emails ek saath bhejte hain
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
