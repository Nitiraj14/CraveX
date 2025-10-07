import mongoose from "mongoose";

const UserSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: {type: String},
    phone: {type: Number},
    role: { type: String, enum: ["user", "admin"], default: "admin" },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", UserSchema);
