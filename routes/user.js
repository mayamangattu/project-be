 const express = require('express');
 const userMiniApp = express.Router();
 const mongoUtil = require('../mongoutil')
 //have the middleware to read the body
 userMiniApp.use(express.json())

 //register the GET
 // http://localhost:8888/user/login
 userMiniApp.post('/login',async (req, res)=>{
    const {
         email,
         password
     } = req.body
     //if email and password is present
     if(email && password){
        const user = await mongoUtil.getDoc("Eator","users", {email,password})
        //if user exists
                if(user){
                 res.json({
                 firstname : user.firstname
             }).status(200)
      }else{
            //send un auth excpetion
            res.sendStatus(401)
        }
     } 
 });

 // add user to DB
 // http://localhost:8888/user/register
 userMiniApp.post('/register',async (req,res)=>{
     //read the registration details
     const userDetails = req.body
     console.log(userDetails)
     //add the details to database
     const result = await mongoUtil.addDoc("Eator","users",userDetails)
     res.status(201)
        .send(result)
 })

 module.exports = userMiniApp;