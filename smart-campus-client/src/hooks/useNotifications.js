/**
 * useNotifications.js
 * Custom hook for all notification state and operations.
 * 
 * Manages: list of notifications, unread count, loading state, and actions.
 * 
 * Member 4 - Notifications Hook
 */

import { useState, useEffect, useCallback } from 'react';
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead as apiMarkAllAsRead,
  deleteNotification as apiDelete,
} from '../services/notificationApi';
import { useAuth } from './useAuth';
import toast from 'react-hot-toast';

export function useNotifications() {
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  /** Fetch all notifications and unread count */
  const fetchNotifications = useCallback(async ({ silent = false } = {}) => {
    if (!isAuthenticated) return;

    const showLoading = !silent && !hasLoadedOnce;
    if (showLoading) {
      setLoading(true);
    }

    try {
      const [notifRes, countRes] = await Promise.all([
        getNotifications(),
        getUnreadCount(),
      ]);
      if (notifRes.success) setNotifications(notifRes.data);
      if (countRes.success) setUnreadCount(countRes.data.count);
      setHasLoadedOnce(true);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  }, [hasLoadedOnce, isAuthenticated]);

  // Auto-fetch on mount and keep the badge/list fresh with short polling.
  useEffect(() => {
    if (!isAuthenticated) {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
      setHasLoadedOnce(false);
      return undefined;
    }

    let active = true;

    const refresh = (options) => {
      if (!active) return;
      fetchNotifications(options);
    };

    refresh();

    // Short interval so booking/ticket notifications feel close to real time without WebSockets.
    const interval = setInterval(() => refresh({ silent: true }), 5000);
    const handleFocus = () => refresh({ silent: true });
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refresh({ silent: true });
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      active = false;
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchNotifications]);

  /** Mark a single notification as read */
  const handleMarkAsRead = useCallback(async (id) => {
    try {
      await markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      toast.error('Failed to mark notification as read.');
    }
  }, []);

  /** Mark all notifications as read */
  const handleMarkAllAsRead = useCallback(async () => {
    try {
      await apiMarkAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success('All notifications marked as read.');
    } catch (err) {
      toast.error('Failed to mark all as read.');
    }
  }, []);

  /** Delete a notification */
  const handleDelete = useCallback(async (id) => {
    try {
      const notif = notifications.find((n) => n.id === id);
      await apiDelete(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      if (notif && !notif.isRead) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
      toast.success('Notification deleted.');
    } catch (err) {
      toast.error('Failed to delete notification.');
    }
  }, [notifications]);

  return {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAsRead: handleMarkAsRead,
    markAllAsRead: handleMarkAllAsRead,
    deleteNotification: handleDelete,
  };
}
