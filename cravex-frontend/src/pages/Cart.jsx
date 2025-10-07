import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState(""); // store user input
  const navigate = useNavigate();
  // ✅ Fetch Cart Items
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch("http://localhost:5000/Cravex/cart", {
          credentials: "include",
          // send JWT cookie
        });

        const data = await res.json();

        if (res.ok) {
          setCartItems(data.items || []); // extract items array
        } else {
          console.error("Error fetching cart:", data.message);
        }
      } catch (err) {
        console.error("Server error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  // ✅ Delete Item from Cart
  const handleRemoveItem = async (cartItemId) => {
    try {
      const res = await fetch(`http://localhost:5000/Cravex/cart/${cartItemId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        setCartItems(cartItems.filter((item) => item._id !== cartItemId));
      } else {
        alert(data.message || "Failed to remove item");
      }
    } catch (err) {
      console.error("Error removing item:", err);
    }
  };

  // ✅ Update Quantity
  const handleUpdateQuantity = async (cartItemId, newQty) => {
    if (newQty < 1) return;

    try {
      const res = await fetch(`http://localhost:5000/Cravex/cart/${cartItemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ quantity: newQty }),
      });

      const data = await res.json();

      if (res.ok) {
        setCartItems(
          cartItems.map((item) =>
            item._id === cartItemId ? { ...item, quantity: newQty } : item
          )
        );
      } else {
        alert(data.message || "Failed to update quantity");
      }
    } catch (err) {
      console.error("Error updating quantity:", err);
    }
  };

  // ✅ Calculate Total
  const totalPrice = cartItems.reduce(
    (sum, cartItem) => sum + cartItem.itemId.price * cartItem.quantity,
    0
  );

  if (loading) return <div className="text-center py-10">Loading...</div>;
  
  //handleCheckout
  const handleCheckout = async () => {
  if (!address) {
    alert("Please enter your address first!");
    return;
  }

  try {
    // 1️⃣ Create order on backend
    const res = await fetch("http://localhost:5000/Cravex/order/create-order", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to create order");

    // 2️⃣ Configure Razorpay options
    const options = {
      key:import.meta.env.VITE_RAZORPAY_KEY_ID, // replace with env variable in production
      amount: data.amount,
      currency: data.currency,
      name: "CraveX",
      description: "Food Order Payment",
      order_id: data.orderId,
      handler: async function (response) {
        // 3️⃣ Payment successful – update backend
        await fetch(`http://localhost:5000/Cravex/order/verify-payment`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
            orderDBId: data.orderDBId,
          }),
        });
        alert("Payment successful! 🎉");
      },
      prefill: {
        name: "John Doe",
        email: "john@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#F97316",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
    return navigate("/order")
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start w-full pb-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center w-full">🛒 Your Cart</h1>

      <div className="w-full max-w-4xl px-2 sm:px-4 md:px-8">
        {cartItems.length === 0 ? (
          <p className="text-center text-gray-500">Your cart is empty.</p>
        ) : (
          <div className="space-y-4 w-full">
            {cartItems.map((cartItem) => {
              const item = cartItem.itemId;
              return (
                <div
                  key={cartItem._id}
                  className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-lg shadow gap-4 sm:gap-0 w-full"
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-16 w-16 sm:h-20 sm:w-20 object-contain rounded"
                    />
                    <div>
                      <h2 className="font-semibold text-base sm:text-lg">{item.name}</h2>
                      <p className="text-gray-500 text-xs sm:text-sm line-clamp-2 max-w-[150px] sm:max-w-none">{item.description}</p>
                      <span className="font-bold text-green-600 text-sm sm:text-base">₹{item.price}</span>
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 mt-2 sm:mt-0">
                    <button
                      onClick={() => handleUpdateQuantity(cartItem._id, cartItem.quantity - 1)}
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm sm:text-base"
                    >
                      -
                    </button>
                    <span className="min-w-[24px] text-center">{cartItem.quantity}</span>
                    <button
                      onClick={() => handleUpdateQuantity(cartItem._id, cartItem.quantity + 1)}
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm sm:text-base"
                    >
                      +
                    </button>
                  </div>

                  {/* Delete */}
                  <button
                    onClick={() => handleRemoveItem(cartItem._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm sm:text-base mt-2 sm:mt-0"
                  >
                    Remove
                  </button>
                </div>
              );
            })}

            <div className="w-full flex flex-col items-center">
              {/* Address Input */}
              <div className="mb-4 w-full max-w-md mx-auto">
                <label className="block text-gray-700 font-semibold mb-2">Delivery Address:</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Enter your delivery address"
                />
              </div>
              {/* Total */}
              <div className="text-right font-bold text-lg sm:text-xl my-3 w-full">
                Total: ₹{Math.round(totalPrice)}.0
              </div>

              {/* Proceed to Checkout */}
              <div className="flex flex-col sm:flex-row justify-end gap-2 w-full">
                <button
                  onClick={() => {
                    if (!address.trim()) {
                      alert("Please enter your delivery address before proceeding!");
                    } else {
                      handleCheckout();
                    }
                  }}
                  className="px-4 sm:px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 w-full sm:w-auto"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
