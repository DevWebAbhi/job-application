const express = require("express");
const jwt = require('jsonwebtoken');
const { userLoginSchema, userSignupSchema } = require("./zodValidations");
const { executeQuery } = require("./dbConfig");

const userRouter = express.Router();

userRouter.post("/login",async(req,res)=>{
    try {
        const { email, password } = await req.body;

    try {
      userLoginSchema.parse({ email, password });
    } catch (validationError) {
      console.error("Validation Error:", validationError.errors);
      return res.status(401).send({message:"validation error",error_validation:validationError});
    }
    const login =await executeQuery({
        query:"CALL JobApplicationManager.Login(?,?)",
        values:[email,password]
    });
    
    if(login && login[0] && login[0][0]){
        const message = login[0][0].Message;
        if(message == "SQLException"){
            return res.status(500).send({message:"Database error"});
        }else if(message == "Email not registered"){
            return res.status(401).send({message:"Email not registered"});
        }else if(message == "Incorrect password"){
            return res.status(401).send({message:"Email not registered"});
        }else{
            const token = jwt.sign({ userDetails: {name:login[0][0].Name,email:login[0][0].Email}}, process.env.JWTSecreat);
            console.log(token);
            const UpdateToken =await executeQuery({
                query:"CALL JobApplicationManager.UpdateToken(?,?)",
                values:[email,token]
            });
            console.log(UpdateToken);
            if(UpdateToken && UpdateToken[0] && UpdateToken[0][0]){
                const message = UpdateToken[0][0].Message;
                if(message == "SQLException"){
                    return res.status(500).send({message:"Database error"});
                }else if(message == "Unauthorized"){
                    return res.status(401).send({message:"Unauthorized"});
                }
                return res.status(200).send({message:"Sucessfully logged in",token});
            }else{
                return res.status(500).send({message:"Internal server error"});  
            }
            
        }
    }else{
        return res.status(500).send({message:"Internal server error"});
    }

    } catch (error) {
        return res.status(500).send({message:"Internal server error"});
    }
})


userRouter.post("/signup",async(req,res)=>{
    try {
        const { email, password , name } = await req.body;

    try {
     userSignupSchema.parse({ email, password,userName: name });
    } catch (validationError) {
      console.error("Validation Error:", validationError.errors);
      return res.status(401).send({message:"validation error",error_validation:validationError});
    }
    const Signup = await executeQuery({
        query:"CALL JobApplicationManager.Signup(?,?,?)",
        values:[name,email,password]
    });
    
    if(Signup && Signup[0] && Signup[0][0]){
        const message = Signup[0][0].Message;
        if(message == "SQLException"){
            return res.status(500).send({message:"Database error"});
        }else if(message == "Email already registered"){
            return res.status(401).send({message:"Email already registered"});
        }else{
            return res.status(200).send({message:"Sucessfully Signned up"});
        }
    }else{
        return res.status(500).send({message:"Internal server error"});
    }

    } catch (error) {
        return res.status(500).send({message:"Internal server error"});
    }
})

module.exports = userRouter;