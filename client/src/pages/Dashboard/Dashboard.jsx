import {
getTotalSpending,
getActiveWarranties,
getSavedDocuments,
getExpiringSoon,
} from '../../utils/dashboardUtils';

import {
calculateMonthlyExpenses,
calculateCategorySpending,
} from '../../utils/analyticsHelpers';

import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AuthContext } from '../../context/AuthContext';

import StatCard from '../../components/dashboard/StatCard';
import RecentReceipts from '../../components/dashboard/RecentReceipts';
import WarrantyAlerts from '../../components/dashboard/WarrantyAlerts';
import ExpenseChart from '../../components/dashboard/ExpenseChart';
import ExpenseCategories from '../../components/dashboard/ExpenseCategories';
import QuickActions from '../../components/dashboard/QuickActions';
import RecentActivity from '../../components/dashboard/RecentActivity';
import UrgentReminderModal from '../../components/dashboard/UrgentReminderModal';

import { useWarrantyNotifications } from '../../hooks/useWarrantyNotifications';

import { getReceipts } from '../../services/receiptService';
import { getWarranties } from '../../services/warrantyService';
import {
shouldShowPopup,
markPopupShown,
} from '../../services/notificationService';

import DashboardSkeleton from '../../components/common/skeleton/DashboardSkeleton';
import {
Receipt,
ShieldCheck,
IndianRupee,
FileText,
} from 'lucide-react';

function Dashboard() {
const { user, loading } = useContext(AuthContext);
const navigate = useNavigate();

const [receipts, setReceipts] = useState([]);
const [warranties, setWarranties] = useState([]);
const [dashboardLoading, setDashboardLoading] = useState(true);

// Billvora notifications
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
    console.error('Failed to load dashboard data:', error);
  } finally {
    setDashboardLoading(false);
  }
};

loadDashboardData();


}, [user]);

// Show popup only when eligible
useEffect(() => {
const checkPopup = async () => {
if (!popupNotification?.id) return;


  try {
    const canShow = await shouldShowPopup(popupNotification.id);

    if (canShow) {
      setShowReminderModal(true);
    }
  } catch (error) {
    console.error('Popup frequency check failed:', error);
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

const monthlyExpenses = calculateMonthlyExpenses(receipts);
const categorySpending = calculateCategorySpending(receipts);

return (
<>
{/* Header */} <div> <h1 className='text-4xl font-bold text-gray-900'>
Welcome back, {user?.displayName || 'User'} 👋 </h1>


    <p className='mt-4 max-w-2xl text-lg text-secondary'>
      Manage all your receipts, warranties and purchases from one place.
    </p>
  </div>

  {/* Stats */}
  <div className='grid grid-cols-1 gap-7 md:grid-cols-2 2xl:grid-cols-4'>
    <StatCard
      title='Total Receipts'
      value={receipts.length}
      subtitle='Stored receipts'
      icon={Receipt}
    />

    <StatCard
      title='Active Warranties'
      value={activeWarranties}
      subtitle={`${expiringSoon} expiring soon`}
      icon={ShieldCheck}
    />

    <StatCard
      title='Total Spending'
      value={`₹${totalSpending.toLocaleString('en-IN')}`}
      subtitle='Total purchase value'
      icon={IndianRupee}
    />

    <StatCard
      title='Saved Documents'
      value={savedDocuments}
      subtitle='Securely stored'
      icon={FileText}
    />
  </div>

  {/* Recent Receipts + Warranty Alerts */}
  <div className='mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3'>
    <div className='lg:col-span-2'>
      <RecentReceipts receipts={receipts} />
    </div>

    <WarrantyAlerts warranties={warranties} />
  </div>

  {/* Analytics Section */}
  <div className='mt-8'>
    <ExpenseChart data={monthlyExpenses} />
  </div>

  <div className='mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2'>
    <ExpenseCategories categories={categorySpending} />

    <div className='card-surface transition-theme p-6'>
      <QuickActions />
    </div>

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
    await snooze(popupNotification.id, 1); // 1 = 1 day (24 hours)
    await markPopupShown(popupNotification.id);
  }
}}
    onViewWarranty={async () => {
      setShowReminderModal(false);

      if (popupNotification?.id) {
        await markPopupShown(popupNotification.id);
      }

      navigate(`/warranty/${popupNotification?.warrantyId}`, {
        state: { from: '/dashboard' },
      });
    }}
  />
</>

);
}

export default Dashboard;
