import { useState, useRef, useEffect } from "react";
import { Bell, ShieldAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useWarrantyNotifications } from "../../hooks/useWarrantyNotifications";

function NotificationBell() {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const [open, setOpen] = useState(false);

  const { notifications, unreadCount } = useWarrantyNotifications();

  // Temporary development fallback
  const demoNotifications =
    notifications.length > 0
      ? notifications
      : [
          {
            id: "demo-1",
            warrantyId: "demo-1",
            productName: "MacBook Air M2",
            title: "Warranty expires in 7 days",
            formattedExpiryDate: "15 Aug 2026",
          },
        ];

  const displayNotifications = demoNotifications;
  const displayUnreadCount =
    notifications.length > 0 ? unreadCount : demoNotifications.length;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  return (
    <div
      className="relative"
      ref={dropdownRef}
    >
      {/* Bell Button */}
      <button
        onClick={() => setOpen(!open)}
        className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 transition hover:bg-gray-100"
      >
        <Bell size={20} />

        {displayUnreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-xs font-semibold text-white">
            {displayUnreadCount > 99 ? "99+" : displayUnreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 z-50 mt-3 w-80 rounded-2xl border border-gray-200 bg-white p-4 shadow-xl">
          {/* Header */}
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Notifications
            </h3>

            {displayUnreadCount > 0 && (
              <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-600">
                {displayUnreadCount} new
              </span>
            )}
          </div>

          {/* Empty State */}
          {displayNotifications.length === 0 ? (
            <div className="py-10 text-center">
              <ShieldAlert
                className="mx-auto mb-3 text-gray-300"
                size={32}
              />

              <p className="text-sm font-medium text-gray-900">
                No notifications
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Your warranty reminders will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {displayNotifications.slice(0, 5).map((notification) => (
                <button
                  key={notification.id}
                  onClick={() => {
                    if (
                      notification.warrantyId !== "demo-1"
                    ) {
                      navigate(
                        `/warranty/${notification.warrantyId}`
                      );
                    }
                    setOpen(false);
                  }}
                  className="flex w-full items-start gap-3 rounded-xl p-3 text-left transition hover:bg-gray-50"
                >
                  <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-lg bg-orange-100">
                    <ShieldAlert
                      size={18}
                      className="text-orange-600"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-900">
                      {notification.productName}
                    </p>

                    <p className="text-sm text-orange-600">
                      {notification.title}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {notification.formattedExpiryDate}
                    </p>
                  </div>
                </button>
              ))}

              <div className="border-t border-gray-100 pt-3">
                <button
                  onClick={() => {
                    navigate("/notifications");
                    setOpen(false);
                  }}
                  className="w-full rounded-xl py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-50"
                >
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationBell;