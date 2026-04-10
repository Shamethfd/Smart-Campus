/**
 * NotificationPanel.jsx
 * Dropdown panel showing recent notifications in the navbar.
 * 
 * Features:
 * - Shows last ~8 notifications
 * - Mark as read on click
 * - Delete individual notifications
 * - Mark all as read button
 * - Link to full notifications page
 * - Empty state illustration
 * 
 * Member 4 - Notification UI
 */

import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useNotifications } from '../hooks/useNotifications';
import { formatDistanceToNow } from '../utils/dateUtils';
import Button from './ui/Button';

// Notification type → emoji icon map
const TYPE_ICONS = {
  BOOKING: '🗓️',
  TICKET:  '🎫',
  COMMENT: '💬',
  SYSTEM:  '🔔',
};

export default function NotificationPanel({ onClose }) {
  const { notifications, loading, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
  const panelRef = useRef(null);

  // Close panel when clicking outside
  useEffect(() => {
    const handle = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [onClose]);

  const recent = notifications.slice(0, 8);

  return (
    <div
      className="absolute right-0 top-12 w-[22rem] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl"
      ref={panelRef}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3">
        <h3 className="text-sm font-extrabold text-slate-900">Notifications</h3>
        {notifications.some((n) => !n.isRead) && (
          <Button variant="ghost" size="sm" onClick={markAllAsRead} className="h-8 px-2">
            Mark all read
          </Button>
        )}
      </div>

      {/* Notification list */}
      <div className="max-h-[70vh] overflow-auto">
        {loading && <p className="p-6 text-center text-sm text-slate-500">Loading…</p>}

        {!loading && recent.length === 0 && (
          <div className="p-8 text-center text-slate-600">
            <div className="text-3xl">🔕</div>
            <p className="mt-2 text-sm font-semibold">No notifications yet</p>
          </div>
        )}

        {!loading &&
          recent.map((n) => (
            <div
              key={n.id}
              className={[
                'flex gap-3 border-b border-slate-100 px-4 py-3 transition',
                !n.isRead ? 'bg-blue-50/50' : 'bg-white',
              ].join(' ')}
            >
              <span className="pt-0.5 text-lg">{TYPE_ICONS[n.type] || '🔔'}</span>

              <div
                className="min-w-0 flex-1"
                onClick={() => !n.isRead && markAsRead(n.id)}
                role={!n.isRead ? 'button' : undefined}
                tabIndex={!n.isRead ? 0 : -1}
                onKeyDown={(e) => {
                  if (!n.isRead && (e.key === 'Enter' || e.key === ' ')) markAsRead(n.id);
                }}
              >
                <p className="truncate text-sm font-bold text-slate-900">{n.title}</p>
                <p className="mt-0.5 text-sm text-slate-600">{n.message}</p>
                <span className="mt-1 block text-xs text-slate-400">
                  {formatDistanceToNow(n.createdAt)}
                </span>
              </div>

              <button
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-700"
                onClick={(e) => { e.stopPropagation(); deleteNotification(n.id); }}
                title="Delete"
              >
                ×
              </button>
            </div>
          ))}
      </div>

      {/* Footer */}
      <div className="border-t border-slate-200 bg-slate-50 px-4 py-3 text-center">
        <Link
          to="/notifications"
          className="text-sm font-semibold text-blue-700 hover:underline"
          onClick={onClose}
        >
          View all notifications →
        </Link>
      </div>
    </div>
  );
}
