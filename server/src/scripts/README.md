# Seed Scripts

This directory contains database seed scripts for populating the database with dummy data.

## Seed Jobs Script

The `seedJobs.js` script creates dummy job data for testing and development purposes.

### Features

- ✅ **Safe to run multiple times** - Won't delete existing data
- ✅ **Creates necessary dependencies** - Automatically creates companies and recruiter user if they don't exist
- ✅ **Uses existing data** - Will use existing companies and users if available
- ✅ **50 diverse jobs** - Creates 50 jobs with varied titles, locations, salaries, and requirements

### Usage

From the `server` directory, run:

```bash
npm run seed:jobs
```

Or directly:

```bash
node src/scripts/seedJobs.js
```

### What it creates

1. **Recruiter User** (if doesn't exist):
   - Email: `recruiter@seed.com`
   - Password: `Recruiter123!`
   - Role: `recruiter`
   - Verified: `true`

2. **Companies** (if don't exist):
   - TechCorp Solutions
   - DataFlow Analytics
   - CloudVault Systems
   - DevOps Innovations
   - SecureNet Technologies

3. **Jobs** (50 jobs):
   - Various job titles (Software Engineer, Data Scientist, etc.)
   - Different job types (Full-time, Part-time, Contract, Remote, Hybrid)
   - Multiple locations (San Francisco, New York, Seattle, etc.)
   - Varied experience levels (1-5 years)
   - Realistic salary ranges based on experience
   - Different number of positions (1-5)

### Notes

- The script will **NOT** delete any existing jobs, companies, or users
- It will add 50 new jobs each time you run it
- If companies or recruiter user already exist, it will use them
- All jobs are linked to valid companies and users

### Environment Variables

Make sure your `.env` file in the `server` directory has:
```
MONGODB_URL=your_mongodb_connection_string
```

