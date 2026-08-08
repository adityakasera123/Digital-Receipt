import {
  getTotalSpending,
  getActiveWarranties,
  getSavedDocuments,
  getExpiringSoon,
} from "../../utils/dashboardUtils";

import {
  calculateMonthlyExpenses,
  calculateCategorySpending,
} from "../../utils/analyticsHelpers";

import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

import StatCard from "../../components/dashboard/StatCard";
import RecentReceipts from "../../components/dashboard/RecentReceipts";
import WarrantyAlerts from "../../components/dashboard/WarrantyAlerts";
import ExpenseChart from "../../components/dashboard/ExpenseChart";
import ExpenseCategories from "../../components/dashboard/ExpenseCategories";
import QuickActions from "../../components/dashboard/QuickActions";
import RecentActivity from "../../components/dashboard/RecentActivity";

import { getReceipts } from "../../services/receiptService";
import { getWarranties } from "../../services/warrantyService";



import DashboardSkeleton from "../../components/common/skeleton/DashboardSkeleton";
import {
  Receipt,
  ShieldCheck,
  IndianRupee,
  FileText,
} from "lucide-react";

function Dashboard() {
  const { user, loading } = useContext(AuthContext);

  const [receipts, setReceipts] = useState([]);
  const [warranties, setWarranties] = useState([]);
  const [dashboardLoading, setDashboardLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const loadDashboardData = async () => {
      try {
        setDashboardLoading(true);

        const [receiptsData, warrantiesData] = await Promise.all([
          getReceipts(user.uid),
          getWarranties(user.uid),
        ]);

        setReceipts(receiptsData);
        setWarranties(warrantiesData);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setDashboardLoading(false);
      }
    };

    loadDashboardData();
  }, [user]);

  if (loading || dashboardLoading) {
    return <DashboardSkeleton />;
  }

  const totalSpending = getTotalSpending(receipts);
  const activeWarranties = getActiveWarranties(warranties);
  const savedDocuments = getSavedDocuments(receipts);
  const expiringSoon = getExpiringSoon(warranties);

  // Real analytics data from Firebase receipts
  const monthlyExpenses = calculateMonthlyExpenses(receipts);
  const categorySpending = calculateCategorySpending(receipts);

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">
          Welcome back, {user?.displayName || "User"} 👋
        </h1>

        <p className="mt-4 max-w-2xl text-lg text-gray-500">
          Manage all your receipts, warranties and purchases from one place.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-7 md:grid-cols-2 2xl:grid-cols-4">
        <StatCard
          title="Total Receipts"
          value={receipts.length}
          subtitle="Stored receipts"
          icon={Receipt}
        />

        <StatCard
          title="Active Warranties"
          value={activeWarranties}
          subtitle={`${expiringSoon} expiring soon`}
          icon={ShieldCheck}
        />

        <StatCard
          title="Total Spending"
          value={`₹${totalSpending.toLocaleString("en-IN")}`}
          subtitle="Total purchase value"
          icon={IndianRupee}
        />

        <StatCard
          title="Saved Documents"
          value={savedDocuments}
          subtitle="Securely stored"
          icon={FileText}
        />
      </div>

      {/* Recent Receipts + Warranty Alerts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentReceipts receipts={receipts} />
        </div>

        <WarrantyAlerts warranties={warranties} />
      </div>

      {/* Analytics Section */}
      <div className="mt-8">
        <ExpenseChart data={monthlyExpenses} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ExpenseCategories categories={categorySpending} />

        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <QuickActions />
        </div>

   <RecentActivity receipts={receipts} />
      </div>
    </div>
  );
}

export default Dashboard;