const { sendMail } = require("../utils/sendEmail");
const User = require("../models/user.model");
const OpenAI = require("openai");
async function processJobAndNotifyUsers(job) {
  try {
    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      experienceLevel,
    } = job;

    console.log("Job", job);

    const content = `We have a new job opportunity: 
      Title: ${title}, 
      Description: ${description}, 
      Requirements: ${requirements.join(", ")}, 
      Salary: ${salary}, 
      Location: ${location}, 
      Job Type: ${jobType}, 
      Experience Level: ${experienceLevel}.`;
    // Find matching users

    const matchingUsers = await User.find({
      "profile.skills": { $in: requirements },
    });

    for (const user of matchingUsers) {
      if (user.role === "student") {
        const emailBody = {
          from: "NextHire <noreply@nexthire.com>",
          to: user.email,
          subject: `Exciting Job Opportunity: ${title} at NextHire!`,
          text: `Dear ${user.fullname},\n\nWe found a job that matches your skills!\n\n${content}\n\nYou can view the job posting [here](job_link).\n\nBest Regards,\nThe NextHire Team`,
          html: `
            <p>Dear ${user.fullname},</p>
            <p>We found a job that matches your skills!</p>
            <p>${content}</p>
            <p>You can view the job posting <a href="job_link">here</a>.</p>
            <p>Best Regards,<br>The NextHire Team</p>
          `,
          amp: `
            <!doctype html>
            <html ⚡4email>
              <head>
                <meta charset="utf-8">
                <style amp4email-boilerplate>body{visibility:hidden}</style>
                <script async src="https://cdn.ampproject.org/v0.js"></script>
                <script async custom-element="amp-anim" src="https://cdn.ampproject.org/v0/amp-anim-0.1.js"></script>
              </head>
              <body>
                <p>Dear ${user.fullname},</p>
                <p>We found a job that matches your skills!</p>
                <p>${content}</p>
                <p>You can view the job posting <a href="job_link">here</a>.</p>
                <p>Best Regards,<br>The NextHire Team</p>
              </body>
            </html>
          `,
        };

        // Send email to matching student user
        await sendMail(emailBody);
        console.log(`Email sent to: ${user.email}`);
      } else {
        console.log(`User ${user.email} is not a student, skipping email.`);
      }
    }

    console.log("Emails sent to matching student users successfully.");
  } catch (error) {
    console.error("Error in processing job and notifying users:", error);
  }
}

module.exports = { processJobAndNotifyUsers };
