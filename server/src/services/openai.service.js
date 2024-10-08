const { sendMail } = require("../utils/sendEmail");
const User = require("../models/user.model");
require("dotenv").config();
const cron = require("node-cron");
async function processJobAndNotifyUsers(job, companyName) {
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

    // Find matching users based on job requirements
    const matchingUsers = await User.find({
      "profile.skills": { $in: requirements },
    });

    for (const user of matchingUsers) {
      if (user.role === "student") {
        // Construct the email body with a fixed template and dynamic job details
        const emailContent = `Subject: ${title} Opportunity at ${companyName}

Dear ${user.fullname},

We are excited to inform you of a great opportunity at ${companyName}. As a registered candidate on NextHire, we thought you might be interested in the ${title} position at ${companyName}, a rapidly growing tech company based in ${location}.

Job Description:
${description}

In this role, you will work with ${requirements.join(
          ", "
        )} to develop and maintain web applications, collaborating with a talented team to deliver outstanding user experiences. You will contribute to building intuitive, responsive interfaces while ensuring the highest standards of quality and efficiency.

Required Skills:
- Proficiency in ${requirements.join(", ")}
- Over ${experienceLevel} years of experience as a ${jobType}
- Strong communication and problem-solving abilities

Job Details:
- Salary: ${salary} per year
- Location: ${location}
- Type: ${jobType}
- Experience Level: ${experienceLevel}+ years

To apply, please visit this link [job-link]. We encourage you to explore this exciting role and join a dynamic and innovative team.

Best regards,
The Hiring Team at ${companyName}`;

        const emailBody = {
          from: "NextHire <noreply@nexthire.com>",
          to: user.email,
          subject: `${title} Opportunity at ${companyName}`,
          text: emailContent, // Use the constructed content directly
          html: `
            <p>Dear ${user.fullname},</p>
            <p>We are excited to inform you of a great opportunity at <b>${companyName}</b>. As a registered candidate on NextHire, we thought you might be interested in the <b>${title}</b> position at ${companyName}, a rapidly growing tech company based in ${location}.</p>

            <p><b>Job Description:</b><br>${description}</p>

            <p>In this role, you will work with <b>${requirements.join(
              ", "
            )}</b> to develop and maintain web applications, collaborating with a talented team to deliver outstanding user experiences. You will contribute to building intuitive, responsive interfaces while ensuring the highest standards of quality and efficiency.</p>

            <p><b>Required Skills:</b></p>
            <ul>
              ${requirements
                .map((skill) => `<li>Proficiency in ${skill}</li>`)
                .join("")}
              <li>Over ${experienceLevel} years of experience as a ${jobType}</li>
              <li>Strong communication and problem-solving abilities</li>
            </ul>

            <p><b>Job Details:</b></p>
            <ul>
              <li>Salary: ${salary} per year</li>
              <li>Location: ${location}</li>
              <li>Type: ${jobType}</li>
              <li>Experience Level: ${experienceLevel}+ years</li>
            </ul>

            <p>To apply, please submit your resume and portfolio at <a href="job_link">this link</a>. We encourage you to explore this exciting role and join a dynamic and innovative team.</p>

            <p>Best regards,<br>The Hiring Team at ${companyName}</p>
          `,
        };

        // Send the email to the user
        await sendMail(emailBody);
        console.log(`Email sent to: ${user.email}`);
      } else {
        console.log(`User ${user.email} is not a student, skipping email.`);
      }
    }

    console.log("Emails sent to matching users successfully.");
  } catch (error) {
    console.error("Error in processing job and notifying users:", error);
  }
}

// New function to check skills and notify users
async function notifyUsersToCompleteProfile() {
  try {
    // Find users whose skills field is empty
    const usersWithEmptySkills = await User.find({
      "profile.skills": { $exists: true, $eq: [] },
    });

    for (const user of usersWithEmptySkills) {
      // Construct the email body
      const userProfileLink = `https://your-platform-url.com/profile/${user._id}`; // Replace with your actual profile URL
      const emailContent = `Subject: Complete Your Profile for Better Job Suggestions

Dear ${user.fullname},

We noticed that your profile is incomplete, specifically the skills section. Completing your profile will help us suggest more relevant job opportunities tailored to your expertise and interests.

To enhance your experience on NextHire and to get notified about exciting job openings that match your skills, please log in to your account and update your skills section at the following link: [Update Your Profile](${userProfileLink}).

Best regards,
The NextHire Team`;

      const emailBody = {
        from: "NextHire <noreply@nexthire.com>",
        to: user.email,
        subject: "Complete Your Profile for Better Job Suggestions",
        text: emailContent,
        html: `
          <p>Dear ${user.fullname},</p>
          <p>We noticed that your profile is incomplete, specifically the skills section. Completing your profile will help us suggest more relevant job opportunities tailored to your expertise and interests.</p>
          <p>To enhance your experience on NextHire and to get notified about exciting job openings that match your skills, please log in to your account and update your skills section at the following link: <a href="${userProfileLink}">Update Your Profile</a>.</p>
          <p>Best regards,<br>The NextHire Team</p>
        `,
      };

      // Send the email to the user
      // await sendMail(emailBody);
      console.log(`Email sent to: ${user.email}`);
    }

    console.log("Profile completion notifications sent successfully.");
  } catch (error) {
    console.error(
      "Error in notifying users to complete their profiles:",
      error
    );
  }
}

// Schedule the profile completion notifications to run daily at midnight
cron.schedule("0 0 * * *", () => {
  console.log(
    "Checking for users to notify about completing their profiles..."
  );
  notifyUsersToCompleteProfile();
});

module.exports = { processJobAndNotifyUsers };
