/**
 * adminApi.js
 * API service for admin-only endpoints.
 *
 * Endpoints used:
 *   GET  /api/admin/users           – fetch all users
 *   PUT  /api/admin/users/{id}/roles – update a user's role
 *   GET  /api/notifications          – all notifications (admin view)
 *
 * Member 4 – Admin API Service
 */

import axios from 'axios';
import { getToken } from '../utils/tokenUtils';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';

const api = axios.create({ baseURL: BASE_URL });

// Attach JWT to every request
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── User management ──────────────────────────────────────

/** GET /api/admin/users — list all registered users */
export const adminGetAllUsers = async () => {
  const res = await api.get('/api/admin/users');
  return res.data; // { success, data: User[] }
};

/** PUT /api/admin/users/{id}/roles — update a user's role */
export const adminUpdateUserRole = async (userId, role) => {
  const res = await api.put(`/api/admin/users/${userId}/roles`, { role });
  return res.data;
};

// ── Notification management ──────────────────────────────

/** GET /api/notifications — fetch all notifications (admin sees all) */
export const adminGetAllNotifications = async () => {
  const res = await api.get('/api/notifications');
  return res.data; // { success, data: Notification[] }
};

/** PATCH /api/notifications/{id}/read — mark one notification read */
export const adminMarkNotifRead = async (id) => {
  const res = await api.patch(`/api/notifications/${id}/read`);
  return res.data;
};

/** DELETE /api/notifications/{id} — delete a notification */
export const adminDeleteNotif = async (id) => {
  const res = await api.delete(`/api/notifications/${id}`);
  return res.data;
};

// ── Stats helper ─────────────────────────────────────────

/** GET /api/notifications/unread-count */
export const adminGetUnreadCount = async () => {
  const res = await api.get('/api/notifications/unread-count');
  return res.data;
};
