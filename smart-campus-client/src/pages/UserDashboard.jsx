import { useState, useEffect } from 'react';
import bookingAPI from '../services/bookingAPI';

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  APPROVED: 'bg-green-100 text-green-800 border-green-300',
  REJECTED: 'bg-red-100 text-red-800 border-red-300',
  CANCELLED: 'bg-gray-100 text-gray-800 border-gray-300',
};

const statusBadgeClasses = {
  PENDING: 'bg-yellow-200 text-yellow-900',
  APPROVED: 'bg-green-200 text-green-900',
  REJECTED: 'bg-red-200 text-red-900',
  CANCELLED: 'bg-gray-200 text-gray-900',
};

export default function UserDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [selectedBookingId, setSelectedBookingId] = useState(null);

  useEffect(() => {
    fetchUserBookings();
  }, []);

  const fetchUserBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingAPI.getUserBookings();
      setBookings(response.data.data || []);
      setError('');
    } catch (err) {
      setError('Failed to fetch bookings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await bookingAPI.cancelBooking(bookingId);
        setMessage({ type: 'success', text: 'Booking cancelled successfully' });
        await fetchUserBookings();
      } catch (err) {
        setMessage({ type: 'error', text: 'Failed to cancel booking' });
        console.error(err);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (timeString) => {
    return timeString || 'N/A';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <p className="text-lg text-gray-600">Loading your bookings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Bookings</h1>
          <p className="text-gray-600">
            View and manage your resource bookings
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg">
            {error}
          </div>
        )}

        {message.text && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-50 border border-green-200 text-green-800'
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}
          >
            {message.text}
          </div>
        )}

        {bookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <p className="text-gray-600 text-lg">No bookings found</p>
            <p className="text-gray-500 mt-2">
              Start by creating a new booking request
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className={`bg-white rounded-lg shadow-lg p-6 border-l-4 ${
                  statusColors[booking.status]?.split(' ')[0] || 'border-gray-300'
                }`}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div>
                    <div className="mb-4">
                      <h3 className="text-2xl font-bold text-gray-900">
                        {booking.resourceName}
                      </h3>
                      <p className="text-gray-600">
                        {booking.resourceType}
                        {booking.resourceId && ` (${booking.resourceId})`}
                      </p>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-semibold text-gray-700">Date:</span>
                        <span className="text-gray-600 ml-2">
                          {formatDate(booking.bookingDate)}
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">Time:</span>
                        <span className="text-gray-600 ml-2">
                          {formatTime(booking.startTime)} -{' '}
                          {formatTime(booking.endTime)}
                        </span>
                      </div>
                      {booking.notes && (
                        <div>
                          <span className="font-semibold text-gray-700">Notes:</span>
                          <p className="text-gray-600 mt-1">{booking.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="flex flex-col justify-between">
                    <div>
                      <div className="mb-4">
                        <span
                          className={`inline-block px-4 py-2 rounded-full font-semibold text-sm ${
                            statusBadgeClasses[booking.status]
                          }`}
                        >
                          {booking.status}
                        </span>
                      </div>

                      {booking.adminNotes && (
                        <div className="mb-4">
                          <p className="text-sm font-semibold text-gray-700">
                            Admin Notes:
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {booking.adminNotes}
                          </p>
                        </div>
                      )}

                      <p className="text-xs text-gray-500 mt-2">
                        Requested on:{' '}
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 mt-4">
                      {booking.status === 'APPROVED' && (
                        <button
                          onClick={() => handleCancelBooking(booking.id)}
                          className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg transition duration-200"
                        >
                          Cancel Booking
                        </button>
                      )}
                      {booking.status === 'PENDING' && (
                        <button
                          disabled
                          className="flex-1 bg-gray-300 text-gray-600 font-semibold py-2 rounded-lg cursor-not-allowed"
                        >
                          Awaiting Approval
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
