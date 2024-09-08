const express = require("express");
const jwt = require('jsonwebtoken');
const {   jobApplicationSchema, jobStatusSchema } = require("./zodValidations");
const { executeQuery } = require("./dbConfig");

const jobApplication = express.Router();

jobApplication.post("/create",async(req,res)=>{
    try {
        const {jobID,name,email,resumeLink} = req.body;
        const token = req.headers.authorization.split(" ")[1];
        console.log(token)
        const decoded = jwt.verify(token, process.env.JWTSecreat);
        console.log(decoded)
        try {
            jobApplicationSchema.parse({
                jobId: jobID,
                applicantName: name,
                email: email,
                resumeLink: resumeLink,
                status: "Pending",
            })
        } catch (error) {
            console.error("Validation Error:", error.errors);
            return res.status(401).send({message:"validation error",error_validation:error});
        }

        const job = await executeQuery({
            query:"CALL JobApplicationManager.CreateJobApplication(?,?,?,?,?,?)",
            values:[email,token,jobID,name,resumeLink,"Pending"]
        });
        console.log(job)
        if(job && job[0] && job[0][0]){
            const message = job[0][0].Message;
            if(message == "SQLException"){
                return res.status(500).send({message:"Database error"});
            }else if(message == "Application created successfully"){
                return res.status(401).send({message:"Application created successfully"});
            }else if (message == "Unauthorized"){
                return res.status(401).send({message:"Unauthorized"}); 
            }else{
                return res.status(200).send({message:"Job created successfully"});
            }
        }else{
            return res.status(500).send({message:"Internal server error"});
        }

    } catch (error) {
        return res.status(500).send({message:"Internal server error"});
    }
})

jobApplication.get("/",async(req,res)=>{
    try {
        const {jobID} = req.query;
        console.log(req.query);
        const token = req.headers.authorization.split(" ")[1];
        console.log(token)
        const decoded = jwt.verify(token, process.env.JWTSecreat);
        console.log(decoded)
        

        const job = await executeQuery({
            query:"CALL JobApplicationManager.GetJobApplicatnts(?,?,?)",
            values:[decoded.userDetails.email,token,jobID]
        });
        console.log(job)
        if(job && job[0] && job[0][0]){
            const message = job[0][0].Message;
            if(message == "SQLException"){
                return res.status(500).send({message:"Database error"});
            }else if (message == "Unauthorized"){
                return res.status(401).send({message:"Unauthorized"}); 
            }else{
                return res.status(200).send({message:"Job fetched successfully",applications:job[0]});
            }
        }else{
            return res.status(500).send({message:"Internal server error"});
        }

    } catch (error) {
        return res.status(500).send({message:"Internal server error"});
    }
})


jobApplication.patch("/",async(req,res)=>{
    try {
        const {applicationID} = req.query;
        const {status} = req.body;
        console.log(req.query);
        const token = req.headers.authorization.split(" ")[1];
        console.log(token)
        const decoded = jwt.verify(token, process.env.JWTSecreat);
        console.log(decoded)
        try {
            jobStatusSchema.parse({
                status
            })
    
        } catch (error) {
            console.error("Validation Error:", error.errors);
            return res.status(401).send({message:"validation error",error_validation:error});
        }
        const job = await executeQuery({
            query:"CALL JobApplicationManager.UpdateApplicantStatus(?,?,?,?)",
            values:[decoded.userDetails.email,token,applicationID,status]
        });
        console.log(job)
        if(job && job[0] && job[0][0]){
            const message = job[0][0].Message;
            if(message == "SQLException"){
                return res.status(500).send({message:"Database error"});
            }else if (message == "Unauthorized"){
                return res.status(401).send({message:"Unauthorized"}); 
            }else if(message == "Not an admin"){
                return res.status(401).send({message:"Not an admin"}); 
            }else
            {
                return res.status(200).send({message:"Application Updated",applications:job[0]});
            }
        }else{
            return res.status(500).send({message:"Internal server error"});
        }

    } catch (error) {
        return res.status(500).send({message:"Internal server error"});
    }
})

module.exports = jobApplication;