import axios from 'axios';

<<<<<<< HEAD
const API_URL = 'http://localhost:8080/api';
=======
const API_URL = 'http://localhost:8081/api';
>>>>>>> 9b434a5249957e185d72085a25e4bcdbaa60f373

// Tickets
export const createTicket = (ticket) =>
  axios.post(`${API_URL}/tickets`, ticket);

export const getAllTickets = () =>
  axios.get(`${API_URL}/tickets`);

export const getMyTickets = (email) =>
<<<<<<< HEAD
  axios.get(`${API_URL}/tickets/my?email=${encodeURIComponent(email)}`);
=======
  axios.get(`${API_URL}/tickets/my?email=${email}`);
>>>>>>> 9b434a5249957e185d72085a25e4bcdbaa60f373

export const getTicketById = (id) =>
  axios.get(`${API_URL}/tickets/${id}`);

export const updateTicketStatus = (id, data) =>
  axios.put(`${API_URL}/tickets/${id}/status`, data);

export const assignTechnician = (id, technicianEmail) =>
  axios.put(`${API_URL}/tickets/${id}/assign`, { technicianEmail });

export const deleteTicket = (id) =>
  axios.delete(`${API_URL}/tickets/${id}`);

<<<<<<< HEAD
// Image upload (multipart/form-data) — up to 3 images
export const uploadTicketImages = (ticketId, files) => {
  const formData = new FormData();
  files.forEach(f => formData.append('files', f));
  return axios.post(`${API_URL}/tickets/${ticketId}/images`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

=======
>>>>>>> 9b434a5249957e185d72085a25e4bcdbaa60f373
// Comments
export const addComment = (ticketId, content, authorEmail) =>
  axios.post(`${API_URL}/tickets/${ticketId}/comments`, { content, authorEmail });

<<<<<<< HEAD
export const editComment = (ticketId, commentId, content, authorEmail) =>
  axios.put(`${API_URL}/tickets/${ticketId}/comments/${commentId}`, { content, authorEmail });

export const deleteComment = (ticketId, commentId, email) =>
  axios.delete(`${API_URL}/tickets/${ticketId}/comments/${commentId}?email=${encodeURIComponent(email)}`);

// Notifications
=======
// Fix: include authorEmail in body (backend uses it to verify ownership)
export const editComment = (ticketId, commentId, content, authorEmail) =>
  axios.put(`${API_URL}/tickets/${ticketId}/comments/${commentId}`, { content, authorEmail });

// Fix: send email as query param (backend reads @RequestParam email)
export const deleteComment = (ticketId, commentId, email) =>
  axios.delete(`${API_URL}/tickets/${ticketId}/comments/${commentId}?email=${encodeURIComponent(email)}`);

// Notifications — all require ?email= query param
>>>>>>> 9b434a5249957e185d72085a25e4bcdbaa60f373
export const getMyNotifications = (email) =>
  axios.get(`${API_URL}/notifications?email=${encodeURIComponent(email)}`);

export const getUnreadCount = (email) =>
  axios.get(`${API_URL}/notifications/unread-count?email=${encodeURIComponent(email)}`);

export const markAsRead = (id) =>
  axios.put(`${API_URL}/notifications/${id}/read`);

export const markAllAsRead = (email) =>
  axios.put(`${API_URL}/notifications/read-all?email=${encodeURIComponent(email)}`);
