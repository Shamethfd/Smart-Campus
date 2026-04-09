import axios from 'axios';
import { getToken } from '../utils/tokenUtils';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8081';

const apiClient = axios.create({
  baseURL: `${BASE}/api/v1/bookings`,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const bookingAPI = {
  createBooking: (bookingData) => apiClient.post('', bookingData),

  getUserBookings: () => apiClient.get('/my-bookings'),

  getBooking: (bookingId) => apiClient.get(`/${bookingId}`),

  getResourceBookingsByDate: (resourceId, date) =>
    apiClient.get(`/resource/${resourceId}/date`, { params: { date } }),

  getAllBookings: () => apiClient.get('/admin/all'),

  getBookingsByStatus: (status) => apiClient.get(`/admin/status/${status}`),

  approveBooking: (bookingId, notes) =>
    apiClient.put(`/${bookingId}/approve`, null, { params: { notes } }),

  rejectBooking: (bookingId, notes) =>
    apiClient.put(`/${bookingId}/reject`, null, { params: { notes } }),

  cancelBooking: (bookingId) => apiClient.delete(`/${bookingId}/cancel`),
};

export default bookingAPI;
