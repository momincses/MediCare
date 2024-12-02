const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, htmlContent) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL, // Your Gmail address
        pass: process.env.EMAIL_PASSWORD, // Your Gmail password or App Password
      },
    });

    const mailOptions = {
      from: `"MediCare" <${process.env.EMAIL}>`, // Proper formatting for the 'from' field
      to, // Recipient email address
      subject, // Email subject
      html: htmlContent, // Email content in HTML format
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);

    console.log(`Email sent: ${info.response}`);
  } catch (error) {
    console.error(`Error sending email: ${error.message}`);
    throw error; // Re-throw the error to handle it in the calling function if necessary
  }
};

module.exports = sendEmail;
