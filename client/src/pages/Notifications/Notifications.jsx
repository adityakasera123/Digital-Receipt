import { useState } from "react";
import { Bell, ShieldAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useWarrantyNotifications } from "../../hooks/useWarrantyNotifications";

function Notifications() {
  const navigate = useNavigate();

  const { notifications, unreadCount } = useWarrantyNotifications();

  // Temporary shared demo notification
  const displayNotifications =
    notifications.length > 0
      ? notifications
      : [
          {
            id: "demo-1",
            warrantyId: "demo-1",
            productName: "MacBook Air M2",
            storeName: "Apple Store",
            title: "Warranty expires in 7 days",
            formattedExpiryDate: "15 Aug 2026",
            priority: "high",
          },
        ];

  // Filter state
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredNotifications = displayNotifications.filter(
    (notification) => {
      if (activeFilter === "all") return true;
      return notification.priority === activeFilter;
    }
  );

  const getPriorityStyles = (priority) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-600";
      case "high":
        return "bg-orange-100 text-orange-600";
      case "medium":
        return "bg-amber-100 text-amber-600";
      default:
        return "bg-blue-100 text-blue-600";
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">
            Notifications
          </h1>

          <p className="mt-2 text-gray-500">
            Stay updated with your warranty reminders and important alerts.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-2">
          <Bell
            size={18}
            className="text-red-600"
          />

          <span className="font-semibold text-red-600">
            {notifications.length > 0 ? unreadCount : 1} unread
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-3">
        {[
          { label: "All", value: "all" },
          { label: "Critical", value: "critical" },
          { label: "High", value: "high" },
          { label: "Medium", value: "medium" },
          { label: "Low", value: "low" },
        ].map((filter) => (
          <button
            key={filter.value}
            onClick={() => setActiveFilter(filter.value)}
            className={`rounded-2xl px-5 py-2.5 text-sm font-medium transition ${
              activeFilter === filter.value
                ? "bg-black text-white"
                : "border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Notification List */}
      {filteredNotifications.length === 0 ? (
        <div className="rounded-3xl border border-gray-200 bg-white p-16 text-center shadow-sm">
          <Bell
            className="mx-auto mb-4 text-gray-300"
            size={48}
          />

          <h3 className="text-xl font-semibold text-gray-900">
            No notifications
          </h3>

          <p className="mt-2 text-gray-500">
            No {activeFilter === "all" ? "" : activeFilter + " "}
            notifications available right now.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNotifications.map((notification) => (
            <button
              key={notification.id}
              onClick={() => {
                if (notification.warrantyId !== "demo-1") {
                  navigate(`/warranty/${notification.warrantyId}`);
                }
              }}
              className="flex w-full items-start gap-4 rounded-3xl border border-gray-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100">
                <ShieldAlert
                  size={22}
                  className="text-orange-600"
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {notification.productName}
                  </h3>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${getPriorityStyles(
                      notification.priority
                    )}`}
                  >
                    {notification.priority.charAt(0).toUpperCase() +
                      notification.priority.slice(1)}
                  </span>
                </div>

                <p className="mt-1 font-medium text-orange-600">
                  {notification.title}
                </p>

                <p className="mt-2 text-sm text-gray-600">
                  Your warranty purchased from{" "}
                  <span className="font-medium text-gray-900">
                    {notification.storeName}
                  </span>{" "}
                  is expiring soon.
                </p>

                <p className="mt-3 text-sm text-gray-500">
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