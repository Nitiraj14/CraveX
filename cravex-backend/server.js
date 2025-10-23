import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

// import routers
import userRouter from './routes/user.js';
import menuRouter from './routes/menu.js';
import cartRouter from './routes/cart.js';
import orderRouter from './routes/order.js';
import adminRouter from './routes/admin.js';
import authRouter from './routes/auth.js';

dotenv.config();
const app = express();

// ✅ Vercel automatically provides PORT
const PORT = process.env.PORT || 5000;

// ✅ MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};
connectDB();

// ✅ CORS setup
const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? ["https://cravex.vercel.app"] // make sure this matches your frontend URL (all lowercase!)
    : ["http://localhost:5173", "https://cravex.vercel.app"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// ✅ Routes
app.use("/Cravex/user", userRouter);
app.use("/Cravex/menu", menuRouter);
app.use("/Cravex/cart", cartRouter);
app.use("/Cravex/order", orderRouter);
app.use("/Cravex/admin", adminRouter);
app.use("/Cravex/auth", authRouter);

// ✅ Base Route
app.get("/", (req, res) => {
  res.send("🚀 CraveX Backend is Live!");
});

// ✅ Only listen if running locally (Vercel handles it automatically)
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

// ✅ Export app for Vercel
export default app;
