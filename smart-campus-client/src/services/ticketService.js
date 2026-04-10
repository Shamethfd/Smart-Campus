import axios from 'axios';

const API_URL = 'http://localhost:8081/api';

// Tickets
export const createTicket = (ticket) =>
  axios.post(`${API_URL}/tickets`, ticket);

export const getAllTickets = () =>
  axios.get(`${API_URL}/tickets`);

export const getMyTickets = (email) =>
  axios.get(`${API_URL}/tickets/my?email=${email}`);

export const getTicketById = (id) =>
  axios.get(`${API_URL}/tickets/${id}`);

export const updateTicketStatus = (id, data) =>
  axios.put(`${API_URL}/tickets/${id}/status`, data);

export const assignTechnician = (id, technicianEmail) =>
  axios.put(`${API_URL}/tickets/${id}/assign`, { technicianEmail });

export const deleteTicket = (id) =>
  axios.delete(`${API_URL}/tickets/${id}`);

// Comments
export const addComment = (ticketId, content, authorEmail) =>
  axios.post(`${API_URL}/tickets/${ticketId}/comments`, { content, authorEmail });

// Fix: include authorEmail in body (backend uses it to verify ownership)
export const editComment = (ticketId, commentId, content, authorEmail) =>
  axios.put(`${API_URL}/tickets/${ticketId}/comments/${commentId}`, { content, authorEmail });

// Fix: send email as query param (backend reads @RequestParam email)
export const deleteComment = (ticketId, commentId, email) =>
  axios.delete(`${API_URL}/tickets/${ticketId}/comments/${commentId}?email=${encodeURIComponent(email)}`);

// Notifications — all require ?email= query param
export const getMyNotifications = (email) =>
  axios.get(`${API_URL}/notifications?email=${encodeURIComponent(email)}`);

export const getUnreadCount = (email) =>
  axios.get(`${API_URL}/notifications/unread-count?email=${encodeURIComponent(email)}`);

export const markAsRead = (id) =>
  axios.put(`${API_URL}/notifications/${id}/read`);

export const markAllAsRead = (email) =>
  axios.put(`${API_URL}/notifications/read-all?email=${encodeURIComponent(email)}`);




