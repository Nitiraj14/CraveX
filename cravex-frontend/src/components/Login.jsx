import React from 'react'
import api from "../services/api";
import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";

const Login = ({ onClose, switchToSignup }) => {
      // Login.jsx
  const [formData, setFormData] = useState({ email: "", password: "" });
    const navigate = useNavigate(); // ← here

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
  const res = await api.post("/Cravex/auth/login", formData, { withCredentials: true });
      const data = res.data;
      if (res.status === 200) {
        alert(data.message + " ✅");
        onClose();
        navigate(data.redirect);
        window.location.reload();
      } else {
        alert(data.message || "Login failed ❌");
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
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 w-full">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md relative">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Login</h2>
        <form method='post' className="space-y-4" onSubmit={handleSubmit}>
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
          <button className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition">
            Login
          </button>
        </form>

        <p className="text-center mt-4 text-gray-600">
          Don’t have an account?{" "}
          <button
            onClick={switchToSignup}
            className="text-orange-500 font-semibold hover:underline"
          >
            Sign Up
          </button>
        </p>

        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-red-500"
        >
          ✖
        </button>
      </div>
    </div>

    
  );
}

export default Login
