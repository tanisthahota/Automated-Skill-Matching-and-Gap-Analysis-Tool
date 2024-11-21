DELIMITER //

CREATE PROCEDURE ExtractUserSkills(IN userId INT, OUT skillsList TEXT)
BEGIN
    SELECT GROUP_CONCAT(DISTINCT LOWER(s.Skill_Name)) INTO skillsList
    FROM Resume_Skills rs
    JOIN Skills s ON rs.Skill_ID = s.Skill_ID
    JOIN Resume r ON rs.Resume_ID = r.Resume_ID
    WHERE r.User_ID = userId;
END //

CREATE PROCEDURE MatchUserSkillsWithJobs(IN userId INT)
BEGIN
    DECLARE latest_resume_id INT;
    
    -- Get the latest resume ID for the user
    SELECT Resume_ID INTO latest_resume_id
    FROM Resume
    WHERE User_ID = userId
    ORDER BY Upload_Date DESC
    LIMIT 1;
    
    -- Clear existing matches for this resume
    DELETE FROM Skill_Match WHERE Resume_ID = latest_resume_id;
    
    -- Insert new matches
    INSERT INTO Skill_Match (Job_Description_ID, Resume_ID, Match_Status, Match_Rate)
    SELECT 
        jd.Job_Description_ID,
        latest_resume_id,
        CASE 
            WHEN COUNT(DISTINCT rs.Skill_ID) = COUNT(DISTINCT jds.Skill_ID) THEN 'Matched'
            ELSE 'Not Matched'
        END as Match_Status,
        (COUNT(DISTINCT rs.Skill_ID) * 100.0 / COUNT(DISTINCT jds.Skill_ID)) as Match_Rate
    FROM Job_Description jd
    JOIN Job_Description_Skills jds ON jd.Job_Description_ID = jds.Job_Description_ID
    LEFT JOIN Resume_Skills rs ON rs.Resume_ID = latest_resume_id 
        AND rs.Skill_ID = jds.Skill_ID
    GROUP BY jd.Job_Description_ID;
END //

CREATE PROCEDURE AnalyzeSkillGaps(IN userId INT)
BEGIN
    DECLARE latest_resume_id INT;
    
    -- Get the latest resume ID for the user
    SELECT Resume_ID INTO latest_resume_id
    FROM Resume
    WHERE User_ID = userId
    ORDER BY Upload_Date DESC
    LIMIT 1;
    
    -- Clear existing analysis
    DELETE FROM Gap_Analysis WHERE User_ID = userId;
    
    -- Insert new analysis
    INSERT INTO Gap_Analysis (User_ID, Job_Description_ID, Missing_Skills)
    SELECT 
        userId,
        jd.Job_Description_ID,
        GROUP_CONCAT(DISTINCT s.Skill_Name) as missing_skills
    FROM Job_Description jd
    JOIN Job_Description_Skills jds ON jd.Job_Description_ID = jds.Job_Description_ID
    JOIN Skills s ON jds.Skill_ID = s.Skill_ID
    WHERE jds.Skill_ID NOT IN (
        SELECT Skill_ID 
        FROM Resume_Skills 
        WHERE Resume_ID = latest_resume_id
    )
    GROUP BY jd.Job_Description_ID;
END //

DELIMITER ;