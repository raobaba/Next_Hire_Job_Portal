const nodemailer = require("nodemailer");

async function sendMail(emailBody) {
  try {
    const transporter = nodemailer.createTransport({
      secure: true,
      host: "smtp.gmail.com",
      port: 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: emailBody.from,
      to: emailBody.to,
      subject: emailBody.subject,
      text: emailBody.text,
      headers: emailBody.headers, // Pass custom headers
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

module.exports = { sendMail };
