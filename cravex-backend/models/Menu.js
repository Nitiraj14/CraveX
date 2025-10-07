import mongoose from 'mongoose';
const MenuSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: {type:Number, required: true}, 
  image: {type: String},
  category: {type: String},
}, { timestamps: true });

export const Menu = mongoose.model('Menu', MenuSchema);
