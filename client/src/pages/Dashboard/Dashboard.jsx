import {
getTotalSpending,
getActiveWarranties,
getSavedDocuments,
getExpiringSoon,
getActiveReturnWindows,
getEndingSoonReturns,
getExpiredReturns,
getReturnAlerts,
} from "../../utils/dashboardUtils";

import {
calculateMonthlyExpenses,
calculateCategorySpending,
} from "../../utils/analyticsHelpers";

import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../../context/AuthContext";

import StatCard from "../../components/dashboard/StatCard";
import RecentReceipts from "../../components/dashboard/RecentReceipts";
import WarrantyAlerts from "../../components/dashboard/WarrantyAlerts";
import ReturnAlerts from "../../components/dashboard/ReturnAlerts";
import ExpenseChart from "../../components/dashboard/ExpenseChart";
import ExpenseCategories from "../../components/dashboard/ExpenseCategories";
import QuickActions from "../../components/dashboard/QuickActions";
import RecentActivity from "../../components/dashboard/RecentActivity";
import UrgentReminderModal from "../../components/dashboard/UrgentReminderModal";

import { useWarrantyNotifications } from "../../hooks/useWarrantyNotifications";

import { getReceipts } from "../../services/receiptService";
import { getWarranties } from "../../services/warrantyService";
import {
shouldShowPopup,
markPopupShown,
} from "../../services/notificationService";

import DashboardSkeleton from "../../components/common/skeleton/DashboardSkeleton";
import {
Receipt,
ShieldCheck,
IndianRupee,
FileText,
RotateCcw,
} from "lucide-react";

function Dashboard() {
const { user, loading } = useContext(AuthContext);
const navigate = useNavigate();

const [receipts, setReceipts] = useState([]);
const [warranties, setWarranties] = useState([]);
const [dashboardLoading, setDashboardLoading] = useState(true);

const { popupNotification, snooze } = useWarrantyNotifications();
const [showReminderModal, setShowReminderModal] = useState(false);

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

useEffect(() => {
const checkPopup = async () => {
if (!popupNotification?.id) return;


  try {
    const canShow = await shouldShowPopup(popupNotification.id);

    if (canShow) {
      setShowReminderModal(true);
    }
  } catch (error) {
    console.error("Popup frequency check failed:", error);
  }
};

checkPopup();


}, [popupNotification]);

if (loading || dashboardLoading) {
return <DashboardSkeleton />;
}

const totalSpending = getTotalSpending(receipts);
const activeWarranties = getActiveWarranties(warranties);
const savedDocuments = getSavedDocuments(receipts);
const expiringSoon = getExpiringSoon(warranties);

const activeReturns = getActiveReturnWindows(receipts);
const endingSoonReturns = getEndingSoonReturns(receipts);
const expiredReturns = getExpiredReturns(receipts);
const returnAlerts = getReturnAlerts(receipts);

const monthlyExpenses = calculateMonthlyExpenses(receipts);
const categorySpending = calculateCategorySpending(receipts);

return (
<>
{/* Header */} <div className="mb-8"> <h1 className="text-3xl font-bold text-primary">
Welcome back, {user?.displayName || "User"} 👋 </h1>

    <p className="mt-2 text-secondary">
      Manage all your receipts, warranties and purchases from one place.
    </p>
  </div>

  {/* Stats */}
  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
    <StatCard
      title="Total Receipts"
      value={receipts.length}
      subtitle="Uploaded purchases"
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
      title="Return Windows"
      value={activeReturns}
      subtitle={`${endingSoonReturns} ending soon • ${expiredReturns} expired`}
      icon={RotateCcw}
    />
  </div>

  {/* Recent Receipts + Warranty Alerts */}
  <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
    <RecentReceipts receipts={receipts} />
    <WarrantyAlerts warranties={warranties} />
  </div>

  {/* Return Alerts */}
  <div className="mt-6">
    <ReturnAlerts receipts={returnAlerts} />
  </div>

  {/* Quick Actions */}
  <div className="mt-6">
    <div className="card-surface transition-theme p-6">
      <QuickActions />
    </div>
  </div>

  {/* Recent Activity */}
  <div className="mt-6">
    <RecentActivity receipts={receipts} />
  </div>

  {/* Urgent Reminder Modal */}
  <UrgentReminderModal
    isOpen={showReminderModal && !!popupNotification}
    notification={popupNotification}
    onClose={async () => {
      setShowReminderModal(false);

      if (popupNotification?.id) {
        await markPopupShown(popupNotification.id);
      }
    }}
    onRemindLater={async () => {
      setShowReminderModal(false);

      if (popupNotification?.id) {
        await snooze(popupNotification.id, 1);
        await markPopupShown(popupNotification.id);
      }
    }}
    onViewWarranty={async () => {
      setShowReminderModal(false);

      if (popupNotification?.id) {
        await markPopupShown(popupNotification.id);
      }

      if (popupNotification?.type === "return_window") {
        navigate(`/receipts/${popupNotification?.receiptId}`, {
          state: { from: "/dashboard" },
        });
      } else {
        navigate(`/warranty/${popupNotification?.warrantyId}`, {
          state: { from: "/dashboard" },
        });
      }
    }}
  />
</>


);
}

export default Dashboard;
