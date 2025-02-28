const express=require('express');
const {createUser, loginUser, getUser, logoutUser,loginUsingGoogle}=require("../controllers/user.controller.js")
const verifyUser=require("../Middlewares/jwt.verify.js")
const router=express.Router()
//POST Request
router.post("/signup",createUser)
//POST Request
router.post("/login",loginUser)
//GET Request
router.get('/get-user',verifyUser,getUser)
//POST Request
router.post('/logout',logoutUser)
router.post('/google',loginUsingGoogle)
module.exports=router