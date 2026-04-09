/**
 * Navbar.jsx
 * Top navigation bar shown on all authenticated regular pages.
 *
 * Features:
 * - Smart Campus logo & branding
 * - Navigation links (conditional by role)
 * - Notification bell with unread badge
 * - User avatar + name + role badge
 * - Logout button
 * - Admin badge linking to /admin/dashboard for ADMIN users
 *
 * Member 4 - Navbar Component
 */

import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import NotificationBell from './NotificationBell';

const ROLE_COLORS = {
  ADMIN: '#ef4444',
  TECHNICIAN: '#f59e0b',
  USER: '#10b981',
};

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      {/* Brand */}
      <Link to="/dashboard" className="navbar__brand">
        <span className="navbar__brand-icon">🏛️</span>
        <span className="navbar__brand-name">Smart Campus</span>
      </Link>

      {/* Navigation links */}
      <div className="navbar__links">
        <Link
          to="/dashboard"
          className={`navbar__link ${isActive('/dashboard') ? 'navbar__link--active' : ''}`}
        >
          Dashboard
        </Link>
        <Link
          to="/notifications"
          className={`navbar__link ${isActive('/notifications') ? 'navbar__link--active' : ''}`}
        >
          Notifications
        </Link>
        {isAdmin && (
          <Link
            to="/admin/dashboard"
            className="navbar__link navbar__link--admin"
          >
            📊 Admin Panel
          </Link>
        )}
      </div>

      {/* Right side: bell + user info */}
      <div className="navbar__right">
        <NotificationBell />

        <div className="navbar__user">
          <img
            src={user.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=fff`}
            alt={user.name}
            className="navbar__avatar"
          />
          <div className="navbar__user-info">
            <span className="navbar__user-name">{user.name.split(' ')[0]}</span>
            <span
              className="navbar__role-badge"
              style={{ backgroundColor: ROLE_COLORS[user.role] }}
            >
              {user.role}
            </span>
          </div>
        </div>

        <button id="logout-btn" className="navbar__logout" onClick={logout} title="Logout">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </button>
      </div>
    </nav>
  );
}
