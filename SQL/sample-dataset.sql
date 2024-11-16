USE AutomatedSkillMatchingandGapAnalysisTool;

-- Insert sample users
INSERT INTO User (User_Name, Email, Phone, Address, Password) VALUES
('Alice Johnson', 'alice@example.com', '123-456-7890', '123 Elm St, Springfield', 'password123'),
('Bob Smith', 'bob@example.com', '987-654-3210', '456 Oak St, Springfield', 'password456');

-- Insert sample skills
INSERT INTO Skills (Skill_Name, Skill_Type) VALUES
('JavaScript', 'Programming'),
('SQL', 'Database'),
('Project Management', 'Soft Skill');

-- Insert sample user skills
INSERT INTO User_Skills (Skill_ID, User_ID) VALUES
(1, 1),  -- Alice has JavaScript
(2, 1),  -- Alice has SQL
(3, 2);  -- Bob has Project Management

-- Insert sample resumes
INSERT INTO Resume (User_ID, File_Name) VALUES
(1, 'alice_resume.pdf'),
(2, 'bob_resume.pdf');

-- Insert sample job descriptions
INSERT INTO Job_Description (Job_Name, Job_Role, Location, Skill_Name) VALUES
('Web Developer', 'Developer', 'Remote', 'JavaScript'),
('Database Administrator', 'Admin', 'On-site', 'SQL');

-- Insert sample skill matches
INSERT INTO Skill_Match (Job_Description_ID, Resume_ID, Match_Status, Skill_Gap) VALUES
(1, 1, 'Matched', ''),
(2, 2, 'Not Matched', 'SQL');

-- Insert sample gap analysis
INSERT INTO Gap_Analysis (Match_ID, Skill_Gap) VALUES
(1, ''),
(2, 'SQL');

-- Insert sample course recommendations
INSERT INTO Course_Recommendation (Analysis_ID, Course_Name, Course_Link) VALUES
(2, 'SQL for Beginners', 'http://example.com/sql-course');