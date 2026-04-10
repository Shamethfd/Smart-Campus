/**
 * AdminDashboard.jsx
 * Main admin overview page — accessible by ROLE_ADMIN only.
 *
 * Layout:  Sidebar (left) + content (right) — full-width, no top Navbar
 *
 * Sections:
 *   1. Gradient welcome banner with admin avatar
 *   2. Stat cards  – Total Users · Total Notifications · Unread count
 *   3. Quick actions – links to User Mgmt & Notification Mgmt pages
 *   4. Recent Activity – latest 6 notifications in a card list
 *
 * Data:
 *   adminGetAllUsers()           → GET /api/admin/users
 *   adminGetAllNotifications()   → GET /api/notifications
 *   adminGetUnreadCount()        → GET /api/notifications/unread-count
 *
 * Member 4 – Admin Dashboard Page
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import Card, { CardBody } from '../components/ui/Card';
import {
  adminGetAllUsers,
  adminGetAllNotifications,
  adminGetUnreadCount,
} from '../services/adminApi';
import { formatDistanceToNow } from '../utils/dateUtils';

/* ── helpers ──────────────────────────────────────────── */
const TYPE_ICON  = { BOOKING: '🗓️', TICKET: '🎫', COMMENT: '💬', SYSTEM: '🔔' };
const TYPE_COLOR = { BOOKING: '#6366f1', TICKET: '#f59e0b', COMMENT: '#10b981', SYSTEM: '#64748b' };

const QUICK_ACTIONS = [
  {
    id: 'qa-users',
    to: '/admin/users',
    icon: '👥',
    label: 'User Management',
    desc: 'View users, assign & update roles',
    color: '#6366f1',
    bg: '#eef2ff',
  },
  {
    id: 'qa-notifications',
    to: '/admin/notifications',
    icon: '🔔',
    label: 'Notifications',
    desc: 'Monitor all campus notifications',
    color: '#f59e0b',
    bg: '#fffbeb',
  },
  {
    id: 'qa-bookings',
    to: '/admin/bookings',
    icon: '🗓️',
    label: 'Booking Management',
    desc: 'Review and update booking requests',
    color: '#0ea5e9',
    bg: '#e0f2fe',
  },
  {
    id: 'qa-tickets',
    to: '#',
    icon: '🎫',
    label: 'Support Tickets',
    desc: 'Coming soon',
    color: '#10b981',
    bg: '#f0fdf4',
    disabled: true,
  },
];

/* ── component ────────────────────────────────────────── */
export default function AdminDashboard() {
  const { user } = useAuth();

  const [users,        setUsers]        = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount,  setUnreadCount]  = useState(0);
  const [loading,      setLoading]      = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [uRes, nRes, cRes] = await Promise.all([
          adminGetAllUsers(),
          adminGetAllNotifications(),
          adminGetUnreadCount(),
        ]);
        if (uRes.success) setUsers(uRes.data);
        if (nRes.success) setNotifications(nRes.data);
        if (cRes.success) setUnreadCount(cRes.data?.count ?? 0);
      } catch (err) {
        console.error('Admin dashboard load error:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const recentNotifs = [...notifications]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6);

  return (
    <div className="flex min-h-dvh bg-slate-50">
      <Sidebar />

      <main className="min-w-0 flex-1 p-4 sm:p-8">
        <header className="rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-8 text-white shadow-card">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight">Admin Dashboard</h1>
              <p className="mt-2 text-white/90">
                Welcome back, <span className="font-extrabold">{user?.name?.split(' ')[0]}</span> — here's your campus overview.
              </p>
            </div>
            <img
              src={
                user?.profilePicture ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  user?.name || 'A'
                )}&background=ffffff&color=4f46e5&size=80`
              }
              alt="Admin"
              className="h-20 w-20 rounded-full border-4 border-white/20 object-cover"
            />
          </div>
        </header>

        <section className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4" aria-label="Overview statistics">
          <StatCard icon="👥" label="Total Users" value={users.length} color="#6366f1" loading={loading} />
          <StatCard icon="🔔" label="Total Notifications" value={notifications.length} color="#f59e0b" loading={loading} />
          <StatCard icon="📬" label="Unread Notifications" value={unreadCount} color="#ef4444" loading={loading} />
          <StatCard icon="🗓️" label="Room Bookings" value="—" color="#0ea5e9" />
        </section>

        <section className="mt-8">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-lg font-extrabold text-slate-900">⚡ Quick Actions</h2>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {QUICK_ACTIONS.map((action) => {
              const base = [
                'relative rounded-2xl border p-5 shadow-sm transition',
                action.disabled ? 'opacity-70' : 'hover:-translate-y-0.5 hover:shadow-md',
              ].join(' ');
              const style = { background: action.bg, borderColor: action.color + '33' };
              const content = (
                <>
                  <div className="text-2xl" style={{ color: action.color }}>
                    {action.icon}
                  </div>
                  <div className="mt-3 text-sm font-extrabold" style={{ color: action.color }}>
                    {action.label}
                  </div>
                  <div className="mt-1 text-sm text-slate-600">{action.desc}</div>
                  {action.disabled ? (
                    <span className="absolute right-4 top-4 rounded-full bg-slate-200 px-2 py-1 text-[10px] font-extrabold text-slate-600">
                      Soon
                    </span>
                  ) : (
                    <span className="absolute right-4 top-4 text-lg font-extrabold" style={{ color: action.color }}>
                      →
                    </span>
                  )}
                </>
              );

              return action.disabled ? (
                <div key={action.id} className={base} style={style}>
                  {content}
                </div>
              ) : (
                <Link key={action.id} id={action.id} to={action.to} className={base} style={style}>
                  {content}
                </Link>
              );
            })}
          </div>
        </section>

        <section className="mt-8">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-lg font-extrabold text-slate-900">🕐 Recent Activity</h2>
            <Link to="/admin/notifications" className="text-sm font-bold text-blue-700 hover:underline" id="see-all-notifs">
              View all →
            </Link>
          </div>

          {loading && (
            <div className="mt-4 space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-20 animate-pulse rounded-2xl border border-slate-200 bg-slate-100" />
              ))}
            </div>
          )}

          {!loading && recentNotifs.length === 0 && (
            <Card className="mt-4">
              <CardBody className="py-12 text-center">
                <div className="text-3xl">🔕</div>
                <h3 className="mt-2 text-base font-extrabold text-slate-900">No notifications yet</h3>
                <p className="mt-1 text-sm text-slate-600">Nothing to show — campus is quiet!</p>
              </CardBody>
            </Card>
          )}

          {!loading && recentNotifs.length > 0 && (
            <div className="mt-4 space-y-3">
              {recentNotifs.map((n) => {
                const color = TYPE_COLOR[n.type] || TYPE_COLOR.SYSTEM;
                return (
                  <div
                    key={n.id}
                    id={`activity-${n.id}`}
                    className={[
                      'relative flex items-center gap-4 rounded-2xl border p-4 shadow-sm',
                      !n.isRead ? 'border-indigo-200 bg-indigo-50' : 'border-slate-200 bg-white',
                    ].join(' ')}
                  >
                    <span
                      className="flex h-11 w-11 items-center justify-center rounded-2xl text-lg"
                      style={{ background: color + '1a', color }}
                    >
                      {TYPE_ICON[n.type] || '🔔'}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-extrabold text-slate-900">{n.title}</p>
                      <p className="truncate text-sm text-slate-600">{n.message}</p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <span
                        className="rounded-full px-2.5 py-1 text-[11px] font-extrabold tracking-wider"
                        style={{ background: color + '1a', color }}
                      >
                        {n.type}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">
                        {formatDistanceToNow(n.createdAt)}
                      </span>
                    </div>
                    {!n.isRead && (
                      <span
                        className="absolute right-4 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-indigo-600 ring-2 ring-white"
                        title="Unread"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <footer className="mt-10 text-center text-xs font-semibold text-slate-400">
            Smart Campus Admin Panel · Role: ADMIN · Auth: OAuth 2.0
          </footer>
        </section>
      </main>
    </div>
  );
}
