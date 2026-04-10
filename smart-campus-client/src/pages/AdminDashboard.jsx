/**
 * AdminDashboard.jsx — redesigned with Primary #094886 / Secondary #2563eb
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Sidebar from '../components/Sidebar';
import {
  adminGetAllUsers,
  adminGetAllNotifications,
  adminGetUnreadCount,
} from '../services/adminApi';
import { formatDistanceToNow } from '../utils/dateUtils';

/* ── constants ───────────────────────────────────────────── */
const TYPE_CFG = {
  BOOKING: { icon: '🗓️', color: '#2563eb', bg: '#eff6ff' },
  TICKET:  { icon: '🎫', color: '#d97706', bg: '#fffbeb' },
  COMMENT: { icon: '💬', color: '#059669', bg: '#ecfdf5' },
  SYSTEM:  { icon: '🔔', color: '#64748b', bg: '#f8fafc' },
};

const QUICK_ACTIONS = [
  {
    id: 'qa-users',
    to: '/admin/users',
    icon: '👥',
    label: 'User Management',
    desc: 'View users, assign & update roles',
    color: '#094886',
    bg: '#eff6ff',
    accent: '#2563eb',
  },
  {
    id: 'qa-notifications',
    to: '/admin/notifications',
    icon: '🔔',
    label: 'Notifications',
    desc: 'Monitor all campus notifications',
    color: '#d97706',
    bg: '#fffbeb',
    accent: '#f59e0b',
  },
  {
    id: 'qa-bookings',
    to: '/admin/bookings',
    icon: '🗓️',
    label: 'Booking Management',
    desc: 'Review and update booking requests',
    color: '#0369a1',
    bg: '#e0f2fe',
    accent: '#0ea5e9',
  },
  {
    id: 'qa-tickets',
    to: '/admin/tickets',
    icon: '🎫',
    label: 'Support Tickets View',
    desc: 'Open and review support ticket details',
    color: '#047857',
    bg: '#f0fdf4',
    accent: '#10b981',
  },
];

/* ── mini helpers ───────────────────────────────────────── */
const MiniStat = ({ icon, label, value, color, loading }) => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
         style={{ background: `${color}18` }}>
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-xs font-bold uppercase tracking-widest text-slate-400 truncate">{label}</p>
      {loading
        ? <div className="mt-1 h-7 w-10 rounded-lg bg-slate-100 animate-pulse" />
        : <p className="text-2xl font-black tabular-nums" style={{ color }}>{value}</p>}
    </div>
  </div>
);

/* ── main component ─────────────────────────────────────── */
export default function AdminDashboard() {
  const { user } = useAuth();

  const [users,         setUsers]         = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount,   setUnreadCount]   = useState(0);
  const [loading,       setLoading]       = useState(true);

  useEffect(() => {
    (async () => {
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
    })();
  }, []);

  const recentNotifs = [...notifications]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6);

  const firstName = user?.name?.split(' ')[0] || 'Admin';
  const avatarSrc = user?.profilePicture ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'A')}&background=094886&color=ffffff&size=80`;

  return (
    <div className="flex min-h-screen" style={{ background: '#f0f4fa' }}>
      <Sidebar />

      <main className="flex-1 min-w-0 flex flex-col">

        {/* ══ Hero Banner ══ */}
        <div className="relative overflow-hidden px-6 sm:px-10 py-10"
             style={{ background: 'linear-gradient(135deg,#094886 0%,#1a60b0 50%,#2563eb 100%)' }}>

          {/* decorative shapes */}
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-10 bg-white" />
          <div className="absolute top-8 right-48 w-24 h-24 rounded-full opacity-10 bg-white" />
          <div className="absolute -bottom-12 left-10 w-48 h-48 rounded-full opacity-10 bg-white" />

          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex items-center gap-5">
              {/* avatar */}
              <div className="relative flex-shrink-0">
                <img src={avatarSrc} alt="Admin"
                     className="w-20 h-20 rounded-2xl object-cover border-4"
                     style={{ borderColor: 'rgba(255,255,255,0.3)' }} />
                <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-400 border-2 border-white" />
              </div>
              <div>
                <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-1">
                  Welcome back
                </p>
                <h1 className="text-3xl font-black text-white leading-tight">
                  {firstName} <span className="wave">👋</span>
                </h1>
                <p className="text-blue-200 text-sm mt-1">
                  Here's your Smart Campus overview
                </p>
              </div>
            </div>

            {/* date badge */}
            <div className="self-start sm:self-auto px-5 py-3 rounded-2xl bg-white/15 border border-white/20 backdrop-blur-sm text-right">
              <p className="text-blue-100 text-xs font-bold uppercase tracking-widest">Today</p>
              <p className="text-white text-sm font-black mt-0.5">
                {new Date().toLocaleDateString('en-US', { weekday:'long', month:'short', day:'numeric' })}
              </p>
            </div>
          </div>

          {/* stat cards inside banner */}
          <div className="relative mt-8 grid grid-cols-2 xl:grid-cols-4 gap-3">
            <MiniStat icon="👥"  label="Total Users"          value={users.length}        color="#094886" loading={loading} />
            <MiniStat icon="🔔"  label="Total Notifications"  value={notifications.length} color="#d97706" loading={loading} />
            <MiniStat icon="📬"  label="Unread"               value={unreadCount}          color="#e11d48" loading={loading} />
            <MiniStat icon="🗓️" label="Room Bookings"         value="—"                   color="#0369a1" loading={loading} />
          </div>
        </div>

        {/* ══ Page body ══ */}
        <div className="flex-1 px-4 sm:px-8 py-8 space-y-8">

          {/* ── Quick Actions ── */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                     style={{ background: 'linear-gradient(135deg,#094886,#2563eb)' }}>
                  <span className="text-white text-sm">⚡</span>
                </div>
                <h2 className="text-base font-black" style={{ color: '#094886' }}>Quick Actions</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {QUICK_ACTIONS.map((action) => {
                const inner = (
                  <>
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl"
                           style={{ background: `${action.accent}20` }}>
                        {action.icon}
                      </div>
                      {action.disabled ? (
                        <span className="px-2 py-1 rounded-full text-[10px] font-black bg-slate-200 text-slate-500">
                          Soon
                        </span>
                      ) : (
                        <span className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-black transition-transform duration-200 group-hover:translate-x-1"
                              style={{ background: `${action.accent}20`, color: action.color }}>
                          →
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-black mb-1" style={{ color: action.color }}>{action.label}</p>
                    <p className="text-xs text-slate-500">{action.desc}</p>
                  </>
                );

                const cls = `group relative bg-white rounded-2xl border shadow-sm p-5 transition-all duration-200 ${
                  action.disabled ? 'opacity-70 cursor-default' : 'hover:-translate-y-1 hover:shadow-md cursor-pointer'
                }`;
                const style = { borderColor: `${action.accent}30` };

                return action.disabled
                  ? <div key={action.id} className={cls} style={style}>{inner}</div>
                  : <Link key={action.id} to={action.to} className={cls} style={style}>{inner}</Link>;
              })}
            </div>
          </section>

          {/* ── Recent Activity ── */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                     style={{ background: 'linear-gradient(135deg,#094886,#2563eb)' }}>
                  <span className="text-white text-sm">🕐</span>
                </div>
                <h2 className="text-base font-black" style={{ color: '#094886' }}>Recent Activity</h2>
              </div>
              <Link to="/admin/notifications"
                    className="text-xs font-black uppercase tracking-widest px-4 py-2 rounded-xl border transition-all duration-200 hover:shadow-sm"
                    style={{ color: '#2563eb', borderColor: '#bfdbfe', background: '#eff6ff' }}>
                View all →
              </Link>
            </div>

            {/* loading skeletons */}
            {loading && (
              <div className="space-y-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="h-20 animate-pulse rounded-2xl bg-white border border-slate-100" />
                ))}
              </div>
            )}

            {/* empty */}
            {!loading && recentNotifs.length === 0 && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm py-14 text-center">
                <div className="text-4xl mb-3">🔕</div>
                <p className="text-base font-black text-slate-700">No notifications yet</p>
                <p className="text-sm text-slate-400 mt-1">Campus is quiet right now!</p>
              </div>
            )}

            {/* notification list */}
            {!loading && recentNotifs.length > 0 && (
              <div className="space-y-3">
                {recentNotifs.map((n, idx) => {
                  const cfg = TYPE_CFG[n.type] || TYPE_CFG.SYSTEM;
                  return (
                    <div key={n.id}
                         className="group relative flex items-center gap-4 bg-white rounded-2xl border shadow-sm p-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                         style={!n.isRead
                           ? { borderColor: '#bfdbfe', background: '#f0f6ff' }
                           : { borderColor: '#f1f5f9' }}>

                      {/* type icon */}
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                           style={{ background: cfg.bg, color: cfg.color }}>
                        {cfg.icon}
                      </div>

                      {/* content */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-black text-slate-800 truncate">{n.title}</p>
                        <p className="text-xs text-slate-500 truncate mt-0.5">{n.message}</p>
                      </div>

                      {/* meta */}
                      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest"
                              style={{ background: cfg.bg, color: cfg.color }}>
                          {n.type}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-400">
                          {formatDistanceToNow(n.createdAt)}
                        </span>
                      </div>

                      {/* unread dot */}
                      {!n.isRead && (
                        <span className="absolute right-3 top-3 w-2.5 h-2.5 rounded-full ring-2 ring-white"
                              style={{ background: '#2563eb' }} />
                      )}

                      {/* hover left accent */}
                      <div className="absolute left-0 top-3 bottom-3 w-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                           style={{ background: 'linear-gradient(180deg,#094886,#2563eb)' }} />
                    </div>
                  );
                })}
              </div>
            )}
          </section>

        </div>
      </main>
    </div>
  );
}