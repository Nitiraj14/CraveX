import express from "express";
import { addToCart, getCart, removeFromCart, updateCartQuantity } from "../controllers/cartController.js"; 
import { authmiddleware } from "../middleware/auth.js";

const router = express.Router();
const app = express();          

router.post("/", authmiddleware,addToCart);
router.get("/",authmiddleware, getCart);          
router.delete("/:cartItemId", authmiddleware,removeFromCart);
router.put("/:cartItemId", authmiddleware, updateCartQuantity);

export default router;  
