USE AutomatedSkillMatchingandGapAnalysisTool;

-- Insert sample users
INSERT INTO User (User_Name, Email, Password, Phone, Address, Role) VALUES
('Alice Johnson', 'alice@example.com', '$2b$10$YourHashedPasswordHere', '123-456-7890', '123 Elm St, Springfield', 'job seeker'),
('Bob Smith', 'bob@example.com', '$2b$10$YourHashedPasswordHere', '987-654-3210', '456 Oak St, Springfield', 'recruiter'),
('Charlie Brown', 'charlie@example.com', '$2b$10$YourHashedPasswordHere', '555-555-5555', '789 Pine St, Springfield', 'job seeker');

-- Insert sample skills (all lowercase)
INSERT INTO Skills (Skill_Name) VALUES
('javascript'),
('python'),
('react'),
('node'),
('sql'),
('typescript'),
('docker'),
('aws'),
('git'),
('mongodb');

-- Insert sample job descriptions
INSERT INTO Job_Description (Job_Name, Job_Role, Company_Name, Location, Description) VALUES
('Frontend Developer', 'Software Engineer', 'TechCorp', 'Remote', 'Looking for a skilled frontend developer...'),
('Backend Developer', 'Software Engineer', 'DataTech', 'San Francisco', 'Looking for a Python/Django developer...'),
('Full Stack Developer', 'Software Engineer', 'InnovateSoft', 'New York', 'Join our team as a Full Stack Developer...'),
('DevOps Engineer', 'Operations', 'CloudTech', 'Remote', 'Seeking a DevOps engineer with experience in AWS...'),
('UI/UX Designer', 'Design', 'DesignPro', 'London', 'Creative designer needed with expertise in design tools...');
('software developer' , ' Software Engineer' ,  'Microsoft ' , 'Remote ' ,' Looking for a skilled frontend developer');

-- Insert job description skills (linking jobs with required skills)
INSERT INTO Job_Description_Skills (Job_Description_ID, Skill_ID) VALUES
(1, 1), -- Frontend Developer needs JavaScript
(1, 3), -- Frontend Developer needs React
(2, 2), -- Backend Developer needs Python
(2, 5), -- Backend Developer needs SQL
(3, 1), -- Full Stack needs JavaScript
(3, 4), -- Full Stack needs Node.js
(3, 5), -- Full Stack needs SQL
(4, 7), -- DevOps needs Docker
(4, 8), -- DevOps needs AWS
(5, 9); -- UI/UX needs Git
(6,1);
(6,8);
(6,9);
(6,5);
(6,3);

-- Insert sample resumes
INSERT INTO Resume (User_ID, File_Name, Upload_Date) VALUES
(1, 'alice_resume.pdf', NOW()),
(3, 'charlie_resume.pdf', NOW());

-- Insert sample course recommendations
INSERT INTO Course_Recommendation (Skill_ID, Course_Name, Provider, URL) VALUES
(2, 'Python for Beginners', 'Coursera', 'https://coursera.org/python'),
(3, 'React Fundamentals', 'Udemy', 'https://udemy.com/react'),
(7, 'Docker Essentials', 'LinkedIn Learning', 'https://linkedin.com/learning/docker'),
(8, 'AWS Certified Developer', 'AWS Training', 'https://aws.training'),
(5, 'SQL Masterclass', 'Udemy', 'https://udemy.com/sql'),
(1, 'JavaScript Advanced Concepts', 'Frontend Masters', 'https://frontendmasters.com/js');