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

const ROLE_COLORS = { ADMIN: '#ef4444', TECHNICIAN: '#f59e0b', USER: '#10b981' };

const NAV_ITEMS = [
  { icon: '📊', label: 'Dashboard',          path: '/admin/dashboard' },
  { icon: '👥', label: 'User Management',    path: '/admin/users'     },
  { icon: '🗓️', label: 'Booking Management', path: '/admin/bookings' },
  { icon: '🔔', label: 'Notifications',      path: '/admin/notifications' },
  { icon: '🏠', label: 'Back to Home',       path: '/dashboard',  divider: true },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <aside className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''}`}>

      {/* ── Brand header ──────────────────── */}
      <div className="sidebar__brand">
        <span className="sidebar__brand-icon">🏛️</span>
        {!collapsed && <span className="sidebar__brand-name">Smart Campus</span>}
        <button
          className="sidebar__toggle"
          onClick={() => setCollapsed((c) => !c)}
          title={collapsed ? 'Expand' : 'Collapse'}
          aria-label="Toggle sidebar"
        >
          {collapsed ? '›' : '‹'}
        </button>
      </div>

      {/* ── Admin label ───────────────────── */}
      {!collapsed && (
        <p className="sidebar__section-label">ADMIN PANEL</p>
      )}

      {/* ── Navigation links ──────────────── */}
      <nav className="sidebar__nav" aria-label="Admin navigation">
        {NAV_ITEMS.map((item) => (
          <div key={item.path}>
            {item.divider && <div className="sidebar__divider" />}
            <Link
              to={item.path}
              className={`sidebar__link ${isActive(item.path) ? 'sidebar__link--active' : ''}`}
              title={collapsed ? item.label : undefined}
            >
              <span className="sidebar__link-icon">{item.icon}</span>
              {!collapsed && <span className="sidebar__link-label">{item.label}</span>}
            </Link>
          </div>
        ))}
      </nav>

      <div style={{ flex: 1 }} />

      {/* ── User card ─────────────────────── */}
      <div className="sidebar__user">
        <img
          src={
            user?.profilePicture ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'A')}&background=6366f1&color=fff&size=40`
          }
          alt={user?.name}
          className="sidebar__user-avatar"
        />
        {!collapsed && (
          <div className="sidebar__user-info">
            <p className="sidebar__user-name" title={user?.name}>
              {user?.name?.split(' ')[0]}
            </p>
            <span
              className="sidebar__role-badge"
              style={{ background: ROLE_COLORS[user?.role] }}
            >
              {user?.role}
            </span>
          </div>
        )}
        {!collapsed && (
          <button
            className="sidebar__logout-btn"
            onClick={logout}
            title="Logout"
            aria-label="Logout"
          >
            ↪
          </button>
        )}
      </div>
    </aside>
  );
}
