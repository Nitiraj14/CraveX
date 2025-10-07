import express from "express";  
import { placeOrder, getUserOrders, getAllOrders, updateOrderStatus, createOrder, verifyPayment, deleteOrder } from "../controllers/orderController.js";
import { authmiddleware } from "../middleware/auth.js";

const router = express.Router();  



// Get user orders
router.post("/placeOrder", authmiddleware,placeOrder);
router.get("/user",  authmiddleware,getUserOrders);
// Admin routes
router.get("/all",  authmiddleware,getAllOrders);
router.put("/:orderId/status", authmiddleware, updateOrderStatus);
router.delete("/:orderId/delete", authmiddleware, deleteOrder);

// Create order
router.post("/create-order", authmiddleware, createOrder);
router.post("/verify-payment", authmiddleware, verifyPayment);

export default router;
