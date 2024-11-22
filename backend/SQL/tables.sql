DROP DATABASE IF EXISTS AutomatedSkillMatchingandGapAnalysisTool;
CREATE DATABASE AutomatedSkillMatchingandGapAnalysisTool;
USE AutomatedSkillMatchingandGapAnalysisTool;

CREATE TABLE User (
    UserID INT PRIMARY KEY AUTO_INCREMENT,
    User_Name VARCHAR(100) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Password VARCHAR(255) NOT NULL,
    Phone VARCHAR(20),
    Address TEXT,
    Role ENUM('job seeker', 'recruiter', 'admin') NOT NULL
);

CREATE TABLE Resume (
    Resume_ID INT PRIMARY KEY AUTO_INCREMENT,
    User_ID INT,
    File_Name VARCHAR(255) NOT NULL,
    Upload_Date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (User_ID) REFERENCES User(UserID)
);

CREATE TABLE Skills (
    Skill_ID INT PRIMARY KEY AUTO_INCREMENT,
    Skill_Name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE Job_Description (
    Job_Description_ID INT PRIMARY KEY AUTO_INCREMENT,
    Job_Name VARCHAR(255) NOT NULL,
    Job_Role VARCHAR(100),
    Company_Name VARCHAR(255),
    Location VARCHAR(100),
    Description TEXT,
    Posted_Date DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Job_Description_Skills (
    Job_Description_ID INT,
    Skill_ID INT,
    PRIMARY KEY (Job_Description_ID, Skill_ID),
    FOREIGN KEY (Job_Description_ID) REFERENCES Job_Description(Job_Description_ID),
    FOREIGN KEY (Skill_ID) REFERENCES Skills(Skill_ID)
);

CREATE TABLE Resume_Skills (
    Resume_ID INT,
    Skill_ID INT,
    PRIMARY KEY (Resume_ID, Skill_ID),
    FOREIGN KEY (Resume_ID) REFERENCES Resume(Resume_ID),
    FOREIGN KEY (Skill_ID) REFERENCES Skills(Skill_ID)
);

CREATE TABLE Job_Applications (
    Application_ID INT PRIMARY KEY AUTO_INCREMENT,
    User_ID INT,
    Job_Description_ID INT,
    Resume_ID INT,
    Application_Date DATETIME DEFAULT CURRENT_TIMESTAMP,
    Status ENUM('Pending', 'Reviewed', 'Accepted', 'Rejected') DEFAULT 'Pending',
    FOREIGN KEY (User_ID) REFERENCES User(UserID),
    FOREIGN KEY (Job_Description_ID) REFERENCES Job_Description(Job_Description_ID),
    FOREIGN KEY (Resume_ID) REFERENCES Resume(Resume_ID)
);

CREATE TABLE Skill_Match (
    Match_ID INT PRIMARY KEY AUTO_INCREMENT,
    Job_Description_ID INT,
    Resume_ID INT,
    Match_Status ENUM('Matched', 'Not Matched') NOT NULL,
    Skill_Gap VARCHAR(255),
    Match_Rate DECIMAL(5,2) DEFAULT 0,
    FOREIGN KEY (Job_Description_ID) REFERENCES Job_Description(Job_Description_ID),
    FOREIGN KEY (Resume_ID) REFERENCES Resume(Resume_ID)
);

CREATE TABLE Course_Recommendation (
    Course_ID INT PRIMARY KEY AUTO_INCREMENT,
    Skill_ID INT,
    Course_Name VARCHAR(255) NOT NULL,
    Provider VARCHAR(100),
    URL TEXT,
    FOREIGN KEY (Skill_ID) REFERENCES Skills(Skill_ID)
);

CREATE TABLE Gap_Analysis (
    Analysis_ID INT PRIMARY KEY AUTO_INCREMENT,
    User_ID INT,
    Job_Description_ID INT,
    Missing_Skills TEXT,
    Analysis_Date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (User_ID) REFERENCES User(UserID),
    FOREIGN KEY (Job_Description_ID) REFERENCES Job_Description(Job_Description_ID)
);

