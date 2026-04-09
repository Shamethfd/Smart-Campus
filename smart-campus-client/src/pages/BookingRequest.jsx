import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bookingAPI from '../services/bookingAPI';

const RESOURCE_TYPES = [
  {
    value: 'ROOM',
    label: 'Room',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
      </svg>
    ),
  },
  {
    value: 'LAB',
    label: 'Lab',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15M14.25 3.104c.251.023.501.05.75.082M19.8 15a2.25 2.25 0 01.45 1.317c0 1.16-.792 2.033-1.72 2.033H5.47c-.928 0-1.72-.874-1.72-2.033 0-.483.17-.927.45-1.317L9 10.5" />
      </svg>
    ),
  },
  {
    value: 'EQUIPMENT',
    label: 'Equipment',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
      </svg>
    ),
  },
];

const STEPS = [
  { num: 1, label: 'Resource type', desc: 'Select the resource type and identifier.' },
  { num: 2, label: 'Date & time', desc: 'Choose the date and your time slot.' },
  { num: 3, label: 'Confirmation', desc: 'Submit for admin review and approval.' },
];

export default function BookingRequest() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    resourceId: '',
    resourceName: '',
    resourceType: 'ROOM',
    bookingDate: '',
    startTime: '',
    endTime: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () =>
    setFormData({
      resourceId: '',
      resourceName: '',
      resourceType: 'ROOM',
      bookingDate: '',
      startTime: '',
      endTime: '',
      notes: '',
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      await bookingAPI.createBooking(formData);
      setMessage({ type: 'success', text: 'Booking request submitted successfully.' });
      handleReset();
      navigate('/dashboard');
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to create booking request.',
      });
    } finally {
      setLoading(false);
    }
  };

  const fieldBase =
    'w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#2563eb] focus:bg-white focus:ring-3 focus:ring-[#2563eb]/15';

  return (
    <section className="py-4">
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">

        {/* ── Left sidebar ── */}
        <aside className="space-y-5">
          {/* Header card */}
          <div
            className="relative overflow-hidden rounded-2xl p-6 text-white"
            style={{ background: 'linear-gradient(145deg, #094886 0%, #1a5fa0 50%, #2563eb 100%)' }}
          >
            {/* Decorative circles */}
            <div className="pointer-events-none absolute -right-8 -top-8 h-36 w-36 rounded-full bg-white/5" />
            <div className="pointer-events-none absolute -bottom-6 -left-4 h-24 w-24 rounded-full bg-white/5" />

            <div className="relative">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold tracking-wider uppercase backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-200 animate-pulse" />
                New booking
              </span>
              <h1 className="mt-3 text-xl font-bold tracking-tight leading-snug">
                Book a Resource
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-blue-100/80">
                Fill in the details below. Your request will be reviewed by an admin before confirmation.
              </p>
            </div>
          </div>

          {/* Steps card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-100">
            <p className="mb-4 text-[11px] font-bold uppercase tracking-widest text-slate-400">
              How it works
            </p>
            <div className="space-y-3.5">
              {STEPS.map((step, idx) => (
                <div key={step.num} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <span
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white shadow-sm"
                      style={{ background: 'linear-gradient(135deg, #094886, #2563eb)' }}
                    >
                      {step.num}
                    </span>
                    {idx < STEPS.length - 1 && (
                      <div className="mt-1 h-6 w-px bg-slate-200" />
                    )}
                  </div>
                  <div className="pt-0.5">
                    <p className="text-xs font-semibold text-slate-800">{step.label}</p>
                    <p className="text-[11px] leading-relaxed text-slate-400">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Info tip */}
          <div
            className="rounded-2xl border px-4 py-3.5"
            style={{ background: '#094886' + '08', borderColor: '#094886' + '25' }}
          >
            <div className="flex items-start gap-2.5">
              <svg
                className="mt-0.5 h-4 w-4 shrink-0"
                style={{ color: '#094886' }}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <p className="text-[11px] leading-relaxed text-slate-600">
                Approved bookings can be cancelled from your{' '}
                <span className="font-semibold" style={{ color: '#094886' }}>dashboard</span> at any time.
              </p>
            </div>
          </div>
        </aside>

        {/* ── Form panel ── */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-100">
          {/* Panel header */}
          <div className="border-b border-slate-100 px-6 py-4">
            <h2 className="text-sm font-bold text-slate-900">Booking details</h2>
            <p className="text-[11px] text-slate-400 mt-0.5">All fields marked are required.</p>
          </div>

          <div className="p-6">
            {/* Alert */}
            {message.text && (
              <div
                className={`mb-5 flex items-start gap-3 rounded-xl border px-4 py-3.5 text-sm font-medium ${
                  message.type === 'success'
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                    : 'border-rose-200 bg-rose-50 text-rose-800'
                }`}
              >
                <svg className="mt-0.5 h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  {message.type === 'success' ? (
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  ) : (
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  )}
                </svg>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Resource type picker */}
              <fieldset>
                <legend className="mb-2.5 text-[11px] font-bold uppercase tracking-widest text-slate-500">
                  Resource type <span className="text-rose-400">*</span>
                </legend>
                <div className="grid grid-cols-3 gap-3">
                  {RESOURCE_TYPES.map((rt) => (
                    <label
                      key={rt.value}
                      className={`relative flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 px-3 py-4 text-center transition-all ${
                        formData.resourceType === rt.value
                          ? 'border-[#2563eb] bg-[#2563eb]/5 text-[#094886]'
                          : 'border-slate-200 bg-slate-50/60 text-slate-500 hover:border-slate-300 hover:bg-white'
                      }`}
                    >
                      <input
                        type="radio"
                        name="resourceType"
                        value={rt.value}
                        checked={formData.resourceType === rt.value}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      {formData.resourceType === rt.value && (
                        <span className="absolute right-2.5 top-2.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#2563eb] text-white">
                          <svg className="h-2.5 w-2.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </span>
                      )}
                      <span className={formData.resourceType === rt.value ? 'text-[#094886]' : 'text-slate-400'}>
                        {rt.icon}
                      </span>
                      <span className="text-[11px] font-bold tracking-wide">{rt.label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              {/* Divider */}
              <div className="h-px bg-slate-100" />

              {/* Resource ID + Name */}
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Resource ID" required>
                  <input
                    type="text"
                    name="resourceId"
                    value={formData.resourceId}
                    onChange={handleInputChange}
                    placeholder="e.g. R-101"
                    required
                    className={fieldBase}
                  />
                </FormField>
                <FormField label="Resource name" required>
                  <input
                    type="text"
                    name="resourceName"
                    value={formData.resourceName}
                    onChange={handleInputChange}
                    placeholder="e.g. Conference Room A"
                    required
                    className={fieldBase}
                  />
                </FormField>
              </div>

              {/* Divider */}
              <div className="h-px bg-slate-100" />

              {/* Date + Time */}
              <div>
                <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-slate-500">
                  Schedule <span className="text-rose-400">*</span>
                </p>
                <div className="grid gap-4 sm:grid-cols-3">
                  <FormField label="Booking date">
                    <div className="relative">
                      <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25" />
                        </svg>
                      </span>
                      <input
                        type="date"
                        name="bookingDate"
                        value={formData.bookingDate}
                        onChange={handleInputChange}
                        required
                        className={`${fieldBase} pl-9`}
                      />
                    </div>
                  </FormField>
                  <FormField label="Start time">
                    <div className="relative">
                      <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </span>
                      <input
                        type="time"
                        name="startTime"
                        value={formData.startTime}
                        onChange={handleInputChange}
                        required
                        className={`${fieldBase} pl-9`}
                      />
                    </div>
                  </FormField>
                  <FormField label="End time">
                    <div className="relative">
                      <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </span>
                      <input
                        type="time"
                        name="endTime"
                        value={formData.endTime}
                        onChange={handleInputChange}
                        required
                        className={`${fieldBase} pl-9`}
                      />
                    </div>
                  </FormField>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-slate-100" />

              {/* Notes */}
              <FormField label="Additional notes" hint="Optional">
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Any extra information for the admin…"
                  className={`${fieldBase} resize-none leading-relaxed`}
                />
              </FormField>

              {/* Actions */}
              <div className="flex flex-col gap-2.5 pt-1 sm:flex-row">
                <button
                  type="submit"
                  disabled={loading}
                  className="relative inline-flex flex-1 items-center justify-center gap-2 overflow-hidden rounded-xl px-6 py-3 text-sm font-bold text-white shadow-md transition-all active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-60"
                  style={{ background: loading ? '#64748b' : 'linear-gradient(135deg, #094886, #2563eb)' }}
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Submitting…
                    </>
                  ) : (
                    <>
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                      </svg>
                      Submit Request
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:border-slate-300 active:scale-[.98]"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg>
                  Reset
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

function FormField({ label, required, hint, children }) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-slate-500">
        {label}
        {required && <span className="text-rose-400">*</span>}
        {hint && (
          <span className="ml-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold normal-case tracking-normal text-slate-400">
            {hint}
          </span>
        )}
      </label>
      {children}
    </div>
  );
}