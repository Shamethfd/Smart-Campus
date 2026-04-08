import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api/v1/bookings';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if needed
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const bookingAPI = {
  // Create a new booking
  createBooking: (bookingData) =>
    apiClient.post('/', bookingData),

  // Get user's bookings
  getUserBookings: () =>
    apiClient.get('/my-bookings'),

  // Get specific booking
  getBooking: (bookingId) =>
    apiClient.get(`/${bookingId}`),

  // Get resource bookings by date
  getResourceBookingsByDate: (resourceId, date) =>
    apiClient.get(`/resource/${resourceId}/date`, { params: { date } }),

  // Admin: Get all bookings
  getAllBookings: () =>
    apiClient.get('/admin/all'),

  // Admin: Get bookings by status
  getBookingsByStatus: (status) =>
    apiClient.get(`/admin/status/${status}`),

  // Admin: Approve booking
  approveBooking: (bookingId, notes) =>
    apiClient.put(`/${bookingId}/approve`, null, { params: { notes } }),

  // Admin: Reject booking
  rejectBooking: (bookingId, notes) =>
    apiClient.put(`/${bookingId}/reject`, null, { params: { notes } }),

  // User: Cancel booking
  cancelBooking: (bookingId) =>
    apiClient.delete(`/${bookingId}/cancel`),
};

export default bookingAPI;
