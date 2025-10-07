import mongoose from "mongoose";        

const CartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
        {  itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Menu" },
           quantity: { type: Number, default: 1 } 
        }
    ],
}, { timestamps: true });

export const Cart = mongoose.model("Cart", CartSchema);