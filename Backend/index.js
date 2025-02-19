const express=require("express")
const cors=require("cors")
const app=express()
const mongoose=require("mongoose")
require("dotenv").config({
    path:"./config/.env"
})
const PORT=process.env.PORT
MongoURL=process.env.MongoURL
app.use(express.json())
app.use(cors())
mongoose.connect(MongoURL)
.then(()=>{
    console.log("Connected to the database successfully")
})
.catch((err)=>{
    console.log("an error occured while connecting to the database",err)
})
app.get("/",(req,res)=>{
    res.send("<h1>Welcome to Backend</h1>")
})


app.listen(PORT,()=>{
    console.log(`the app is listening on http://localhost:${PORT}`)
})