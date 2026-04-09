/**
 * AdminUsersPage.jsx
 * Admin-only page for managing all users and their roles.
 * 
 * Features:
 * - Table of all users (name, email, role, status, joined date)
 * - Role badge with color coding
 * - Role dropdown to change a user's role (with confirm dialog)
 * - Toggle active/inactive status
 * - Search/filter by name or email
 * - Loading state and error handling
 * - Success/error toasts
 * 
 * Member 4 - Role Management UI
 */

import { useState, useEffect } from 'react';
import { getAllUsers, updateUserRole, toggleUserActive } from '../services/userApi';
import { formatDate } from '../utils/dateUtils';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

const ROLES = ['USER', 'ADMIN', 'TECHNICIAN'];

const ROLE_STYLES = {
  ADMIN:      { bg: '#fee2e2', text: '#dc2626' },
  TECHNICIAN: { bg: '#fef3c7', text: '#d97706' },
  USER:       { bg: '#d1fae5', text: '#059669' },
};

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState(null); // tracks which row is being updated

  // Fetch all users on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getAllUsers();
      if (res.success) setUsers(res.data);
    } catch (err) {
      toast.error('Failed to load users. Are you logged in as ADMIN?');
    } finally {
      setLoading(false);
    }
  };

  /** Handle role change with confirmation */
  const handleRoleChange = async (userId, newRole, userName) => {
    if (!window.confirm(`Change ${userName}'s role to ${newRole}?`)) return;
    setUpdatingId(userId);
    try {
      const res = await updateUserRole(userId, newRole);
      if (res.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        );
        toast.success(`${userName}'s role updated to ${newRole}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update role.');
    } finally {
      setUpdatingId(null);
    }
  };

  /** Handle toggle active/inactive */
  const handleToggleActive = async (userId, userName, currentStatus) => {
    const action = currentStatus ? 'deactivate' : 'activate';
    if (!window.confirm(`Are you sure you want to ${action} ${userName}?`)) return;
    setUpdatingId(userId);
    try {
      const res = await toggleUserActive(userId);
      if (res.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, active: !currentStatus } : u))
        );
        toast.success(`${userName} has been ${action}d.`);
      }
    } catch (err) {
      toast.error('Failed to update user status.');
    } finally {
      setUpdatingId(null);
    }
  };

  // Filter users by search term
  const filtered = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-users">
      {/* Page header */}
      <div className="admin-users__header">
        <div>
          <h1 className="admin-users__title">User Management</h1>
          <p className="admin-users__subtitle">
            {users.length} registered user{users.length !== 1 ? 's' : ''} in the system
          </p>
        </div>
        <button className="btn btn--ghost" onClick={fetchUsers} title="Refresh">
          🔄 Refresh
        </button>
      </div>

      {/* Search bar */}
      <div className="admin-users__search">
        <span className="admin-users__search-icon">🔍</span>
        <input
          id="user-search"
          type="text"
          placeholder="Search by name or email…"
          className="admin-users__search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* User table */}
      {loading ? (
        <div className="skeleton-list">
          {[1, 2, 3, 4].map((i) => <div key={i} className="skeleton-item skeleton-item--tall" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <span className="empty-state__icon">👥</span>
          <h3>No users found</h3>
          <p>Try a different search term.</p>
        </div>
      ) : (
        <div className="admin-users__table-wrapper">
          <table className="admin-users__table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Auth Provider</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => {
                const roleStyle = ROLE_STYLES[u.role] || ROLE_STYLES.USER;
                const isCurrentUser = u.id === currentUser?.id;
                const isUpdating = updatingId === u.id;

                return (
                  <tr
                    key={u.id}
                    id={`user-row-${u.id}`}
                    className={`admin-users__row ${isCurrentUser ? 'admin-users__row--self' : ''} ${!u.active ? 'admin-users__row--inactive' : ''}`}
                  >
                    {/* Avatar + Name */}
                    <td className="admin-users__user-cell">
                      <img
                        src={u.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&size=40`}
                        alt={u.name}
                        className="admin-users__avatar"
                      />
                      <div>
                        <p className="admin-users__name">{u.name}</p>
                        {isCurrentUser && <span className="admin-users__you">(You)</span>}
                      </div>
                    </td>

                    <td className="admin-users__email">{u.email}</td>

                    {/* Auth Provider */}
                    <td>
                      <span className="admin-users__provider">
                        {u.authProvider === 'GOOGLE' ? '🔑 Google' : u.authProvider}
                      </span>
                    </td>

                    {/* Role badge + dropdown */}
                    <td>
                      <div className="admin-users__role-cell">
                        <span
                          className="role-badge"
                          style={{ backgroundColor: roleStyle.bg, color: roleStyle.text }}
                        >
                          {u.role}
                        </span>
                        {!isCurrentUser && (
                          <select
                            id={`role-select-${u.id}`}
                            className="admin-users__role-select"
                            value={u.role}
                            disabled={isUpdating}
                            onChange={(e) => handleRoleChange(u.id, e.target.value, u.name)}
                          >
                            {ROLES.map((r) => (
                              <option key={r} value={r}>{r}</option>
                            ))}
                          </select>
                        )}
                      </div>
                    </td>

                    {/* Active status */}
                    <td>
                      <span className={`status-badge ${u.active ? 'status-badge--active' : 'status-badge--inactive'}`}>
                        {u.active ? '● Active' : '○ Inactive'}
                      </span>
                    </td>

                    {/* Joined date */}
                    <td className="admin-users__date">{formatDate(u.createdAt)}</td>

                    {/* Actions */}
                    <td>
                      {!isCurrentUser && (
                        <button
                          id={`toggle-active-${u.id}`}
                          className={`btn btn--sm ${u.active ? 'btn--danger-ghost' : 'btn--success-ghost'}`}
                          disabled={isUpdating}
                          onClick={() => handleToggleActive(u.id, u.name, u.active)}
                        >
                          {isUpdating ? '…' : u.active ? 'Deactivate' : 'Activate'}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
