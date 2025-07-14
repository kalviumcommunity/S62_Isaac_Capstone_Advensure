/* eslint-disable no-unused-vars */
import React from 'react'
import LandingPage from './Pages/LandingPage'
import { Route, Routes } from 'react-router-dom'
import Navbar from './Components/Navbar'
import LoginPage from './Pages/LoginPage'
import SignupPage from './Pages/SignupPage'
import Dashboard from './Pages/Dashboard'
import Explore from './Pages/ExplorePage'
import PlanTrip from './Pages/PlanTrip'
import BudgetPage from './Pages/BudgetPage'
import HotelsPage from './Pages/HotelsPage'
import ContactPage from './Pages/Contact'
import RouteMap from './Components/RouteMap'

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/loginpage' element={<LoginPage />} />
        <Route path='/signuppage' element={<SignupPage />} />
        <Route path='/dashboard' element={<Dashboard />} />
        {/* <Route path='/destinations' element={<Explore />} /> */}
        <Route path="/plan" element={<PlanTrip />} />
        <Route path="/budget" element={<BudgetPage />} />
        <Route path="/hotels" element={<HotelsPage />} />
        {/* <Route path='/contact' element={<ContactPage />} /> */}
        <Route path='/map' element={<RouteMap from="Bangalore" to="Coorg" />} />
      </Routes>
    </div>
  )
}

export default App