import { useState } from 'react';
import {
  Bell,
  ShieldAlert,
  CheckCheck,
  Clock3,
  MoreHorizontal,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { useWarrantyNotifications } from '../../hooks/useWarrantyNotifications';

function Notifications() {
  const navigate = useNavigate();

  const {
    notifications,
    unreadCount,
    markAllAsRead,
    markAsRead,
    snooze,
  } = useWarrantyNotifications();

  // Filter state
  const [activeFilter, setActiveFilter] = useState('all');
  const [openMenu, setOpenMenu] = useState(null);

  const filteredNotifications = notifications.filter((notification) => {
    if (activeFilter === 'all') return true;

    return notification.priority === activeFilter;
  });

  const getPriorityStyles = (priority) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-600';

      case 'high':
        return 'bg-orange-100 text-orange-600';

      case 'medium':
        return 'bg-amber-100 text-amber-600';

      default:
        return 'bg-blue-100 text-blue-600';
    }
  };

  const filters = [
    { label: 'All', value: 'all' },
    { label: 'Critical', value: 'critical' },
    { label: 'High', value: 'high' },
    { label: 'Medium', value: 'medium' },
    { label: 'Low', value: 'low' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        {/* Title */}
        <div className="min-w-0">
          <h1 className="text-4xl font-bold text-primary">
            Notifications
          </h1>

          <p className="mt-2 max-w-md text-secondary">
            Stay updated with your warranty reminders and important alerts.
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex items-center justify-between gap-3 lg:justify-end">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllAsRead}
              className="flex items-center gap-2 rounded-2xl border border-default px-4 py-2 text-sm font-medium text-primary transition-theme hover:bg-surface-hover"
            >
              <CheckCheck size={16} />
              <span className="hidden sm:inline">
                Mark all as read
              </span>
            </button>
          )}

          <div className="flex shrink-0 items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-2">
            <Bell size={18} className="text-red-600" />

            <span className="font-semibold text-red-600">
              {unreadCount} unread
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-3">
        {filters.map((filter) => (
          <button
            key={filter.value}
            type="button"
            onClick={() => setActiveFilter(filter.value)}
            className={`rounded-2xl border px-5 py-2.5 text-sm font-medium transition-theme ${
              activeFilter === filter.value
                ? 'border-transparent bg-black text-white'
                : 'border-default bg-surface text-secondary hover:bg-surface-hover'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Notification List */}
      {filteredNotifications.length === 0 ? (
        <div className="flex min-h-[280px] items-center justify-center rounded-3xl border border-default bg-surface px-6 py-12 text-center shadow-sm transition-theme">
          <div>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-surface-secondary">
              <Bell
                size={36}
                className="text-secondary"
              />
            </div>

            <h3 className="mt-5 text-xl font-semibold text-primary">
              No notifications
            </h3>

            <p className="mt-2 max-w-sm text-secondary">
              No{' '}
              {activeFilter === 'all'
                ? ''
                : `${activeFilter} `}
              notifications available right now.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNotifications.map((notification) => (
            <button
              key={notification.id}
              type="button"
              onClick={async () => {
                await markAsRead(notification.id);

                navigate(
                  `/warranty/${notification.warrantyId}`,
                  {
                    state: {
                      from: '/notifications',
                    },
                  }
                );
              }}
              className={`flex w-full items-start gap-4 rounded-3xl border border-default bg-surface p-4 text-left shadow-sm transition-theme hover:-translate-y-0.5 hover:bg-surface-hover hover:shadow-md sm:p-6 ${
                notification.isRead ? 'opacity-70' : ''
              }`}
            >
              {/* Notification Icon */}
              <div className="hidden shrink-0 sm:flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100">
                <ShieldAlert
                  size={20}
                  className="text-orange-600"
                />
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                {/* Title + Priority + Menu */}
                <div className="flex items-start justify-between gap-3">
                  <h3 className="min-w-0 text-base font-semibold text-primary sm:text-lg">
                    {notification.productName || 'Warranty'}
                  </h3>

                  <div className="flex shrink-0 items-center gap-1 sm:gap-2">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium sm:px-3 ${getPriorityStyles(
                        notification.priority
                      )}`}
                    >
                      {notification.priority
                        .charAt(0)
                        .toUpperCase() +
                        notification.priority.slice(1)}
                    </span>

                    {/* More Menu */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();

                          setOpenMenu(
                            openMenu === notification.id
                              ? null
                              : notification.id
                          );
                        }}
                        className="rounded-xl p-2 text-secondary transition-theme hover:bg-surface-hover"
                        aria-label="Notification options"
                      >
                        <MoreHorizontal size={18} />
                      </button>

                      {openMenu === notification.id && (
                        <div className="absolute right-0 top-10 z-20 w-44 rounded-2xl border border-default bg-surface p-2 shadow-xl">
                          <button
                            type="button"
                            onClick={async (e) => {
                              e.stopPropagation();

                              await snooze(
                                notification.id,
                                1
                              );

                              setOpenMenu(null);
                            }}
                            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-primary transition-theme hover:bg-surface-hover"
                          >
                            <Clock3 size={16} />
                            Remind in 24 hours
                          </button>

                          <button
                            type="button"
                            onClick={async (e) => {
                              e.stopPropagation();

                              await snooze(
                                notification.id,
                                3
                              );

                              setOpenMenu(null);
                            }}
                            className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-primary transition-theme hover:bg-surface-hover"
                          >
                            <Clock3 size={16} />
                            Remind in 3 days
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Notification Title */}
                <p className="mt-2 font-medium text-orange-600">
                  {notification.title}
                </p>

                {/* Description */}
                <p className="mt-2 text-sm text-secondary">
                  Your warranty purchased from{' '}
                  {notification.storeName || 'Store'} is
                  expiring soon.
                </p>

                {/* Expiry */}
                <p className="mt-3 text-sm text-secondary">
                  Expires on {notification.formattedExpiryDate}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default Notifications;