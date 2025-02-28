const express=require("express")
const userModel=require("../Models/user.model.js")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const admin=require("../firebaseAdmin.js")
require("dotenv").config({
    path:"../config/.env"
})
// In the create user function the writing to the database part is done 
const createUser=async(req,res)=>{
    try{
        const {name,email,password}=req.body;
        const checkIfUserExist=await userModel.findOne({email:email})
        if (checkIfUserExist){
            return res.status(409).json({message:"User already exists please login",success:false})
        }
        const emailRegex=/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
        const passwordRegex=/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/
        if (!name ||!email||!password){
            return res.status(400).json({message:"All fields are required",success:false})
        }
        if (!emailRegex.test(email)){
            return res.status(400).json({message:"invalid email format",success:false})
        }
        if (!passwordRegex.test(password)){
            return res.status(400).json({message:"invalid password format",success:false})
        }
        if (name.length<=2){
            return res.status(400).json({message:"invalid name format"})
        }
        const hashedPassword= await bcrypt.hash(password,10)
        const data=await new userModel({
            name:name,
            email:email,
            password:hashedPassword,
            provider:"email"
        })
        await data.save()
        res.status(201).json({message:"User details added successfully",success:true,data:data})
    }
    catch(er){
        res.status(500).json({message:"internal server error",success:false,error:er.message})
    }
}

const loginUser=async(req,res)=>{
    try{
        const {email,password}=req.body
        if (!email||!password){
            return res.status(404).json({message:"all fields are required",success:false})
        }
        const emailRegex=/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
        const passwordRegex=/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/
        if (!emailRegex.test(email)){
            return res.status(400).json({message:"invalid email format",success:false})
        }
        if (!passwordRegex.test(password)){
            return res.status(400).json({message:"invalid password format",success:false})
        }
        const user=await userModel.findOne({email:email})
        if (!user){
            return res.status(404).json({message:"User not found please signup",success:false})
        }
        const isMatch=await bcrypt.compare(password,user.password)
        if (!isMatch){
            return res.status(401).json({message:"invalid Password",success:false})
        }
        const token = jwt.sign(
            { userId: user._id, email: user.email }, 
            process.env.jwtSecret, 
            { expiresIn: "10m"}
        );
        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "Strict",
            maxAge: 60*1000*10
        });
        res.status(200).json({message:"Successfully logged in",success:true,user:user})
    }
    catch(er){
        return res.status(500).json({message:"Internal server error",success:false,Error:er.message})
    }
}
// in the get user function the read operation from the database is done
const getUser=async(req,res)=>{
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ success: false, message: "No token found" });
        }
        
        const decoded = jwt.verify(token, process.env.jwtSecret); 
        res.status(200).json({ success: true, user: { name: decoded.name, email: decoded.email } });
    } catch (err) {
        return res.status(401).json({ success: false, message: "Invalid token" });
    }
}

const logoutUser=(req,res)=>{
    res.clearCookie("token", { httpOnly: true, secure:true, sameSite: "None" });
    res.status(201).json({ success: true, message: "Logged out successfully" });
}

const loginUsingGoogle=async(req,res)=>{
    const {token}=req.body;
    try{
        const decodedToken=await admin.auth().verifyIdToken(token);
        const {uid,email,name}=decodedToken
        let user=await userModel.findOne({email})
        if(!user){
            user=new userModel({
                googleId:uid,
                email,
                name,
                provider:"google"
            })
            await user.save()
        }
        res.json({ message: "User authenticated", user });
    }
    catch(er){
        console.log("Error verifying Google token:", er);
        res.status(401).json({ error: "Invalid token" });
    }
}
module.exports={createUser,loginUser,getUser,logoutUser,loginUsingGoogle}