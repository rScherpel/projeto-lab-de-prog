import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "@/pages/login/Login";
import Register from "@/pages/register/Register";
import Home from "@/pages/home/Home";
import Dashboard from "@/pages/dashBoard/Dashboard";

import ProtectedRoute from "@/components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;