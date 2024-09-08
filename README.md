# job-application

This project is a backend server for a job portal system built using Express.js and MySQL. It handles functionalities like user registration, job applications, interviews, and more, leveraging stored procedures for database operations. This README will guide you through the project's structure, setup, and how to run the backend.

## Technologies Used

- ** Nodejs**
- **Expressjs**
- **Zod: ** For Validation
- **MySQL** 

### Postman Collection URL




### Deloyed Link 
https://job-application-s70v.onrender.com

## API Endpoints

- ** Base URL: ** https://job-application-s70v.onrender.com


- ** Signup URL(POST) ** https://job-application-s70v.onrender.com/user/signup

 ### Store Procedure

 CREATE DEFINER="avnadmin"@"%" PROCEDURE "Signup"(
    IN p_username VARCHAR(50),
    IN p_email VARCHAR(100),
    IN p_password VARCHAR(255)
)
BEGIN
    DECLARE email_exists INT;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
         Handle SQL exceptions
        SELECT 'SQLException' AS Message;
    END;

     Check if the email already exists in the Users table
    SELECT COUNT(*) INTO email_exists FROM Users WHERE Email = p_email;

    IF email_exists > 0 THEN
         Email already exists
        SELECT 'Email already registered' AS Message;
    ELSE
         Insert the new user into the Users table with the token
        INSERT INTO Users (Name, Email, Password, Token)
        VALUES (p_username, p_email, p_password, null);
        SELECT 'Signup successful' AS Message;
    END IF;
END


- ** Login URL(POST) ** https://job-application-s70v.onrender.com/user/login

 ### Store Procedure


CREATE DEFINER="avnadmin"@"%" PROCEDURE "Login"(
    IN p_email VARCHAR(100),
    IN p_password VARCHAR(255)
)
BEGIN
    DECLARE user_exists INT;
    DECLARE password_correct INT;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
         Handle SQL exceptions
        SELECT 'SQLException' AS Message;
    END;

     Check if the email exists and the password is correct
    BEGIN
        SELECT COUNT(*) INTO user_exists 
        FROM Users 
        WHERE Email = p_email;

        IF user_exists = 0 THEN
            SELECT 'Email not registered' AS Message;
        ELSE
            SELECT COUNT(*) INTO password_correct
            FROM Users
            WHERE Email = p_email AND Password = p_password;

            IF password_correct = 0 THEN
                SELECT 'Incorrect password' AS Message;
            ELSE
                SELECT * FROM Users WHERE Email = p_email;
            END IF;
        END IF;
    END;
END


- ** Create Job(POST) **  https://job-application-s70v.onrender.com/Jobs/create

CREATE DEFINER="avnadmin"@"%" PROCEDURE "CreateJob"(
    IN p_email VARCHAR(100),
    IN p_token VARCHAR(1024),
    IN p_title VARCHAR(255),
    IN p_department VARCHAR(100),
    IN p_description TEXT,
    IN p_openDate DATE
)
BEGIN
    DECLARE is_admin BOOLEAN;
    DECLARE db_token VARCHAR(255);

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        SELECT 'SQLException' AS Message;
    END;

     Check if the user is an admin
    SELECT Admin INTO is_admin
    FROM Users
    WHERE Email = p_email;
IF is_admin = 0 THEN
         User is not an admin
        SELECT 'Not an admin' AS Message;
    ELSE
         Check if the token matches
        SELECT Token INTO db_token
        FROM Users
        WHERE Email = p_email;

        IF db_token = p_token THEN
             User is an admin and token matches, proceed to create the job
            
            INSERT INTO Jobs (Title,Department, Description,OpenDate )
            VALUES (p_title,p_department, p_description, p_openDate);
            SELECT 'Job created successfully' AS Message;
        ELSE
             Token does not match
            SELECT 'Unauthorized' AS Message;
        END IF;
    END IF;
    
END