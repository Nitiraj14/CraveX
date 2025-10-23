import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

// import routers
import userRouter from './routes/User.js';
import menuRouter from './routes/menu.js';
import cartRouter from './routes/cart.js';
import orderRouter from './routes/order.js';
import adminRouter from './routes/admin.js';
import authRouter from './routes/auth.js';

dotenv.config();
const app = express();

const PORT = process.env.PORT || 5000;


const connection = async () => {

  const conn = await mongoose.connect(process.env.MONGO_URI,console.log(`MongoDB Connected:`));
 
  return conn;  
}

connection();

//Routes
app.use(cors({
  origin: ["http://localhost:5173", "https://Cravex.vercel.app"], // your React app
  credentials: true                 
}));
app.use(express.json());
app.use(cookieParser());

app.use('/Cravex/user', userRouter);
app.use('/Cravex/menu', menuRouter);
app.use('/Cravex/cart', cartRouter);
app.use('/Cravex/order', orderRouter);
app.use('/Cravex/admin', adminRouter);
app.use('/Cravex/auth', authRouter);

app.get('/', (req, res) => {
  res.send('CraveX Website is ON Now!')
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



