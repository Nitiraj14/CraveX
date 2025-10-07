import { User } from "../models/User.js";
import bcrypt from "bcryptjs";

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });  // ✅ send user object back to frontend
  } catch (err) {
    console.error("Error in getUserProfile:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const logoutUser = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    return res.json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ message: "Logout failed" });
  }
};

export const updateUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        if (req.user.id !== userId && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Forbidden" });
        }
        const updates = {...req.body };
        if (updates.password) {
            updates.password = await bcrypt.hash(updates.password, 10);
        }   
        const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true }).select('-password');
        res.json(updatedUser);
    }
    catch (err) {   
        res.status(500).json({ message: "Failed to update user" });
    }
};

// Note: Ensure to add authentication middleware to protect these routes in your route definitions.