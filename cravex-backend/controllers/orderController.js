import {Cart} from "../models/Cart.js";
import { Order } from "../models/Order.js";
import Razorpay from "razorpay";
import crypto from "crypto";


// console.log("Key ID:", process.env.RAZORPAY_KEY_ID);
// console.log("Key Secret:", process.env.RAZORPAY_KEY_SECRET);


export const placeOrder = async (req, res) => {
  try {
    const userId = req.user.id ;
    // console.log(userId);
    const { items, total, address } = req.body;
    const cart = await Cart.findOne({ userId });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }
    const newOrder = new Order({    
        userId,
        items: cart.items,
        total,
        address,
        status: 'Pending',    
    });
    await newOrder.save();
    cart.items = [];
    await cart.save();
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(500).json({ message: "Failed to place order from backend" });
  }

};

export const getUserOrders = async (req, res) => {
    try {   
        const userId = req.user.id;
        const orders = await Order.find({ userId }).populate("items.itemId");
        res.json(orders);

    }   
    catch (err) {   
        res.status(500).json({ message: "Failed to fetch orders" });
    }   
};

export const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findByIdAndDelete(orderId);
    
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("items.itemId")       // populate menu items
      .populate("userId", "name email") // populate user details (only name & email)
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }   
        order.status = status;
        await order.save();
        res.json(order);
    }   
    catch (err) {
        res.status(500).json({ message: "Failed to update order status" });
    }   
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpayPaymentId, razorpayOrderId, razorpaySignature, orderDBId } = req.body;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpayOrderId + "|" + razorpayPaymentId)
      .digest("hex");

    if (generatedSignature !== razorpaySignature) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    // Update order status
    const order = await Order.findById(orderDBId);
    order.status = "Processing";
    await order.save();

    // Clear user's cart
    const cart = await Cart.findOne({ userId: order.userId });
    cart.items = [];
    await cart.save();

    res.json({ message: "Payment verified and order placed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Payment verification failed" });
  }
};


// Create Razorpay Order
export const createOrder = async (req, res) => {
  try {
    const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    const userId = req.user.id;
    const { address } = req.body;

    // 1️⃣ Get user's cart
    const cart = await Cart.findOne({ userId }).populate("items.itemId");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // 2️⃣ Calculate total amount in paise (Razorpay uses smallest currency unit)
    const totalAmount = cart.items.reduce(
      (sum, cartItem) => sum + cartItem.itemId.price * cartItem.quantity,
      0
    ) * 100;

    // 3️⃣ Create Razorpay order
    const options = {
      amount: totalAmount,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const response = await razorpay.orders.create(options);

    // 4️⃣ Save order in DB with Pending status
    const newOrder = new Order({
      userId,
      items: cart.items,
      total: totalAmount / 100, // save in rupees
      status: "Pending",
      address,
      razorpayOrderId: response.id,
    });

    await newOrder.save();

    res.status(201).json({
      orderId: response.id,
      amount: response.amount,
      currency: response.currency,
      orderDBId: newOrder._id,
    });
  } catch (err) {
    console.error("Create Order Error:", err);
    res.status(500).json({ message: "Failed to create order" });
  }
};

