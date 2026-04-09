import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiBarChart2, FiUsers, FiHome, FiCalendar, FiTrendingUp, FiTool, FiAlertCircle, FiDownload } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { API_BASE_URL } from '../lib/apiBase';

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/admin/dashboard/stats`);
      setStats(response.data);
    } catch (error) {
      toast.error('Failed to fetch dashboard stats');
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#094886', '#2563eb', '#10b981', '#f59e0b', '#ef4444'];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#094886]"></div>
      </div>
    );
  }

  // Mock data for charts (replace with real API calls)
  const resourceTypeData = [
    { name: 'Lecture Hall', value: 35, color: '#094886' },
    { name: 'Computer Lab', value: 28, color: '#2563eb' },
    { name: 'Meeting Room', value: 42, color: '#10b981' },
    { name: 'Equipment', value: 25, color: '#f59e0b' },
    { name: 'Auditorium', value: 8, color: '#ef4444' },
    { name: 'Smart Classroom', value: 12, color: '#8b5cf6' }
  ];

  const buildingData = [
    { name: 'Main', resources: 45 },
    { name: 'Engineering', resources: 38 },
    { name: 'Science', resources: 32 },
    { name: 'Library', resources: 25 },
    { name: 'Admin', resources: 10 }
  ];

  const bookingData = [
    { month: 'Jan', bookings: 120 },
    { month: 'Feb', bookings: 145 },
    { month: 'Mar', bookings: 168 },
    { month: 'Apr', bookings: 189 },
    { month: 'May', bookings: 210 },
    { month: 'Jun', bookings: 195 }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Resource management overview and analytics</p>
        </div>
        <button className="btn-secondary flex items-center space-x-2">
          <FiDownload className="w-4 h-4" />
          <span>Export Report</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FiHome className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Resources</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalResources || 150}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <FiUsers className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Working Resources</p>
              <p className="text-2xl font-bold text-gray-900">{stats.workingResources || 120}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <FiCalendar className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Bookings</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeBookings || 89}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg">
              <FiTool className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Under Maintenance</p>
              <p className="text-2xl font-bold text-gray-900">{stats.underMaintenance || 8}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Resource Types Pie Chart */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Resources by Type</h2>
          <div className="h-80">
            <PieChart>
              <Pie
                data={resourceTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {resourceTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </div>
        </div>

        {/* Buildings Bar Chart */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Resources by Building</h2>
          <div className="h-80">
            <BarChart data={buildingData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="resources" fill="#094886" />
            </BarChart>
          </div>
        </div>
      </div>

      {/* Booking Trends */}
      <div className="card mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Booking Trends (Last 6 Months)</h2>
        <div className="h-80">
          <BarChart data={bookingData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="bookings" fill="#2563eb" name="Bookings" />
          </BarChart>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link to="/resource/add" className="card hover:shadow-lg transition-shadow group">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
              <FiHome className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Add Resource</h3>
              <p className="text-gray-600">Create a new resource</p>
            </div>
          </div>
        </Link>

        <Link to="/resources" className="card hover:shadow-lg transition-shadow group">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
              <FiBarChart2 className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Manage Resources</h3>
              <p className="text-gray-600">View and edit all resources</p>
            </div>
          </div>
        </Link>

        <Link to="/admin/export" className="card hover:shadow-lg transition-shadow group">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
              <FiTrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Analytics Export</h3>
              <p className="text-gray-600">Download detailed reports</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[
            { type: 'warning', message: 'Computer Lab 203 requires maintenance', time: '2 hours ago' },
            { type: 'info', message: 'New booking for Lecture Hall A', time: '4 hours ago' },
            { type: 'success', message: 'Resource updated: Meeting Room 101', time: '6 hours ago' },
            { type: 'warning', message: 'High utilization detected in Library', time: '1 day ago' },
            { type: 'info', message: 'New resource added: Equipment Lab', time: '2 days ago' }
          ].map((activity, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
              <div className={`p-2 rounded-full ${
                activity.type === 'warning' ? 'bg-yellow-100' :
                activity.type === 'success' ? 'bg-green-100' :
                'bg-blue-100'
              }`}>
                <FiAlertCircle className={`w-4 h-4 ${
                  activity.type === 'warning' ? 'text-yellow-600' :
                  activity.type === 'success' ? 'text-green-600' :
                  'text-blue-600'
                }`} />
              </div>
              <div className="flex-1">
                <p className="text-gray-900">{activity.message}</p>
                <p className="text-sm text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
