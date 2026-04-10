/**
 * AdminUsersPage.jsx
 * Admin-only page — view all users and manage their roles.
 *
 * Layout: Sidebar (left) + content (right) — full-width, no top Navbar.
 *
 * Features:
 *   - Live table of all registered users
 *   - Role badge with colour coding
 *   - Role dropdown to change a user's role (with confirm dialog)
 *   - Toggle active / inactive status
 *   - Search / filter by name or email
 *   - Loading skeletons & empty state
 *   - Success / error toasts
 *
 * APIs used:
 *   GET /api/admin/users          → adminGetAllUsers()
 *   PUT /api/admin/users/{id}/roles → adminUpdateUserRole()
 *   PATCH /api/users/{id}/toggle-active → toggleUserActive() (existing)
 *
 * Member 4 – Admin User Management Page
 */

import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { adminGetAllUsers, adminUpdateUserRole } from '../services/adminApi';
import { toggleUserActive } from '../services/userApi';   // existing helper
import { formatDate } from '../utils/dateUtils';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button';
import Card, { CardBody } from '../components/ui/Card';
import Badge from '../components/ui/Badge';

/* ── constants ────────────────────────────────────────── */
const ROLES = ['USER', 'ADMIN', 'TECHNICIAN'];

const ROLE_STYLES = {
  ADMIN:      { bg: '#fee2e2', text: '#dc2626' },
  TECHNICIAN: { bg: '#fef3c7', text: '#d97706' },
  USER:       { bg: '#d1fae5', text: '#059669' },
};

/* ── component ────────────────────────────────────────── */
export default function AdminUsersPage() {
  const { user: currentUser } = useAuth();

  const [users,      setUsers]      = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  /* Load users on mount */
  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await adminGetAllUsers();
      if (res.success) setUsers(res.data);
    } catch (err) {
      toast.error('Failed to load users. Make sure you are logged in as ADMIN.');
    } finally {
      setLoading(false);
    }
  };

  /* Change role */
  const handleRoleChange = async (userId, newRole, userName) => {
    if (!window.confirm(`Change ${userName}'s role to ${newRole}?`)) return;
    setUpdatingId(userId);
    try {
      const res = await adminUpdateUserRole(userId, newRole);
      if (res.success) {
        setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, role: newRole } : u));
        toast.success(`${userName}'s role updated to ${newRole}.`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update role.');
    } finally {
      setUpdatingId(null);
    }
  };

  /* Toggle active/inactive */
  const handleToggleActive = async (userId, userName, currentActive) => {
    const action = currentActive ? 'deactivate' : 'activate';
    if (!window.confirm(`${action.charAt(0).toUpperCase() + action.slice(1)} ${userName}?`)) return;
    setUpdatingId(userId);
    try {
      const res = await toggleUserActive(userId);
      if (res.success) {
        setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, active: !currentActive } : u));
        toast.success(`${userName} has been ${action}d.`);
      }
    } catch {
      toast.error('Failed to update user status.');
    } finally {
      setUpdatingId(null);
    }
  };

  /* Search filter */
  const filtered = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-dvh bg-slate-50">
      <Sidebar />

      <main className="min-w-0 flex-1 p-4 sm:p-8">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
              👥 User Management
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {users.length} registered user{users.length !== 1 ? 's' : ''} in the system
            </p>
          </div>
          <Button variant="outline" onClick={fetchUsers} title="Refresh">
            🔄 Refresh
          </Button>
        </header>

        <div className="mt-5 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <span className="text-slate-400">🔍</span>
          <input
            id="user-search"
            type="text"
            placeholder="Search by name or email…"
            className="min-w-0 flex-1 bg-transparent text-sm outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              className="rounded-lg px-2 py-1 text-slate-400 hover:bg-slate-100 hover:text-slate-900"
              onClick={() => setSearch('')}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {!loading && (
          <p className="mt-3 text-sm text-slate-500">
            Showing <span className="font-extrabold text-slate-900">{filtered.length}</span> of{' '}
            {users.length} users
          </p>
        )}

        {loading ? (
          <div className="mt-5 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 animate-pulse rounded-2xl border border-slate-200 bg-slate-100" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <Card className="mt-5">
            <CardBody className="py-12 text-center">
              <div className="text-3xl">👥</div>
              <h3 className="mt-2 text-base font-extrabold text-slate-900">No users found</h3>
              <p className="mt-1 text-sm text-slate-600">Try a different search term.</p>
            </CardBody>
          </Card>
        ) : (
          <div className="mt-5 overflow-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="min-w-[900px] w-full text-left text-sm" aria-label="Users table">
              <thead className="bg-slate-50 text-[11px] font-extrabold uppercase tracking-widest text-slate-500">
                <tr>
                  <th className="px-4 py-4">User</th>
                  <th className="px-4 py-4">Email</th>
                  <th className="px-4 py-4">Auth Provider</th>
                  <th className="px-4 py-4">Role</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4">Joined</th>
                  <th className="px-4 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((u) => {
                  const roleStyle = ROLE_STYLES[u.role] || ROLE_STYLES.USER;
                  const isSelf = u.id === currentUser?.id;
                  const isUpdating = updatingId === u.id;

                  return (
                    <tr
                      key={u.id}
                      id={`user-row-${u.id}`}
                      className={[
                        'transition',
                        !u.active ? 'opacity-70' : '',
                        isSelf ? 'bg-indigo-50/40' : 'hover:bg-slate-50',
                      ].join(' ')}
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              u.profilePicture ||
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                u.name
                              )}&size=40`
                            }
                            alt={u.name}
                            className="h-10 w-10 rounded-full border border-slate-200 object-cover"
                          />
                          <div className="min-w-0">
                            <p className="truncate font-extrabold text-slate-900">{u.name}</p>
                            {isSelf && <p className="text-xs font-semibold text-indigo-600">(You)</p>}
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4 text-slate-600">{u.email}</td>

                      <td className="px-4 py-4">
                        <Badge>
                          {u.authProvider === 'GOOGLE' ? '🔑 Google' : u.authProvider}
                        </Badge>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex flex-col items-start gap-2">
                          <span
                            className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-extrabold tracking-wider"
                            style={{ background: roleStyle.bg, color: roleStyle.text }}
                          >
                            {u.role}
                          </span>
                          {!isSelf && (
                            <select
                              id={`role-select-${u.id}`}
                              className="h-9 rounded-lg border border-slate-300 bg-white px-2 text-xs font-bold text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                              value={u.role}
                              disabled={isUpdating}
                              onChange={(e) => handleRoleChange(u.id, e.target.value, u.name)}
                            >
                              {ROLES.map((r) => (
                                <option key={r} value={r}>
                                  {r}
                                </option>
                              ))}
                            </select>
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <Badge variant={u.active ? 'success' : 'neutral'}>
                          {u.active ? '● Active' : '○ Inactive'}
                        </Badge>
                      </td>

                      <td className="px-4 py-4 text-slate-500">{formatDate(u.createdAt)}</td>

                      <td className="px-4 py-4">
                        {!isSelf && (
                          <Button
                            id={`toggle-active-${u.id}`}
                            variant={u.active ? 'outline' : 'primary'}
                            size="sm"
                            disabled={isUpdating}
                            onClick={() => handleToggleActive(u.id, u.name, u.active)}
                            className={u.active ? 'border-red-300 text-red-700 hover:bg-red-50' : ''}
                          >
                            {isUpdating ? '…' : u.active ? 'Deactivate' : 'Activate'}
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

      </main>
    </div>
  );
}
