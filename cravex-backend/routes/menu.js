import express from "express";
import { getMenu, addMenuItem, updateMenuItem, deleteMenuItem}  from "../controllers/menuController.js";

const router = express.Router();


router.get("/", getMenu);           // Fetch all menu items
router.post("/", addMenuItem);      // Add new menu item
router.put("/:id", updateMenuItem); // Update menu item
router.delete("/:id", deleteMenuItem); // Delete menu item


export default router;