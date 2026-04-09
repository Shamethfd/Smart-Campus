import { useState, useEffect } from 'react';
import bookingAPI from '../services/bookingAPI';

const STATUS = {
  PENDING: {
    card: 'border-amber-200/60 bg-gradient-to-br from-amber-50/80 to-white',
    badge: 'bg-amber-100 text-amber-700 ring-1 ring-amber-300/60',
    dot: 'bg-amber-400',
    glow: 'shadow-amber-100',
  },
  APPROVED: {
    card: 'border-emerald-200/60 bg-gradient-to-br from-emerald-50/80 to-white',
    badge: 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-300/60',
    dot: 'bg-emerald-400',
    glow: 'shadow-emerald-100',
  },
  REJECTED: {
    card: 'border-rose-200/60 bg-gradient-to-br from-rose-50/80 to-white',
    badge: 'bg-rose-100 text-rose-700 ring-1 ring-rose-300/60',
    dot: 'bg-rose-400',
    glow: 'shadow-rose-100',
  },
  CANCELLED: {
    card: 'border-slate-200/60 bg-gradient-to-br from-slate-50/80 to-white',
    badge: 'bg-slate-100 text-slate-500 ring-1 ring-slate-300/60',
    dot: 'bg-slate-300',
    glow: 'shadow-slate-100',
  },
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

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  const formatTime = (t) => t || 'N/A';

  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === 'PENDING').length,
    approved: bookings.filter((b) => b.status === 'APPROVED').length,
    cancelled: bookings.filter((b) => b.status === 'CANCELLED').length,
  };

  if (loading) {
    return (
      <section className="py-10 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div
            className="h-10 w-10 rounded-full border-[3px] animate-spin"
            style={{ borderColor: '#094886', borderTopColor: '#2563eb' }}
          />
          <p className="text-sm font-medium text-slate-500">Loading your bookings…</p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-7">
      {/* ── Header ── */}
      <header className="relative overflow-hidden rounded-2xl p-6 text-white"
        style={{ background: 'linear-gradient(135deg, #094886 0%, #1d5fa8 55%, #2563eb 100%)' }}
      >
        {/* decorative blobs */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-8 left-24 h-32 w-32 rounded-full bg-white/5" />

        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-200">
            Dashboard
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">My Bookings</h1>
          <p className="mt-1 text-sm text-blue-100/80">
            Track every request you have submitted.
          </p>

          {/* Stats row */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: 'Total', value: stats.total, accent: 'bg-white/20' },
              { label: 'Pending', value: stats.pending, accent: 'bg-amber-400/20' },
              { label: 'Approved', value: stats.approved, accent: 'bg-emerald-400/20' },
              { label: 'Cancelled', value: stats.cancelled, accent: 'bg-slate-400/20' },
            ].map(({ label, value, accent }) => (
              <div
                key={label}
                className={`${accent} backdrop-blur-sm rounded-xl px-4 py-3 border border-white/10`}
              >
                <p className="text-[11px] font-medium uppercase tracking-wider text-blue-100/70">
                  {label}
                </p>
                <p className="mt-1 text-2xl font-bold">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ── Alerts ── */}
      {error && (
        <div className="flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 shadow-sm shadow-rose-100">
          <svg className="h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      {message.text && (
        <div
          className={`flex items-center gap-2.5 rounded-xl border px-4 py-3 text-sm shadow-sm ${
            message.type === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-700 shadow-emerald-100'
              : 'border-rose-200 bg-rose-50 text-rose-700 shadow-rose-100'
          }`}
        >
          <svg className="h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            {message.type === 'success' ? (
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            ) : (
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            )}
          </svg>
          {message.text}
        </div>
      )}

      {/* ── Empty state ── */}
      {bookings.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/60 py-16 text-center">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-2xl"
            style={{ background: 'linear-gradient(135deg, #094886, #2563eb)' }}
          >
            <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700">No bookings yet</p>
            <p className="mt-1 text-xs text-slate-400">Create your first booking from the booking page.</p>
          </div>
        </div>
      ) : (
        /* ── Booking cards ── */
        <div className="space-y-4">
          {bookings.map((booking, index) => {
            const s = STATUS[booking.status] || STATUS.CANCELLED;
            return (
              <article
                key={booking.id}
                className={`group rounded-2xl border ${s.card} p-5 shadow-md ${s.glow} transition-shadow hover:shadow-lg`}
              >
                <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                  {/* Left */}
                  <div className="min-w-0 flex-1 space-y-3.5">
                    {/* Badges row */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white"
                        style={{ background: '#094886' }}
                      >
                        #{index + 1}
                      </span>
                      <span className={`flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${s.badge}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
                        {booking.status}
                      </span>
                    </div>

                    {/* Resource name */}
                    <div>
                      <h2 className="text-base font-bold text-slate-900 leading-tight">
                        {booking.resourceName}
                      </h2>
                      <p className="mt-0.5 text-xs text-slate-400">
                        {booking.resourceType}
                        {booking.resourceId ? (
                          <span
                            className="ml-1.5 rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold text-white"
                            style={{ background: '#094886' }}
                          >
                            {booking.resourceId}
                          </span>
                        ) : null}
                      </p>
                    </div>

                    {/* Date & time */}
                    <div className="grid gap-3 sm:grid-cols-2">
                      <InfoChip
                        icon={
                          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25" />
                          </svg>
                        }
                        label="Date"
                        value={formatDate(booking.bookingDate)}
                      />
                      <InfoChip
                        icon={
                          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        }
                        label="Time"
                        value={`${formatTime(booking.startTime)} – ${formatTime(booking.endTime)}`}
                      />
                    </div>

                    {/* Notes */}
                    {booking.notes && (
                      <div className="rounded-xl border border-slate-200/80 bg-white/70 px-3.5 py-3">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Notes</p>
                        <p className="mt-1 text-xs leading-relaxed text-slate-600">{booking.notes}</p>
                      </div>
                    )}
                  </div>

                  {/* Right */}
                  <div className="flex w-full flex-col gap-3 md:w-56 md:shrink-0">
                    <div className="rounded-xl border border-slate-200/80 bg-white/60 px-3.5 py-3">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Requested on</p>
                      <p className="mt-0.5 text-xs font-semibold text-slate-700">
                        {booking.createdAt
                          ? new Date(booking.createdAt).toLocaleDateString()
                          : 'N/A'}
                      </p>
                    </div>

                    {booking.adminNotes && (
                      <div
                        className="rounded-xl px-3.5 py-3"
                        style={{ background: '#094886' + '12', border: '1px solid ' + '#094886' + '30' }}
                      >
                        <p
                          className="text-[10px] font-bold uppercase tracking-widest"
                          style={{ color: '#094886' }}
                        >
                          Admin notes
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-slate-700">{booking.adminNotes}</p>
                      </div>
                    )}

                    {/* Action button */}
                    {booking.status === 'APPROVED' ? (
                      <button
                        onClick={() => handleCancelBooking(booking.id)}
                        className="mt-auto flex w-full items-center justify-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm shadow-rose-200 transition hover:bg-rose-700 active:scale-95"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Cancel booking
                      </button>
                    ) : booking.status === 'PENDING' ? (
                      <div className="mt-auto flex w-full items-center justify-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 px-4 py-2.5 text-xs font-bold text-amber-700">
                        <svg className="h-3.5 w-3.5 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        Awaiting approval
                      </div>
                    ) : (
                      <div className="mt-auto flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-xs font-semibold text-slate-400">
                        No action available
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

function InfoChip({ icon, label, value }) {
  return (
    <div className="flex items-start gap-2 rounded-xl border border-slate-200/70 bg-white/60 px-3 py-2.5">
      <span className="mt-0.5 shrink-0 text-slate-400">{icon}</span>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</p>
        <p className="mt-0.5 truncate text-xs font-semibold text-slate-800">{value}</p>
      </div>
    </div>
  );
}