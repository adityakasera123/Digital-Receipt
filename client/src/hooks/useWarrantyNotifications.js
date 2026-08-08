import { useEffect, useState, useCallback, useContext } from "react";
import { getDashboardNotifications } from "../services/notificationService";
import { AuthContext } from "../context/AuthContext";

import {
  getReadNotifications,
  markAllNotificationsAsRead,
} from "../utils/notificationStorage";

const initialState = {
  notifications: [],
  unreadCount: 0,
  urgentCount: 0,
  expiringToday: 0,
  expiringTomorrow: 0,
  expiringThisWeek: 0,
  popupNotification: null,
};

export const useWarrantyNotifications = () => {
  const { user } = useContext(AuthContext);

  const [data, setData] = useState(initialState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadNotifications = useCallback(async () => {
    if (!user?.uid) {
      setData(initialState);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const result = await getDashboardNotifications(user.uid);

      // Calculate unread count from localStorage
      const readIds = getReadNotifications();

      const unreadCount = result.notifications.filter(
        (notification) => !readIds.includes(notification.id)
      ).length;

      setData({
        ...result,
        unreadCount,
      });
    } catch (err) {
      console.error("Failed to load warranty notifications:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const markAllAsRead = useCallback(() => {
    markAllNotificationsAsRead(data.notifications);

    setData((prev) => ({
      ...prev,
      unreadCount: 0,
    }));
  }, [data.notifications]);

  return {
    ...data,
    loading,
    error,
    refreshNotifications: loadNotifications,
    markAllAsRead,
  };
};