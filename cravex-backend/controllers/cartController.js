import {Cart} from "../models/Cart.js";

// Add item to cart
export const addToCart = async (req, res) => {
  try {
    const  userId = req.user.id;
    const {  itemId, quantity } = req.body;

    let cart = await Cart.findOne({ userId });

    if (cart) {
      // check if item exists
      const itemIndex = cart.items.findIndex(item => item.itemId == itemId);
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ itemId, quantity });
      }
    } else {
      cart = new Cart({ userId, items: [{ itemId, quantity }] });
    }

    await cart.save();
    res.status(201).json(cart);
  } catch (err) {
    res.status(500).json({ message: "Failed to add to cart" });
  }
};

// Get user cart
export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    // console.log("Fetching cart for user:", userId);

    const cart = await Cart.findOne({ userId }).populate("items.itemId");

    if (!cart) {
      return res.status(200).json({ items: [] }); // empty cart
    }

    res.json(cart);
  } catch (err) {
    console.error("Error in getCart:", err);
    res.status(500).json({ message: "Failed to fetch cart" });
  }
};

// Update quantity of a specific item in the cart
export const updateCartQuantity = async (req, res) => {
  try {
    const userId = req.user.id;
    const { cartItemId } = req.params;      // _id of the item in cart.items
    const { quantity } = req.body;

    if (quantity < 0) {
      return res.status(400).json({ message: "Quantity cannot be negative" });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const itemIndex = cart.items.findIndex(item => item._id.toString() === cartItemId);

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    if (quantity === 0) {
      // Remove item if quantity is 0
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();
    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update cart quantity" });
  }
};


// Remove item from cart
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cartItemId = req.params.cartItemId;

    let cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter((item) => item._id.toString() !== cartItemId);
    await cart.save();

    res.json(cart);
  } catch (err) {
    console.error("Error in removeFromCart:", err);
    res.status(500).json({ message: "Failed to remove item" });
  }
};
