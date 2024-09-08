const express = require("express");
const jwt = require('jsonwebtoken');
const {   interviewApplicationSchema, interviewStatusSchema, interviewSchema } = require("./zodValidations");
const { executeQuery } = require("./dbConfig");

const interview = express.Router();

interview.get("/",async (req,res)=>{
    try {
        const {applicantId} = req.query;
        const token = req.headers.authorization.split(" ")[1];
        console.log(token)
        const decoded = jwt.verify(token, process.env.JWTSecreat);
        console.log(decoded)
       

        const interview = await executeQuery({
            query:"CALL JobApplicationManager.GetApplicatntInterview(?,?,?)",
            values:[decoded.userDetails.email,token,applicantId]
        });
        console.log(interview)
        if(interview && interview[0] && interview[0][0]){
            const message = interview[0][0].Message;
            if(message == "SQLException"){
                return res.status(500).send({message:"Database error"});
            }else if (message == "Unauthorized"){
                return res.status(401).send({message:"Unauthorized"}); 
            }else if(message == "Not an admin"){
                return res.status(401).send({message:"Not an admin"});
            }else{
                return res.status(200).send({message:"interview fetched successfully",interviews:interview[0]});
            }
        }else{
            return res.status(500).send({message:"Internal server error"});
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({message:"Internal server error"});
    }
})

interview.post("/create",async (req,res)=>{
    try {
        const {applicantId,interviewDate,interviewerName} = req.body;
        const token = req.headers.authorization.split(" ")[1];
        console.log(token)
        const decoded = jwt.verify(token, process.env.JWTSecreat);
        console.log(decoded)
        try {
            interviewSchema.parse({
                applicantId,interviewDate,interviewerName
            })
        } catch (error) {
            console.error("Validation Error:", error.errors);
            return res.status(401).send({message:"validation error",error_validation:error});
        }

        const interview = await executeQuery({
            query:"CALL JobApplicationManager.CreateInterviews(?,?,?,?,?)",
            values:[decoded.userDetails.email,token,applicantId,interviewDate,interviewerName]
        });
        console.log(interview)
        if(interview && interview[0] && interview[0][0]){
            const message = interview[0][0].Message;
            if(message == "SQLException"){
                return res.status(500).send({message:"Database error"});
            }else if (message == "Unauthorized"){
                return res.status(401).send({message:"Unauthorized"}); 
            }else if(message == "Not an admin"){
                return res.status(401).send({message:"Not an admin"});
            }else{
                return res.status(200).send({message:"interview created successfully"});
            }
        }else{
            return res.status(500).send({message:"Internal server error"});
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({message:"Internal server error"});
    }
})

module.exports = interview;