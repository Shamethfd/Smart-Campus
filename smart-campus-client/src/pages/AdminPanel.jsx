import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import bookingAPI from '../services/bookingAPI';
import Button from '../components/ui/Button';
import Card, { CardBody } from '../components/ui/Card';

const STATUSES = ['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'];

const STATUS_BADGE_STYLE = {
  PENDING: { bg: '#fef3c7', color: '#b45309', border: '#fde68a' },
  APPROVED: { bg: '#d1fae5', color: '#047857', border: '#a7f3d0' },
  REJECTED: { bg: '#fee2e2', color: '#b91c1c', border: '#fecaca' },
  CANCELLED: { bg: '#f1f5f9', color: '#64748b', border: '#e2e8f0' },
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
      setFilteredBookings(bookings.filter((b) => b.status === filter));
    }
  }, [bookings, filter]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await bookingAPI.getAllBookings();
      setBookings(response.data?.data || []);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Failed to fetch bookings';
      setError(typeof msg === 'string' ? msg : 'Failed to fetch bookings');
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
    if (dateString == null) return '—';
    const d = new Date(dateString);
    return Number.isNaN(d.getTime())
      ? String(dateString)
      : d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatTime = (timeString) => {
    if (timeString == null || timeString === '') return '—';
    return String(timeString);
  };

  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === 'PENDING').length,
    approved: bookings.filter((b) => b.status === 'APPROVED').length,
    rejected: bookings.filter((b) => b.status === 'REJECTED').length,
  };

  return (
    <div className="flex min-h-dvh bg-slate-50">
      <Sidebar />

      <main className="min-w-0 flex-1 p-4 sm:p-8">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
              🗓️ Booking management
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Review incoming booking requests and keep resource usage under control.
            </p>
          </div>
          <Button type="button" variant="outline" onClick={fetchBookings} title="Refresh list">
            🔄 Refresh
          </Button>
        </header>

        <section className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4" aria-label="Booking statistics">
          <StatCard icon="📋" label="Total" value={stats.total} color="#1e3a8a" loading={loading} />
          <StatCard icon="⏳" label="Pending" value={stats.pending} color="#d97706" loading={loading} />
          <StatCard icon="✅" label="Approved" value={stats.approved} color="#059669" loading={loading} />
          <StatCard icon="✖️" label="Rejected" value={stats.rejected} color="#dc2626" loading={loading} />
        </section>

        {message.text && (
          <div
            role="status"
            className={[
              'mt-5 rounded-2xl border px-4 py-3 text-sm font-semibold',
              message.type === 'success'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                : 'border-red-200 bg-red-50 text-red-800',
            ].join(' ')}
          >
            {message.text}
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800"
          >
            {error}
          </div>
        )}

        <div className="mt-6">
          <p className="text-sm font-semibold text-slate-500">Filter by status</p>
          <div className="mt-3 flex gap-2 overflow-auto pb-1" role="tablist" aria-label="Booking status filters">
            {STATUSES.map((status) => {
              const active = filter === status;
              return (
                <button
                  key={status}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  className={[
                    'shrink-0 rounded-full border px-4 py-2 text-sm font-bold transition',
                    active
                      ? 'border-slate-900 bg-slate-900 text-white'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                  ].join(' ')}
                  onClick={() => setFilter(status)}
                >
                  {status}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-5 overflow-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          {!loading && filteredBookings.length === 0 ? (
            <Card className="border-0 shadow-none">
              <CardBody className="py-12 text-center">
                <div className="text-3xl">🗓️</div>
                <h3 className="mt-2 text-base font-extrabold text-slate-900">No bookings</h3>
                <p className="mt-1 text-sm text-slate-600">No bookings for the selected filter.</p>
              </CardBody>
            </Card>
          ) : loading ? (
            <div className="p-10 text-center text-sm font-semibold text-slate-500">
              Loading bookings…
            </div>
          ) : (
            <table className="min-w-[920px] w-full text-left text-sm">
              <thead className="bg-slate-50 text-[11px] font-extrabold uppercase tracking-widest text-slate-500">
                <tr>
                  {['User', 'Resource', 'Date', 'Time', 'Status', 'Actions'].map((col) => (
                    <th key={col} className="px-4 py-4">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBookings.map((booking) => {
                  const st = booking.status || 'CANCELLED';
                  const badge = STATUS_BADGE_STYLE[st] || STATUS_BADGE_STYLE.CANCELLED;
                  return (
                    <tr key={booking.id} className="hover:bg-slate-50">
                      <td className="px-4 py-4">
                        <p className="font-extrabold text-slate-900">{booking.userName || '—'}</p>
                        <p className="mt-1 text-xs text-slate-500">{booking.userId || ''}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-extrabold text-slate-900">{booking.resourceName || '—'}</p>
                        <p className="mt-1 text-xs text-slate-500">{booking.resourceType || ''}</p>
                      </td>
                      <td className="px-4 py-4 text-slate-600">{formatDate(booking.bookingDate)}</td>
                      <td className="px-4 py-4 text-slate-600">
                        {formatTime(booking.startTime)} – {formatTime(booking.endTime)}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className="inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-extrabold tracking-wider"
                          style={{ background: badge.bg, color: badge.color, borderColor: badge.border }}
                        >
                          {st}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        {booking.status === 'PENDING' ? (
                          <div className="flex flex-wrap gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                              onClick={() => setSelectedAction({ type: 'approve', id: booking.id })}
                            >
                              Approve
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="border-red-300 text-red-700 hover:bg-red-50"
                              onClick={() => setSelectedAction({ type: 'reject', id: booking.id })}
                            >
                              Reject
                            </Button>
                          </div>
                        ) : (
                          <span className="text-sm font-semibold text-slate-400">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <footer className="mt-10 text-center text-xs font-semibold text-slate-400">
          Smart Campus Admin Panel · Booking management
        </footer>

        {selectedAction && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-modal-title"
            className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 p-4"
          >
            <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
              <h2 id="booking-modal-title" className="text-base font-extrabold text-slate-900">
                {selectedAction.type === 'approve' ? 'Approve booking' : 'Reject booking'}
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Optionally add a short note for the requester.
              </p>
              <label htmlFor="admin-notes" className="mt-4 block text-sm font-bold text-slate-700">
                Admin notes
              </label>
              <textarea
                id="admin-notes"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={4}
                className="mt-2 w-full resize-y rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                placeholder="Short explanation (optional)"
              />
              <div className="mt-5 flex flex-wrap gap-3">
                <Button
                  type="button"
                  variant={selectedAction.type === 'approve' ? 'primary' : 'danger'}
                  onClick={() => {
                    if (selectedAction.type === 'approve') handleApprove(selectedAction.id);
                    else handleReject(selectedAction.id);
                  }}
                >
                  {selectedAction.type === 'approve' ? 'Confirm approval' : 'Confirm rejection'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setSelectedAction(null);
                    setAdminNotes('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
