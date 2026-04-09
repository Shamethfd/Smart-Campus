import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import bookingAPI from '../services/bookingAPI';

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
    <div className="adm-layout">
      <Sidebar />

      <main className="adm-content">
        <header className="adm-page-header">
          <div>
            <h1 className="adm-page-header__title">🗓️ Booking management</h1>
            <p className="adm-page-header__sub">
              Review incoming booking requests and keep resource usage under control.
            </p>
          </div>
          <div className="adm-page-header__actions">
            <button type="button" className="btn btn--ghost" onClick={fetchBookings} title="Refresh list">
              🔄 Refresh
            </button>
          </div>
        </header>

        <section className="adm-stats" aria-label="Booking statistics">
          <StatCard icon="📋" label="Total" value={stats.total} color="#1e3a8a" loading={loading} />
          <StatCard icon="⏳" label="Pending" value={stats.pending} color="#d97706" loading={loading} />
          <StatCard icon="✅" label="Approved" value={stats.approved} color="#059669" loading={loading} />
          <StatCard icon="✖️" label="Rejected" value={stats.rejected} color="#dc2626" loading={loading} />
        </section>

        {message.text && (
          <div
            role="status"
            style={{
              marginBottom: 'var(--spacing-4)',
              padding: 'var(--spacing-3) var(--spacing-4)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid',
              borderColor: message.type === 'success' ? '#a7f3d0' : '#fecaca',
              background: message.type === 'success' ? '#ecfdf5' : '#fef2f2',
              color: message.type === 'success' ? '#047857' : '#b91c1c',
              fontSize: '0.875rem',
            }}
          >
            {message.text}
          </div>
        )}

        {error && (
          <div
            role="alert"
            style={{
              marginBottom: 'var(--spacing-4)',
              padding: 'var(--spacing-3) var(--spacing-4)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid #fecaca',
              background: '#fef2f2',
              color: '#b91c1c',
              fontSize: '0.875rem',
            }}
          >
            {error}
          </div>
        )}

        <div style={{ marginBottom: 'var(--spacing-4)' }}>
          <p className="adm-results-count">Filter by status</p>
          <div className="adm-filter-tabs" role="tablist" aria-label="Booking status filters">
            {STATUSES.map((status) => (
              <button
                key={status}
                type="button"
                role="tab"
                aria-selected={filter === status}
                className={`adm-filter-tab ${filter === status ? 'adm-filter-tab--active' : ''}`}
                onClick={() => setFilter(status)}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="adm-table-wrapper">
          {!loading && filteredBookings.length === 0 ? (
            <div className="empty-state" style={{ border: 'none', boxShadow: 'none' }}>
              <span className="empty-state__icon">🗓️</span>
              <h3>No bookings</h3>
              <p>No bookings for the selected filter.</p>
            </div>
          ) : loading ? (
            <div style={{ padding: 'var(--spacing-8)', textAlign: 'center', color: 'var(--gray-500)' }}>
              Loading bookings…
            </div>
          ) : (
            <table className="adm-table">
              <thead>
                <tr>
                  {['User', 'Resource', 'Date', 'Time', 'Status', 'Actions'].map((col) => (
                    <th key={col}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => {
                  const st = booking.status || 'CANCELLED';
                  const badge = STATUS_BADGE_STYLE[st] || STATUS_BADGE_STYLE.CANCELLED;
                  return (
                    <tr key={booking.id} className="adm-table__row">
                      <td>
                        <p className="adm-table__cell-title">{booking.userName || '—'}</p>
                        <p className="adm-table__cell-email" style={{ fontSize: '0.75rem', marginTop: 4 }}>
                          {booking.userId || ''}
                        </p>
                      </td>
                      <td>
                        <p className="adm-table__cell-title">{booking.resourceName || '—'}</p>
                        <p className="adm-table__cell-msg" style={{ fontSize: '0.75rem', marginTop: 4 }}>
                          {booking.resourceType || ''}
                        </p>
                      </td>
                      <td className="adm-table__cell-time">{formatDate(booking.bookingDate)}</td>
                      <td className="adm-table__cell-time">
                        {formatTime(booking.startTime)} – {formatTime(booking.endTime)}
                      </td>
                      <td>
                        <span
                          className="adm-type-badge"
                          style={{
                            background: badge.bg,
                            color: badge.color,
                            border: `1px solid ${badge.border}`,
                          }}
                        >
                          {st}
                        </span>
                      </td>
                      <td>
                        {booking.status === 'PENDING' ? (
                          <div className="adm-table__actions">
                            <button
                              type="button"
                              className="btn btn--sm btn--success-ghost"
                              onClick={() => setSelectedAction({ type: 'approve', id: booking.id })}
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              className="btn btn--sm btn--danger-ghost"
                              onClick={() => setSelectedAction({ type: 'reject', id: booking.id })}
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.8rem', color: 'var(--gray-400)' }}>—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <footer className="adm-footer">Smart Campus Admin Panel · Booking management</footer>

        {selectedAction && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-modal-title"
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 60,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(15, 23, 42, 0.45)',
              padding: 'var(--spacing-4)',
            }}
          >
            <div
              style={{
                width: '100%',
                maxWidth: 440,
                background: '#fff',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-lg)',
                border: '1px solid var(--gray-200)',
                padding: 'var(--spacing-6)',
              }}
            >
              <h2
                id="booking-modal-title"
                style={{
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  color: 'var(--gray-900)',
                  marginBottom: 'var(--spacing-2)',
                }}
              >
                {selectedAction.type === 'approve' ? 'Approve booking' : 'Reject booking'}
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)', marginBottom: 'var(--spacing-4)' }}>
                Optionally add a short note for the requester.
              </p>
              <label htmlFor="admin-notes" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: 6 }}>
                Admin notes
              </label>
              <textarea
                id="admin-notes"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={4}
                style={{
                  width: '100%',
                  padding: 'var(--spacing-3)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--gray-300)',
                  fontFamily: 'inherit',
                  fontSize: '0.875rem',
                  resize: 'vertical',
                }}
                placeholder="Short explanation (optional)"
              />
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 'var(--spacing-3)',
                  marginTop: 'var(--spacing-4)',
                }}
              >
                <button
                  type="button"
                  className={
                    selectedAction.type === 'approve' ? 'btn btn--primary' : 'btn btn--danger-ghost'
                  }
                  style={
                    selectedAction.type === 'reject'
                      ? { background: '#dc2626', color: '#fff', borderColor: '#dc2626' }
                      : {}
                  }
                  onClick={() => {
                    if (selectedAction.type === 'approve') handleApprove(selectedAction.id);
                    else handleReject(selectedAction.id);
                  }}
                >
                  {selectedAction.type === 'approve' ? 'Confirm approval' : 'Confirm rejection'}
                </button>
                <button
                  type="button"
                  className="btn btn--ghost"
                  onClick={() => {
                    setSelectedAction(null);
                    setAdminNotes('');
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
