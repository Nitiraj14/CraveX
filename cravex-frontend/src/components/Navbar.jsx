import React, { useState, useEffect } from "react";
import api from "../services/api";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Signup from "./Signup";
import Login from "./Login";
import UserProfileCard from "./userprofilecard";

const Navbar = () => {
  const [showSignup, setShowSignup] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const checkAuth = async () => {
        try {
          const res = await api.get("/CraveX/auth/check-token", { withCredentials: true });
          setLoggedIn(res.data.loggedIn);
          if (res.data.loggedIn) setUser(res.data.user);
        } catch (err) {
          console.error(err);
          setLoggedIn(false);
        }
      }
      checkAuth();
    }
  }, []);

 

  const handleAnyToMenu = () => {
    if (location.pathname === "/") {
      const menuSection = document.getElementById("menu");
      if (menuSection) {
        const yOffset = -80;
        const y = menuSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    } else {
      navigate("/#menu");
    }
  };



  return (
    <nav className="bg-[rgb(89,70,202)] right-8 top-0 w-full flex items-center justify-between z-2 px-2 sm:px-6 py-2 h-auto min-h-14">
      {/* Left: CraveX always left, shrinks on mobile */}
      <div className="flex-shrink-0 text-white text-lg sm:text-2xl font-extrabold ml-2 sm:ml-6">CraveX</div>

      {/* Center: Components always centered, shrink for mobile */}
      <div className="flex-1 flex justify-center items-center space-x-2 sm:space-x-8 mx-1 sm:mx-10 cursor-pointer">
        <div className="text-white text-xs sm:text-lg font-bold"><Link to="/">Home</Link></div>
        <div className="text-white text-xs sm:text-lg font-bold"><button onClick={handleAnyToMenu}>Menu</button></div>
        <div className="text-white text-xs sm:text-lg font-bold"><Link to="/Cart">Cart</Link></div>
        <div className="text-white text-xs sm:text-lg font-bold"><Link to="/order">Order</Link></div>
      </div>

      {/* Right: Login/Signup always right, shrink for mobile, hide signup on mobile */}
      <div className="flex-shrink-0 flex items-center space-x-2 sm:space-x-6 mr-2 sm:mr-6">
        {!loggedIn ? (
          <>
            <button
              onClick={() => setShowSignup(true)}
              className="hidden sm:inline bg-white px-2 py-1 text-center rounded-full hover:scale-105"
            >
              <span className="cursor-pointer text-black text-xs sm:text-sm font-bold text-center">Sign Up</span>
            </button>
            <button
              onClick={() => setShowLogin(true)}
              className="bg-white px-2 py-1 text-center rounded-full hover:scale-105"
            >
              <span className="cursor-pointer text-black text-xs sm:text-sm font-bold text-center">Login</span>
            </button>
            {/* ...existing code... */}
            {showSignup && (
              <Signup
                onClose={() => setShowSignup(false)}
                switchToLogin={() => {
                  setShowSignup(false);
                  setShowLogin(true);
                }}
              />
            )}
            {showLogin && (
              <Login
                onClose={() => setShowLogin(false)}
                switchToSignup={() => {
                  setShowLogin(false);
                  setShowSignup(true);
                }}
              />
            )}
          </>
        ) : (
            <div
            className="bg-white h-8 w-8 rounded-full cursor-pointer flex items-center justify-center"
            onClick={() => setShowProfile(!showProfile)}
          >
            <img
              src="/image/usericon.jpg"
              alt={user?.name || "profile"}
              className="h-8 w-8 rounded-full object-cover"
            />
          </div>
        )}

        {showProfile && <UserProfileCard /> }
      </div>
    </nav>
  );
};

export default Navbar;
