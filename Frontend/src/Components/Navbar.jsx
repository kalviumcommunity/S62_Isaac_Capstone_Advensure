/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Menu, X, User } from "lucide-react";
import Logo from "../assets/Logo.jpg";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const userProfileImage = "https://via.placeholder.com/40";

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <a href="/" className="flex items-center">
          <img src={Logo} alt="Logo" className="w-24 h-12 object-contain" />
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          <a href="/" className="hover:text-blue-500">Home</a>
          <a href="/destinations" className="hover:text-blue-500">Explore</a>
          <a href="/plan" className="hover:text-blue-500">Plan a Trip</a>
          <a href="/budget" className="hover:text-blue-500">Budget</a>
          <a href="/hotels" className="hover:text-blue-500">Hotels</a>
          <a href="/contact" className="hover:text-blue-500">Contact</a>
        </div>

        {/* User Profile or Guest */}
        <div className="hidden md:flex items-center space-x-4">
          {isLoggedIn ? (
            <img src={userProfileImage} alt="User Profile" className="w-10 h-10 rounded-full" />
          ) : (
            <a href="/login" className="flex items-center space-x-2 text-blue-500">
              <User size={24} />
              <span>Guest User</span>
            </a>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
          {isOpen ? <X size={30} /> : <Menu size={30} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md">
          <a href="/" className="block px-6 py-2">Home</a>
          <a href="/destinations" className="block px-6 py-2">Explore</a>
          <a href="/plan" className="block px-6 py-2">Plan a Trip</a>
          <a href="/budget" className="block px-6 py-2">Budget</a>
          <a href="/hotels" className="block px-6 py-2">Hotels</a>
          <a href="/contact" className="block px-6 py-2">Contact</a>
          {isLoggedIn ? (
            <img src={userProfileImage} alt="User Profile" className="block w-10 h-10 mx-auto rounded-full mt-4" />
          ) : (
            <a href="/loginPage" className="block px-6 py-2 text-blue-500 text-center flex items-center justify-center">
              <User size={24} className="mr-2" /> Guest User
            </a>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
