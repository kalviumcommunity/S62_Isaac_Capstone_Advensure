const mongoose=require("mongoose")
userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
    },
    googleId:{
        type:String,
        unique:true,
        sparse:true,
    },
    provider:{
        type:String,
        enum:["email","google"],
        required:true
    }
})

module.exports=mongoose.model("userModel",userSchema)