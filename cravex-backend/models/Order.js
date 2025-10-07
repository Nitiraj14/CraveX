import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Menu" },
      quantity: { type: Number, default: 1 },
    },
  ],
  total: { type: Number, required: true },
  status: { type: String, enum: ["Pending", "Processing", "Preparing","Delivered", "Failed"] , default: "pending" },
});

export const Order = mongoose.model("Order", OrderSchema);


