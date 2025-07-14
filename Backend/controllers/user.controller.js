const express=require("express")
const userModel=require("../Models/user.model.js")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const admin=require("../firebaseAdmin.js")
const axios = require('axios');
const _ = require('lodash');
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
        cd
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

const loginUsingGoogle = async (req, res) => {
    const { token } = req.body;
    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        const { uid, email, name } = decodedToken;

        let user = await userModel.findOne({ email });
        if (!user) {
            user = new userModel({
                googleId: uid,
                email,
                name,
                provider: "google"
            });
            await user.save();
        }
        const accessToken = jwt.sign({ userId: user._id }, process.env.jwtSecret, { expiresIn: "15m" });
        const refreshToken = jwt.sign({ userId: user._id }, process.env.encryptionSecret, { expiresIn: "7d" });

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            sameSite: "Strict",
            maxAge: 15 * 60 * 1000 
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 
        });

        res.json({ message: "User authenticated", user });

    } catch (error) {
        console.error("Error verifying Google token:", error);
        res.status(401).json({ error: error.message });
    }
};
// const hotelMapping = async (req, res) => {
//   try {
//     // Make the API call to the mapping endpoint
//     const response = await axios.get('https://api.makcorps.com/mapping', {
//       params: {
//         api_key: process.env.HOTEL_API_KEY,
//         name: 'bengaluru'
//       }
//     });

//     // Send the API response data back to the client
//     res.status(200).json(response.data);
//   } catch (error) {
//     // Handle any errors from the API call
//     console.error('Error fetching hotel mapping:', error.message);
//     res.status(500).json({ error: 'Failed to fetch hotel mapping' });
//   }
// };
const API_KEY = process.env.HOTEL_API_KEY;
const getCityId = _.memoize(async (name) => {
  try {
    const mapRes = await axios.get('https://api.makcorps.com/mapping', {
      params: { api_key: API_KEY, name }
    });
    const mappingArray = Array.isArray(mapRes.data) ? mapRes.data : [];

    const cityObj = mappingArray.find(
      (item) =>
        (item.type === 'GEO' || item.title === 'Destinations') &&
        (item.value || item.document_id)
    );
    console.log("City Object:", cityObj);
    return cityObj?.value ?? cityObj?.document_id ?? null;
  } catch (err) {
    console.error('Mapping API error:', err.message);
    return null;
  }
});

const searchHotel = async (req, res) => {
  try {
    const {
      name,             // city name (e.g. Bengaluru)
      pagination,
      cur,
      rooms,
      adults,
      checkin,
      checkout,
      tax = false,
      children = 0
    } = req.query;

    // 1️⃣ Basic validation
    if (!name || !pagination || !cur || !rooms || !adults || !checkin || !checkout) {
      return res.status(400).json({ error: 'Missing required query parameters.' });
    }

    if (
      isNaN(pagination) || isNaN(rooms) || isNaN(adults) || isNaN(children)
    ) {
      return res.status(400).json({ error: 'Invalid numeric query parameters.' });
    }

    if (
      isNaN(Date.parse(checkin)) || isNaN(Date.parse(checkout))
    ) {
      return res.status(400).json({ error: 'Invalid checkin or checkout date format.' });
    }

    /* 2️⃣ STEP 1 — Get city ID from cached helper */
    const cityid = await getCityId(name);
    if (!cityid) {
      return res.status(404).json({ error: 'City ID not found for the given city name.' });
    }

    /* 3️⃣ STEP 2 — Query the City API with the cityid */
    const hotelRes = await axios.get('https://api.makcorps.com/city', {
      params: {
        api_key: API_KEY,
        cityid,
        pagination,
        cur,
        rooms,
        adults,
        checkin,
        checkout,
        tax,
        children
      }
    });
    console.log("Hotel Response:", hotelRes.data);
    res.status(200).json(hotelRes.data);
    
  } catch (err) {
    console.error('Error during hotel search:', err.message);
    res.status(500).json({ error: 'Failed to fetch hotel data.' });
  }
};
module.exports={createUser,loginUser,getUser,logoutUser,loginUsingGoogle,searchHotel}