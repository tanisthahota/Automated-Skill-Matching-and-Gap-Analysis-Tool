USE AutomatedSkillMatchingandGapAnalysisTool;
DELIMITER //

CREATE PROCEDURE RegisterNewUser(
    IN p_User_Name VARCHAR(100),
    IN p_Email VARCHAR(100),
    IN p_Phone VARCHAR(15),
    IN p_Address VARCHAR(250),
    IN p_Password VARCHAR(100),
    OUT p_UserID INT
)
BEGIN
    INSERT INTO User (User_Name, Email, Phone, Address, Password)
    VALUES (p_User_Name, p_Email, p_Phone, p_Address, p_Password);
    SET p_UserID = LAST_INSERT_ID();
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE ExtractUserSkills(
    IN p_UserID INT,
    RETURNS VARCHAR(255)
)
BEGIN
    DECLARE skills VARCHAR(255);
    SELECT GROUP_CONCAT(Skill_Name SEPARATOR ', ') INTO skills
    FROM Skills s
    JOIN User_Skills us ON s.Skill_ID = us.Skill_ID
    WHERE us.User_ID = p_User_ID;
    RETURN skills;    
END //
DELIMITER ;



DELIMITER //
CREATE PROCEDURE MatchUserSkillsWithJobs(
    IN p_User_ID INT
)
BEGIN
    DECLARE jobSkill VARCHAR(100);
    DECLARE userSkill VARCHAR(100);
    
    DECLARE cur CURSOR FOR 
        SELECT j.Skill_Name 
        FROM Job_Description j;

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET jobSkill = NULL;

    OPEN cur;

    read_loop: LOOP
        FETCH cur INTO jobSkill;
        IF jobSkill IS NULL THEN
            LEAVE read_loop;
        END IF;

        SELECT Skill_Name INTO userSkill
        FROM Skills s
        JOIN User_Skills us ON s.Skill_ID = us.Skill_ID
        WHERE us.User_ID = p_User_ID AND s.Skill_Name = jobSkill;

        IF userSkill IS NOT NULL THEN
            INSERT INTO Skill_Match (Job_Description_ID, Resume_ID, Match_Status, Skill_Gap)
            VALUES ((SELECT Job_Description_ID FROM Job_Description WHERE Skill_Name = jobSkill LIMIT 1), 
                    (SELECT Resume_ID FROM Resume WHERE User_ID = p_User_ID LIMIT 1), 
                    'Matched', 
                    '');
        ELSE
            INSERT INTO Skill_Match (Job_Description_ID, Resume_ID, Match_Status, Skill_Gap)
            VALUES ((SELECT Job_Description_ID FROM Job_Description WHERE Skill_Name = jobSkill LIMIT 1), 
                    (SELECT Resume_ID FROM Resume WHERE User_ID = p_User_ID LIMIT 1), 
                    'Not Matched', 
                    jobSkill);
        END IF;
    END LOOP;

    CLOSE cur;
END //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE AnalyzeSkillGaps(
    IN p_User_ID INT
)
BEGIN
    DECLARE skillGap VARCHAR(250);
    
    SELECT Skill_Name INTO skillGap
    FROM Skills s
    WHERE s.Skill_ID NOT IN (SELECT Skill_ID FROM User_Skills WHERE User_ID = p_User_ID);
    
    IF skillGap IS NOT NULL THEN
        INSERT INTO Gap_Analysis (Match_ID, Skill_Gap)
        VALUES ((SELECT MAX(Match_ID) FROM Skill_Match), skillGap);
    END IF;
END //
DELIMITER ;