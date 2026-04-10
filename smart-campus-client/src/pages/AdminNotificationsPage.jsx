/**
 * AdminNotificationsPage.jsx
 * Admin view of ALL campus notifications.
 *
 * Layout: Sidebar (left) + content (right)
 *
 * Features:
 *   - Table of all notifications with type, title, message, time, read-status
 *   - Filter tabs: All / Unread / By type (BOOKING, TICKET, COMMENT, SYSTEM)
 *   - Sort: Newest / Oldest
 *   - Mark individual notification as read
 *   - Delete individual notification
 *   - Loading skeletons & empty state
 *   - Result count summary
 *
 * APIs:
 *   GET    /api/notifications         → adminGetAllNotifications()
 *   PATCH  /api/notifications/{id}/read → adminMarkNotifRead()
 *   DELETE /api/notifications/{id}    → adminDeleteNotif()
 *
 * Member 4 – Admin Notifications Page
 */

import { useState, useEffect, useMemo } from 'react';
import Sidebar from '../components/Sidebar';
import {
  adminGetAllNotifications,
  adminMarkNotifRead,
  adminDeleteNotif,
} from '../services/adminApi';
import { formatDistanceToNow } from '../utils/dateUtils';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button';
import Card, { CardBody } from '../components/ui/Card';
import Badge from '../components/ui/Badge';

/* ── constants ────────────────────────────────────────── */
const TYPE_ICON  = { BOOKING: '🗓️', TICKET: '🎫', COMMENT: '💬', SYSTEM: '🔔' };
const TYPE_COLOR = {
  BOOKING: { accent: '#6366f1', bg: '#eef2ff' },
  TICKET:  { accent: '#f59e0b', bg: '#fffbeb' },
  COMMENT: { accent: '#10b981', bg: '#f0fdf4' },
  SYSTEM:  { accent: '#64748b', bg: '#f8fafc' },
};

const FILTERS     = ['ALL', 'UNREAD', 'BOOKING', 'TICKET', 'COMMENT', 'SYSTEM'];
const SORT_OPTIONS = [
  { value: 'newest', label: '↓ Newest first' },
  { value: 'oldest', label: '↑ Oldest first' },
];

/* ── component ────────────────────────────────────────── */
export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [activeFilter,  setActiveFilter]  = useState('ALL');
  const [sortOrder,     setSortOrder]     = useState('newest');

  /* Fetch on mount */
  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await adminGetAllNotifications();
      if (res.success) setNotifications(res.data);
    } catch {
      toast.error('Failed to load notifications.');
    } finally {
      setLoading(false);
    }
  };

  /* Mark as read */
  const handleMarkRead = async (id) => {
    try {
      await adminMarkNotifRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      toast.success('Marked as read.');
    } catch {
      toast.error('Failed to mark as read.');
    }
  };

  /* Delete */
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this notification?')) return;
    try {
      await adminDeleteNotif(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      toast.success('Notification deleted.');
    } catch {
      toast.error('Failed to delete notification.');
    }
  };

  /* Derived list */
  const filtered = useMemo(() => {
    let list = notifications;
    if (activeFilter === 'UNREAD')     list = list.filter((n) => !n.isRead);
    else if (activeFilter !== 'ALL')   list = list.filter((n) => n.type === activeFilter);
    return sortOrder === 'newest'
      ? [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      : [...list].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }, [notifications, activeFilter, sortOrder]);

  const unreadTotal = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="flex min-h-dvh bg-slate-50">
      <Sidebar />

      <main className="min-w-0 flex-1 p-4 sm:p-8">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="flex flex-wrap items-center gap-3 text-2xl font-extrabold tracking-tight text-slate-900">
              🔔 Notifications
              {unreadTotal > 0 && (
                <Badge variant="danger" id="notif-unread-total">
                  {unreadTotal} unread
                </Badge>
              )}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Showing all campus notifications — {notifications.length} total
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <select
              id="notif-sort"
              className="h-10 rounded-xl border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              aria-label="Sort notifications"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <Button variant="outline" onClick={fetchNotifications} title="Refresh">
              🔄 Refresh
            </Button>
          </div>
        </header>

        <div className="mt-5 flex gap-2 overflow-auto pb-1" role="tablist">
          {FILTERS.map((f) => {
            const label =
              f === 'UNREAD'
                ? `Unread${unreadTotal > 0 ? ` (${unreadTotal})` : ''}`
                : f.charAt(0) + f.slice(1).toLowerCase();
            const active = activeFilter === f;
            return (
              <button
                key={f}
                id={`tab-${f.toLowerCase()}`}
                role="tab"
                aria-selected={active}
                className={[
                  'shrink-0 rounded-full border px-4 py-2 text-sm font-bold transition',
                  active
                    ? 'border-slate-900 bg-slate-900 text-white'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                ].join(' ')}
                onClick={() => setActiveFilter(f)}
              >
                {TYPE_ICON[f] ? `${TYPE_ICON[f]} ` : ''}
                {label}
              </button>
            );
          })}
        </div>

        {!loading && (
          <p className="mt-3 text-sm text-slate-500">
            Showing <span className="font-extrabold text-slate-900">{filtered.length}</span>{' '}
            notification{filtered.length !== 1 ? 's' : ''}
          </p>
        )}

        {loading && (
          <div className="mt-5 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-20 animate-pulse rounded-2xl border border-slate-200 bg-slate-100" />
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <Card className="mt-5">
            <CardBody className="py-12 text-center">
              <div className="text-3xl">🔕</div>
              <h3 className="mt-2 text-base font-extrabold text-slate-900">No notifications found</h3>
              <p className="mt-1 text-sm text-slate-600">
                {activeFilter === 'UNREAD'
                  ? 'All notifications have been read.'
                  : `No ${activeFilter === 'ALL' ? '' : activeFilter.toLowerCase() + ' '}notifications yet.`}
              </p>
            </CardBody>
          </Card>
        )}

        {!loading && filtered.length > 0 && (
          <div className="mt-5 overflow-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="min-w-[920px] w-full text-left text-sm" aria-label="Notifications table">
              <thead className="bg-slate-50 text-[11px] font-extrabold uppercase tracking-widest text-slate-500">
                <tr>
                  <th className="px-4 py-4">Type</th>
                  <th className="px-4 py-4">Title</th>
                  <th className="px-4 py-4">Message</th>
                  <th className="px-4 py-4">Time</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((n) => {
                  const colors = TYPE_COLOR[n.type] || TYPE_COLOR.SYSTEM;
                  return (
                    <tr
                      key={n.id}
                      id={`notif-row-${n.id}`}
                      className={!n.isRead ? 'bg-amber-50/40' : 'hover:bg-slate-50'}
                    >
                      <td className="px-4 py-4">
                        <span
                          className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-extrabold tracking-wider"
                          style={{ background: colors.bg, color: colors.accent }}
                        >
                          {TYPE_ICON[n.type] || '🔔'} {n.type}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-extrabold text-slate-900">{n.title}</p>
                      </td>
                      <td className="px-4 py-4 text-slate-600">{n.message}</td>
                      <td className="px-4 py-4 text-slate-500">{formatDistanceToNow(n.createdAt)}</td>
                      <td className="px-4 py-4">
                        <Badge variant={n.isRead ? 'success' : 'warning'}>
                          {n.isRead ? '✓ Read' : '● Unread'}
                        </Badge>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-2">
                          {!n.isRead && (
                            <Button
                              id={`mark-read-${n.id}`}
                              variant="outline"
                              size="sm"
                              onClick={() => handleMarkRead(n.id)}
                              title="Mark as read"
                              className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                            >
                              ✓ Read
                            </Button>
                          )}
                          <Button
                            id={`delete-${n.id}`}
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(n.id)}
                            title="Delete"
                            className="border-red-300 text-red-700 hover:bg-red-50"
                          >
                            🗑️ Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <footer className="mt-10 text-center text-xs font-semibold text-slate-400">
          Smart Campus Admin Panel · Notification Centre
        </footer>
      </main>
    </div>
  );
}
