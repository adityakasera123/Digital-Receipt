import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";

import Landing from "../pages/Landing/Landing";
import Login from "../pages/Login/Login";
import Signup from "../pages/Signup/Signup";
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword";
import Dashboard from "../pages/Dashboard/Dashboard";
import Receipts from "../pages/Receipts/Receipts";
import ReceiptDetail from "../pages/Receipts/ReceiptDetail/ReceiptDetail";
import Upload from "../pages/Upload/Upload";

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
      </Route>

      {/* Protected Application */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/receipts" element={<Receipts />} />
          <Route path="/receipts/:id" element={<ReceiptDetail />} />
          <Route path="/upload" element={<Upload />} />
      </Route>

    </Routes>
  );
}

export default AppRoutes;