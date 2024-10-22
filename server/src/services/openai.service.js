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

    const matchingUsers = await User.find({
      "profile.skills": { $in: requirements },
    });

    for (const user of matchingUsers) {
      if (user.role === "student") {
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
          text: emailContent,
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

async function notifyUsersToCompleteProfile() {
  try {
    const usersWithEmptySkills = await User.find({
      "profile.skills": { $exists: true, $eq: [] },
      role: "student",
    });

    for (const user of usersWithEmptySkills) {
      const userProfileLink = `http://localhost:5173/profile`; // Replace with your actual profile URL
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
      await sendMail(emailBody);
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


cron.schedule("0 0 * * *", () => {
  console.log(
    "Checking for users to notify about completing their profiles..."
  );
  notifyUsersToCompleteProfile();
});


async function notifyApplicationReceived(user, job, companyName) {
  try {
    const emailContentText = `
Dear ${user.fullname},

Thank you for applying to the position of ${job.title} at ${companyName}. We have received your application, and it is currently under review.

We value your interest in joining our team, and we will carefully evaluate your qualifications. Our hiring team will reach out to you if your skills and experience match the requirements of this role.

In the meantime, feel free to explore other opportunities on our platform and update your profile to ensure we can suggest the most relevant job openings to you.

Thank you again for your interest in ${companyName}. We wish you the best in the application process!

Best regards,
The Hiring Team at ${companyName}
    `;

    const emailContentHtml = `
<p>Dear ${user.fullname},</p>
<p>Thank you for applying to the position of <strong>${job.title}</strong> at <strong>${companyName}</strong>. We have received your application, and it is currently under review.</p>

<p>We value your interest in joining our team, and we will carefully evaluate your qualifications. Our hiring team will reach out to you if your skills and experience match the requirements of this role.</p>

<p>In the meantime, feel free to explore other opportunities on our platform and update your profile to ensure we can suggest the most relevant job openings to you.</p>

<p>Thank you again for your interest in <strong>${companyName}</strong>. We wish you the best in the application process!</p>

<p>Best regards,<br>The Hiring Team at ${companyName}</p>
    `;

    const emailBody = {
      from: "NextHire <noreply@nexthire.com>",
      to: user.email,
      subject: `Application Received for ${job.title} at ${companyName}`,
      text: emailContentText,
      html: emailContentHtml,
    };

    await sendMail(emailBody);
    console.log(`Application confirmation email sent to: ${user.email}`);
  } catch (error) {
    console.error("Error sending application confirmation email:", error);
  }
}

async function notifyJobDeletion(jobTitle, companyName, applicants) {
  try {
    for (const applicant of applicants) {
      const emailContentText = `
Dear ${applicant.fullname},

We regret to inform you that the job position for ${jobTitle} at ${companyName} has been deleted, and the hiring process for this position has been stopped. 

We understand that this news may be disappointing, and we encourage you to explore other opportunities that may align with your skills and interests.

Thank you for your understanding.

Best regards,
The Hiring Team at ${companyName}
`;

      const emailContentHtml = `
<p>Dear ${applicant.fullname},</p>
<p>We regret to inform you that the job position for <strong>${jobTitle}</strong> at <strong>${companyName}</strong> has been deleted, and the hiring process for this position has been stopped.</p>

<p>We understand that this news may be disappointing, and we encourage you to explore other opportunities that may align with your skills and interests.</p>

<p>Thank you for your understanding.</p>

<p>Best regards,<br>The Hiring Team at ${companyName}</p>
`;

      const emailBody = {
        from: "NextHire <noreply@nexthire.com>",
        to: applicant.email,
        subject: `Job Deletion Notification: ${jobTitle} at ${companyName}`,
        text: emailContentText,
        html: emailContentHtml,
      };

      await sendMail(emailBody);
      console.log(`Notification email sent to: ${applicant.email}`);
    }

    console.log("All applicants notified about the job deletion.");
  } catch (error) {
    console.error("Error notifying applicants about job deletion:", error);
  }
}




module.exports = { processJobAndNotifyUsers, notifyApplicationReceived, notifyJobDeletion };
