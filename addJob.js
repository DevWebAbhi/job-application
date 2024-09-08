const express = require("express");
const jwt = require('jsonwebtoken');
const {  jobDetailsSchema } = require("./zodValidations");
const { executeQuery } = require("./dbConfig");

const addJobRouter = express.Router();

addJobRouter.post("/",async(req,res)=>{

    try {
        const {jobTitle ,department , description , openDate } = req.body;
        console.log(jobTitle,department,description,openDate)
        const token = req.headers.authorization.split(" ")[1];
        console.log(token)
        const decoded = jwt.verify(token, process.env.JWTSecreat);
        console.log(decoded)
        try {
            jobDetailsSchema.parse({
                jobTitle,
                department,
                description,
                openDate
            })
        } catch (validationError) {
            console.error("Validation Error:", validationError.errors);
            return res.status(401).send({message:"validation error",error_validation:validationError});
          }
          console.log(decoded.userDetails.email,token,jobTitle,department,description,openDate)
          const job = await executeQuery({
            query:"CALL JobApplicationManager.CreateJob(?,?,?,?,?,?)",
            values:[decoded.userDetails.email,token,jobTitle,department,description,openDate]
        });
        console.log(job)
        if(job && job[0] && job[0][0]){
            const message = job[0][0].Message;
            if(message == "SQLException"){
                return res.status(500).send({message:"Database error"});
            }else if(message == "Not an admin"){
                return res.status(401).send({message:"Not an admin"});
            }else if (message == "Unauthorized"){
                return res.status(401).send({message:"Unauthorized"}); 
            }else{
                return res.status(200).send({message:"Job created successfully"});
            }
        }else{
            return res.status(500).send({message:"Internal server error"});
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({message:"Internal server error1"});
    }
})

module.exports = addJobRouter;