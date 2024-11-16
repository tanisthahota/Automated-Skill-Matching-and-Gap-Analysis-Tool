import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise();

async function registeruser(user) {
    const query = "CALL RegisterUser(?, ?, ?, ?, ?, @p_UserID)";
    const values = [user.name, user.email, user.phone, user.address, user.password];
   
    const [result] = await pool.query(query, values);
    const [userIDResult] = await pool.query("SELECT @p_UserID AS UserID");

    return userIDResult[0].UserID; 
}

async function loginUser(email, password) {
    const [rows] = await pool.query(
        "SELECT UserID, User_Name, Email FROM User WHERE Email = ? AND Password = ?",
        [email, password]
    );
    return rows[0];
}

async function extractUserSkills(userID) {
    const [rows] = await pool.query("CALL ExtractUserSkills(?)", [userID]);
    return rows[0]; 
}

async function matchUserSkillsWithJobs(userID) {
    await pool.query("CALL MatchUserSkillsWithJobs(?)", [userID]);
}

async function analyzeSkillGaps(userID) {
    await pool.query("CALL AnalyzeSkillGaps(?)", [userID]);
}

export {
    registerUser,
    loginUser,
    extractUserSkills,
    matchUserSkillsWithJobs,
    analyzeSkillGaps
};