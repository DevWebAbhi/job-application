# Job Application Backend Server
=====================================

This is a backend server for a job portal system built using Express.js and MySQL. The server handles functionalities like user registration, job applications, interviews, and more, leveraging stored procedures for database operations.

# Important Noticable Keys 

### For extra security in every login the token value is also updating.
==========================================================================

### No Middleware function is used here for authorization because we do not want to increase load in Database and that same thing we are doing in single call with store procedure.

### We can also implement request limit for user and ip addresses as well.

## Technologies Used
--------------------

* Node.js
* Express.js
* Zod for validation
* MySQL

## Database
------------

A database dump is available at: https://drive.google.com/drive/folders/1QFLw_O3aKP2XhwkCWHoufQzc-bqrGaCs?usp=sharing

Note: The dump does not include stored procedures, as they are not exported by Aiven (DB deployment platform).

## Postman Collection
---------------------

The Postman collection is available at: https://api.postman.com/collections/36672306-4d439b86-87a4-4d22-95f3-434ae09a981e?access_key=PMAT-01J796ZM46MTWSGKSDNP4PJZB1

## Deployed Link
-----------------

The deployed link is: https://job-application-s70v.onrender.com

## Admin Credentials
--------------------

* Email: abhishektiwari9xx@gmail.com
* Password: Abhishek12345@

## API Endpoints
----------------

### Signup

* URL: `https://job-application-s70v.onrender.com/user/signup`
* Method: POST
* Body: `name`, `email`, and `password`

### Login

* URL: `https://job-application-s70v.onrender.com/user/login`
* Method: POST
* Body: `email` and `password`

### Create Job

* URL: `https://job-application-s70v.onrender.com/Jobs/create`
* Method: POST
* Body: `jobTitle`, `department`, `description`, `openDate`, and `bearer token` (admin only)

### Get Jobs

* URL: `https://job-application-s70v.onrender.com/Jobs`
* Method: GET
* No authentication required

### Create Job Application

* URL: `https://job-application-s70v.onrender.com/jobApplication/create`
* Method: POST
* Body: `jobID`, `name`, `email`, `resumeLink`, and `bearer token` (user only)

### Get Job Applications

* URL: `https://job-application-s70v.onrender.com/jobApplication?jobID=(number)`
* Method: GET
* Query: `jobID`
* Authentication: admin only

### Update Job Application Status

* URL: `https://job-application-s70v.onrender.com/jobApplication/updateStatus?applicationID=(number)`
* Method: PATCH
* Body: `status`
* Authentication: admin only

### Delete Job Application

* URL: `https://job-application-s70v.onrender.com/jobApplication/deleteApplication?applicationID=(number)`
* Method: DELETE
* Authentication: admin only

### Create Interview

* URL: `https://job-application-s70v.onrender.com/interview/create`
* Method: POST
* Body: `applicantId`, `interviewDate`, `interviewerName`, and `bearer token` (admin only)

### Get Interviews

* URL: `https://job-application-s70v.onrender.com/interview?applicantId=(number)`
* Method: GET
* Query: `applicantId`
* Authentication: user only



## Stored Procedures
---------------------

### Create Interviews

```
CREATE DEFINER="avnadmin"@"%" PROCEDURE "CreateInterviews"(
    IN p_email VARCHAR(100),
    IN p_token VARCHAR(255),
    IN p_applicantid VARCHAR(255),
    IN p_interviewDate DATE,
    IN p_interviewerName VARCHAR(255)
)
BEGIN
    DECLARE is_admin BOOLEAN;
    DECLARE db_token VARCHAR(255);

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        SELECT 'SQLException' AS Message;
    END;

    -- Check if the user is an admin
    SELECT Admin INTO is_admin
    FROM Users
    WHERE Email = p_email;
IF is_admin = 0 THEN
        -- User is not an admin
        SELECT 'Not an admin' AS Message;
    ELSE
        -- Check if the token matches
        SELECT Token INTO db_token
        FROM Users
        WHERE Email = p_email;

        IF db_token = p_token THEN
            -- User is an admin and token matches, proceed to create the job
            
             INSERT INTO Interviews (ApplicantID,InterviewDate,InterviewerName)
             Values (p_applicantid,p_interviewDate,p_interviewerName);
            SELECT 'Interview created successfully' AS Message;
        ELSE
            -- Token does not match
            SELECT 'Unauthorized' AS Message;
        END IF;
    END IF;
    
END

```

### Create Job

```
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

    -- Check if the user is an admin
    SELECT Admin INTO is_admin
    FROM Users
    WHERE Email = p_email;
IF is_admin = 0 THEN
        -- User is not an admin
        SELECT 'Not an admin' AS Message;
    ELSE
        -- Check if the token matches
        SELECT Token INTO db_token
        FROM Users
        WHERE Email = p_email;

        IF db_token = p_token THEN
            -- User is an admin and token matches, proceed to create the job
            
            INSERT INTO Jobs (Title,Department, Description,OpenDate )
            VALUES (p_title,p_department, p_description, p_openDate);
            SELECT 'Job created successfully' AS Message;
        ELSE
            -- Token does not match
            SELECT 'Unauthorized' AS Message;
        END IF;
    END IF;
    
END
```


### Create Job Application 

```

CREATE DEFINER="avnadmin"@"%" PROCEDURE "CreateJobApplication"(
    IN p_email VARCHAR(100),
    IN p_token VARCHAR(255),
    IN p_jobid VARCHAR(255),
    IN p_name VARCHAR(100),
    IN p_resumelink VARCHAR(255),
     IN p_status VARCHAR(30)
)
BEGIN
    DECLARE db_token VARCHAR(255);

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        SELECT 'SQLException' AS Message;
    END;
        SELECT Token INTO db_token
        FROM Users
        WHERE Email = p_email;

        IF db_token = p_token THEN
            
            INSERT INTO Applicants (JobID,Name, Email,ResumeLink,Status )
            VALUES (p_jobid,p_name, p_email, p_resumelink,p_status);
            SELECT 'Application created successfully' AS Message;
        ELSE
            -- Token does not match
            SELECT 'Unauthorized' AS Message;
        END IF;
    
END

```


### DeleteApplicantion 

```
CREATE DEFINER="avnadmin"@"%" PROCEDURE "DeleteApplicant"(
    IN p_email VARCHAR(100),
    IN p_token VARCHAR(255),
    IN p_applicantid VARCHAR(255)
)
BEGIN
    DECLARE is_admin BOOLEAN;
    DECLARE db_token VARCHAR(255);

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        SELECT 'SQLException' AS Message;
    END;

    -- Check if the user is an admin
    SELECT Admin INTO is_admin
    FROM Users
    WHERE Email = p_email;
IF is_admin = 0 THEN
        -- User is not an admin
        SELECT 'Not an admin' AS Message;
    ELSE
        -- Check if the token matches
        SELECT Token INTO db_token
        FROM Users
        WHERE Email = p_email;

        IF db_token = p_token THEN
            -- User is an admin and token matches, proceed to create the job
            
             DELETE FROM Applicants WHERE ApplicantID = p_applicantid;
            SELECT 'Application deleted successfully' AS Message;
        ELSE
            -- Token does not match
            SELECT 'Unauthorized' AS Message;
        END IF;
    END IF;
    
END

```


### Get Applicant Interview

```


CREATE DEFINER="avnadmin"@"%" PROCEDURE "GetApplicatntInterview"(
    IN p_email VARCHAR(100),
    IN p_token VARCHAR(255),
    IN p_applicantid VARCHAR(255)
)
BEGIN

    DECLARE db_token VARCHAR(255);

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        SELECT 'SQLException' AS Message;
    END;

        SELECT Token INTO db_token
        FROM Users
        WHERE Email = p_email;

        IF db_token = p_token THEN
            -- User is an admin and token matches, proceed to create the job
            
             SELECT * FROM Interviews WHERE ApplicantID = p_applicantid;
        ELSE
            -- Token does not match
            SELECT 'Unauthorized' AS Message;
        END IF;
   
    
END
```

### Get Jobs

```

CREATE DEFINER="avnadmin"@"%" PROCEDURE "GetJob"(
    
)
BEGIN

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        SELECT 'SQLException' AS Message;
    END;
	SELECT * FROM Jobs;
    
   
    
END

```

### Get Job Applicants

```

CREATE DEFINER="avnadmin"@"%" PROCEDURE "GetJobApplicatnts"(
    IN p_email VARCHAR(100),
    IN p_token VARCHAR(255),
    IN p_jobid Numeric
)
BEGIN
    DECLARE is_admin BOOLEAN;
    DECLARE db_token VARCHAR(255);

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        SELECT 'SQLException' AS Message;
    END;

    -- Check if the user is an admin
    SELECT Admin INTO is_admin
    FROM Users
    WHERE Email = p_email;
IF is_admin = 0 THEN
        -- User is not an admin
        SELECT 'Not an admin' AS Message;
    ELSE
        -- Check if the token matches
        SELECT Token INTO db_token
        FROM Users
        WHERE Email = p_email;

        IF db_token = p_token THEN
            -- User is an admin and token matches, proceed to create the job
            
            SELECT * FROM Applicants WHERE JobID = p_jobid;
        ELSE
            -- Token does not match
            SELECT 'Unauthorized' AS Message;
        END IF;
    END IF;
    
END
```

### Login

```


CREATE DEFINER="avnadmin"@"%" PROCEDURE "Login"(
    IN p_email VARCHAR(100),
    IN p_password VARCHAR(255)
)
BEGIN
    DECLARE user_exists INT;
    DECLARE password_correct INT;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        -- Handle SQL exceptions
        SELECT 'SQLException' AS Message;
    END;

    -- Check if the email exists and the password is correct
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
```

### Signup

```

CREATE DEFINER="avnadmin"@"%" PROCEDURE "Signup"(
    IN p_username VARCHAR(50),
    IN p_email VARCHAR(100),
    IN p_password VARCHAR(255)
)
BEGIN
    DECLARE email_exists INT;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        -- Handle SQL exceptions
        SELECT 'SQLException' AS Message;
    END;

    -- Check if the email already exists in the Users table
    SELECT COUNT(*) INTO email_exists FROM Users WHERE Email = p_email;

    IF email_exists > 0 THEN
        -- Email already exists
        SELECT 'Email already registered' AS Message;
    ELSE
        -- Insert the new user into the Users table with the token
        INSERT INTO Users (Name, Email, Password, Token)
        VALUES (p_username, p_email, p_password, null);
        SELECT 'Signup successful' AS Message;
    END IF;
END

```

### Update Appliction Status

```

CREATE DEFINER="avnadmin"@"%" PROCEDURE "UpdateApplicantStatus"(
    IN p_email VARCHAR(100),
    IN p_token VARCHAR(255),
    IN p_applicantid VARCHAR(255),
    IN p_status VARCHAR(100)
)
BEGIN
    DECLARE is_admin BOOLEAN;
    DECLARE db_token VARCHAR(255);

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        SELECT 'SQLException' AS Message;
    END;

    -- Check if the user is an admin
    SELECT Admin INTO is_admin
    FROM Users
    WHERE Email = p_email;
IF is_admin = 0 THEN
        -- User is not an admin
        SELECT 'Not an admin' AS Message;
    ELSE
        -- Check if the token matches
        SELECT Token INTO db_token
        FROM Users
        WHERE Email = p_email;

        IF db_token = p_token THEN
            -- User is an admin and token matches, proceed to create the job
            
             UPDATE Applicants SET Status = p_status WHERE ApplicantID = p_applicantid;
            SELECT 'Application updated successfully' AS Message;
        ELSE
            -- Token does not match
            SELECT 'Unauthorized' AS Message;
        END IF;
    END IF;
    
END
```

### Update Token

```

CREATE DEFINER="avnadmin"@"%" PROCEDURE "UpdateToken"(
IN p_email VARCHAR(100),
IN p_token VARCHAR(255)
)
BEGIN
DECLARE email_exists INT;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        -- Handle SQL exceptions
        SELECT 'SQLException' AS Message;
    END;

    -- Check if the email already exists in the Users table
    SELECT COUNT(*) INTO email_exists FROM Users WHERE Email = p_email;

    IF email_exists > 0 THEN
    UPDATE Users SET Token = p_token WHERE Email = p_email;
    SELECT 'Token updated sucessfully' AS Message;
    ELSE 
    SELECT 'Unauthorized' AS Message;
    END IF;
END

```
