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
      from: emailBody.from || process.env.EMAIL_USER,
      to: emailBody.to,
      subject: emailBody.subject,
      text: emailBody.text || "",       // optional fallback plain text
      html: emailBody.html || "",       // required: actual email content
      headers: emailBody.headers || {},
    };

    // Verify SMTP connectivity and auth
    try {
      await transporter.verify();
      console.log("SMTP verified and ready to send");
    } catch (vErr) {
      console.error("SMTP verify failed:", vErr);
      throw vErr;
    }

    console.log("Sending email with options:", {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject,
    });

    const info = await transporter.sendMail(mailOptions);

    console.log("✅ Email sent");
    console.log("📨 Message ID:", info?.messageId);
    console.log("📧 Envelope:", info?.envelope);
    console.log("📤 Accepted:", info?.accepted);
    console.log("❌ Rejected:", info?.rejected);
    console.log("🔁 Response:", info?.response);

    return info;
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw error;
  }
}

module.exports = { sendMail };
