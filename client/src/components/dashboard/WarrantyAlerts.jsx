import { ChevronRight, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import EmptyState from '../common/EmptyState';
import Card from '../ui/Card';
import { getWarrantyNotifications } from '../../utils/warrantyReminder';

function WarrantyAlerts({ warranties = [] }) {
  const navigate = useNavigate();

  // Billvora reminder notifications
  const notifications = getWarrantyNotifications(warranties);

  // Development fallback
  const displayNotifications =
    notifications.length > 0
      ? notifications
      : warranties.slice(0, 1).map((warranty) => ({
          id: warranty.id,
          warrantyId: warranty.id,
          productName: warranty.productName,
          formattedExpiryDate: 'Demo - 7 days left',
          title: 'Warranty expires in 7 days',
          priority: 'high',
        }));

  const getBadgeStyles = (priority) => {
    switch (priority) {
      case 'critical':
        return {
          iconBg: 'bg-red-100',
          icon: 'text-red-600',
          text: 'text-red-500',
        };

      case 'high':
        return {
          iconBg: 'bg-orange-100',
          icon: 'text-orange-600',
          text: 'text-orange-500',
        };

      case 'medium':
        return {
          iconBg: 'bg-amber-100',
          icon: 'text-amber-600',
          text: 'text-amber-500',
        };

      default:
        return {
          iconBg: 'bg-blue-100',
          icon: 'text-blue-600',
          text: 'text-blue-500',
        };
    }
  };

  return (
    <Card className='transition-theme'>
      {/* Header */}
      <div className='mb-5 flex items-center justify-between'>
        <h2 className='text-2xl font-bold text-primary'>Warranty Alerts</h2>

        <button
          onClick={() => navigate('/notifications')}
          className='flex items-center gap-1 text-sm font-medium text-primary transition hover:opacity-80'
        >
          View All
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Empty State */}
      {displayNotifications.length === 0 ? (
        <EmptyState
          icon={ShieldAlert}
          title='No Warranty Alerts'
          description='No warranties are currently expiring soon.'
        />
      ) : (
        <div className='space-y-4'>
          {displayNotifications.slice(0, 5).map((notification) => {
            const styles = getBadgeStyles(notification.priority);

            return (
              <button
                key={notification.id}
                onClick={() => navigate(`/warranty/${notification.warrantyId}`)}
                className='flex w-full items-center gap-4 rounded-2xl border border-default bg-surface p-4 text-left transition-theme hover:bg-surface-hover'
              >
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${styles.iconBg}`}
                >
                  <ShieldAlert size={20} className={styles.icon} />
                </div>

                <div className='min-w-0 flex-1'>
                  <h3 className='font-medium text-primary'>
                    {notification.productName}
                  </h3>

                  <p className={`text-sm font-medium ${styles.text}`}>
                    {notification.title}
                  </p>

                  <p className='mt-1 text-xs text-secondary'>
                    Expires on {notification.formattedExpiryDate}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </Card>
  );
}

export default WarrantyAlerts;