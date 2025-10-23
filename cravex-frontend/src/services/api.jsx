// src/services/api.js
import axios from "axios";

// Use environment variable to determine base URL
const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

// const api = axios.create({
//   baseURL: BASE_URL,
//   headers: { "Content-Type": "application/json" },
// });

const api = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:5000"
      : "https://your-backend.vercel.app",  // replace with your deployed backend URL
  headers: { "Content-Type": "application/json" },
});


// Function to set Authorization token
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

export default api;
