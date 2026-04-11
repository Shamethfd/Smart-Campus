/**
 * DashboardPage.jsx
 * The main home page after login.
 * Shows different content for USER vs ADMIN roles.
 * 
 * Member 4 - Dashboard UI
 */

import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../lib/apiBase';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../hooks/useNotifications';
import { Link, useNavigate } from 'react-router-dom';
import { formatDate } from '../utils/dateUtils';
import Card, { CardBody } from '../components/ui/Card';
import Badge from '../components/ui/Badge';

const TYPE_ICONS = { BOOKING: '🗓️', TICKET: '🎫', COMMENT: '💬', SYSTEM: '🔔' };
const TYPE_COLORS = { BOOKING: '#6366f1', TICKET: '#f59e0b', COMMENT: '#10b981', SYSTEM: '#64748b' };

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { notifications, unreadCount } = useNotifications();
  const [defaultResourceId, setDefaultResourceId] = useState(null);

  const recentNotifs = notifications.slice(0, 5);

  useEffect(() => {
    let isMounted = true;

    const fetchFirstResource = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/resources`, {
          params: { page: 0, size: 1, sortBy: 'name', sortDir: 'asc' },
        });
        const firstResourceId = response.data?.content?.[0]?.id;
        if (isMounted && firstResourceId != null) {
          setDefaultResourceId(firstResourceId);
        }
      } catch {
        // Keep fallback navigation when no resources can be loaded.
      }
    };

    fetchFirstResource();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-indigo-700 to-blue-600 p-8 text-white shadow-card">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              Welcome back, <span>{user?.name?.split(' ')[0]}</span> <span aria-hidden>👋</span>
            </h1>
            <p className="mt-2 max-w-2xl text-white/90">
              {isAdmin
                ? 'You have full administrator access to the Smart Campus system.'
                : 'Access your bookings, tickets, and campus resources below.'}
            </p>
          </div>
          <img
            src={
              user?.profilePicture ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                user?.name || 'U'
              )}&size=80`
            }
            alt="User Avatar"
            className="h-20 w-20 rounded-full border-4 border-white/20 object-cover"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardBody className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-xl text-indigo-700">
              🔔
            </div>
            <div>
              <div className="text-2xl font-extrabold text-slate-900">{unreadCount}</div>
              <div className="text-sm font-semibold text-slate-500">Unread Notifications</div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-xl text-emerald-700">
              👤
            </div>
            <div>
              <div className="flex items-center gap-2">
                <div className="text-lg font-extrabold text-slate-900">{user?.role}</div>
                <Badge variant={isAdmin ? 'danger' : 'success'}>
                  {isAdmin ? 'ADMIN' : 'USER'}
                </Badge>
              </div>
              <div className="text-sm font-semibold text-slate-500">Your Role</div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-fuchsia-50 text-xl text-fuchsia-700">
              🔒
            </div>
            <div>
              <div className="text-lg font-extrabold text-slate-900">OAuth 2.0</div>
              <div className="text-sm font-semibold text-slate-500">Auth Provider</div>
            </div>
          </CardBody>
        </Card>
      </div>

      <section>
        <h2 className="text-lg font-extrabold text-slate-900">Quick Actions</h2>
        <div className="relative z-10 mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          <button
            type="button"
            onClick={() => navigate('/notifications')}
            className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="text-2xl">🔔</div>
            <div className="mt-3 font-extrabold text-slate-900">My Notifications</div>
            <div className="mt-1 text-sm text-slate-500">View and manage updates</div>
          </button>
          {isAdmin && (
            <button
              type="button"
              onClick={() => navigate('/admin/users')}
              className="group rounded-2xl border border-red-200 bg-red-50 p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="text-2xl">👥</div>
              <div className="mt-3 font-extrabold text-slate-900">Manage Users</div>
              <div className="mt-1 text-sm text-slate-600">Roles and access control</div>
            </button>
          )}
          <button
            type="button"
            onClick={() => navigate(defaultResourceId ? `/resource/${defaultResourceId}` : '/resource')}
            className="group rounded-2xl border border-blue-200 bg-blue-50 p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="text-2xl">🗓️</div>
            <div className="mt-3 font-extrabold text-slate-900">Booking</div>
            <div className="mt-1 text-sm text-slate-600">Request rooms / labs / equipment</div>
          </button>
          <button
            type="button"
            onClick={() => navigate('/tickets')}
            className="group rounded-2xl border border-amber-200 bg-amber-50 p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="text-2xl">🎫</div>
            <div className="mt-3 font-extrabold text-slate-900">Support Tickets</div>
            <div className="mt-1 text-sm text-slate-600">Report incidents and request support</div>
          </button>
          <button
            type="button"
            onClick={() => navigate('/my-bookings')}
            className="group rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="text-2xl">📋</div>
            <div className="mt-3 font-extrabold text-slate-900">Show my booking</div>
            <div className="mt-1 text-sm text-slate-600">View your submitted booking requests</div>
          </button>
          <button
            type="button"
            onClick={() => navigate('/my-previous-tickets')}
            className="group rounded-2xl border border-violet-200 bg-violet-50 p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="text-2xl">🎟️</div>
            <div className="mt-3 font-extrabold text-slate-900">Show my previous tickets</div>
            <div className="mt-1 text-sm text-slate-600">Past support tickets tied to your email</div>
          </button>
        </div>
      </section>

      <section>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">Recent Notifications</h2>
            <p className="mt-1 text-xs font-medium text-slate-500">
              Booking and ticket alerts refresh automatically every few seconds.
            </p>
          </div>
          <Link to="/notifications" className="text-sm font-bold text-blue-700 hover:underline sm:shrink-0">
            See all →
          </Link>
        </div>

        <div className="mt-4">
          {recentNotifs.length === 0 ? (
            <Card>
              <CardBody className="py-10 text-center">
                <div className="text-3xl">🔕</div>
                <p className="mt-2 text-sm font-semibold text-slate-600">
                  No notifications yet. You're all caught up!
                </p>
              </CardBody>
            </Card>
          ) : (
            <div className="space-y-3">
              {recentNotifs.map((n) => (
                <div
                  key={n.id}
                  className={[
                    'flex items-center gap-4 rounded-2xl border p-4 shadow-sm transition',
                    !n.isRead
                      ? 'border-indigo-200 bg-indigo-50'
                      : 'border-slate-200 bg-white',
                  ].join(' ')}
                >
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-2xl text-lg"
                    style={{
                      backgroundColor: TYPE_COLORS[n.type] + '20',
                      color: TYPE_COLORS[n.type],
                    }}
                  >
                    {TYPE_ICONS[n.type]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-extrabold text-slate-900">
                      {n.title}
                    </p>
                    <p className="truncate text-sm text-slate-600">{n.message}</p>
                  </div>
                  <span className="shrink-0 text-xs font-semibold text-slate-400">
                    {formatDate(n.createdAt)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
