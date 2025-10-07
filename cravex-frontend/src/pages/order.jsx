// import React from 'react'

// const order = () => {
//   return (
//     <div>
      
//     </div>
//   )
// }

// export default order

import React, { useEffect, useState } from "react";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch orders for logged-in user
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("http://localhost:5000/Cravex/order/user", {
          credentials: "include", // send JWT cookie
        });
        const data = await res.json();
        if (res.ok) {
          setOrders(data);
        } else {
          console.error("Failed to fetch orders:", data.message);
        }
      } catch (err) {
        console.error("Server error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <div className="text-center py-10">Loading orders...</div>;

  if (orders.length === 0)
    return <div className="text-center py-10 text-gray-500">No orders found.</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-12">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">🧾 Your Orders</h1>

      <div className="max-w-5xl mx-auto space-y-6">
        {orders.map((order) => (
          <div key={order._id} className="bg-white shadow-lg rounded-xl p-4 sm:p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
              <h2 className="text-lg sm:text-xl font-semibold break-all">Order ID: {order._id}</h2>
              <span
                className={`px-3 py-1 rounded-full font-semibold text-xs sm:text-base ${
                  order.status === "Pending"
                    ? "bg-yellow-200 text-yellow-800"
                    : order.status === "Processing"
                    ? "bg-blue-200 text-blue-800"
                    : "bg-green-200 text-green-800"
                }`}
              >
                {order.status}
              </span>
            </div>

            {/* Address */}
            {order.address && (
              <p className="text-gray-600 mb-4 text-sm sm:text-base">
                <strong>Delivery Address:</strong> {order.address}
              </p>
            )}

            {/* Items */}
            <div className="space-y-3">
              {order.items.map((cartItem) => {
                const item = cartItem.itemId;
                return (
                  <div
                    key={cartItem._id}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-200 pb-2 gap-2"
                  >
                    <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
                      <img
                        src={item.image || "/placeholder.png"}
                        alt={item.name || "Item not available"}
                        className="h-12 w-12 sm:h-16 sm:w-16 object-contain rounded"
                      />
                      <div>
                        <h3 className="font-semibold text-sm sm:text-base">{item.name}</h3>
                        <p className="text-gray-500 text-xs sm:text-sm line-clamp-2 max-w-[120px] sm:max-w-none">{item.description}</p>
                        <span className="font-bold text-green-600 text-xs sm:text-base">
                          ₹{item.price} × {cartItem.quantity}
                        </span>
                      </div>
                    </div>
                    <span className="font-semibold text-xs sm:text-base">
                      ₹{item.price * cartItem.quantity}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Total */}
            <div className="text-right font-bold text-base sm:text-lg mt-4">
              Total: ₹
              {order.items.reduce(
                (sum, cartItem) => sum + cartItem.itemId.price * cartItem.quantity,
                0
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
