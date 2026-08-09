import { useEffect, useState, useCallback, useContext } from "react";
import {
  getDashboardNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../services/notificationService";
import { AuthContext } from "../context/AuthContext";

const initialState = {
  notifications: [],
  unreadCount: 0,
  criticalCount: 0,
  hasUrgent: false,
  nextUrgent: null,
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

      setData(result);
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

  const markAllAsRead = useCallback(async () => {
    if (!user?.uid) return;

    try {
      await markAllNotificationsAsRead(user.uid);

      setData((prev) => ({
        ...prev,
        notifications: prev.notifications.map((notification) => ({
          ...notification,
          isRead: true,
        })),
        unreadCount: 0,
      }));
    } catch (err) {
      console.error("Failed to mark notifications as read:", err);
    }
  }, [user?.uid]);

  const markAsRead = useCallback(async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);

      setData((prev) => {
        const notifications = prev.notifications.map((notification) =>
          notification.id === notificationId
            ? { ...notification, isRead: true }
            : notification
        );

        return {
          ...prev,
          notifications,
          unreadCount: notifications.filter((n) => !n.isRead).length,
        };
      });
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  }, []);

  return {
    ...data,
    loading,
    error,
    refreshNotifications: loadNotifications,
    markAllAsRead,
    markAsRead,
  };
};