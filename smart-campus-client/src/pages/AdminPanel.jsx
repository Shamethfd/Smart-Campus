import { useState, useEffect } from 'react';
import bookingAPI from '../services/bookingAPI';

const STATUSES = ['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'];

const badgeStyles = {
  PENDING: 'border-amber-300 bg-amber-50 text-amber-800',
  APPROVED: 'border-emerald-300 bg-emerald-50 text-emerald-800',
  REJECTED: 'border-rose-300 bg-rose-50 text-rose-800',
  CANCELLED: 'border-slate-200 bg-slate-100 text-slate-600',
};

const statCardStyles = {
  total: 'bg-[#094886] border-[#094886]',
  pending: 'bg-amber-50 border-amber-200',
  approved: 'bg-emerald-50 border-emerald-200',
  rejected: 'bg-rose-50 border-rose-200',
};

const statTextStyles = {
  total: 'text-white',
  pending: 'text-amber-800',
  approved: 'text-emerald-800',
  rejected: 'text-rose-800',
};

export default function AdminPanel() {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('PENDING');
  const [selectedAction, setSelectedAction] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    if (filter === 'ALL') {
      setFilteredBookings(bookings);
    } else {
      setFilteredBookings(bookings.filter((booking) => booking.status === filter));
    }
  }, [bookings, filter]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingAPI.getAllBookings();
      setBookings(response.data.data || []);
      setError('');
    } catch (err) {
      setError('Failed to fetch bookings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (bookingId) => {
    try {
      await bookingAPI.approveBooking(bookingId, adminNotes);
      setMessage({ type: 'success', text: 'Booking approved successfully.' });
      setAdminNotes('');
      setSelectedAction(null);
      await fetchBookings();
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to approve booking.' });
      console.error(err);
    }
  };

  const handleReject = async (bookingId) => {
    try {
      await bookingAPI.rejectBooking(bookingId, adminNotes);
      setMessage({ type: 'success', text: 'Booking rejected successfully.' });
      setAdminNotes('');
      setSelectedAction(null);
      await fetchBookings();
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to reject booking.' });
      console.error(err);
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

  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === 'PENDING').length,
    approved: bookings.filter((b) => b.status === 'APPROVED').length,
    rejected: bookings.filter((b) => b.status === 'REJECTED').length,
  };

  if (loading) {
    return (
      <section className="py-6">
        <div className="flex items-center justify-center rounded-lg border border-[#094886]/20 bg-white p-8 text-sm text-slate-700 shadow-sm">
          <div className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-[#094886]/30 border-t-[#094886]" />
          Loading bookings…
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      {/* Header */}
      <header className="flex flex-col gap-2 border-b border-[#094886]/20 pb-4">
        <h1 className="text-xl font-semibold text-[#094886]">Admin dashboard</h1>
        <p className="text-xs text-slate-500">
          Review incoming booking requests and keep resource usage under control.
        </p>

        {/* Stats */}
        <div className="mt-3 grid gap-3 text-xs sm:grid-cols-4">
          <AdminStat
            label="Total"
            value={stats.total}
            cardStyle={statCardStyles.total}
            textStyle={statTextStyles.total}
          />
          <AdminStat
            label="Pending"
            value={stats.pending}
            cardStyle={statCardStyles.pending}
            textStyle={statTextStyles.pending}
          />
          <AdminStat
            label="Approved"
            value={stats.approved}
            cardStyle={statCardStyles.approved}
            textStyle={statTextStyles.approved}
          />
          <AdminStat
            label="Rejected"
            value={stats.rejected}
            cardStyle={statCardStyles.rejected}
            textStyle={statTextStyles.rejected}
          />
        </div>
      </header>

      {/* Alert messages */}
      {message.text && (
        <div
          className={`rounded-md border px-3 py-2 text-xs ${
            message.type === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
              : 'border-rose-200 bg-rose-50 text-rose-800'
          }`}
        >
          {message.text}
        </div>
      )}

      {error && (
        <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-800">
          {error}
        </div>
      )}

      {/* Filter bar */}
      <div className="rounded-lg border border-[#094886]/15 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap gap-2">
          {STATUSES.map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`rounded-full px-3 py-1.5 text-[11px] font-semibold transition-colors ${
                filter === status
                  ? 'bg-[#094886] text-white'
                  : 'border border-slate-300 bg-white text-slate-600 hover:border-[#094886]/40 hover:bg-[#094886]/5 hover:text-[#094886]'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-[#094886]/15 bg-white shadow-sm">
        {filteredBookings.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">
            No bookings for the selected filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100 text-xs">
              <thead className="bg-[#094886]/5">
                <tr>
                  {['User', 'Resource', 'Date', 'Time', 'Status', 'Actions'].map((col) => (
                    <th
                      key={col}
                      className="px-4 py-3 text-left text-[11px] font-semibold text-[#094886]"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-[#094886]/[0.03]">
                    <td className="px-4 py-3 align-top">
                      <p className="font-semibold text-slate-900">{booking.userName}</p>
                      <p className="text-[11px] text-slate-400">{booking.userId}</p>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <p className="font-semibold text-slate-900">{booking.resourceName}</p>
                      <p className="text-[11px] text-slate-400">{booking.resourceType}</p>
                    </td>
                    <td className="px-4 py-3 align-top text-slate-700">
                      {formatDate(booking.bookingDate)}
                    </td>
                    <td className="px-4 py-3 align-top text-slate-700">
                      {formatTime(booking.startTime)} – {formatTime(booking.endTime)}
                    </td>
                    <td className="px-4 py-3 align-top">
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold ${
                          badgeStyles[booking.status] || badgeStyles.CANCELLED
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 align-top">
                      {booking.status === 'PENDING' ? (
                        <div className="flex flex-wrap gap-1.5">
                          <button
                            onClick={() =>
                              setSelectedAction({ type: 'approve', id: booking.id })
                            }
                            className="rounded-full bg-emerald-600 px-3 py-1.5 text-[10px] font-semibold text-white hover:bg-emerald-700"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() =>
                              setSelectedAction({ type: 'reject', id: booking.id })
                            }
                            className="rounded-full bg-rose-600 px-3 py-1.5 text-[10px] font-semibold text-white hover:bg-rose-700"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400">No actions</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Approval / Rejection modal */}
      {selectedAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#094886]/40 p-4">
          <div className="w-full max-w-md rounded-lg border border-[#094886]/20 bg-white p-5 shadow-lg">
            <h2 className="text-sm font-semibold text-[#094886]">
              {selectedAction.type === 'approve' ? 'Approve booking' : 'Reject booking'}
            </h2>
            <p className="mt-1 text-[11px] text-slate-500">
              Optionally add a short note that will be visible to the requester.
            </p>

            <div className="mt-4">
              <label className="mb-1 block text-[11px] font-semibold text-slate-700">
                Admin notes
              </label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={4}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20"
                placeholder="Short explanation (optional)"
              />
            </div>

            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <button
                onClick={() => {
                  if (selectedAction.type === 'approve') {
                    handleApprove(selectedAction.id);
                  } else {
                    handleReject(selectedAction.id);
                  }
                }}
                className={`flex-1 rounded-full px-4 py-2.5 text-[11px] font-semibold text-white ${
                  selectedAction.type === 'approve'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                {selectedAction.type === 'approve' ? 'Confirm approval' : 'Confirm rejection'}
              </button>
              <button
                onClick={() => {
                  setSelectedAction(null);
                  setAdminNotes('');
                }}
                className="flex-1 rounded-full border border-slate-300 bg-white px-4 py-2.5 text-[11px] font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function AdminStat({ label, value, cardStyle = '', textStyle = '' }) {
  return (
    <div className={`rounded-md border px-3 py-2 shadow-sm ${cardStyle}`}>
      <p className={`text-[11px] font-medium ${textStyle} opacity-80`}>{label}</p>
      <p className={`mt-1 text-base font-semibold ${textStyle}`}>{value}</p>
    </div>
  );
}