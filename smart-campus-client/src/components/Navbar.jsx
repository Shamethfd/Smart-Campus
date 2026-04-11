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
import Badge from './ui/Badge';

const ROLE_VARIANT = {
  ADMIN: 'danger',
  TECHNICIAN: 'warning',
  USER: 'success',
};

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4">
        <Link to="/dashboard" className="flex items-center gap-2 font-extrabold text-slate-900">
          <span className="text-xl">🏛️</span>
          <span className="hidden sm:inline">Smart Campus</span>
        </Link>

        <div className="hidden items-center gap-1 sm:flex">
          <Link
            to="/dashboard"
            className={[
              'rounded-lg px-3 py-2 text-sm font-semibold transition',
              isActive('/dashboard')
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
            ].join(' ')}
          >
            Dashboard
          </Link>
          <Link
            to="/booking"
            className={[
              'rounded-lg px-3 py-2 text-sm font-semibold transition',
              isActive('/booking')
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
            ].join(' ')}
          >
            Booking
          </Link>
          <Link
            to="/tickets"
            className={[
              'rounded-lg px-3 py-2 text-sm font-semibold transition',
              isActive('/tickets')
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
            ].join(' ')}
          >
            Support Ticket
          </Link>
          {isAdmin && (
            <Link
              to="/admin/dashboard"
              className="rounded-lg px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"
            >
              Admin Panel
            </Link>
          )}
        </div>

        <div className="flex items-center gap-3">
          <NotificationBell />

          <div className="flex items-center gap-3">
            <img
              src={
                user.profilePicture ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  user.name
                )}&background=6366f1&color=fff`
              }
              alt={user.name}
              className="h-9 w-9 rounded-full border border-slate-200 object-cover"
            />
            <div className="hidden sm:block">
              <div className="text-sm font-semibold leading-4">
                {user.name.split(' ')[0]}
              </div>
              <Badge variant={ROLE_VARIANT[user.role] ?? 'neutral'} className="mt-1">
                {user.role}
              </Badge>
            </div>
          </div>

          <button
            id="logout-btn"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-red-50 hover:text-red-700"
            onClick={logout}
            title="Logout"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              width="20"
              height="20"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
