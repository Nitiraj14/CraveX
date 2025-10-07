import express from "express";
import { getUserProfile, updateUserProfile, logoutUser } from "../controllers/userController.js";
import { authmiddleware } from "../middleware/auth.js";

const router = express.Router();
const app = express();  

router.get("/get",authmiddleware, getUserProfile);
router.post('/logout', authmiddleware, logoutUser)
router.get("/update",authmiddleware, updateUserProfile);

export default router;
