import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Menu from "./components/Menu";
import Cart from "./pages/Cart";
import Order from "./pages/order";
import AdminPanel from "./pages/AdminPanel";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer"; 
import MainLoader from "./pages/MainLoader";
// import { Analytics } from "@vercel/analytics/react"

function App() {
  return (
    <div className="">
    <Router>
      <div className="scrollbar-hide">
        <div className="">
          <Routes>
            <Route path="/" element={<MainLoader><Home /></MainLoader>}/>
            <Route path="/login" element={<MainLoader><Login /></MainLoader>} />
            <Route path="/signup" element={<MainLoader><Signup /></MainLoader>} />
            <Route path="/menu" element={<MainLoader><Menu /></MainLoader>} />
            <Route path="/cart" element={<MainLoader><Cart /></MainLoader>} />
            <Route path="/order" element={<MainLoader><Order /></MainLoader>} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </div>  
      </div>
    </Router>
    {/* <Analytics /> */}
    </div>
  );
}

export default App;



