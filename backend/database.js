import mysql from "mysql2";
import dotenv from "dotenv";
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the correct path
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config();
console.log('Database Config:', {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    database: process.env.MYSQL_DATABASE,
});
const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    port: 3306,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
}).promise();

// Test database connection
pool.getConnection()
    .then(connection => {
        console.log('Successfully connected to MySQL database');
        connection.release();
    })
    .catch(err => {
        console.error('Error connecting to MySQL database:', err);
    });

async function registerUser(user) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    
    const [result] = await pool.query(
        `INSERT INTO User (User_Name, Email, Phone, Address, Password, Role) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [user.name, user.email, user.phone, user.address, hashedPassword, user.role]
    );
    
    return result.insertId;
}

async function loginUser(email) {
    const [rows] = await pool.query(
        `SELECT UserID, User_Name, Email, Password, Role 
         FROM User WHERE Email = ?`,
        [email]
    );
    return rows[0];
}

async function extractUserSkills(userID) {
    const [rows] = await pool.query("CALL ExtractUserSkills(?, @skills)", [userID]);
    const [result] = await pool.query("SELECT @skills as skills");
    return result[0].skills;
}

async function matchUserSkillsWithJobs(userID) {
    await pool.query("CALL MatchUserSkillsWithJobs(?)", [userID]);
}

async function analyzeSkillGaps(userID) {
    await pool.query("CALL AnalyzeSkillGaps(?)", [userID]);
}

export {
    pool,
    registerUser,
    loginUser,
    extractUserSkills
};