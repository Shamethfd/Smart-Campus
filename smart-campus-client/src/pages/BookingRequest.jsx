import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bookingAPI from '../services/bookingAPI';

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
    <div className="dashboard">
      <div className="booking-page">
        <div className="booking-page__grid">
          <aside className="booking-page__aside">
            <div className="booking-hero">
              <span className="booking-hero__badge">
                <span className="booking-hero__dot" aria-hidden />
                New booking
              </span>
              <h1>Book a resource</h1>
              <p>
                Fill in the details below. Your request will be reviewed by an admin before confirmation.
              </p>
            </div>

            <div className="booking-card">
              <p className="booking-steps__title">How it works</p>
              {STEPS.map((step, idx) => (
                <div key={step.num} className="booking-step">
                  <div className="booking-step__rail">
                    <span className="booking-step__num">{step.num}</span>
                    {idx < STEPS.length - 1 && <span className="booking-step__line" aria-hidden />}
                  </div>
                  <div className="booking-step__body">
                    <strong>{step.label}</strong>
                    <span>{step.desc}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="booking-tip">
              Approved bookings can be cancelled from your <strong>dashboard</strong> at any time.
            </div>
          </aside>

          <div className="booking-panel">
            <div className="booking-panel__header">
              <h2>Booking details</h2>
              <p>All fields marked with * are required.</p>
            </div>

            <div className="booking-panel__body">
              {message.text && (
                <div
                  className={`booking-alert ${
                    message.type === 'success' ? 'booking-alert--success' : 'booking-alert--error'
                  }`}
                  role="status"
                >
                  {message.text}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <fieldset style={{ border: 'none', margin: 0, padding: 0 }}>
                  <legend className="booking-field-label">
                    Resource type <span className="req">*</span>
                  </legend>
                  <div className="booking-type-grid">
                    {RESOURCE_TYPES.map((rt) => (
                      <label
                        key={rt.value}
                        className={`booking-type-option ${
                          formData.resourceType === rt.value ? 'booking-type-option--active' : ''
                        }`}
                      >
                        <input
                          type="radio"
                          name="resourceType"
                          value={rt.value}
                          checked={formData.resourceType === rt.value}
                          onChange={handleInputChange}
                        />
                        {formData.resourceType === rt.value && (
                          <span className="booking-type-option__check" aria-hidden>
                            ✓
                          </span>
                        )}
                        <span className="booking-type-option__icon">{rt.icon}</span>
                        <span className="booking-type-option__label">{rt.label}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                <div className="booking-divider" />

                <div className="booking-grid-2">
                  <FormField label="Resource ID" required>
                    <input
                      type="text"
                      name="resourceId"
                      value={formData.resourceId}
                      onChange={handleInputChange}
                      placeholder="e.g. R-101"
                      required
                      className="booking-input"
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
                      className="booking-input"
                    />
                  </FormField>
                </div>

                <div className="booking-divider" />

                <p className="booking-schedule-title">
                  Schedule <span className="req">*</span>
                </p>
                <div className="booking-grid-3">
                  <FormField label="Booking date">
                    <div className="booking-input-wrap">
                      <span className="booking-input-icon" aria-hidden>
                        <svg fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25"
                          />
                        </svg>
                      </span>
                      <input
                        type="date"
                        name="bookingDate"
                        value={formData.bookingDate}
                        onChange={handleInputChange}
                        required
                        className="booking-input booking-input--icon"
                      />
                    </div>
                  </FormField>
                  <FormField label="Start time">
                    <div className="booking-input-wrap">
                      <span className="booking-input-icon" aria-hidden>
                        <svg fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </span>
                      <input
                        type="time"
                        name="startTime"
                        value={formData.startTime}
                        onChange={handleInputChange}
                        required
                        className="booking-input booking-input--icon"
                      />
                    </div>
                  </FormField>
                  <FormField label="End time">
                    <div className="booking-input-wrap">
                      <span className="booking-input-icon" aria-hidden>
                        <svg fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </span>
                      <input
                        type="time"
                        name="endTime"
                        value={formData.endTime}
                        onChange={handleInputChange}
                        required
                        className="booking-input booking-input--icon"
                      />
                    </div>
                  </FormField>
                </div>

                <div className="booking-divider" />

                <FormField label="Additional notes" hint="Optional">
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Any extra information for the admin…"
                    className="booking-textarea"
                  />
                </FormField>

                <div className="booking-actions">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-booking-submit"
                  >
                    {loading ? (
                      <>
                        <span className="booking-spinner" style={{ marginRight: 8 }} />
                        Submitting…
                      </>
                    ) : (
                      'Submit request'
                    )}
                  </button>
                  <button type="button" className="btn btn--ghost" onClick={handleReset}>
                    Reset
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FormField({ label, required, hint, children }) {
  return (
    <div>
      <label className="booking-field-label">
        {label}
        {required && <span className="req">*</span>}
        {hint && <span className="hint">{hint}</span>}
      </label>
      {children}
    </div>
  );
}
