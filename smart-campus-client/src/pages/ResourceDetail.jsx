import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiMapPin, FiUsers, FiClock, FiEdit, FiTrash2, FiDownload, FiCalendar, FiWifi, FiMonitor, FiBook, FiTool } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { API_BASE_URL } from '../lib/apiBase';

const ResourceDetail = () => {
  const { id } = useParams();
  const [resource, setResource] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [timelineView, setTimelineView] = useState('week');

  useEffect(() => {
    const role = localStorage.getItem('role');
    setIsAdmin(role === 'admin');
  }, []);

  useEffect(() => {
    fetchResource();
    fetchBookings();
  }, [id]);

  const fetchResource = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/resources/${id}`);
      setResource(response.data);
    } catch (error) {
      toast.error('Failed to fetch resource details');
      console.error('Error fetching resource:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/bookings/approved?resourceId=${id}`);
      setBookings(response.data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'WORKING': return 'text-green-600 bg-green-100';
      case 'OUT_OF_SERVICE': return 'text-red-600 bg-red-100';
      case 'UNDER_MAINTENANCE': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const generateTimeSlots = () => {
    const slots = [];
    const startHour = 8;
    const endHour = 18;
    const days = ['MON', 'TUE', 'WED', 'THU', 'FRI'];

    days.forEach(day => {
      for (let hour = startHour; hour < endHour; hour++) {
        const timeSlot = `${day} ${hour}:00-${hour + 1}:00`;
        const isBooked = bookings.some(booking => {
          const bookingDay = booking.dayOfWeek?.substring(0, 3).toUpperCase();
          const bookingStart = parseInt(booking.startTime?.split(':')[0]);
          const bookingEnd = parseInt(booking.endTime?.split(':')[0]);
          return bookingDay === day && hour >= bookingStart && hour < bookingEnd;
        });

        slots.push({
          day,
          hour,
          timeSlot,
          isBooked,
          booking: bookings.find(booking => {
            const bookingDay = booking.dayOfWeek?.substring(0, 3).toUpperCase();
            const bookingStart = parseInt(booking.startTime?.split(':')[0]);
            return bookingDay === day && hour === bookingStart;
          })
        });
      }
    });

    return slots;
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this resource?')) {
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/api/resources/${id}`);
      toast.success('Resource deleted successfully');
      window.location.href = '/resources';
    } catch (error) {
      toast.error('Failed to delete resource');
      console.error('Error deleting resource:', error);
    }
  };

  const downloadQRCode = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/admin/qr/${id}`);
      const qrData = response.data.qrCode;
      const link = document.createElement('a');
      link.href = `data:image/png;base64,${qrData}`;
      link.download = `${resource.name}-qr-code.png`;
      link.click();
    } catch (error) {
      toast.error('Failed to download QR code');
      console.error('Error downloading QR code:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#094886]"></div>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Resource not found</h2>
          <Link to="/resources" className="btn-primary">
            Back to Resources
          </Link>
        </div>
      </div>
    );
  }

  const timeSlots = generateTimeSlots();
  const days = ['MON', 'TUE', 'WED', 'THU', 'FRI'];
  const hours = Array.from({ length: 10 }, (_, i) => i + 8);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{resource.name}</h1>
          <div className="flex items-center space-x-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(resource.status)}`}>
              {resource.status.replace('_', ' ')}
            </span>
            <span className="text-gray-600">
              {resource.type.replace('_', ' ')}
            </span>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={downloadQRCode}
            className="btn-secondary flex items-center space-x-2"
          >
            <FiDownload className="w-4 h-4" />
            <span>QR Code</span>
          </button>
          {isAdmin && (
            <>
              <Link
                to={`/resource/edit/${id}`}
                className="btn-primary flex items-center space-x-2"
              >
                <FiEdit className="w-4 h-4" />
                <span>Edit</span>
              </Link>
              <button
                onClick={handleDelete}
                className="btn-danger flex items-center space-x-2"
              >
                <FiTrash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <FiMapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-500">Location</div>
                  <div className="font-medium">
                    {resource.building} - Floor {resource.floor}
                    {resource.roomNumber && `, Room ${resource.roomNumber}`}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <FiUsers className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-500">Capacity</div>
                  <div className="font-medium">{resource.capacity} people</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <FiClock className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-500">Available Hours</div>
                  <div className="font-medium">
                    {resource.availableFrom} - {resource.availableTo}
                  </div>
                </div>
              </div>
              {resource.areaSqFt && (
                <div>
                  <div className="text-sm text-gray-500">Area</div>
                  <div className="font-medium">{resource.areaSqFt} sq ft</div>
                </div>
              )}
            </div>
          </div>

          {/* Features */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Features</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {resource.hasAC && (
                <div className="flex items-center space-x-2 text-blue-600">
                  <FiMonitor className="w-5 h-5" />
                  <span>Air Conditioning</span>
                </div>
              )}
              {resource.hasProjector && (
                <div className="flex items-center space-x-2 text-purple-600">
                  <FiMonitor className="w-5 h-5" />
                  <span>Projector</span>
                </div>
              )}
              {resource.hasWhiteboard && (
                <div className="flex items-center space-x-2 text-green-600">
                  <FiBook className="w-5 h-5" />
                  <span>Whiteboard</span>
                </div>
              )}
              {resource.hasWiFi && (
                <div className="flex items-center space-x-2 text-indigo-600">
                  <FiWifi className="w-5 h-5" />
                  <span>WiFi</span>
                </div>
              )}
            </div>
            {resource.accessibilityFeatures && resource.accessibilityFeatures.length > 0 && (
              <div className="mt-4">
                <div className="text-sm text-gray-500 mb-2">Accessibility Features</div>
                <div className="flex flex-wrap gap-2">
                  {resource.accessibilityFeatures.map((feature, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                    >
                      {feature.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Timeline Heatmap */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Weekly Availability</h2>
            <div className="overflow-x-auto">
              <div className="min-w-[800px]">
                <div className="grid grid-cols-6 gap-2">
                  <div className="text-sm font-medium text-gray-600">Day/Time</div>
                  {hours.map(hour => (
                    <div key={hour} className="text-sm font-medium text-gray-600 text-center">
                      {hour}:00
                    </div>
                  ))}
                </div>
                {days.map(day => (
                  <div key={day} className="grid grid-cols-6 gap-2 mt-2">
                    <div className="text-sm font-medium text-gray-700">{day}</div>
                    {hours.map(hour => {
                      const slot = timeSlots.find(s => s.day === day && s.hour === hour);
                      return (
                        <div
                          key={hour}
                          className={`h-8 rounded text-xs flex items-center justify-center cursor-pointer transition-colors ${
                            slot?.isBooked
                              ? 'bg-red-100 text-red-800 hover:bg-red-200'
                              : 'bg-green-100 text-green-800 hover:bg-green-200'
                          }`}
                          title={slot?.booking ? `${slot.booking.title} - ${slot.booking.startTime}` : 'Available'}
                        >
                          {slot?.isBooked ? 'Booked' : 'Free'}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-100 rounded"></div>
                <span>Available</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-100 rounded"></div>
                <span>Booked</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Booking Info */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Information</h3>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-500">Advance Booking Limit</div>
                <div className="font-medium">{resource.advanceBookingLimit} days</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Minimum Notice</div>
                <div className="font-medium">{resource.minimumNoticeHours} hours</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Available Days</div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {resource.availableDays?.map((day, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded"
                    >
                      {day}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
            <div className="space-y-2">
              <button className="btn-primary w-full">
                Book Now
              </button>
              <button className="btn-secondary w-full">
                Report Issue
              </button>
              <Link
                to={`/compare?ids=${id}`}
                className="btn-secondary w-full text-center block"
              >
                Add to Comparison
              </Link>
            </div>
          </div>

          {/* QR Code */}
          <div className="card text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">QR Code</h3>
            <div className="w-32 h-32 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <FiDownload className="w-8 h-8 text-gray-400" />
            </div>
            <button
              onClick={downloadQRCode}
              className="btn-secondary text-sm"
            >
              Download QR Code
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceDetail;
