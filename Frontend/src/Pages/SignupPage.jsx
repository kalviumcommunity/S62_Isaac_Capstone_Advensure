import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../Firebase";
import { useAuth } from "../AuthContext";
import googleIcon from "../assets/Googleicon.webp"
function SignupPage() {
  const navigate=useNavigate()
  const { setUser } = useAuth();  
  const [data,setData]=useState({
    name:"",
    email:"",
    password:"",
    confirmPassword:""
  })
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();
      
      const response = await fetch("http://localhost:8080/user/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token })
      });
      
      const data = await response.json();
      if (response.ok) {
        setUser(data.user);
        alert("Google login successful");
        navigate("/dashboard");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Google login error", error);
    }
  };
  const handleChange=(e)=>{
    setData({...data,[e.target.id]:e.target.value})
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (data.password !== data.confirmPassword) {
        alert("The password does not match the confirm password");
        return;
      }
  
      const response = await fetch("http://localhost:8080/user/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        alert(`Signup failed: ${errorData.message}`);
        return;
      }
  
      const result = await response.json();
      console.log("Signup successful:", result);
      navigate('/loginpage')
    } catch (er) {
      console.log("An error occurred during signup:", er);
    }
  };  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 shadow-lg rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input type="text" value={data.name} onChange={handleChange} id="name" placeholder="Enter your name" className="w-full p-2 border rounded-lg" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" value={data.email} onChange={handleChange} id="email" placeholder="Enter your email" className="w-full p-2 border rounded-lg" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" value={data.password} onChange={handleChange} id="password" placeholder="Enter your password" className="w-full p-2 border rounded-lg" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input type="password" onChange={handleChange} value={data.confirmPassword} placeholder="Confirm your password" id="confirmPassword" className="w-full p-2 border rounded-lg" />
          </div>

          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
            Sign Up
          </button>
          <button 
            type="button" 
            onClick={handleGoogleLogin} 
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-100 shadow-md"
          >
            <img 
              src={googleIcon} 
              alt="Google Logo" 
              className="w-8 h-8"
            />
            <span>Sign up with Google</span>
          </button>
        </form>

        <p className="text-center mt-4 text-sm">
          Already have an account? <Link to="/loginpage" className="text-blue-500 font-semibold">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default SignupPage