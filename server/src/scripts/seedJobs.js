const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config({ path: require("path").resolve(__dirname, "../../.env") });

// Import models
const Job = require("../models/job.model");
const Company = require("../models/company.model");
const User = require("../models/user.model");

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("✅ Database connected successfully");
  } catch (err) {
    console.error("❌ Database connection error:", err.message);
    process.exit(1);
  }
};

// Seed data
const seedJobs = async () => {
  try {
    await connectDB();

    // Check if jobs already exist
    const existingJobsCount = await Job.countDocuments();
    console.log(`📊 Current jobs in database: ${existingJobsCount}`);

    // Get or create a recruiter user
    let recruiterUser = await User.findOne({ 
      $or: [
        { email: "recruiter@seed.com" },
        { role: "recruiter" }
      ]
    });
    
    if (!recruiterUser) {
      console.log("👤 Creating seed recruiter user...");
      const bcrypt = require("bcryptjs");
      const hashedPassword = await bcrypt.hash("Recruiter123!", 10);
      
      recruiterUser = await User.create({
        fullname: "Seed Recruiter",
        email: "recruiter@seed.com",
        phoneNumber: 1234567890,
        password: hashedPassword,
        role: "recruiter",
        isVerified: true,
      });
      console.log("✅ Seed recruiter user created");
    } else {
      console.log(`✅ Using existing recruiter user: ${recruiterUser.email}`);
    }

    // Get or create companies
    const seedCompanyNames = [
      "TechCorp Solutions",
      "DataFlow Analytics",
      "CloudVault Systems",
      "DevOps Innovations",
      "SecureNet Technologies",
    ];
    
    let companies = await Company.find({
      companyName: { $in: seedCompanyNames }
    });
    
    if (companies.length < seedCompanyNames.length) {
      console.log("🏢 Creating missing seed companies...");
      const existingNames = companies.map(c => c.companyName);
      const companiesToCreate = seedCompanyNames
        .filter(name => !existingNames.includes(name))
        .map((name, index) => {
          const locations = [
            "San Francisco, CA",
            "New York, NY",
            "Seattle, WA",
            "Austin, TX",
            "Boston, MA",
          ];
          const descriptions = [
            "Leading technology solutions provider",
            "Advanced data analytics and AI solutions",
            "Enterprise cloud infrastructure services",
            "Cutting-edge DevOps and automation tools",
            "Cybersecurity and network solutions",
          ];
          return {
            companyName: name,
            description: descriptions[index] || "Innovative technology company",
            website: `https://${name.toLowerCase().replace(/\s+/g, '')}.com`,
            location: locations[index] || "Remote",
            userId: recruiterUser._id,
          };
        });
      
      if (companiesToCreate.length > 0) {
        const newCompanies = await Company.insertMany(companiesToCreate);
        companies = [...companies, ...newCompanies];
        console.log(`✅ Created ${newCompanies.length} new seed companies`);
      }
    }
    
    // If still no companies, use any existing companies or create at least one
    if (companies.length === 0) {
      const allCompanies = await Company.find();
      if (allCompanies.length > 0) {
        companies = allCompanies;
        console.log(`✅ Using ${companies.length} existing companies from database`);
      } else {
        // Create at least one company
        const newCompany = await Company.create({
          companyName: "TechCorp Solutions",
          description: "Leading technology solutions provider",
          website: "https://techcorp.com",
          location: "San Francisco, CA",
          userId: recruiterUser._id,
        });
        companies = [newCompany];
        console.log("✅ Created default seed company");
      }
    } else {
      console.log(`✅ Using ${companies.length} companies (seed + existing)`);
    }

    // Job seed data
    const jobTitles = [
      "Senior Software Engineer",
      "Full Stack Developer",
      "Frontend Developer",
      "Backend Developer",
      "DevOps Engineer",
      "Data Scientist",
      "Machine Learning Engineer",
      "Product Manager",
      "UI/UX Designer",
      "QA Engineer",
      "Cloud Architect",
      "Cybersecurity Analyst",
      "Mobile App Developer",
      "React Developer",
      "Node.js Developer",
      "Python Developer",
      "Java Developer",
      "System Administrator",
      "Database Administrator",
      "Technical Lead",
    ];

    const jobTypes = [
      "Full-time",
      "Part-time",
      "Contract",
      "Remote",
      "Hybrid",
    ];

    const locations = [
      "San Francisco, CA",
      "New York, NY",
      "Seattle, WA",
      "Austin, TX",
      "Boston, MA",
      "Chicago, IL",
      "Los Angeles, CA",
      "Remote",
      "Hybrid",
    ];

    const jobDescriptions = [
      "We are looking for an experienced professional to join our dynamic team. You will work on cutting-edge projects and collaborate with talented individuals.",
      "Join our innovative team and help build the next generation of software solutions. We offer a collaborative environment and opportunities for growth.",
      "We seek a motivated individual to contribute to our mission of delivering exceptional products. You'll work with modern technologies and best practices.",
      "This role offers the opportunity to work on challenging problems and make a real impact. We value creativity, collaboration, and continuous learning.",
      "Be part of a team that's shaping the future of technology. We're looking for someone passionate about building great products and solving complex problems.",
    ];

    const requirementsSets = [
      ["Bachelor's degree in Computer Science or related field", "3+ years of experience", "Strong problem-solving skills", "Excellent communication abilities"],
      ["Proven experience in software development", "Knowledge of modern frameworks", "Ability to work in a team", "Strong analytical skills"],
      ["Relevant industry experience", "Proficiency in multiple programming languages", "Experience with cloud platforms", "Agile methodology knowledge"],
      ["Strong technical background", "Experience with version control systems", "Understanding of software architecture", "Passion for technology"],
      ["Excellent coding skills", "Experience with testing frameworks", "Knowledge of database systems", "Ability to learn quickly"],
    ];

    // Generate jobs
    const jobsToCreate = [];
    const numJobs = 50; // Number of jobs to create

    for (let i = 0; i < numJobs; i++) {
      const randomCompany = companies[Math.floor(Math.random() * companies.length)];
      const randomTitle = jobTitles[Math.floor(Math.random() * jobTitles.length)];
      const randomJobType = jobTypes[Math.floor(Math.random() * jobTypes.length)];
      const randomLocation = locations[Math.floor(Math.random() * locations.length)];
      const randomDescription = jobDescriptions[Math.floor(Math.random() * jobDescriptions.length)];
      const randomRequirements = requirementsSets[Math.floor(Math.random() * requirementsSets.length)];

      // Generate salary based on experience level
      const experienceLevel = Math.floor(Math.random() * 5) + 1; // 1-5 years
      const baseSalary = 50000 + (experienceLevel * 15000);
      const salary = baseSalary + Math.floor(Math.random() * 30000);

      // Generate number of positions
      const position = Math.floor(Math.random() * 5) + 1; // 1-5 positions

      jobsToCreate.push({
        title: randomTitle,
        description: `${randomDescription} This position is for ${randomTitle} at ${randomCompany.companyName}.`,
        requirements: randomRequirements,
        salary: salary,
        experienceLevel: experienceLevel,
        location: randomLocation,
        jobType: randomJobType,
        position: position,
        company: randomCompany._id,
        created_by: recruiterUser._id,
        applications: [],
      });
    }

    // Insert jobs
    const createdJobs = await Job.insertMany(jobsToCreate);
    console.log(`✅ Successfully created ${createdJobs.length} jobs`);

    // Summary
    const totalJobs = await Job.countDocuments();
    console.log(`\n📈 Summary:`);
    console.log(`   Total jobs in database: ${totalJobs}`);
    console.log(`   Companies: ${companies.length}`);
    console.log(`   Recruiter: ${recruiterUser.email}`);

    console.log("\n🎉 Seed data created successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding jobs:", error);
    process.exit(1);
  }
};

// Run the seed function
if (require.main === module) {
  seedJobs();
}

module.exports = seedJobs;

