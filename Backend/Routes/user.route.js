const express=require('express');
const {createUser, loginUser, getUser, logoutUser}=require("../controllers/user.controller.js")
const verifyUser=require("../Middlewares/jwt.verify.js")
const router=express.Router()
router.post("/signup",createUser)
router.post("/login",loginUser)
router.get('/get-user',verifyUser,getUser)
router.post('/logout',logoutUser)
module.exports=router