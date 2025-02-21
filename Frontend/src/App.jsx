/* eslint-disable no-unused-vars */
import React from 'react'
import LandingPage from './Pages/LandingPage'
import { Route, Routes } from 'react-router-dom'
import Navbar from './Components/Navbar'

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path='/' element={<LandingPage />} />
      </Routes>
    </div>
  )
}

export default App