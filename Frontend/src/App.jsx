/* eslint-disable no-unused-vars */
import React from 'react'
import LandingPage from './Pages/LandingPage'
import { Route, Routes } from 'react-router-dom'
import Navbar from './Components/Navbar'
import LoginPage from './Pages/LoginPage'
import SignupPage from './Pages/SignupPage'
import Dashboard from './Pages/Dashboard'

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/loginpage' element={<LoginPage />} />
        <Route path='/signuppage' element={<SignupPage />} />
        <Route path='/dashboard' element={<Dashboard />} />
      </Routes>
    </div>
  )
}

export default App