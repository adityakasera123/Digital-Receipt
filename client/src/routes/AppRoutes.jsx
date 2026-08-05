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
import EditReceipt from "../pages/EditReceipt/EditReceipt";

import Upload from "../pages/Upload/Upload";

import Warranty from "../pages/Warranty/Warranty";
import WarrantyDetail from "../pages/WarrantyDetail/WarrantyDetail";
import EditWarranty from "../pages/EditWarranty/EditWarranty";

import Search from "../pages/Search/Search";
import Analytics from "../pages/Analytics/Analytics";

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

      {/* Protected Dashboard */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Receipt */}
        <Route path="/receipts" element={<Receipts />} />
        <Route path="/receipts/:id" element={<ReceiptDetail />} />
        <Route path="/receipts/edit/:id" element={<EditReceipt />} />

        {/* Upload */}
        <Route path="/upload" element={<Upload />} />

        {/* Warranty */}
        <Route path="/warranty" element={<Warranty />} />
        <Route path="/warranty/:id" element={<WarrantyDetail />} />
        <Route path="/warranty/edit/:id" element={<EditWarranty />} />

        {/* Search */}
        <Route path="/search" element={<Search />} />

          {/* Analytics */}
<Route path="/analytics" element={<Analytics />} />

      </Route>
    </Routes>
  );
}

export default AppRoutes;