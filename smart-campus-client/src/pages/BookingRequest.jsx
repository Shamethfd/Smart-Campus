import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bookingAPI from '../services/bookingAPI';
import Button from '../components/ui/Button';
import Card, { CardBody, CardHeader } from '../components/ui/Card';
import Badge from '../components/ui/Badge';

const RESOURCE_TYPES = [
  {
    value: 'ROOM',
    label: 'Room',
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"
        />
      </svg>
    ),
  },
  {
    value: 'LAB',
    label: 'Lab',
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15M14.25 3.104c.251.023.501.05.75.082M19.8 15a2.25 2.25 0 01.45 1.317c0 1.16-.792 2.033-1.72 2.033H5.47c-.928 0-1.72-.874-1.72-2.033 0-.483.17-.927.45-1.317L9 10.5"
        />
      </svg>
    ),
  },
  {
    value: 'EQUIPMENT',
    label: 'Equipment',
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z"
        />
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
      const data = error.response?.data;
      const text =
        (typeof data?.message === 'string' && data.message) ||
        (data?.error && typeof data.error === 'string' && data.error) ||
        'Failed to create booking request.';
      setMessage({ type: 'error', text });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
        <aside className="space-y-4">
          <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-blue-700 to-blue-500 p-6 text-white shadow-card">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[11px] font-extrabold tracking-widest">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-200" />
              NEW BOOKING
            </div>
            <h1 className="mt-3 text-xl font-extrabold tracking-tight">Book a resource</h1>
            <p className="mt-2 text-sm text-white/90">
              Fill in the details below. Your request will be reviewed by an admin before confirmation.
            </p>
          </div>

          <Card>
            <CardBody>
              <p className="text-[11px] font-extrabold tracking-widest text-slate-400">
                HOW IT WORKS
              </p>
              <div className="mt-4 space-y-4">
                {STEPS.map((step) => (
                  <div key={step.num} className="flex gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-extrabold text-white">
                      {step.num}
                    </div>
                    <div className="pt-0.5">
                      <div className="text-sm font-extrabold text-slate-900">{step.label}</div>
                      <div className="text-xs text-slate-500">{step.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm text-slate-700">
            Approved bookings can be cancelled from your <span className="font-extrabold">dashboard</span> at any time.
          </div>
        </aside>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-extrabold text-slate-900">Booking details</h2>
                <p className="mt-1 text-sm text-slate-500">All fields marked with * are required.</p>
              </div>
              <Badge variant="info">Request</Badge>
            </div>
          </CardHeader>
          <CardBody>
            {message.text && (
              <div
                className={[
                  'mb-5 rounded-2xl border px-4 py-3 text-sm font-semibold',
                  message.type === 'success'
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                    : 'border-red-200 bg-red-50 text-red-800',
                ].join(' ')}
                role="status"
              >
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <fieldset className="space-y-3">
                <legend className="text-xs font-extrabold uppercase tracking-widest text-slate-500">
                  Resource type <span className="text-red-500">*</span>
                </legend>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {RESOURCE_TYPES.map((rt) => {
                    const active = formData.resourceType === rt.value;
                    return (
                      <label
                        key={rt.value}
                        className={[
                          'relative cursor-pointer rounded-2xl border p-4 text-center transition',
                          active
                            ? 'border-blue-500 bg-blue-50 text-blue-800'
                            : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-white',
                        ].join(' ')}
                      >
                        <input
                          type="radio"
                          name="resourceType"
                          value={rt.value}
                          checked={active}
                          onChange={handleInputChange}
                          className="sr-only"
                        />
                        {active && (
                          <span className="absolute right-3 top-3 inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-extrabold text-white">
                            ✓
                          </span>
                        )}
                        <span className="mx-auto block h-6 w-6 text-current">{rt.icon}</span>
                        <span className="mt-2 block text-xs font-extrabold uppercase tracking-wider">
                          {rt.label}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField label="Resource ID" required>
                  <input
                    type="text"
                    name="resourceId"
                    value={formData.resourceId}
                    onChange={handleInputChange}
                    placeholder="e.g. R-101"
                    required
                    className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
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
                    className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </FormField>
              </div>

              <div>
                <p className="text-xs font-extrabold uppercase tracking-widest text-slate-500">
                  Schedule <span className="text-red-500">*</span>
                </p>
                <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-3">
                  <FormField label="Booking date" required>
                    <input
                      type="date"
                      name="bookingDate"
                      value={formData.bookingDate}
                      onChange={handleInputChange}
                      required
                      className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </FormField>
                  <FormField label="Start time" required>
                    <input
                      type="time"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleInputChange}
                      required
                      className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </FormField>
                  <FormField label="End time" required>
                    <input
                      type="time"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleInputChange}
                      required
                      className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </FormField>
                </div>
              </div>

              <FormField label="Additional notes" hint="Optional">
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Any extra information for the admin…"
                  className="w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </FormField>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                <Button type="button" variant="outline" onClick={handleReset}>
                  Reset
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Submitting…' : 'Submit request'}
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

function FormField({ label, required, hint, children }) {
  return (
    <div>
      <label className="mb-2 flex flex-wrap items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-slate-500">
        <span>{label}</span>
        {required && <span className="text-red-500">*</span>}
        {hint && <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold normal-case tracking-normal text-slate-500">{hint}</span>}
      </label>
      {children}
    </div>
  );
}
