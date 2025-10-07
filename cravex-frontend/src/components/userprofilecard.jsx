import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UserProfileCard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:5000/CraveX/user/get", {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:5000/CraveX/user/logout", {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        setUser(null);
        navigate("/");
        window.location.reload(); // refresh to clear navbar state
      } else {
        console.error("Logout failed");
      }
    } catch (err) {
      console.error("Logout failed", err);
    }
  };
    if (loading) return <p className="text-center text-gray-600"></p>;

  return (
    <div className="absolute right-20 top-10 mt-2 bg-white rounded-2xl shadow-lg w-64 p-4 z-50">
      <div className="flex items-center space-x-3 border-b pb-3 mb-3">
        <div className="h-10 w-10 rounded-full overflow-hidden">
          <img
            src="src/assets/image/usericon.jpg"
            alt={user.name || "User"}
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-800">{user.name}</h2>
          {/* <h2 className="text-lg font-bold text-gray-800">name</h2> */}
          {/* <p className="text-sm text-gray-500">email</p> */}
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
      </div>
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
        >
          Logout
        </button>     
    </div>
  );
};

export default UserProfileCard;
