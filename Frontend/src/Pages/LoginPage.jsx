/* eslint-disable react/no-unescaped-entities */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext"; 
function LoginPage() {
  const navigate=useNavigate()
  const { setUser } = useAuth();  
  const [data,setData]=useState({
    email:"",
    password:""
  })
  const handleSubmit=async(e)=>{
    e.preventDefault()
    try{
      const response=await fetch("http://localhost:8080/user/login",
        {
          method:"POST",
          headers:{
            "Content-Type":"application/json"
          },
          credentials:"include",
          body:JSON.stringify({
            email:data.email,
            password:data.password
          })
        }
      )
      const result=await response.json()
      if (response.ok){
        setUser(result.user)
        alert("Login successful")
        navigate("/dashboard")
      }
      else{
        alert(result.message)
      }
    }
    catch(er){
      console.log("An error occured",er)
    }
  } 
  const handleChange=(e)=>{
    setData({...data,[e.target.id]:e.target.value})
  }
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 shadow-lg rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        <form onSubmit={handleSubmit}className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" id="email" placeholder="Enter your email" value={data.email} onChange={handleChange} className="w-full p-2 border rounded-lg" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" id="password" value={data.password} onChange={handleChange} placeholder="Enter your password" className="w-full p-2 border rounded-lg" />
          </div>

          <div className="text-right">
            <a href="#" className="text-blue-500 text-sm">Forgot Password?</a>
          </div>

          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
            Login
          </button>
        </form>

        <p className="text-center mt-4 text-sm">
          Don't have an account? <Link to="/signuppage" className="text-blue-500 font-semibold">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage
