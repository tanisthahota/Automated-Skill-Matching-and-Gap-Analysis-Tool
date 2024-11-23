## Automated-Skill-Matching-and-Gap-Analysis-Tool

### Overview
The Automated Skill Matching and Gap Analysis Tool is a web application designed to help job seekers and recruiters 
efficiently match skills with job descriptions. The application allows users to upload resumes, analyze skill gaps, 
and receive course recommendations to enhance their skill sets. It also provides recruiters with a streamlined way 
to manage job applications and track candidate skills.

### Features
- User Registration and Authentication: Users can register and log in to the application.
- Resume Upload: Users can upload their resumes in various formats (PDF, text).
- Skill Extraction: The application extracts skills from uploaded resumes.
- Skill Matching: Matches user skills with job descriptions to identify suitable job opportunities.
- Skill Gap Analysis: Analyzes the skills required for job descriptions against the user's skills to identify gaps.
- Course Recommendations: Provides recommendations for courses to help users fill their skill gaps.
- Job Application Management: Allows users to apply for jobs and track their application status.

### Technologies Used
- Backend: Node.js, Express.js
- Database: MySQL
- Authentication: JSON Web Tokens (JWT)
- Password Hashing: bcrypt
- File Parsing: pdf-parse (for PDF resumes)


### Database Schema
- The application uses a relational database with the following key tables:
- User: Stores user information and roles.
- Resume: Stores uploaded resumes linked to users.
- Skills: Maintains a master list of skills.
- Job_Description: Stores job postings.
- Job_Description_Skills: Maps required skills to jobs.
- Resume_Skills: Maps skills to resumes.
- Skill_Match: Stores matching results between resumes and jobs.
- Gap_Analysis: Stores analysis of missing skills for users.
- Course_Recommendation: Stores course suggestions for skill gaps.


### Installation
1. Clone the repository:
```bash
git clone https://github.com/tanisthahota/Automated-Skill-Matching-and-Gap-Analysis-Tool.git
```

2. Install dependencies:
```bash
npm install
```
3. Create a `.env` file and set the following environment variables:
```bash
JWT_SECRET=your_secret_key
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_DATABASE=your_database_name
```
4. Setup the database:
- run the SQL scripts in the `backend/SQL` directory to create the necessary tables and populate the skills list.

5. Start the server:
```bash
npm run dev
```

### API Endpoints
- POST /api/auth/register: Register a new user.
- POST /api/auth/login: Log in an existing user.
- POST /api/jobs/:jobId/apply: Apply for a job.
- GET /api/jobs/:jobId/application-status: Check the status of a job application.
- GET /api/skill-gap-analysis: Analyze skill gaps for the logged-in user.
- GET /api/course-recommendations: Get course recommendations based on missing skills.
- GET /api/user/skills: Retrieve skills associated with the logged-in user's resumes.

### Usage
1. Register a new user or log in with existing credentials.
2. Upload your resume to extract skills.
3. View job matches based on your skills.
4. Analyze skill gaps and receive course recommendations to improve your skill set.


