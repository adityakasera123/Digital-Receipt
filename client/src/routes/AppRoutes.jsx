import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";

import Landing from "../pages/Landing/Landing";
import Login from "../pages/Login/Login";
import Signup from "../pages/Signup/Signup";
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword";
import Dashboard from "../pages/Dashboard/Dashboard";
import ProtectedRoute from "../components/ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>

      {/* Public Website */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Landing />} />
      </Route>

      {/* Authentication */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
      </Route>

    </Routes>
  );
}

export default AppRoutes;