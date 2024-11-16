DROP DATABASE IF EXISTS AutomatedSkillMatchingandGapAnalysisTool;
CREATE DATABASE AutomatedSkillMatchingandGapAnalysisTool;
USE AutomatedSkillMatchingandGapAnalysisTool;

CREATE TABLE User (
    UserID INT PRIMARY KEY AUTO_INCREMENT,
    User_Name VARCHAR(100) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Phone VARCHAR(15),
    Address VARCHAR(250), 
    Password VARCHAR(100) NOT NULL 
);

CREATE TABLE Skills (
    Skill_ID INT PRIMARY KEY AUTO_INCREMENT,
    Skill_Name VARCHAR(100) NOT NULL,
    Skill_Type VARCHAR(100)
);

CREATE TABLE User_Skills (
    Skill_ID INT,
    User_ID INT,
    PRIMARY KEY (Skill_ID, User_ID),
    FOREIGN KEY (Skill_ID) REFERENCES Skills(Skill_ID),
    FOREIGN KEY (User_ID) REFERENCES User(UserID)
);

CREATE TABLE Resume (
    Resume_ID INT PRIMARY KEY AUTO_INCREMENT,
    User_ID INT,
    File_Name VARCHAR(250),
    FOREIGN KEY (User_ID) REFERENCES User(UserID)
);

CREATE TABLE Job_Description (
    Job_Description_ID INT PRIMARY KEY AUTO_INCREMENT,
    Job_Name VARCHAR(100),
    Job_Role VARCHAR(100),
    Location VARCHAR(250),
    Skill_Name VARCHAR(100)
);

CREATE TABLE Skill_Match (
    Match_ID INT PRIMARY KEY AUTO_INCREMENT,
    Job_Description_ID INT,
    Resume_ID INT,
    Match_Status VARCHAR(50),
    Skill_Gap VARCHAR(250),
    FOREIGN KEY (Job_Description_ID) REFERENCES Job_Description(Job_Description_ID),
    FOREIGN KEY (Resume_ID) REFERENCES Resume(Resume_ID)
);

CREATE TABLE Gap_Analysis (
    Analysis_ID INT PRIMARY KEY AUTO_INCREMENT,
    Match_ID INT,
    Skill_Gap VARCHAR(250),
    FOREIGN KEY (Match_ID) REFERENCES Skill_Match(Match_ID)
);

CREATE TABLE Course_Recommendation (
    Recommendation_ID INT PRIMARY KEY AUTO_INCREMENT,
    Analysis_ID INT,
    Course_Name VARCHAR(100),
    Course_Link VARCHAR(250),
    FOREIGN KEY (Analysis_ID) REFERENCES Gap_Analysis(Analysis_ID)
);