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
import Notifications from "../pages/Notifications/Notifications";
import Settings from "../pages/Settings/Settings";

// Help Center
import HelpCenter from "../pages/HelpCenter/HelpCenter";
import HelpCategory from "../pages/HelpCenter/HelpCategory";
import HelpArticle from "../pages/HelpCenter/HelpArticle";

// Billvora 6.4 Help Pages
import FAQ from "../pages/HelpCenter/FAQ";
import ContactSupport from "../pages/HelpCenter/ContactSupport";
import ReportBug from "../pages/HelpCenter/ReportBug";
import FeatureRequest from "../pages/HelpCenter/FeatureRequest";
import PrivacyPolicy from "../pages/HelpCenter/PrivacyPolicy";
import Terms from "../pages/HelpCenter/Terms";
import AppVersion from "../pages/HelpCenter/AppVersion";

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
        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />
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

        {/* Receipts */}
        <Route path="/receipts" element={<Receipts />} />
        <Route
          path="/receipts/:id"
          element={<ReceiptDetail />}
        />
        <Route
          path="/receipts/edit/:id"
          element={<EditReceipt />}
        />

        {/* Upload */}
        <Route path="/upload" element={<Upload />} />

        {/* Warranty */}
        <Route path="/warranty" element={<Warranty />} />
        <Route
          path="/warranty/:id"
          element={<WarrantyDetail />}
        />
        <Route
          path="/warranty/edit/:id"
          element={<EditWarranty />}
        />

        {/* Search */}
        <Route path="/search" element={<Search />} />

        {/* Analytics */}
        <Route path="/analytics" element={<Analytics />} />

        {/* Notifications */}
        <Route
          path="/notifications"
          element={<Notifications />}
        />

        {/* Settings */}
        <Route path="/settings" element={<Settings />} />

        {/* Help Center */}
        <Route path="/help-center" element={<HelpCenter />} />
        <Route
          path="/help-center/:categoryId"
          element={<HelpCategory />}
        />
        <Route
          path="/help-center/:categoryId/:articleId"
          element={<HelpArticle />}
        />

        {/* Billvora 6.4 Help Pages */}
        <Route path="/help-center/faq" element={<FAQ />} />
        <Route
          path="/help-center/contact-support"
          element={<ContactSupport />}
        />
        <Route
          path="/help-center/report-bug"
          element={<ReportBug />}
        />
        <Route
          path="/help-center/feature-request"
          element={<FeatureRequest />}
        />
        <Route
          path="/help-center/privacy-policy"
          element={<PrivacyPolicy />}
        />
        <Route
          path="/help-center/terms"
          element={<Terms />}
        />
        <Route
          path="/help-center/app-version"
          element={<AppVersion />}
        />
      </Route>
    </Routes>
  );
}

export default AppRoutes;