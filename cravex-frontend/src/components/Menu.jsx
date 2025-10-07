import React, { useEffect, useState } from "react";
import FloatingCartButton from "./floatbutton"; 

const Menu = () => {
  const [cartItems, setCartItems] = useState([]);
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch("http://localhost:5000/Cravex/menu", {
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok) setMenuItems(data || []);
        else {
          console.error("Failed to fetch menu:", data.message || data);
        }
      } catch (err) {
        console.error("Failed to fetch menu:", err);
      }
    };

    fetchMenu();
  }, []);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch("http://localhost:5000/Cravex/cart", {
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok) setCartItems(data.items || []);
        else {
          console.error("Error fetching cart:", data.message || data);
          setCartItems([]);
        }
      } catch (err) {
        console.error("Server error:", err);
        setCartItems([]);
      }
    };

    fetchCart();
  }, []);

  // helper to get cartItem for a menu item (works whether itemId is populated object or just id)
  const findCartItem = (menuItem) => {
    return cartItems.find((ci) => {
      if (!ci || ci.itemId == null) return false;
      const ciId = typeof ci.itemId === "object" ? ci.itemId._id : ci.itemId;
      // compare as strings to avoid ObjectId mismatch
      return ciId?.toString() === menuItem._id?.toString();
    });
  };

  // Add to cart (POST). Backend returns the cart object (or at least items array)
  const handleAddToCart = async (menuItem, qty = 1) => {
    try {
      const res = await fetch("http://localhost:5000/Cravex/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          itemId: menuItem._id,
          quantity: qty,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setCartItems(data.items || []); // replace with server cart items
      } else {
        console.error("Add to cart failed:", data.message || data);
        alert(data.message || "Failed to add to cart");
      }
    } catch (err) {
      console.error("Add to cart error:", err);
      alert("Server error while adding to cart");
    }
  };

  // Update quantity (PUT). If newQty === 0 we remove (server handler can remove too)
  const handleUpdateQuantity = async (cartItemId, newQty) => {
    try {
      if (newQty <= 0) {
        // call DELETE to remove item
        const res = await fetch(`http://localhost:5000/Cravex/cart/${cartItemId}`, {
          method: "DELETE",
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok) {
          setCartItems(data.items || []);
        } else {
          console.error("Delete failed:", data.message || data);
          alert(data.message || "Failed to remove item");
        }
        return;
      }

      const res = await fetch(`http://localhost:5000/Cravex/cart/${cartItemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ quantity: newQty }),
      });
      const data = await res.json();
      if (res.ok) {
        // update UI from server response if available
        setCartItems(data.items || cartItems.map(ci => (ci._id === cartItemId ? { ...ci, quantity: newQty } : ci)));
      } else {
        console.error("Update failed:", data.message || data);
        alert(data.message || "Failed to update quantity");
      }
    } catch (err) {
      console.error("Error updating quantity:", err);
      alert("Server error while updating quantity");
    }
  };

  return (
    <div className="w-full min-h-screen bg-[rgb(89,70,202)] flex flex-col items-center justify-start pb-8">
      {/* Title */}
      <h1 id="menu" className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center text-white mb-10 w-full pt-10">MENU</h1>

      <div className="w-full max-w-6xl px-2 sm:px-6 md:px-10 mb-20 flex flex-wrap justify-center gap-6 sm:gap-10">
        {menuItems.map((item, index) => {
          const cartItem = findCartItem(item);
          return (
            <div
              key={item._id || index}
              className="bg-white rounded-3xl shadow-md hover:shadow-xl transition-transform duration-200 p-4 sm:p-5 w-full max-w-xs flex flex-col justify-between"
            >
              {/* Image */}
              <img src={item.image} alt={item.name} className="h-32 sm:h-40 w-full object-cover rounded-xl mb-4" />

              {/* Content */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-gray-800">{item.name}</h2>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">{item.description || "Delicious item"}</p>
                </div>

                {/* Price + Quantity Controls */}
                <div className="flex justify-between items-center mt-4">
                  <span className="text-green-600 font-bold text-base sm:text-xl">₹{item.price}</span>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        cartItem
                          ? handleUpdateQuantity(cartItem._id, cartItem.quantity - 1)
                          : null
                      }
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 text-xs sm:text-base"
                      disabled={!cartItem}
                    >
                      -
                    </button>

                    <span className="min-w-[24px] text-center">{cartItem ? cartItem.quantity : ""}</span>

                    <button
                      onClick={() =>
                        cartItem ? handleUpdateQuantity(cartItem._id, cartItem.quantity + 1) : handleAddToCart(item, 1)
                      }
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 text-xs sm:text-base"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={() => handleAddToCart(item, 1)}
                  className="mt-4 w-full bg-orange-500 text-white py-2 rounded-xl font-semibold hover:bg-orange-600 transition text-xs sm:text-base"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {/* ✅ Floating Cart Button */}
      <FloatingCartButton cartCount={cartItems.length} />
    </div>
  );
};

export default Menu;
