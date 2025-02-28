const admin=require("firebase-admin")
require("dotenv").config({
    path:"./config/.env"
})
const serviceAccount=JSON.parse(process.env.firebaseCredentials)
admin.initializeApp({
    credential:admin.credential.cert(serviceAccount),
})

module.exports=admin