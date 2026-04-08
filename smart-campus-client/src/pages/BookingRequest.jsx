import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bookingAPI from '../services/bookingAPI';

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await bookingAPI.createBooking(formData);
      setMessage({ type: 'success', text: 'Booking request submitted successfully.' });
      setFormData({
        resourceId: '',
        resourceName: '',
        resourceType: 'ROOM',
        bookingDate: '',
        startTime: '',
        endTime: '',
        notes: '',
      });
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

  const inputClass =
    'w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20';

  return (
    <section className="py-4">
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.3fr]">
        <aside className="rounded-lg border border-slate-200 bg-white p-5 text-xs shadow-sm">
          <span className="inline-flex rounded-full bg-[#094886]/5 px-3 py-1 text-[11px] font-semibold text-[#094886]">
            New booking
          </span>
          <h1 className="mt-3 text-base font-semibold text-slate-900">Book a resource</h1>
          <p className="mt-2 text-xs leading-relaxed text-slate-600">
            Provide the resource, date, and time slot. Your request will be reviewed before it is confirmed.
          </p>

          <div className="mt-4 space-y-2">
            {[
              'Select the resource type and identifier.',
              'Choose the date and start/end time.',
              'Submit the request for admin approval.',
            ].map((item, idx) => (
              <div
                key={item}
                className="flex items-start gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700"
              >
                <span className="mt-[2px] flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-[#2563EB] text-[9px] font-semibold text-white">
                  {idx + 1}
                </span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </aside>

        <div className="rounded-lg border border-slate-200 bg-white p-5 text-xs shadow-sm">
          {message.text && (
            <div
              className={`mb-6 rounded-xl border px-4 py-3 text-sm font-medium ${
                message.type === 'success'
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                  : 'border-rose-200 bg-rose-50 text-rose-800'
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-[11px] font-semibold text-slate-700">
                  Resource type
                </label>
                <select
                  name="resourceType"
                  value={formData.resourceType}
                  onChange={handleInputChange}
                  className={inputClass}
                >
                  <option value="ROOM">Room</option>
                  <option value="LAB">Lab</option>
                  <option value="EQUIPMENT">Equipment</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-semibold text-slate-700">
                  Resource ID
                </label>
                <input
                  type="text"
                  name="resourceId"
                  value={formData.resourceId}
                  onChange={handleInputChange}
                  placeholder="R-101"
                  required
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-semibold text-slate-700">
                Resource name
              </label>
              <input
                type="text"
                name="resourceName"
                value={formData.resourceName}
                onChange={handleInputChange}
                placeholder="Conference Room A"
                required
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-semibold text-slate-700">
                Booking date
              </label>
              <input
                type="date"
                name="bookingDate"
                value={formData.bookingDate}
                onChange={handleInputChange}
                required
                className={inputClass}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-[11px] font-semibold text-slate-700">
                  Start time
                </label>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-semibold text-slate-700">
                  End time
                </label>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  required
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-semibold text-slate-700">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows="4"
                placeholder="Additional information (optional)"
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-2 pt-1 sm:flex-row">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex flex-1 items-center justify-center rounded-full bg-[#094886] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#094886]/90 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {loading ? 'Submitting...' : 'Submit Request'}
              </button>
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    resourceId: '',
                    resourceName: '',
                    resourceType: 'ROOM',
                    bookingDate: '',
                    startTime: '',
                    endTime: '',
                    notes: '',
                  })
                }
                className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Clear
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
