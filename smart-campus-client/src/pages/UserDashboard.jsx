import { useState, useEffect } from 'react';
import bookingAPI from '../services/bookingAPI';

const statusCardStyles = {
  PENDING: 'border-amber-200 bg-amber-50',
  APPROVED: 'border-emerald-200 bg-emerald-50',
  REJECTED: 'border-rose-200 bg-rose-50',
  CANCELLED: 'border-slate-200 bg-slate-100',
};

const statusBadgeStyles = {
  PENDING: 'border-amber-200 bg-amber-100 text-amber-800',
  APPROVED: 'border-emerald-200 bg-emerald-100 text-emerald-800',
  REJECTED: 'border-rose-200 bg-rose-100 text-rose-800',
  CANCELLED: 'border-slate-200 bg-slate-200 text-slate-700',
};

export default function UserDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

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
        setMessage({ type: 'success', text: 'Booking cancelled successfully.' });
        await fetchUserBookings();
      } catch (err) {
        setMessage({ type: 'error', text: 'Failed to cancel booking.' });
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

  const stats = {
    total: bookings.length,
    pending: bookings.filter((booking) => booking.status === 'PENDING').length,
    approved: bookings.filter((booking) => booking.status === 'APPROVED').length,
    cancelled: bookings.filter((booking) => booking.status === 'CANCELLED').length,
  };

  if (loading) {
    return (
      <section className="py-6">
        <div className="flex items-center justify-center rounded-lg border border-slate-200 bg-white p-8 text-sm text-slate-700 shadow-sm">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-secondary/30 border-t-secondary mr-3" />
          Loading your bookings…
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-2 border-b border-slate-200 pb-4">
        <h1 className="text-xl font-semibold text-slate-900">My bookings</h1>
        <p className="text-xs text-slate-500">Track every request you have submitted.</p>
        <div className="mt-3 grid gap-3 text-xs sm:grid-cols-4">
          <StatTile label="Total" value={stats.total} />
          <StatTile label="Pending" value={stats.pending} />
          <StatTile label="Approved" value={stats.approved} />
          <StatTile label="Cancelled" value={stats.cancelled} />
        </div>
      </header>

      {error && (
        <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-800">
          {error}
        </div>
      )}

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

      {bookings.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
          No bookings yet. Create your first booking from the booking page.
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking, index) => (
            <article
              key={booking.id}
              className={`rounded-lg border bg-white p-5 text-sm shadow-sm ${statusCardStyles[booking.status] || statusCardStyles.CANCELLED}`}
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-primary/5 px-2.5 py-1 text-[10px] font-semibold text-primary">
                      Booking #{index + 1}
                    </span>
                    <span
                      className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold ${statusBadgeStyles[booking.status] || statusBadgeStyles.CANCELLED}`}
                    >
                      {booking.status}
                    </span>
                  </div>
                  <h2 className="text-sm font-semibold text-slate-900">
                    {booking.resourceName}
                  </h2>
                  <p className="text-xs text-slate-600">
                    {booking.resourceType}
                    {booking.resourceId ? ` · ${booking.resourceId}` : ''}
                  </p>

                  <div className="mt-3 grid gap-3 text-xs sm:grid-cols-2">
                    <InfoItem label="Date" value={formatDate(booking.bookingDate)} />
                    <InfoItem
                      label="Time"
                      value={`${formatTime(booking.startTime)} - ${formatTime(booking.endTime)}`}
                    />
                  </div>

                  {booking.notes && (
                    <div className="mt-3 rounded-md border border-slate-200 bg-white/70 p-3">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                        Notes
                      </p>
                      <p className="mt-1 text-xs text-slate-700">{booking.notes}</p>
                    </div>
                  )}
                </div>

                <div className="w-full max-w-xs space-y-3">
                  <InfoItem
                    label="Requested on"
                    value={booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : 'N/A'}
                  />
                  {booking.adminNotes && (
                    <div className="rounded-md border border-primary/15 bg-primary/5 p-3">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-primary">
                        Admin notes
                      </p>
                      <p className="mt-1 text-xs text-slate-700">{booking.adminNotes}</p>
                    </div>
                  )}

                  <div>
                    {booking.status === 'APPROVED' ? (
                      <button
                        onClick={() => handleCancelBooking(booking.id)}
                        className="inline-flex w-full items-center justify-center rounded-full bg-rose-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-rose-700"
                      >
                        Cancel booking
                      </button>
                    ) : booking.status === 'PENDING' ? (
                      <button
                        disabled
                        className="inline-flex w-full cursor-not-allowed items-center justify-center rounded-full border border-amber-300 bg-amber-50 px-4 py-2.5 text-xs font-semibold text-amber-800"
                      >
                        Awaiting approval
                      </button>
                    ) : (
                      <button
                        disabled
                        className="inline-flex w-full cursor-not-allowed items-center justify-center rounded-full border border-slate-300 bg-slate-100 px-4 py-2.5 text-xs font-semibold text-slate-600"
                      >
                        No action available
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function StatTile({ label, value }) {
  return (
    <div className="rounded-md border border-slate-200 bg-white px-3 py-2 shadow-sm">
      <p className="text-[11px] text-slate-500">{label}</p>
      <p className="mt-1 text-base font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div>
      <p className="text-[11px] text-slate-500">{label}</p>
      <p className="mt-0.5 text-xs font-semibold text-slate-900">{value}</p>
    </div>
  );
}
