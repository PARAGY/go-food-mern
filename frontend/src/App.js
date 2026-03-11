import "./App.css";
import Home from "./screens/Home";
import Login from "./screens/Login";
import Signup from "./screens/Signup";
import MyOrder from "./screens/MyOrder";
import Cart from "./screens/Cart";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AdminDashboard from "./screens/AdminDashboard";
import NutritionDashboard from "./screens/NutritionDashboard";
import AIChatbot from "./components/AIChatbot";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/signup" element={<Signup />} />
        <Route exact path="/myorder" element={<MyOrder />} />
        <Route exact path="/nutrition" element={<NutritionDashboard />} />
        <Route exact path="/cart" element={<Cart />} />
        <Route exact path="/admin" element={<AdminDashboard />} />
        <Route exact path="/createuser" element={<Signup />} />
      </Routes>
      <AIChatbot />
    </Router>
  );
}

export default App;
