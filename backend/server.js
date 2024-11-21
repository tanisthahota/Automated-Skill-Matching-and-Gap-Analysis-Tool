import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { pool } from './database.js';
import multer from 'multer';
import path from 'path';
import pdf from 'pdf-parse';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Create uploads directory if it doesn't exist
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads');
try {
  await fs.access(uploadDir);
} catch {
  await fs.mkdir(uploadDir, { recursive: true });
}

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({ storage: storage });

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access denied' });

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ error: 'Invalid token' });
  }
};

// Add this function before your routes
async function parseResume(filePath) {
  try {
    const dataBuffer = await fs.readFile(filePath);
    let text = '';
    
    if (filePath.toLowerCase().endsWith('.pdf')) {
      const pdfData = await pdf(dataBuffer);
      text = pdfData.text;
    } else {
      // For non-PDF files, just convert buffer to string
      text = dataBuffer.toString();
    }

    return { text };
  } catch (error) {
    console.error('Error parsing resume:', error);
    throw new Error('Failed to parse resume: ' + error.message);
  }
}

// Also add a basic skill extraction function
// Update the extractSkillsFromText function (around line 84-102):
function extractSkillsFromText(text) {
  const skillPatterns = {
    'javascript': /javascript|js/i,
    'python': /python/i,
    'java': /\bjava\b/i,
    'react': /react/i,
    'node': /node\.?js/i,
    'sql': /sql/i,
    'html': /html/i,
    'css': /css/i,
    'typescript': /typescript|ts/i,
    'angular': /angular/i,
    'vue': /vue\.?js/i,
    'docker': /docker|containerization/i,
    'aws': /aws|amazon web services/i,
    'azure': /azure/i,
    'git': /\bgit\b/i,
    'mongodb': /mongo|mongodb/i,
    'postgresql': /postgres|postgresql/i,
    'mysql': /mysql/i,
    'redux': /redux/i,
    'express': /express\.?js|express/i
  };

  const foundSkills = new Set();

  for (const [skill, pattern] of Object.entries(skillPatterns)) {
    if (pattern.test(text)) {
      foundSkills.add(skill);
    }
  }

  return Array.from(foundSkills);
}

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, phone, address, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const [result] = await pool.query(
      'INSERT INTO User (User_Name, Email, Phone, Address, Password, Role) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, phone, address, hashedPassword, role]
    );

    const token = jwt.sign({ id: result.insertId, role }, JWT_SECRET);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/jobs/:jobId/apply', authenticateToken, async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const { resumeId } = req.body;
    const userId = req.user.id;

    // Check if already applied
    const [existing] = await pool.query(
      'SELECT * FROM Job_Applications WHERE User_ID = ? AND Job_Description_ID = ?',
      [userId, jobId]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: 'Already applied to this job' });
    }

    // Insert application with resume information
    await pool.query(
      'INSERT INTO Job_Applications (User_ID, Job_Description_ID, Resume_ID, Application_Date, Status) VALUES (?, ?, ?, NOW(), "Pending")',
      [userId, jobId, resumeId]
    );

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/jobs/:jobId/application-status', authenticateToken, async (req, res) => {
  try {
    const [application] = await pool.query(
      'SELECT Status, Application_Date FROM Job_Applications WHERE User_ID = ? AND Job_Description_ID = ?',
      [req.user.id, req.params.jobId]
    );

    if (application.length === 0) {
      return res.json({ applied: false });
    }

    res.json({
      applied: true,
      status: application[0].Status,
      applicationDate: application[0].Application_Date
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/jobs/my-applications', authenticateToken, async (req, res) => {
  try {
    const [applications] = await pool.query(`
      SELECT 
        jd.Job_Description_ID as id,
        jd.Job_Name as title,
        jd.Company_Name as company,
        jd.Location as location,
        jd.Description as description,
        ja.Application_Date as applicationDate,
        ja.Status as status,
        r.File_Name as resumeName,
        GROUP_CONCAT(DISTINCT s.Skill_Name) as skills
      FROM Job_Applications ja
      JOIN Job_Description jd ON ja.Job_Description_ID = jd.Job_Description_ID
      LEFT JOIN Resume r ON ja.Resume_ID = r.Resume_ID
      LEFT JOIN Resume_Skills rs ON r.Resume_ID = rs.Resume_ID
      LEFT JOIN Skills s ON rs.Skill_ID = s.Skill_ID
      WHERE ja.User_ID = ?
      GROUP BY ja.Application_ID
      ORDER BY ja.Application_Date DESC
    `, [req.user.id]);

    const formattedApplications = applications.map(app => ({
      ...app,
      skills: app.skills ? app.skills.split(',').filter(Boolean) : [],
      applicationStatus: {
        applicationDate: app.applicationDate,
        status: app.status,
        resumeName: app.resumeName
      }
    }));

    res.json(formattedApplications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/jobs/applications/:id', authenticateToken, async (req, res) => {
  try {
    // Verify the application belongs to the user
    const [application] = await pool.query(
      'SELECT * FROM Job_Applications WHERE Job_Description_ID = ? AND User_ID = ?',
      [req.params.id, req.user.id]
    );

    if (application.length === 0) {
      return res.status(404).json({ error: 'Application not found' });
    }

    await pool.query('DELETE FROM Job_Applications WHERE Job_Description_ID = ? AND User_ID = ?', 
      [req.params.id, req.user.id]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/jobs/applications', authenticateToken, async (req, res) => {
  if (req.user.role !== 'recruiter') {
    return res.status(403).json({ error: 'Access denied' });
  }

  try {
    const [applications] = await pool.query(`
      SELECT 
        ja.Application_ID as id,
        ja.User_ID as userId,
        ja.Job_Description_ID as jobId,
        ja.Status as status,
        ja.Application_Date as applicationDate,
        jd.Job_Name as jobTitle,
        u.User_Name as applicantName,
        COALESCE(sm.Match_Rate, 0) as matchRate
      FROM Job_Applications ja
      JOIN Job_Description jd ON ja.Job_Description_ID = jd.Job_Description_ID
      JOIN User u ON ja.User_ID = u.UserID
      LEFT JOIN Skill_Match sm ON ja.User_ID = sm.User_ID AND ja.Job_Description_ID = sm.Job_Description_ID
      ORDER BY ja.Application_Date DESC
    `);

    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/jobs/applications/:id', authenticateToken, async (req, res) => {
  if (req.user.role !== 'recruiter') {
    return res.status(403).json({ error: 'Access denied' });
  }

  try {
    const { status } = req.body;
    await pool.query(
      'UPDATE Job_Applications SET Status = ? WHERE Application_ID = ?',
      [status, req.params.id]
    );

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/jobs/recommendations', authenticateToken, async (req, res) => {
  try {
    // Get user's skills from their resumes
    const [userSkills] = await pool.query(`
      SELECT DISTINCT s.Skill_Name 
      FROM Resume_Skills rs
      JOIN Skills s ON rs.Skill_ID = s.Skill_ID
      JOIN Resume r ON rs.Resume_ID = r.Resume_ID
      WHERE r.User_ID = ?
    `, [req.user.id]);

    // Find jobs matching user's skills
    const [jobs] = await pool.query(`
      SELECT 
        jd.Job_Description_ID as id,
        jd.Job_Name as title,
        jd.Company_Name as company,
        jd.Location as location,
        jd.Posted_Date as posted,
        (
          SELECT COUNT(DISTINCT rs.Skill_ID) * 100.0 / 
            (SELECT COUNT(DISTINCT jds2.Skill_ID) 
             FROM Job_Description_Skills jds2 
             WHERE jds2.Job_Description_ID = jd.Job_Description_ID)
          FROM Resume_Skills rs
          JOIN Skills s ON rs.Skill_ID = s.Skill_ID
          JOIN Resume r ON rs.Resume_ID = r.Resume_ID
          WHERE r.User_ID = ?
          AND rs.Skill_ID IN (
            SELECT DISTINCT jds.Skill_ID 
            FROM Job_Description_Skills jds
            WHERE jds.Job_Description_ID = jd.Job_Description_ID
          )
        ) as matchRate
      FROM Job_Description jd
      WHERE jd.Job_Description_ID NOT IN (
        SELECT Job_Description_ID FROM Job_Applications WHERE User_ID = ?
      )
      ORDER BY matchRate DESC
      LIMIT 5
    `, [req.user.id, req.user.id]);

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const [users] = await pool.query(
      'SELECT UserID, User_Name, Email, Password, Role FROM User WHERE Email = ?',
      [email]
    );
    
    if (users.length === 0) {
      return res.status(400).json({ error: 'User not found' });
    }

    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.Password);
    
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    const token = jwt.sign(
      { 
        id: user.UserID, 
        email: user.Email,
        role: user.Role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.UserID,
        name: user.User_Name,
        email: user.Email,
        role: user.Role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add this route
app.post('/api/resumes/upload', authenticateToken, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { text } = await parseResume(req.file.path);
    const skills = extractSkillsFromText(text);
    
    // Insert resume
    const [result] = await pool.query(
      'INSERT INTO Resume (User_ID, File_Name) VALUES (?, ?)',
      [req.user.id, req.file.originalname]
    );

    // First, ensure all skills exist in Skills table
    for (const skill of skills) {
      await pool.query(
        'INSERT IGNORE INTO Skills (Skill_Name) VALUES (?)',
        [skill]
      );
    }

    // Store skills for this specific resume
    for (const skill of skills) {
      const [skillResult] = await pool.query(
        'SELECT Skill_ID FROM Skills WHERE Skill_Name = ?',
        [skill]
      );
      
      if (skillResult.length > 0) {
        await pool.query(
          'INSERT INTO Resume_Skills (Resume_ID, Skill_ID) VALUES (?, ?)',
          [result.insertId, skillResult[0].Skill_ID]
        );
      }
    }

    // Update match rates
    await pool.query(`
      INSERT INTO Skill_Match (Job_Description_ID, Resume_ID, Match_Status, Skill_Gap)
      SELECT 
        jd.Job_Description_ID,
        ?,
        CASE 
          WHEN COUNT(DISTINCT rs.Skill_ID) = COUNT(DISTINCT jds.Skill_ID) THEN 'Matched'
          ELSE 'Not Matched'
        END,
        CASE 
          WHEN COUNT(DISTINCT rs.Skill_ID) = COUNT(DISTINCT jds.Skill_ID) THEN ''
          ELSE GROUP_CONCAT(DISTINCT s.Skill_Name)
        END
      FROM Job_Description jd
      JOIN Job_Description_Skills jds ON jd.Job_Description_ID = jds.Job_Description_ID
      JOIN Skills s ON jds.Skill_ID = s.Skill_ID
      LEFT JOIN Resume_Skills rs ON rs.Resume_ID = ?
        AND rs.Skill_ID = jds.Skill_ID
      GROUP BY jd.Job_Description_ID
    `, [result.insertId, result.insertId]);

    res.json({ 
      success: true, 
      resumeId: result.insertId,
      skills 
    });
  } catch (error) {
    console.error('Error uploading resume:', error);
    res.status(500).json({ error: error.message });
  }
});

// Protected routes
app.get('/api/jobs', authenticateToken, async (req, res) => {
  try {
    // Get user's skills
    const [userSkills] = await pool.query(`
      SELECT DISTINCT s.Skill_Name 
      FROM Resume_Skills rs
      JOIN Skills s ON rs.Skill_ID = s.Skill_ID
      JOIN Resume r ON rs.Resume_ID = r.Resume_ID
      WHERE r.User_ID = ?
    `, [req.user.id]);

    const userSkillsList = userSkills.map(s => s.Skill_Name);

    // Get jobs with their skills
    // Replace the jobs query (lines 474-497) with:
const [jobs] = await pool.query(`
  SELECT 
    j.Job_Description_ID as id,
    j.Job_Name as title,
    j.Company_Name as company,
    j.Location as location,
    j.Description as description,
    j.Posted_Date as posted,
    GROUP_CONCAT(DISTINCT s.Skill_Name) as skills,
    (
      SELECT COUNT(DISTINCT rs.Skill_ID) * 100.0 / 
        (SELECT COUNT(DISTINCT jds2.Skill_ID) 
         FROM Job_Description_Skills jds2 
         WHERE jds2.Job_Description_ID = j.Job_Description_ID)
      FROM Resume_Skills rs
      JOIN Resume r ON rs.Resume_ID = r.Resume_ID
      WHERE r.User_ID = ?
      AND rs.Skill_ID IN (
        SELECT DISTINCT jds3.Skill_ID 
        FROM Job_Description_Skills jds3
        WHERE jds3.Job_Description_ID = j.Job_Description_ID
      )
    ) as matchRate
  FROM Job_Description j
  LEFT JOIN Job_Description_Skills jds ON j.Job_Description_ID = jds.Job_Description_ID
  LEFT JOIN Skills s ON jds.Skill_ID = s.Skill_ID
  GROUP BY j.Job_Description_ID
`, [req.user.id]);

    const formattedJobs = jobs.map(job => ({
      ...job,
      skills: job.skills ? job.skills.split(',').filter(Boolean) : [],
      matchRate: job.matchRate || calculateMatchRate(userSkillsList, job.skills ? job.skills.split(',') : [])
    }));

    res.json(formattedJobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/resumes/analyze', authenticateToken, async (req, res) => {
  if (req.user.role !== 'user') {
    return res.status(403).json({ error: 'Access denied' });
  }

  try {
    const { resumeId, jobId } = req.body;
    await pool.query('CALL MatchUserSkillsWithJobs(?)', [req.user.id]);
    await pool.query('CALL AnalyzeSkillGaps(?)', [req.user.id]);
    
    const [matches] = await pool.query(
      'SELECT * FROM Skill_Match WHERE Resume_ID = ? AND Job_Description_ID = ?',
      [resumeId, jobId]
    );

    res.json(matches[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add this route after your existing routes
app.get('/api/resumes', authenticateToken, async (req, res) => {
  try {
    const [resumes] = await pool.query(`
      SELECT 
        r.Resume_ID as id,
        r.File_Name as fileName,
        r.Upload_Date as uploadDate,
        GROUP_CONCAT(DISTINCT s.Skill_Name) as skills
      FROM Resume r
      LEFT JOIN Resume_Skills rs ON r.Resume_ID = rs.Resume_ID
      LEFT JOIN Skills s ON rs.Skill_ID = s.Skill_ID
      WHERE r.User_ID = ?
      GROUP BY r.Resume_ID
      ORDER BY r.Upload_Date DESC
    `, [req.user.id]);

    const formattedResumes = resumes.map(resume => ({
      ...resume,
      skills: resume.skills ? resume.skills.split(',').filter(Boolean) : [],
      filePath: `/uploads/${resume.fileName}`
    }));

    res.json(formattedResumes);
  } catch (error) {
    console.error('Error fetching resumes:', error);
    res.status(500).json({ error: error.message });
  }
});
app.get('/uploads/:filename', authenticateToken, (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.params.filename);
  res.sendFile(filePath);
});

function calculateMatchRate(userSkills, jobSkills) {
  if (!userSkills?.length || !jobSkills?.length) return 0;
  
  const matchingSkills = jobSkills.filter(skill => 
    userSkills.some(userSkill => 
      userSkill.toLowerCase() === skill.toLowerCase()
    )
  );

  return Math.round((matchingSkills.length / jobSkills.length) * 100);
}

app.delete('/api/resumes/:id', authenticateToken, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // First delete related job applications
    await connection.query(
      'DELETE FROM Job_Applications WHERE Resume_ID = ? AND User_ID = ?',
      [req.params.id, req.user.id]
    );

    // Delete skill matches
    await connection.query(
      'DELETE FROM Skill_Match WHERE Resume_ID = ?',
      [req.params.id]
    );

    // Delete resume skills
    await connection.query(
      'DELETE FROM Resume_Skills WHERE Resume_ID = ?',
      [req.params.id]
    );

    // Finally delete the resume
    await connection.query(
      'DELETE FROM Resume WHERE Resume_ID = ? AND User_ID = ?',
      [req.params.id, req.user.id]
    );

    await connection.commit();
    res.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    await connection.rollback();
    console.error('Error deleting resume:', error);
    res.status(500).json({ error: error.message });
  } finally {
    connection.release();
  }
});

app.get('/api/dashboard', authenticateToken, async (req, res) => {
  try {
    // Get resume count
    const [resumes] = await pool.query(
      'SELECT COUNT(*) as total FROM Resume WHERE User_ID = ?', 
      [req.user.id]
    );

    // Get job matches (above 50% match rate)
    const [jobMatches] = await pool.query(`
      SELECT COUNT(DISTINCT j.Job_Description_ID) as total
      FROM Job_Description j
      WHERE (
        SELECT COUNT(DISTINCT rs.Skill_ID) * 100.0 / 
          (SELECT COUNT(DISTINCT jds2.Skill_ID) 
           FROM Job_Description_Skills jds2 
           WHERE jds2.Job_Description_ID = j.Job_Description_ID)
        FROM Resume_Skills rs
        JOIN Resume r ON rs.Resume_ID = r.Resume_ID
        WHERE r.User_ID = ?
        AND rs.Skill_ID IN (
          SELECT DISTINCT jds.Skill_ID 
          FROM Job_Description_Skills jds
          WHERE jds.Job_Description_ID = j.Job_Description_ID
        )
      ) >= 50
    `, [req.user.id]);

    // Calculate average skills match rate
    const [skillsMatch] = await pool.query(`
      SELECT COALESCE(AVG(match_rate), 0) as average
      FROM (
        SELECT 
          j.Job_Description_ID,
          (
            SELECT COUNT(DISTINCT s.Skill_Name) * 100.0 / 
              NULLIF((SELECT COUNT(DISTINCT jds2.Skill_ID) 
                       FROM Job_Description_Skills jds2 
                       WHERE jds2.Job_Description_ID = j.Job_Description_ID), 0)
            FROM Resume_Skills rs
            JOIN Skills s ON rs.Skill_ID = s.Skill_ID
            JOIN Resume r ON rs.Resume_ID = r.Resume_ID
            WHERE r.User_ID = ?
            AND rs.Skill_ID IN (
              SELECT DISTINCT jds.Skill_ID 
              FROM Job_Description_Skills jds
              WHERE jds.Job_Description_ID = j.Job_Description_ID
            )
          ) as match_rate
        FROM Job_Description j
      ) as matches
      WHERE match_rate IS NOT NULL
    `, [req.user.id]);

    // Get missing skills for recommendations
    const [missingSkills] = await pool.query(`
      SELECT COUNT(DISTINCT s.Skill_Name) as total
      FROM Job_Description_Skills jds
      JOIN Skills s ON jds.Skill_ID = s.Skill_ID
      WHERE s.Skill_Name NOT IN (
        SELECT DISTINCT s2.Skill_Name
        FROM Resume_Skills rs
        JOIN Skills s2 ON rs.Skill_ID = s2.Skill_ID
        JOIN Resume r ON rs.Resume_ID = r.Resume_ID
        WHERE r.User_ID = ?
      )
    `, [req.user.id]);

    res.json({
      resumes: resumes[0].total || 0,
      jobMatches: jobMatches[0].total || 0,
      skillsMatch: Math.round(skillsMatch[0].average) || 0,
      recommendations: missingSkills[0].total || 0
    });
  } catch (error) {
    console.error('Error in dashboard:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/course-recommendations', authenticateToken, async (req, res) => {
  try {
    const [missingSkills] = await pool.query(`
      SELECT DISTINCT 
        s.Skill_Name,
        jd.Job_Name
      FROM Job_Description jd
      JOIN Job_Description_Skills jds ON jd.Job_Description_ID = jds.Job_Description_ID
      JOIN Skills s ON jds.Skill_ID = s.Skill_ID
      WHERE s.Skill_ID NOT IN (
        SELECT DISTINCT rs.Skill_ID
        FROM Resume_Skills rs
        JOIN Resume r ON rs.Resume_ID = r.Resume_ID
        WHERE r.User_ID = ?
      )
      ORDER BY jd.Job_Name
    `, [req.user.id]);

    const formattedRecommendations = missingSkills.map(skill => ({
      ...skill,
      matchRate: 0
    }));

    res.json(formattedRecommendations);
  } catch (error) {
    console.error('Error in course recommendations:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/user/skills', authenticateToken, async (req, res) => {
  try {
    const [skills] = await pool.query(`
      SELECT DISTINCT s.Skill_Name 
      FROM Resume_Skills rs
      JOIN Skills s ON rs.Skill_ID = s.Skill_ID
      WHERE rs.Resume_ID IN (SELECT Resume_ID FROM Resume WHERE User_ID = ?)
    `, [req.user.id]);

    res.json(skills.map(skill => skill.Skill_Name));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/skill-gap-analysis', authenticateToken, async (req, res) => {
  try {
    const [gaps] = await pool.query(`
      SELECT 
        s.Skill_Name as name,
        COALESCE(
          (
            SELECT COUNT(*) 
            FROM Resume_Skills rs
            JOIN Resume r ON rs.Resume_ID = r.Resume_ID
            WHERE rs.Skill_ID = s.Skill_ID 
            AND r.User_ID = ?
          ) * 100.0 / 
          NULLIF((
            SELECT COUNT(*) 
            FROM Job_Description_Skills jds
            WHERE jds.Skill_ID = s.Skill_ID
          ), 0),
          0
        ) as match_rate
      FROM Skills s
      WHERE s.Skill_ID IN (
        SELECT DISTINCT rs.Skill_ID 
        FROM Resume_Skills rs
        JOIN Resume r ON rs.Resume_ID = r.Resume_ID
        WHERE r.User_ID = ?
      )
      ORDER BY match_rate DESC
    `, [req.user.id, req.user.id]);

    const formattedGaps = gaps.map(gap => ({
      name: gap.name,
      match: Math.round(gap.match_rate || 0)
    }));

    res.json(formattedGaps);
  } catch (error) {
    console.error('Error in skill gap analysis:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/recent-activity', authenticateToken, async (req, res) => {
  try {
    const [activities] = await pool.query(`
      SELECT 
        'Resume Upload' as type, 
        CONCAT('Uploaded ', File_Name) as description, 
        Upload_Date as date 
      FROM Resume 
      WHERE User_ID = ?
      UNION
      SELECT 
        'Job Match' as type, 
        CONCAT('Matched with ', Job_Name, ' at ', Company_Name) as description, 
        Application_Date as date 
      FROM Job_Applications ja
      JOIN Job_Description jd ON ja.Job_Description_ID = jd.Job_Description_ID
      WHERE ja.User_ID = ?
      ORDER BY date DESC
      LIMIT 5
    `, [req.user.id, req.user.id]);

    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/profile/applications', authenticateToken, async (req, res) => {
  try {
    const [applications] = await pool.query(`
      SELECT 
        ja.Application_ID,
        ja.Application_Date,
        ja.Status,
        jd.Job_Name,
        jd.Company_Name,
        r.File_Name as resumeName,
        GROUP_CONCAT(DISTINCT s.Skill_Name) as skills
      FROM Job_Applications ja
      JOIN Job_Description jd ON ja.Job_Description_ID = jd.Job_Description_ID
      JOIN Resume r ON ja.Resume_ID = r.Resume_ID
      LEFT JOIN Resume_Skills rs ON r.Resume_ID = rs.Resume_ID
      LEFT JOIN Skills s ON rs.Skill_ID = s.Skill_ID
      WHERE ja.User_ID = ?
      GROUP BY ja.Application_ID
      ORDER BY ja.Application_Date DESC
    `, [req.user.id]);

    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});