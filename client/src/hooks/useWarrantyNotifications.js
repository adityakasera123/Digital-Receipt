import { useEffect, useState, useCallback, useContext } from "react";
import {
  getDashboardNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  snoozeNotification,
} from "../services/notificationService";
import { AuthContext } from "../context/AuthContext";

const initialState = {
  notifications: [],
  unreadCount: 0,
  criticalCount: 0,
  hasUrgent: false,
  nextUrgent: null,
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

      const popupNotification = result.nextUrgent || null;

      setData({
        ...result,
        popupNotification,
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

  useEffect(() => {
    const handleNotificationsUpdated = () => {
      loadNotifications();
    };

    window.addEventListener(
      "notifications-updated",
      handleNotificationsUpdated
    );

    return () => {
      window.removeEventListener(
        "notifications-updated",
        handleNotificationsUpdated
      );
    };
  }, [loadNotifications]);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        loadNotifications();
      }
    };

    const handleFocus = () => {
      loadNotifications();
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener(
      "visibilitychange",
      handleVisibility
    );

    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener(
        "visibilitychange",
        handleVisibility
      );
    };
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
        criticalCount: 0,
        hasUrgent: false,
        nextUrgent: null,
        popupNotification: null,
      }));

      window.dispatchEvent(new Event("notifications-updated"));
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

        const unreadCount = notifications.filter((n) => !n.isRead).length;

        const nextUrgent =
          notifications.find(
            (n) =>
              !n.isRead &&
              (
                n.priority === "critical" ||
                n.priority === "high" ||
                n.priority === "medium"
              )
          ) || null;

        return {
          ...prev,
          notifications,
          unreadCount,
          criticalCount: notifications.filter(
            (n) => !n.isRead && n.priority === "critical"
          ).length,
          hasUrgent: !!nextUrgent,
          nextUrgent,
          popupNotification: nextUrgent,
        };
      });

      window.dispatchEvent(new Event("notifications-updated"));
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  }, []);

  // TEST MODE: minutes instead of days
  const snooze = useCallback(async (notificationId, minutes) => {
    try {
      await snoozeNotification(notificationId, minutes);

      setData((prev) => {
        const updatedNotifications = prev.notifications.filter(
          (notification) => notification.id !== notificationId
        );

        const nextUrgent =
          updatedNotifications.find(
            (n) =>
              !n.isRead &&
              (
                n.priority === "critical" ||
                n.priority === "high" ||
                n.priority === "medium"
              )
          ) || null;

        return {
          ...prev,
          notifications: updatedNotifications,
          unreadCount: updatedNotifications.filter((n) => !n.isRead).length,
          criticalCount: updatedNotifications.filter(
            (n) => !n.isRead && n.priority === "critical"
          ).length,
          hasUrgent: !!nextUrgent,
          nextUrgent,
          popupNotification: nextUrgent,
        };
      });

      window.dispatchEvent(new Event("notifications-updated"));
    } catch (err) {
      console.error("Failed to snooze notification:", err);
    }
  }, []);

  return {
    ...data,
    loading,
    error,
    refreshNotifications: loadNotifications,
    markAllAsRead,
    markAsRead,
    snooze,
  };
};