import express from "express";
import { getAllUsers, deleteUser } from "../controllers/adminController.js";
import { addMenuItem, updateMenuItem, deleteMenuItem}  from "../controllers/menuController.js";
// import auth from "../middleware/auth.js";
// import admin from "../middleware/admin.js";

const router = express.Router();

router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);
router.post("/", addMenuItem);      // Add new menu item
router.put("/:id", updateMenuItem); // Update menu item
router.delete("/:id", deleteMenuItem); // Delete menu item

export default router;
