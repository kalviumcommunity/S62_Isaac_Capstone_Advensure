import { useAuth } from "../AuthContext"; // Import useAuth hook
import { Menu, X, User, LogOut, Edit } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/Logo.jpg";

function Navbar() {
  const { user, setUser } = useAuth(); // Get user & setUser from context
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Toggle profile dropdown
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Logout function
  const handleLogout = async() => {
    try {
      const response = await fetch("http://localhost:8080/user/logout", {
        method: "POST",
        credentials: "include",
      });
      
      const data = await response.json();
      if (data.success) {
        setUser("Guest User");
        navigate("/loginpage");
        localStorage.removeItem("name");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src={Logo} alt="Logo" className="w-24 h-12 object-contain" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-6">
          <Link to="/" className="hover:text-blue-500">Home</Link>
          <Link to="/destinations" className="hover:text-blue-500">Explore</Link>
          <Link to="/plan" className="hover:text-blue-500">Plan a Trip</Link>
          <Link to="/budget" className="hover:text-blue-500">Budget</Link>
          <Link to="/hotels" className="hover:text-blue-500">Hotels</Link>
          <Link to="/contact" className="hover:text-blue-500">Contact</Link>
        </div>

        {/* User Profile or Login */}
        <div className="relative hidden md:flex items-center space-x-4" ref={dropdownRef}>
          {user !== "Guest User" ? (
            <button onClick={toggleDropdown} className="flex items-center space-x-2 text-blue-500">
              <User size={24} />
              <span>{user.name}</span>
            </button>
          ) : (
            <Link to="/loginpage" className="flex items-center space-x-2 text-blue-500">
              <User size={24} />
              <span>Guest User</span>
            </Link>
          )}

          {/* Dropdown Menu */}
          {dropdownOpen && user !== "Guest User" && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg">
              <button 
                onClick={() => { navigate("/profile"); setDropdownOpen(false); }} 
                className="flex items-center px-4 py-2 w-full text-left hover:bg-gray-100"
              >
                <Edit size={18} className="mr-2" /> Edit Profile
              </button>
              <button 
                onClick={handleLogout} 
                className="flex items-center px-4 py-2 w-full text-left text-red-500 hover:bg-gray-100"
              >
                <LogOut size={18} className="mr-2" /> Logout
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button onClick={toggleMenu} className="md:hidden">
          {isOpen ? <X size={30} /> : <Menu size={30} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md">
          <Link to="/" className="block px-6 py-2">Home</Link>
          <Link to="/destinations" className="block px-6 py-2">Explore</Link>
          <Link to="/plan" className="block px-6 py-2">Plan a Trip</Link>
          <Link to="/budget" className="block px-6 py-2">Budget</Link>
          <Link to="/hotels" className="block px-6 py-2">Hotels</Link>
          <Link to="/contact" className="block px-6 py-2">Contact</Link>

          {user !== "Guest User" ? (
            <div className="px-6 py-2">
              <button onClick={toggleDropdown} className="flex items-center space-x-2">
                <User size={24} />
                <span>{user.name}</span>
              </button>

              {/* Mobile Dropdown Menu */}
              {dropdownOpen && (
                <div className="mt-2 w-full bg-white border rounded-lg shadow-lg">
                  <button 
                    onClick={() => { navigate("/profile"); setDropdownOpen(false); }} 
                    className="flex items-center px-6 py-2 w-full text-left hover:bg-gray-100"
                  >
                    <Edit size={18} className="mr-2" /> Edit Profile
                  </button>
                  <button 
                    onClick={handleLogout} 
                    className="flex items-center px-6 py-2 w-full text-left text-red-500 hover:bg-gray-100"
                  >
                    <LogOut size={18} className="mr-2" /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/loginpage" className="block px-6 py-2 text-blue-500 text-center">
              <User size={24} className="mr-2" /> Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
