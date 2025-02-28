const express=require("express")
const cors=require("cors")
const cookieParser=require("cookie-parser")
const app=express()
const mongoose=require("mongoose")
require("dotenv").config({
    path:"./config/.env"
})
const userRoutes=require("./Routes/user.route.js")
const PORT=process.env.PORT
MongoURL=process.env.MongoURL
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin:["http://localhost:5173" , "http://localhost:8080"],
    credentials:true,   
    methods:"GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders:"Content-Type,Authorization"
}))
app.options("*", cors());
app.use("/user",userRoutes)
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