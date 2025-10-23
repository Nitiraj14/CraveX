import React from 'react'
import api from "../services/api";
import Login from './Login';
import { useState } from 'react';
import { useEffect } from 'react';

const Signup = ({ onClose, switchToLogin }) => {
    const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/CraveX/auth/signup", formData, { withCredentials: true });
      const data = res.data;
      if (res.status === 200) {
        alert("Signup successful ✅");
        window.location.reload();
        onClose(); // close modal
      } else {
        alert(data.message || "Signup failed ❌");
      }
    } catch (err) {
      console.error(err);
      alert("Server error ❌");
    }
  };
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Disable scroll
      document.body.style.overflow = "hidden";
      return () => {
        // Enable scroll again when modal closes
        document.body.style.overflow = "auto";
      };
    }
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm bg-opacity-50 z-3 w-full">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Create Account</h2>
        
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-400"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-400"
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-400"
          />
          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition"
          >
            Sign Up
          </button>
        </form>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-red-500"
        >
          ✖
        </button>
         <p className="text-center mt-4 text-gray-600">
          Already have an account?{" "}
          <button
            onClick={switchToLogin}
            className="text-orange-500 font-semibold hover:underline"
          >
            Login
          </button>
        </p>

      </div>
    </div>
  
  )
}

export default Signup

