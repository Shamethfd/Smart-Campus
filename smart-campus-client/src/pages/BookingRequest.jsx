import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import bookingAPI from '../services/bookingAPI';
import Button from '../components/ui/Button';
import Card, { CardBody, CardHeader } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../lib/apiBase';
import { getToken } from '../utils/tokenUtils';

const SELECTED_RESOURCE_KEY = 'smartCampus:selectedBookingResourceId';

const resourcesApi = axios.create({ baseURL: API_BASE_URL });
resourcesApi.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function toMinutes(hhmm) {
  if (!hhmm) return null;
  const [h, m] = String(hhmm).slice(0, 5).split(':').map((x) => Number(x));
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  return h * 60 + m;
}

function overlaps(aStart, aEnd, bStart, bEnd) {
  return aStart < bEnd && aEnd > bStart;
}

const STEPS = [
  { num: 1, label: 'Resource type', desc: 'Select the resource type and identifier.' },
  { num: 2, label: 'Date & time', desc: 'Choose the date and your time slot.' },
  { num: 3, label: 'Confirmation', desc: 'Submit for admin review and approval.' },
];

export default function BookingRequest() {
  const location = useLocation();
  const requestedResourceId = useMemo(() => {
    const queryResourceId = new URLSearchParams(location.search).get('resourceId');
    return queryResourceId || location.state?.resourceId || sessionStorage.getItem(SELECTED_RESOURCE_KEY) || '';
  }, [location.search, location.state]);
  const [formData, setFormData] = useState({
    resourceId: '',
    bookingDate: '',
    startTime: '',
    endTime: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [resources, setResources] = useState([]);
  const [loadingResources, setLoadingResources] = useState(true);
  const [bookingsOnDate, setBookingsOnDate] = useState([]);

  const selectedResource = resources.find((r) => String(r.id) === String(formData.resourceId));

  const fetchResources = useCallback(async () => {
    setLoadingResources(true);
    try {
      const res = await resourcesApi.get('/api/resources', {
        params: { page: 0, size: 1000, sortBy: 'name', sortDir: 'asc' },
      });
      const page = res.data?.data ?? res.data;
      const list = page?.content ?? res.data?.content ?? [];
      const availableResources = list.filter((r) => r.status === 'WORKING');
      setResources(availableResources);

      if (requestedResourceId) {
        const matched = availableResources.find(
          (resource) => String(resource.id) === String(requestedResourceId)
        );
        if (matched) {
          sessionStorage.setItem(SELECTED_RESOURCE_KEY, String(matched.id));
          setFormData((prev) => ({ ...prev, resourceId: String(matched.id) }));
        } else {
          try {
            const one = await resourcesApi.get(`/api/resources/${requestedResourceId}`);
            const r = one.data;
            if (r?.status === 'WORKING') {
              setResources((prev) =>
                prev.some((x) => String(x.id) === String(r.id)) ? prev : [...prev, r]
              );
              sessionStorage.setItem(SELECTED_RESOURCE_KEY, String(r.id));
              setFormData((prev) => ({ ...prev, resourceId: String(r.id) }));
            } else {
              toast.error('This resource is not available for booking (not active).');
            }
          } catch {
            toast.error('Could not find the resource from the link. Please choose a resource below.');
          }
        }
      }
    } catch (err) {
      const msg =
        err.response?.status === 401 || err.response?.status === 403
          ? 'Session expired or not allowed to load resources. Please sign in again.'
          : 'Failed to load resources. Please try again.';
      toast.error(msg);
      setResources([]);
    } finally {
      setLoadingResources(false);
    }
  }, [requestedResourceId]);

  const fetchBookingsForSelection = async (date, resourceId) => {
    if (!date || !resourceId) {
      setBookingsOnDate([]);
      return;
    }
    try {
      const res = await bookingAPI.getResourceBookingsByDate(resourceId, date);
      setBookingsOnDate(res.data?.data ?? []);
    } catch {
      setBookingsOnDate([]);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  useEffect(() => {
    fetchBookingsForSelection(formData.bookingDate, formData.resourceId);
  }, [formData.bookingDate, formData.resourceId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () =>
    setFormData({
      resourceId: '',
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
      if (!selectedResource) {
        toast.error('Please select a resource to book.');
        return;
      }

      const payload = {
        ...formData,
        resourceId: String(selectedResource.id),
        resourceName: selectedResource.name,
        resourceType: selectedResource.type,
      };

      await bookingAPI.createBooking(payload);
      localStorage.setItem('smartCampus:lastBookingAt', String(Date.now()));
      window.dispatchEvent(new Event('smart-campus:booking-created'));
      toast.success('Booking request submitted successfully.');
      setMessage({ type: 'success', text: 'Booking request submitted successfully.' });
      setFormData((prev) => ({
        ...prev,
        bookingDate: '',
        startTime: '',
        endTime: '',
        notes: '',
      }));
    } catch (error) {
      const data = error.response?.data;
      const text =
        (typeof data?.message === 'string' && data.message) ||
        (data?.error && typeof data.error === 'string' && data.error) ||
        'Failed to create booking request.';
      toast.error(text);
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
              <div>
                <p className="text-xs font-extrabold uppercase tracking-widest text-slate-500">
                  Resource <span className="text-red-500">*</span>
                </p>
                <div className="mt-3">
                  <FormField label="Choose resource" required>
                    <select
                      name="resourceId"
                      value={formData.resourceId}
                      onChange={handleInputChange}
                      required
                      disabled={loadingResources}
                      className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      <option value="">
                        {loadingResources ? 'Loading resources…' : 'Select a resource'}
                      </option>
                      {resources.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name} · {r.type} · {r.building}
                        </option>
                      ))}
                    </select>
                  </FormField>
                </div>
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
                      onChange={(e) => {
                        handleInputChange(e);
                      }}
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

              {selectedResource &&
                formData.bookingDate &&
                formData.startTime &&
                formData.endTime && (() => {
                  const reqStart = toMinutes(formData.startTime);
                  const reqEnd = toMinutes(formData.endTime);
                  const conflicts = bookingsOnDate.filter((b) => {
                    if (String(b.resourceId) !== String(selectedResource.id)) return false;
                    const bStart = toMinutes(b.startTime);
                    const bEnd = toMinutes(b.endTime);
                    if (reqStart == null || reqEnd == null || bStart == null || bEnd == null) return false;
                    return overlaps(reqStart, reqEnd, bStart, bEnd);
                  });

                  const outsideHours =
                    toMinutes(formData.startTime) < toMinutes(selectedResource.availableFrom) ||
                    toMinutes(formData.endTime) > toMinutes(selectedResource.availableTo);

                  if (outsideHours) {
                    return (
                      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
                        Selected time is outside this resource’s availability hours.
                      </div>
                    );
                  }

                  if (conflicts.length > 0) {
                    return (
                      <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
                        This resource is already booked for the selected time slot. Please choose another time or resource.
                      </div>
                    );
                  }

                  return (
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
                      Resource is available for this time slot.
                    </div>
                  );
                })()}

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
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex h-11 min-w-40 items-center justify-center rounded-xl border border-blue-700 bg-white px-6 text-sm font-extrabold tracking-wide text-blue-700 shadow-sm transition hover:bg-blue-50 active:bg-blue-100 disabled:pointer-events-none disabled:opacity-70"
                >
                  {loading ? 'Submitting…' : 'Submit request'}
                </button>
              </div>

              <p className="text-xs text-slate-500">
                The selected resource is checked against existing bookings for the same date and time before submission.
              </p>
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
