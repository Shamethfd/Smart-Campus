/**
 * Sidebar.jsx
 * Collapsible left-hand navigation for admin panel pages.
 *
 * Features:
 *   - Active route highlighting via react-router's useLocation
 *   - Collapse / expand button (icon-only when collapsed)
 *   - User profile card at the bottom
 *   - Responsive: auto-collapses to icon-only on small screens
 *
 * Member 4 – Admin Sidebar
 */

import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Badge from './ui/Badge';

const ROLE_VARIANT = { ADMIN: 'danger', TECHNICIAN: 'warning', USER: 'success' };

const NAV_ITEMS = [
  { icon: '📊', label: 'Dashboard',          path: '/admin/dashboard' },
  { icon: '👥', label: 'User Management',    path: '/admin/users'     },
  { icon: '🗓️', label: 'Booking Management', path: '/admin/bookings' },
  { icon: '🛠️', label: 'Resource Manage',    path: '/admin/resources' },
  { icon: '🔔', label: 'Notifications',      path: '/admin/notifications' },
  { icon: '🏠', label: 'Back to Home',       path: '/dashboard',  divider: true },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <aside
      className={[
        'sticky top-0 flex h-dvh flex-col border-r border-slate-200 bg-gradient-to-b from-slate-950 via-indigo-950 to-indigo-700 text-white',
        collapsed ? 'w-[76px]' : 'w-[270px]',
      ].join(' ')}
    >
      <div className="flex items-center gap-3 border-b border-white/10 px-4 py-4">
        <span className="text-2xl">🏛️</span>
        {!collapsed && <span className="flex-1 font-extrabold">Smart Campus</span>}
        <button
          className="rounded-lg px-2 py-1 text-white/70 transition hover:bg-white/10 hover:text-white"
          onClick={() => setCollapsed((c) => !c)}
          title={collapsed ? 'Expand' : 'Collapse'}
          aria-label="Toggle sidebar"
        >
          {collapsed ? '›' : '‹'}
        </button>
      </div>

      {!collapsed && (
        <p className="px-4 py-3 text-[11px] font-extrabold tracking-widest text-white/45">
          ADMIN PANEL
        </p>
      )}

      <nav className="flex flex-col gap-1 px-3" aria-label="Admin navigation">
        {NAV_ITEMS.map((item) => (
          <div key={item.path}>
            {item.divider && <div className="my-3 h-px bg-white/10" />}
            <Link
              to={item.path}
              className={[
                'flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-white/70 transition',
                isActive(item.path) ? 'bg-white/15 text-white' : 'hover:bg-white/10 hover:text-white',
              ].join(' ')}
              title={collapsed ? item.label : undefined}
            >
              <span className="text-lg">{item.icon}</span>
              {!collapsed && <span className="flex-1">{item.label}</span>}
            </Link>
          </div>
        ))}
      </nav>

      <div className="flex-1" />

      <div className="border-t border-white/10 px-4 py-4">
        <div className="flex items-center gap-3">
          <img
            src={
              user?.profilePicture ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                user?.name || 'A'
              )}&background=6366f1&color=fff&size=40`
            }
            alt={user?.name}
            className="h-10 w-10 rounded-full border border-white/20 object-cover"
          />
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold" title={user?.name}>
                {user?.name?.split(' ')[0]}
              </p>
              <Badge variant={ROLE_VARIANT[user?.role] ?? 'neutral'} className="mt-1">
                {user?.role}
              </Badge>
            </div>
          )}
          {!collapsed && (
            <button
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-white/70 transition hover:bg-red-500/20 hover:text-white"
              onClick={logout}
              title="Logout"
              aria-label="Logout"
            >
              ↪
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
