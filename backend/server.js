import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { pool } from './database.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

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

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const [users] = await pool.query('SELECT * FROM User WHERE Email = ?', [email]);
    
    if (users.length === 0) {
      return res.status(400).json({ error: 'User not found' });
    }

    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.Password);
    
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    const token = jwt.sign({ id: user.UserID, role: user.Role }, JWT_SECRET);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Protected routes
app.post('/api/jobs', authenticateToken, async (req, res) => {
  if (req.user.role !== 'recruiter') {
    return res.status(403).json({ error: 'Access denied' });
  }

  try {
    const { title, description, location, skills } = req.body;
    const [result] = await pool.query(
      'INSERT INTO Job_Description (Job_Name, Job_Role, Location) VALUES (?, ?, ?)',
      [title, description, location]
    );

    // Insert skills
    for (const skill of skills) {
      await pool.query(
        'INSERT INTO Job_Skills (Job_Description_ID, Skill_Name) VALUES (?, ?)',
        [result.insertId, skill]
      );
    }

    res.json({ success: true, jobId: result.insertId });
  } catch (error) {
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});