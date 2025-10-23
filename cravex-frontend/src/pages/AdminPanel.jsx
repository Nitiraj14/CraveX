import React, { useState, useEffect } from "react";
import api from "../services/api";

const AdminPanel = () => {
  const [activeSection, setActiveSection] = useState("orders");
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemCategory, setItemCategory] = useState("");
  const [itemImage, setItemImage] = useState("");
  const [menuItems, setMenuItems] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
    fetchMenuItems();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/Cravex/order/all", { withCredentials: true });
      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    }
  };

  const fetchMenuItems = async () => {
    try {
      const res = await api.get("/Cravex/menu");
      setMenuItems(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch menu items:", err);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const res = await api.put(`/Cravex/order/${id}/status`, { status: newStatus }, { withCredentials: true });
      if (res.status === 200) {
        setOrders(orders.map(o => o._id === id ? { ...o, status: newStatus } : o));
      } else {
        alert("Failed to update status ❌");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteOrder = async (id) => {
    try {
      const res = await api.delete(`/Cravex/order/${id}/delete`, { withCredentials: true });
      if (res.status === 200) {
        setOrders(orders.filter(o => o._id !== id));
      } else {
        alert("Failed to delete order ❌");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddItem = async (newItem) => {
    try {
      const res = await api.post("/Cravex/menu", newItem);
      if (res.status === 200) {
        alert("Item added successfully ✅");
        setItemName("");
        setItemDescription("");
        setItemPrice("");
        setItemCategory("");
        setItemImage("");
        fetchMenuItems();
      } else {
        alert("Failed to add item ❌");
      }
    } catch (err) {
      console.error(err);
      alert("Server error ❌");
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      const res = await api.delete(`/Cravex/menu/${id}`, { withCredentials: true });
      if (res.status === 200) {
        setMenuItems(menuItems.filter((item) => item._id !== id));
      } else {
        alert("Failed to delete item");
      }
    } catch (err) {
      console.error("Error deleting item:", err);
      alert("Server error while deleting item");
    }
  };

  const handleUpdateItem = async (id) => {
    const name = prompt("Enter new item name:");
    const price = prompt("Enter new price:");
    const description = prompt("Enter new description:");
    const category = prompt("Enter new category:");
    const image = prompt("Enter new image URL:");
    const updatedItem = { name, price, description, category, image };
    try {
      const res = await api.put(`/Cravex/menu/${id}`, updatedItem, { withCredentials: true });
      if (res.status === 200) {
        alert("Item updated successfully ✅");
        fetchMenuItems();
      } else {
        alert("Failed to update item ❌");
      }
    } catch (err) {
      console.error("Error updating item:", err);
      alert("Server error while updating item ❌");
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start w-full py-8 pb-8 px-2 sm:px-6 md:px-12">
      <h1 className="text-3xl font-bold mb-6 text-center py-8">CraveX Admin Panel</h1>
      {/* Navigation Tabs */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-8 w-full">
        <button
          onClick={() => setActiveSection("orders")}
          className={`px-4 py-2 rounded-lg font-semibold ${activeSection === "orders" ? "bg-orange-500 text-white" : "bg-white border"}`}
        >Orders</button>
        <button
          onClick={() => setActiveSection("menu")}
          className={`px-4 py-2 rounded-lg font-semibold ${activeSection === "menu" ? "bg-orange-500 text-white" : "bg-white border"}`}
        >Menu</button>
        <button
          onClick={() => setActiveSection("users")}
          className={`px-4 py-2 rounded-lg font-semibold ${activeSection === "users" ? "bg-orange-500 text-white" : "bg-white border"}`}
        >Users</button>
      </div>

      {/* Orders Section */}
      {activeSection === "orders" && (
        <div className="bg-white p-6 rounded-xl shadow space-y-4 w-full max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Orders</h2>
          {orders.length === 0 ? (
            <p className="text-gray-500">No orders yet.</p>
          ) : (
            <table className="min-w-full border rounded-lg overflow-hidden">
              <thead className="bg-gray-200">
                <tr>
                  <th className="py-2 px-4">Order ID</th>
                  <th className="py-2 px-4">User</th>
                  <th className="py-2 w-1/3 px-4">Items</th>
                  <th className="py-2 px-4">Total</th>
                  <th className="py-2 px-4">Status</th>
                  <th className="py-2 px-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-t">
                    <td className="py-2 px-4">{order._id}</td>
                    <td className="py-2 px-4">{order.userId?.name || "Guest"}</td>
                    <td className="py-2 px-4">
                      {order.items.map((i, idx) => (
                        <span key={idx}>
                          {i.itemId?.name || "Unknown"} × {i.quantity}
                          {idx < order.items.length - 1 && ", "}
                        </span>
                      ))}
                    </td>
                    <td className="py-2 px-4 font-semibold">₹{order.total}</td>
                    <td className="py-2 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === "Pending" ? "bg-yellow-200 text-yellow-800" : order.status === "Preparing" ? "bg-blue-200 text-blue-800" : order.status === "Failed" ? "bg-red-200 text-red-800" : "bg-green-200 text-green-800"}`}>{order.status}</span>
                    </td>
                    <td className="py-2 px-4 flex gap-2">
                      {order.status !== "Delivered" && (
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                          className="px-2 py-1 rounded border border-gray-300 bg-white text-sm"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Preparing">Preparing</option>
                          <option value="Processing">Processing</option>
                          <option value="Failed">Failed</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      )}
                      <button
                        onClick={() => handleDeleteOrder(order._id)}
                        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Menu Section */}
      {activeSection === "menu" && (
        <div className="bg-white p-6 rounded-xl shadow space-y-6 w-full max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Menu Management</h2>
          {/* Add Menu Item */}
          <div className="space-y-2">
            <h3 className="font-semibold">Add Menu Item</h3>
            <input type="text" placeholder="Item Name" className="border px-3 py-2 rounded w-full" value={itemName} onChange={(e) => setItemName(e.target.value)} />
            <input type="text" placeholder="Description (10-15 words)" className="border px-3 py-2 rounded w-full" value={itemDescription} onChange={(e) => setItemDescription(e.target.value)} />
            <input type="number" placeholder="Price" className="border px-3 py-2 rounded w-full" value={itemPrice} onChange={(e) => setItemPrice(e.target.value)} />
            <input type="text" placeholder="Category" className="border px-3 py-2 rounded w-full" value={itemCategory} onChange={(e) => setItemCategory(e.target.value)} />
            <input type="text" placeholder="Image URL" className="border px-3 py-2 rounded w-full" value={itemImage} onChange={(e) => setItemImage(e.target.value)} />
            <button onClick={() => handleAddItem({ name: itemName, description: itemDescription, price: Number(itemPrice), category: itemCategory, image: itemImage })} className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600">Add Item</button>
          </div>
          {/* Update/Delete Menu Item */}
          <div className="space-y-2 mt-4">
            <h3 className="font-semibold">Update/Delete Items</h3>
            {menuItems.map((item) => (
              <div key={item._id} className="flex justify-between items-center bg-gray-100 p-3 rounded">
                <span>{item.name} - ₹{item.price}</span>
                <div className="flex gap-2">
                  <button onClick={() => handleUpdateItem(item._id)} className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">Update</button>
                  <button onClick={() => handleDeleteItem(item._id)} className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Users Section */}
      {activeSection === "users" && (
        <div className="bg-white p-6 rounded-xl shadow space-y-6 w-full max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">User Management</h2>
          {/* Add User */}
          <div className="space-y-2">
            <h3 className="font-semibold">Add User</h3>
            <input type="text" placeholder="Name" className="border px-3 py-2 rounded w-full" />
            <input type="email" placeholder="Email" className="border px-3 py-2 rounded w-full" />
            <input type="password" placeholder="Password" className="border px-3 py-2 rounded w-full" />
            <button className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600">Add User</button>
          </div>
          {/* Delete User */}
          <div className="space-y-2 mt-4">
            <h3 className="font-semibold">Delete Users</h3>
            <div className="flex justify-between items-center bg-gray-100 p-3 rounded">
              <span>John Doe (johndoe@gmail.com)</span>
              <button className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;