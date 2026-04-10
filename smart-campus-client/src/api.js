import axios from 'axios';

// Backend API base URL
const API_URL = "http://localhost:8081/api";

// Example API calls (kept for backward compat; prefer ticketService.js)
export const getTickets = () => axios.get(`${API_URL}/tickets`);
export const createTicket = (ticket) => axios.post(`${API_URL}/tickets`, ticket);
export const getNotifications = (email) => axios.get(`${API_URL}/notifications?email=${email}`);

export default API_URL;




