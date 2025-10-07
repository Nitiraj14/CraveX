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
import MainLayout from "./pages/mainloader";


function App() {
  return (
    <div className="">
    <Router>
      <div className="scrollbar-hide">
        <div className="">
          <Routes>
            <Route path="/" element={<MainLayout><Home /></MainLayout>}/>
            <Route path="/login" element={<MainLayout><Login /></MainLayout>} />
            <Route path="/signup" element={<MainLayout><Signup /></MainLayout>} />
            <Route path="/menu" element={<MainLayout><Menu /></MainLayout>} />
            <Route path="/cart" element={<MainLayout><Cart /></MainLayout>} />
            <Route path="/order" element={<MainLayout><Order /></MainLayout>} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </div>  
      </div>
    </Router>
    </div>
  );
}

export default App;



