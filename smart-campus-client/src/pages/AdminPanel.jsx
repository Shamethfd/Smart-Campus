import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import bookingAPI from '../services/bookingAPI';

/* ─── constants ─────────────────────────────────────── */
const STATUSES = ['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'];

const STATUS_CFG = {
  PENDING:   { bg: '#fffbeb', color: '#b45309', border: '#fde68a', dot: '#f59e0b', label: 'Pending'   },
  APPROVED:  { bg: '#ecfdf5', color: '#047857', border: '#a7f3d0', dot: '#10b981', label: 'Approved'  },
  REJECTED:  { bg: '#fff1f2', color: '#be123c', border: '#fecdd3', dot: '#f43f5e', label: 'Rejected'  },
  CANCELLED: { bg: '#f8fafc', color: '#64748b', border: '#e2e8f0', dot: '#94a3b8', label: 'Cancelled' },
};

/* ─── small helpers ──────────────────────────────────── */
const formatDate = (v) => {
  if (v == null) return '—';
  const d = new Date(v);
  return isNaN(d) ? String(v) : d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};
const formatTime = (v) => (v == null || v === '' ? '—' : String(v));

/* stat mini-card */
const MiniStat = ({ label, value, color, icon, loading }) => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
         style={{ background: `${color}18` }}>
      {icon}
    </div>
    <div>
      <p className="text-xs font-bold uppercase tracking-widest text-slate-400">{label}</p>
      {loading
        ? <div className="mt-1 h-7 w-10 rounded-lg bg-slate-100 animate-pulse" />
        : <p className="text-2xl font-black" style={{ color }}>{value}</p>}
    </div>
  </div>
);

/* status badge */
const Badge = ({ status }) => {
  const cfg = STATUS_CFG[status] || STATUS_CFG.CANCELLED;
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black tracking-widest border"
          style={{ background: cfg.bg, color: cfg.color, borderColor: cfg.border }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.dot }} />
      {cfg.label}
    </span>
  );
};

/* filter tab */
const FilterTab = ({ label, active, count, onClick }) => (
  <button type="button" onClick={onClick}
          className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border transition-all duration-200"
          style={active
            ? { background: 'linear-gradient(135deg,#094886,#2563eb)', color: '#fff', borderColor: 'transparent', boxShadow: '0 2px 10px #094886/30' }
            : { background: '#fff', color: '#64748b', borderColor: '#e2e8f0' }}>
    {label}
    {count != null && (
      <span className="ml-0.5 px-1.5 py-0.5 rounded-full text-[10px]"
            style={active ? { background: 'rgba(255,255,255,0.25)' } : { background: '#f1f5f9', color: '#94a3b8' }}>
        {count}
      </span>
    )}
  </button>
);

/* ─── main component ─────────────────────────────────── */
export default function AdminPanel() {
  const [bookings,         setBookings]         = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading,          setLoading]          = useState(true);
  const [error,            setError]            = useState('');
  const [filter,           setFilter]           = useState('PENDING');
  const [selectedAction,   setSelectedAction]   = useState(null);
  const [adminNotes,       setAdminNotes]       = useState('');
  const [message,          setMessage]          = useState({ type: '', text: '' });

  useEffect(() => { fetchBookings(); }, []);

  useEffect(() => {
    const refreshBookings = () => fetchBookings();

    const handleStorageRefresh = (event) => {
      if (event.key === 'smartCampus:lastBookingAt') {
        fetchBookings();
      }
    };

    window.addEventListener('smart-campus:booking-created', refreshBookings);
    window.addEventListener('storage', handleStorageRefresh);

    const intervalId = setInterval(fetchBookings, 10000);

    return () => {
      window.removeEventListener('smart-campus:booking-created', refreshBookings);
      window.removeEventListener('storage', handleStorageRefresh);
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (message.text) {
      const t = setTimeout(() => setMessage({ type: '', text: '' }), 4000);
      return () => clearTimeout(t);
    }
  }, [message]);

  useEffect(() => {
    setFilteredBookings(filter === 'ALL' ? bookings : bookings.filter(b => b.status === filter));
  }, [bookings, filter]);

  const fetchBookings = async () => {
    try {
      setLoading(true); setError('');
      const res = await bookingAPI.getAllBookings();
      setBookings(res.data?.data || []);
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to fetch bookings';
      setError(typeof msg === 'string' ? msg : 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await bookingAPI.approveBooking(id, adminNotes);
      setMessage({ type: 'success', text: 'Booking approved successfully.' });
      setAdminNotes(''); setSelectedAction(null);
      await fetchBookings();
    } catch { setMessage({ type: 'error', text: 'Failed to approve booking.' }); }
  };

  const handleReject = async (id) => {
    try {
      await bookingAPI.rejectBooking(id, adminNotes);
      setMessage({ type: 'success', text: 'Booking rejected successfully.' });
      setAdminNotes(''); setSelectedAction(null);
      await fetchBookings();
    } catch { setMessage({ type: 'error', text: 'Failed to reject booking.' }); }
  };

  const counts = {
    ALL: bookings.length,
    PENDING:   bookings.filter(b => b.status === 'PENDING').length,
    APPROVED:  bookings.filter(b => b.status === 'APPROVED').length,
    REJECTED:  bookings.filter(b => b.status === 'REJECTED').length,
    CANCELLED: bookings.filter(b => b.status === 'CANCELLED').length,
  };

  return (
    <div className="flex min-h-screen" style={{ background: '#f0f4fa' }}>
      <Sidebar />

      <main className="flex-1 min-w-0 flex flex-col">

        {/* ── Top header banner ── */}
        <div className="relative overflow-hidden px-6 sm:px-10 py-8"
             style={{ background: 'linear-gradient(135deg,#094886 0%,#2563eb 100%)' }}>
          <div className="absolute -top-10 -right-10 w-52 h-52 rounded-full opacity-10 bg-white" />
          <div className="absolute bottom-0 left-32 w-36 h-36 rounded-full opacity-10 bg-white" />

          <div className="relative flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-1">Admin Panel</p>
              <h1 className="text-3xl font-black text-white">Booking Management</h1>
              <p className="text-blue-200 text-sm mt-1">Review requests and manage resource usage</p>
            </div>
            <button type="button" onClick={fetchBookings}
                    className="self-start sm:self-auto flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-white/20 hover:bg-white/30 text-white border border-white/30 transition-all duration-200">
              <span className={loading ? 'animate-spin inline-block' : ''}>↻</span>
              Refresh
            </button>
          </div>

          {/* stats row inside banner */}
          <div className="relative mt-8 grid grid-cols-2 xl:grid-cols-4 gap-3">
            <MiniStat label="Total"    value={counts.ALL}      color="#094886" icon="📋" loading={loading} />
            <MiniStat label="Pending"  value={counts.PENDING}  color="#d97706" icon="⏳" loading={loading} />
            <MiniStat label="Approved" value={counts.APPROVED} color="#059669" icon="✅" loading={loading} />
            <MiniStat label="Rejected" value={counts.REJECTED} color="#e11d48" icon="✖️" loading={loading} />
          </div>
        </div>

        <div className="flex-1 px-4 sm:px-8 py-7">

          {/* toast */}
          {message.text && (
            <div className={`mb-5 flex items-center gap-3 p-4 rounded-xl border text-sm font-semibold ${
              message.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}>
              <span>{message.type === 'success' ? '✓' : '✕'}</span>
              {message.text}
            </div>
          )}

          {error && (
            <div className="mb-5 flex items-center gap-3 p-4 rounded-xl border bg-rose-50 border-rose-200 text-rose-800 text-sm font-semibold">
              ⚠ {error}
            </div>
          )}

          {/* filter tabs */}
          <div className="mb-5">
            <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Filter by status</p>
            <div className="flex flex-wrap gap-2">
              {STATUSES.map(s => (
                <FilterTab key={s}
                           label={s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
                           count={counts[s]}
                           active={filter === s}
                           onClick={() => setFilter(s)} />
              ))}
            </div>
          </div>

          {/* table card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

            {/* table header bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100"
                 style={{ background: 'linear-gradient(90deg,#f0f6ff,#f8faff)' }}>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                     style={{ background: 'linear-gradient(135deg,#094886,#2563eb)' }}>
                  <span className="text-white text-xs">📋</span>
                </div>
                <p className="text-sm font-black" style={{ color: '#094886' }}>
                  Bookings
                  <span className="ml-2 text-xs font-bold text-slate-400">
                    ({filteredBookings.length})
                  </span>
                </p>
              </div>
            </div>

            {loading ? (
              <div className="py-16 text-center">
                <div className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin mx-auto"
                     style={{ borderColor: '#2563eb', borderTopColor: 'transparent' }} />
                <p className="mt-3 text-sm font-semibold text-slate-400">Loading bookings…</p>
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="py-16 text-center">
                <div className="text-4xl mb-3">🗓️</div>
                <p className="text-base font-black text-slate-700">No bookings found</p>
                <p className="text-sm text-slate-400 mt-1">No bookings match the selected filter.</p>
              </div>
            ) : (
              <div className="overflow-auto">
                <table className="w-full min-w-[860px] text-sm text-left">
                  <thead>
                    <tr style={{ background: '#f8fafc' }}>
                      {['User', 'Resource', 'Date', 'Time', 'Status', 'Actions'].map(col => (
                        <th key={col}
                            className="px-5 py-3.5 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map((booking, idx) => (
                      <tr key={booking.id}
                          className="border-b border-slate-50 transition-colors duration-150 hover:bg-blue-50/40"
                          style={idx % 2 === 0 ? {} : { background: '#fafbff' }}>

                        {/* User */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0"
                                 style={{ background: 'linear-gradient(135deg,#094886,#2563eb)' }}>
                              {(booking.userName || '?').charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-slate-800">{booking.userName || '—'}</p>
                              <p className="text-xs text-slate-400">{booking.userId || ''}</p>
                            </div>
                          </div>
                        </td>

                        {/* Resource */}
                        <td className="px-5 py-4">
                          <p className="font-bold text-slate-800">{booking.resourceName || '—'}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{booking.resourceType || ''}</p>
                        </td>

                        {/* Date */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1.5 text-slate-600">
                            <span className="text-slate-400">📅</span>
                            <span className="font-semibold">{formatDate(booking.bookingDate)}</span>
                          </div>
                        </td>

                        {/* Time */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1.5 text-slate-600">
                            <span className="text-slate-400">🕐</span>
                            <span className="font-semibold tabular-nums">
                              {formatTime(booking.startTime)} – {formatTime(booking.endTime)}
                            </span>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4">
                          <Badge status={booking.status || 'CANCELLED'} />
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4">
                          {booking.status === 'PENDING' ? (
                            <div className="flex gap-2">
                              <button type="button"
                                      onClick={() => setSelectedAction({ type: 'approve', id: booking.id })}
                                      className="px-3 py-1.5 rounded-lg text-xs font-black border transition-all duration-200 hover:shadow-sm"
                                      style={{ background: '#ecfdf5', color: '#047857', borderColor: '#a7f3d0' }}>
                                ✓ Approve
                              </button>
                              <button type="button"
                                      onClick={() => setSelectedAction({ type: 'reject', id: booking.id })}
                                      className="px-3 py-1.5 rounded-lg text-xs font-black border transition-all duration-200 hover:shadow-sm"
                                      style={{ background: '#fff1f2', color: '#be123c', borderColor: '#fecdd3' }}>
                                ✕ Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-300 font-semibold">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <p className="mt-8 text-center text-xs font-semibold text-slate-400">
            Smart Campus Admin Panel · Booking Management
          </p>
        </div>
      </main>

      {/* ── Modal ── */}
      {selectedAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
             style={{ background: 'rgba(9,72,134,0.4)', backdropFilter: 'blur(4px)' }}
             onClick={(e) => { if (e.target === e.currentTarget) { setSelectedAction(null); setAdminNotes(''); } }}>

          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
               style={{ boxShadow: '0 20px 60px rgba(9,72,134,0.25)' }}>

            {/* Modal header */}
            <div className="px-6 py-5 border-b border-slate-100"
                 style={{ background: 'linear-gradient(90deg,#f0f6ff,#f8faff)' }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
                     style={selectedAction.type === 'approve'
                       ? { background: '#ecfdf5' }
                       : { background: '#fff1f2' }}>
                  {selectedAction.type === 'approve' ? '✅' : '✖️'}
                </div>
                <div>
                  <h2 className="text-base font-black text-slate-800">
                    {selectedAction.type === 'approve' ? 'Approve Booking' : 'Reject Booking'}
                  </h2>
                  <p className="text-xs text-slate-400">
                    {selectedAction.type === 'approve'
                      ? 'This will notify the requester of approval'
                      : 'This will notify the requester of rejection'}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal body */}
            <div className="p-6">
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                Admin Notes <span className="normal-case font-medium">(optional)</span>
              </label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={4}
                placeholder="Add a short explanation for the requester…"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none resize-y transition-all duration-200 focus:border-[#2563eb] focus:bg-white focus:ring-2 focus:ring-[#2563eb]/20"
              />

              <div className="flex gap-3 mt-5">
                <button
                  type="button"
                  onClick={() => selectedAction.type === 'approve' ? handleApprove(selectedAction.id) : handleReject(selectedAction.id)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-black text-white transition-all duration-200 hover:opacity-90 hover:shadow-md active:scale-95"
                  style={selectedAction.type === 'approve'
                    ? { background: 'linear-gradient(135deg,#059669,#10b981)' }
                    : { background: 'linear-gradient(135deg,#be123c,#e11d48)' }}>
                  {selectedAction.type === 'approve' ? '✓ Confirm Approval' : '✕ Confirm Rejection'}
                </button>
                <button
                  type="button"
                  onClick={() => { setSelectedAction(null); setAdminNotes(''); }}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold border border-slate-200 text-slate-500 hover:bg-slate-50 transition-all duration-200">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}