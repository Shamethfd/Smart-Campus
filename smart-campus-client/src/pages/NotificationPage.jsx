/**
 * NotificationPage.jsx
 * Full-page view of all user notifications.
 * 
 * Features:
 * - Filter tabs: All / Unread / By type
 * - Mark as read on click
 * - Delete individual notifications
 * - Mark all as read button
 * - Notification type badges with colors
 * - Empty state
 * - Loading skeleton
 * 
 * Member 4 - Notification UI
 */

import { useState } from 'react';
import { useNotifications } from '../hooks/useNotifications';
import { formatDistanceToNow } from '../utils/dateUtils';
import Button from '../components/ui/Button';
import Card, { CardBody } from '../components/ui/Card';
import Badge from '../components/ui/Badge';

const TYPE_ICONS = { BOOKING: '🗓️', TICKET: '🎫', COMMENT: '💬', SYSTEM: '🔔' };
const TYPE_COLORS = {
  BOOKING: { bg: '#eef2ff', text: '#4f46e5' },
  TICKET:  { bg: '#fffbeb', text: '#d97706' },
  COMMENT: { bg: '#f0fdf4', text: '#16a34a' },
  SYSTEM:  { bg: '#f8fafc', text: '#475569' },
};

const FILTERS = ['ALL', 'UNREAD', 'BOOKING', 'TICKET', 'COMMENT', 'SYSTEM'];

export default function NotificationPage() {
  const { notifications, loading, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
  const [activeFilter, setActiveFilter] = useState('ALL');

  const filtered = notifications.filter((n) => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'UNREAD') return !n.isRead;
    return n.type === activeFilter;
  });

  const unreadTotal = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Notifications
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {unreadTotal > 0
              ? `${unreadTotal} unread notification${unreadTotal > 1 ? 's' : ''}`
              : 'All caught up!'}
          </p>
        </div>
        {unreadTotal > 0 && (
          <Button id="mark-all-read-btn" onClick={markAllAsRead}>
            ✓ Mark all as read
          </Button>
        )}
      </div>

      <div className="flex gap-2 overflow-auto pb-1" role="tablist">
        {FILTERS.map((f) => {
          const active = activeFilter === f;
          return (
            <button
              key={f}
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
              {f === 'UNREAD' && unreadTotal > 0
                ? `Unread (${unreadTotal})`
                : f.charAt(0) + f.slice(1).toLowerCase()}
            </button>
          );
        })}
      </div>

      {loading && (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-20 animate-pulse rounded-2xl border border-slate-200 bg-slate-100"
            />
          ))}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <Card>
          <CardBody className="py-12 text-center">
            <div className="text-3xl">🔕</div>
            <h3 className="mt-2 text-base font-extrabold text-slate-900">
              No notifications found
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              {activeFilter === 'UNREAD'
                ? 'You have no unread notifications.'
                : `No ${activeFilter.toLowerCase()} notifications yet.`}
            </p>
          </CardBody>
        </Card>
      )}

      {!loading && filtered.length > 0 && (
        <div className="space-y-3">
          {filtered.map((n) => {
            const colors = TYPE_COLORS[n.type] || TYPE_COLORS.SYSTEM;
            return (
              <div
                key={n.id}
                id={`notif-${n.id}`}
                className={[
                  'flex items-start gap-4 rounded-2xl border p-4 shadow-sm transition',
                  !n.isRead ? 'border-indigo-200 bg-indigo-50' : 'border-slate-200 bg-white',
                ].join(' ')}
              >
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-xl"
                  style={{ backgroundColor: colors.bg, color: colors.text }}
                >
                  {TYPE_ICONS[n.type] || '🔔'}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-extrabold text-slate-900">{n.title}</h3>
                    <span
                      className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-extrabold tracking-wider"
                      style={{ backgroundColor: colors.bg, color: colors.text }}
                    >
                      {n.type}
                    </span>
                    {!n.isRead && <Badge variant="info">Unread</Badge>}
                  </div>
                  <p className="mt-1 text-sm text-slate-600">{n.message}</p>
                  <div className="mt-2 text-xs font-semibold text-slate-400">
                    🕐 {formatDistanceToNow(n.createdAt)}
                  </div>
                </div>

                <div className="flex shrink-0 flex-col gap-2">
                  {!n.isRead && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => markAsRead(n.id)}
                      title="Mark as read"
                    >
                      ✓ Read
                    </Button>
                  )}
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => deleteNotification(n.id)}
                    title="Delete"
                  >
                    🗑️ Delete
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
