import axios from 'axios';
import { getToken } from '../utils/tokenUtils';

const API_URL = 'http://localhost:8081/api';
const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Tickets
export const createTicket = (ticket) =>
  api.post('/tickets', ticket);

export const getAllTickets = () =>
  api.get('/tickets');

export const getMyTickets = (email) =>
  api.get(`/tickets/my?email=${email}`);

export const getTicketById = (id) =>
  api.get(`/tickets/${id}`);

export const updateTicketStatus = (id, data) =>
  api.put(`/tickets/${id}/status`, data);

export const assignTechnician = (id, technicianEmail) =>
  api.put(`/tickets/${id}/assign`, { technicianEmail });

export const deleteTicket = (id) =>
  api.delete(`/tickets/${id}`);

// Comments
export const addComment = (ticketId, content, authorEmail) =>
  api.post(`/tickets/${ticketId}/comments`, { content, authorEmail });

// Fix: include authorEmail in body (backend uses it to verify ownership)
export const editComment = (ticketId, commentId, content, authorEmail) =>
  api.put(`/tickets/${ticketId}/comments/${commentId}`, { content, authorEmail });

// Fix: send email as query param (backend reads @RequestParam email)
export const deleteComment = (ticketId, commentId, email) =>
  api.delete(`/tickets/${ticketId}/comments/${commentId}?email=${encodeURIComponent(email)}`);

// Notifications — all require ?email= query param
export const getMyNotifications = (email) =>
  api.get(`/notifications?email=${encodeURIComponent(email)}`);

export const getUnreadCount = (email) =>
  api.get(`/notifications/unread-count?email=${encodeURIComponent(email)}`);

export const markAsRead = (id) =>
  api.put(`/notifications/${id}/read`);

export const markAllAsRead = (email) =>
  api.put(`/notifications/read-all?email=${encodeURIComponent(email)}`);




