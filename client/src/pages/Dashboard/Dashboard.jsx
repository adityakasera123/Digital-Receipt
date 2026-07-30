import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

import StatCard from "../../components/dashboard/StatCard";
import RecentReceipts from "../../components/dashboard/RecentReceipts";
import WarrantyAlerts from "../../components/dashboard/WarrantyAlerts";
import ExpenseChart from "../../components/dashboard/ExpenseChart";
import ExpenseCategories from "../../components/dashboard/ExpenseCategories";
import QuickActions from "../../components/dashboard/QuickActions";
import RecentActivity from "../../components/dashboard/RecentActivity";


import {
  Receipt,
  ShieldCheck,
  IndianRupee,
  FileText,
} from "lucide-react";

function Dashboard() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-bold text-gray-900">
          Welcome back, {user?.displayName || "User"} 👋
        </h1>

        <p className="mt-4 max-w-2xl text-lg text-gray-500">
          Manage all your receipts, warranties and purchases from one place.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-7 md:grid-cols-2 2xl:grid-cols-4">

  <StatCard
    title="Total Receipts"
    value="126"
    subtitle="+12 this month"
    icon={Receipt}
  />

  <StatCard
    title="Active Warranties"
    value="18"
    subtitle="3 expiring soon"
    icon={ShieldCheck}
  />

  <StatCard
    title="Total Spending"
    value="₹24,560"
    subtitle="₹4,320 this month"
    icon={IndianRupee}
  />

  <StatCard
    title="Saved Documents"
    value="142"
    subtitle="Securely stored"
    icon={FileText}
  />

</div>
       <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
  <div className="lg:col-span-2">
    <RecentReceipts />
  </div>
   <WarrantyAlerts />

</div>
<div className="mt-8">
    <ExpenseChart />
  </div>
  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
  <ExpenseCategories />

  <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
   
<QuickActions />
  </div>
  <RecentActivity />
</div>
    </div>
  );
}

export default Dashboard;