import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiSave, FiX, FiAlertTriangle, FiChevronRight } from 'react-icons/fi';
import {
  MdOutlineInfo,
  MdOutlineTune,
  MdOutlineCalendarMonth,
  MdOutlineSettings,
  MdOutlineBuild,
  MdOutlineAccessible,
} from 'react-icons/md';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { API_BASE_URL } from '../lib/apiBase';
import { getToken } from '../utils/tokenUtils';

/* ─── constants ─────────────────────────────────────────── */
const BUILDINGS   = ['MAIN', 'ENGINEERING', 'SCIENCE', 'LIBRARY', 'ADMIN'];
const TYPES       = ['LECTURE_HALL', 'COMPUTER_LAB', 'MEETING_ROOM', 'EQUIPMENT', 'AUDITORIUM', 'SMART_CLASSROOM'];
const STATUSES    = ['WORKING', 'OUT_OF_SERVICE', 'UNDER_MAINTENANCE'];
const A11Y_OPT    = ['WHEELCHAIR_RAMP', 'ELEVATOR', 'BRAILLE', 'HEARING_LOOP'];
const DAYS        = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
const FEATURES    = [
  { name: 'hasAC',        label: 'Air Conditioning', icon: '❄️' },
  { name: 'hasProjector', label: 'Projector',         icon: '📽️' },
  { name: 'hasWhiteboard',label: 'Whiteboard',        icon: '📋' },
  { name: 'hasWiFi',      label: 'WiFi',              icon: '📶' },
];

const SECTIONS = [
  { id: 'basic',        label: 'Basic Info',     icon: MdOutlineInfo },
  { id: 'features',     label: 'Features',       icon: MdOutlineTune },
  { id: 'accessibility',label: 'Accessibility',  icon: MdOutlineAccessible },
  { id: 'availability', label: 'Availability',   icon: MdOutlineCalendarMonth },
  { id: 'booking',      label: 'Booking',        icon: MdOutlineSettings },
  { id: 'status',       label: 'Status',         icon: MdOutlineBuild },
];

/* ─── small reusable pieces ─────────────────────────────── */
const Label = ({ children, required }) => (
  <label className="block text-xs font-bold uppercase tracking-widest mb-1.5"
         style={{ color: '#475569' }}>
    {children}{required && <span className="ml-1 text-rose-500">*</span>}
  </label>
);

const FieldError = ({ msg }) =>
  msg ? (
    <p className="mt-1.5 text-xs font-semibold text-rose-500 flex items-center gap-1">
      <FiAlertTriangle size={11} /> {msg}
    </p>
  ) : null;

const inputBase =
  'w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 ' +
  'placeholder-slate-400 outline-none transition-all duration-200 ' +
  'focus:border-[#2563eb] focus:bg-white focus:ring-2 focus:ring-[#2563eb]/20 ' +
  'disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed';

const inputErr  = 'border-rose-400 bg-rose-50 focus:border-rose-500 focus:ring-rose-200';

const SectionCard = ({ id, title, icon: Icon, children }) => (
  <div id={id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
    <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100"
         style={{ background: 'linear-gradient(90deg,#f0f6ff 0%,#f8faff 100%)' }}>
      <div className="w-8 h-8 rounded-lg flex items-center justify-center"
           style={{ background: 'linear-gradient(135deg,#094886,#2563eb)' }}>
        <Icon className="text-white" size={16} />
      </div>
      <h2 className="text-base font-black tracking-tight" style={{ color: '#094886' }}>{title}</h2>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

const ToggleChip = ({ active, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-200 border"
    style={
      active
        ? { background: 'linear-gradient(135deg,#094886,#2563eb)', color: '#fff', borderColor: 'transparent', boxShadow: '0 2px 8px #094886/30' }
        : { background: '#f8fafc', color: '#64748b', borderColor: '#e2e8f0' }
    }
  >
    {children}
  </button>
);

const FeatureCheckbox = ({ name, label, icon, checked, onChange }) => (
  <label className="flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-200 select-none"
         style={checked
           ? { background: '#eff6ff', borderColor: '#2563eb' }
           : { background: '#f8fafc', borderColor: '#e2e8f0' }}>
    <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
      checked ? '' : 'bg-white border border-slate-300'
    }`}
         style={checked ? { background: 'linear-gradient(135deg,#094886,#2563eb)' } : {}}>
      {checked && <span className="text-white text-xs font-black">✓</span>}
    </div>
    <input type="checkbox" name={name} checked={checked} onChange={onChange} className="sr-only" />
    <span className="text-sm">{icon}</span>
    <span className="text-sm font-semibold" style={{ color: checked ? '#094886' : '#64748b' }}>{label}</span>
  </label>
);

/* ─── main component ─────────────────────────────────────── */
const ResourceForm = () => {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const isEditing  = !!id;

  const [loading,      setLoading]      = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [errors,       setErrors]       = useState({});
  const [conflicts,    setConflicts]    = useState([]);
  const [activeSection,setActiveSection]= useState('basic');

  const api = axios.create({ baseURL: API_BASE_URL });

  api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  const [formData, setFormData] = useState({
    name: '', type: '', building: '', floor: '', roomNumber: '',
    capacity: '', areaSqFt: '',
    hasAC: false, hasProjector: false, hasWhiteboard: false, hasWiFi: false,
    accessibilityFeatures: [],
    availableFrom: '08:00', availableTo: '18:00',
    availableDays: ['MON','TUE','WED','THU','FRI'],
    advanceBookingLimit: 30, minimumNoticeHours: 2,
    status: 'WORKING', maintenanceEndDate: '',
    imageUrls: [], virtualTourUrl: '',
  });

  useEffect(() => { if (isEditing) fetchResource(); }, [id]);

  /* scroll spy */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActiveSection(e.target.id); });
      },
      { threshold: 0.4 }
    );
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const fetchResource = async () => {
    try {
      setFetchLoading(true);
      const { data } = await api.get(`/api/resources/${id}`);
      setFormData({
        ...data,
        availableFrom:      data.availableFrom?.substring(0, 5) || '',
        availableTo:        data.availableTo?.substring(0, 5)   || '',
        maintenanceEndDate: data.maintenanceEndDate             || '',
      });
    } catch {
      toast.error('Failed to fetch resource');
      navigate('/admin/resources');
    } finally {
      setFetchLoading(false);
    }
  };

  const validateForm = () => {
    const e = {};
    if (!formData.name?.trim())              e.name = 'Resource name is required';
    else if (formData.name.length < 3)       e.name = 'Minimum 3 characters';
    else if (formData.name.length > 100)     e.name = 'Maximum 100 characters';
    if (!formData.type)                      e.type = 'Resource type is required';
    if (!formData.building)                  e.building = 'Building is required';
    if (!formData.floor)                     e.floor = 'Floor is required';
    else if (formData.floor < 1)             e.floor = 'Floor must be at least 1';
    else if (formData.floor > 10)            e.floor = 'Floor must be 10 or less';
    if (!formData.capacity)                  e.capacity = 'Capacity is required';
    else if (formData.capacity < 1)          e.capacity = 'Minimum 1 person';
    else if (formData.capacity > 1000)       e.capacity = 'Maximum 1000 people';
    if (!formData.availableFrom || !formData.availableTo)
                                             e.availableTime = 'Both times are required';
    else if (formData.availableFrom >= formData.availableTo)
                                             e.availableTime = 'From must be before To';
    if (!formData.availableDays?.length)     e.availableDays = 'Select at least one day';
    if (formData.advanceBookingLimit < 1)    e.advanceBookingLimit = 'Minimum 1 day';
    if (formData.advanceBookingLimit > 90)   e.advanceBookingLimit = 'Maximum 90 days';
    if (formData.minimumNoticeHours < 0)     e.minimumNoticeHours = 'Cannot be negative';
    if (formData.minimumNoticeHours > 48)    e.minimumNoticeHours = 'Maximum 48 hours';
    if (formData.status === 'UNDER_MAINTENANCE' && !formData.maintenanceEndDate)
                                             e.maintenanceEndDate = 'End date is required';
    if (formData.areaSqFt && formData.areaSqFt < 10) e.areaSqFt = 'Minimum 10 sq ft';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validateForm()) { toast.error('Please fix the errors'); return; }
    setLoading(true);
    try {
      const data = {
        ...formData,
        capacity:            formData.type === 'EQUIPMENT' ? 1 : parseInt(formData.capacity),
        areaSqFt:            formData.type === 'EQUIPMENT' ? null : formData.areaSqFt ? parseInt(formData.areaSqFt) : null,
        floor:               parseInt(formData.floor),
        advanceBookingLimit: formData.advanceBookingLimit ? parseInt(formData.advanceBookingLimit) : 30,
        minimumNoticeHours:  formData.minimumNoticeHours  ? parseInt(formData.minimumNoticeHours)  : 2,
        hasAC:       Boolean(formData.hasAC),
        hasProjector:Boolean(formData.hasProjector),
        hasWhiteboard:Boolean(formData.hasWhiteboard),
        hasWiFi:     Boolean(formData.hasWiFi),
        accessibilityFeatures: formData.accessibilityFeatures || [],
        availableDays: formData.availableDays || ['MON','TUE','WED','THU','FRI'],
      };
      try { await api.get('/api/health'); } catch {
        toast.error(`Cannot connect to backend at ${API_BASE_URL}`);
        setLoading(false); return;
      }
      if (isEditing) {
        await api.put(`/api/resources/${id}`, data);
        toast.success('Resource updated successfully');
      } else {
        await api.post('/api/resources', data);
        toast.success('Resource created successfully');
      }
      navigate('/admin/resources');
    } catch (error) {
      const msg = error.response?.data?.message || error.response?.data?.error || error.message
               || (isEditing ? 'Failed to update resource' : 'Failed to create resource');
      setErrors({ submit: msg });
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error('You are not allowed to manage resources.');
      }
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const checkConflicts = async () => {
    try {
      const { data } = await api.get('/api/resources/check-conflict', {
        params: { building: formData.building, type: formData.type, from: formData.availableFrom, to: formData.availableTo },
      });
      setConflicts(data);
    } catch { /* silent */ }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleDayToggle = (day) =>
    setFormData(prev => ({
      ...prev,
      availableDays: prev.availableDays.includes(day)
        ? prev.availableDays.filter(d => d !== day)
        : [...prev.availableDays, day],
    }));

  const handleA11yToggle = (f) =>
    setFormData(prev => ({
      ...prev,
      accessibilityFeatures: prev.accessibilityFeatures.includes(f)
        ? prev.accessibilityFeatures.filter(x => x !== f)
        : [...prev.accessibilityFeatures, f],
    }));

  const scrollTo = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  /* ─── loading ─── */
  if (fetchLoading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#f0f4fa' }}>
      <div className="text-center">
        <div className="w-14 h-14 rounded-full border-4 border-t-transparent animate-spin mx-auto"
             style={{ borderColor: '#2563eb', borderTopColor: 'transparent' }} />
        <p className="mt-4 text-sm font-bold" style={{ color: '#094886' }}>Loading resource…</p>
      </div>
    </div>
  );

  /* ─── render ─── */
  return (
    <div className="min-h-screen" style={{ background: '#f0f4fa' }}>

      {/* ── Top Header Bar ── */}
      <div style={{ background: 'linear-gradient(135deg,#094886 0%,#2563eb 100%)' }}
           className="relative overflow-hidden px-6 py-8">
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full opacity-10 bg-white" />
        <div className="absolute -bottom-8 left-20 w-32 h-32 rounded-full opacity-10 bg-white" />
        <div className="relative max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-1">
              Resource Management
            </p>
            <h1 className="text-3xl font-black text-white">
              {isEditing ? 'Edit Resource' : 'Add New Resource'}
            </h1>
            <p className="text-blue-200 text-sm mt-1">
              {isEditing ? 'Update the details below' : 'Fill in the details to register a new resource'}
            </p>
          </div>
            <button onClick={() => navigate('/admin/resources')}
                  className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-all duration-200">
            <FiX size={20} />
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 flex gap-6">

        {/* ── Sticky sidebar nav ── */}
        <aside className="hidden lg:block w-52 flex-shrink-0">
          <div className="sticky top-6 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100"
                 style={{ background: 'linear-gradient(90deg,#f0f6ff,#f8faff)' }}>
              <p className="text-xs font-black uppercase tracking-widest" style={{ color: '#094886' }}>
                Sections
              </p>
            </div>
            <nav className="p-2 flex flex-col gap-1">
              {SECTIONS.map(({ id, label, icon: Icon }) => {
                const active = activeSection === id;
                return (
                  <button key={id} onClick={() => scrollTo(id)}
                          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all duration-200 w-full"
                          style={active
                            ? { background: 'linear-gradient(90deg,#eff6ff,#dbeafe)', color: '#094886' }
                            : { color: '#64748b' }}>
                    <Icon size={15} className={active ? 'text-[#2563eb]' : ''} />
                    <span className={`text-xs font-bold ${active ? 'text-[#094886]' : ''}`}>{label}</span>
                    {active && <FiChevronRight size={12} className="ml-auto text-[#2563eb]" />}
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* ── Main form ── */}
        <div className="flex-1 min-w-0">

          {/* Conflict banner */}
          {conflicts.length > 0 && (
            <div className="mb-6 p-4 rounded-2xl border flex gap-3 items-start"
                 style={{ background: '#fff7ed', borderColor: '#fed7aa' }}>
              <FiAlertTriangle className="text-orange-500 flex-shrink-0 mt-0.5" size={18} />
              <div>
                <p className="text-sm font-black text-orange-800 mb-1">Booking Conflicts Detected</p>
                <ul className="space-y-0.5">
                  {conflicts.map(c => (
                    <li key={c.id} className="text-xs text-orange-700 font-medium">
                      • {c.name} — {c.building}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Submit error */}
          {errors.submit && (
            <div className="mb-6 p-4 rounded-2xl border flex gap-3 items-start"
                 style={{ background: '#fff1f2', borderColor: '#fecdd3' }}>
              <FiAlertTriangle className="text-rose-500 flex-shrink-0 mt-0.5" size={18} />
              <p className="text-sm font-semibold text-rose-700">{errors.submit}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">

            {/* ── 1. Basic Information ── */}
            <SectionCard id="basic" title="Basic Information" icon={MdOutlineInfo}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <div className="md:col-span-2">
                  <Label required>Resource Name</Label>
                  <input name="name" value={formData.name} onChange={handleInputChange}
                         placeholder="e.g. Engineering Lab A — 3rd Floor"
                         className={`${inputBase} ${errors.name ? inputErr : ''}`} />
                  <FieldError msg={errors.name} />
                </div>

                <div>
                  <Label required>Resource Type</Label>
                  <select name="type" value={formData.type} onChange={handleInputChange}
                          className={`${inputBase} ${errors.type ? inputErr : ''}`}>
                    <option value="">Select type…</option>
                    {TYPES.map(t => <option key={t} value={t}>{t.replaceAll('_',' ')}</option>)}
                  </select>
                  <FieldError msg={errors.type} />
                </div>

                <div>
                  <Label required>Building</Label>
                  <select name="building" value={formData.building} onChange={handleInputChange}
                          className={`${inputBase} ${errors.building ? inputErr : ''}`}>
                    <option value="">Select building…</option>
                    {BUILDINGS.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                  <FieldError msg={errors.building} />
                </div>

                <div>
                  <Label required>Floor</Label>
                  <input type="number" name="floor" value={formData.floor} onChange={handleInputChange}
                         placeholder="1 – 10" min="1" max="10"
                         className={`${inputBase} ${errors.floor ? inputErr : ''}`} />
                  <FieldError msg={errors.floor} />
                </div>

                <div>
                  <Label>Room Number</Label>
                  <input type="text" name="roomNumber" value={formData.roomNumber} onChange={handleInputChange}
                         placeholder="e.g. 101, A205"
                         className={inputBase} />
                </div>

                <div>
                  <Label required>Capacity (persons)</Label>
                  <input type="number" name="capacity" value={formData.capacity} onChange={handleInputChange}
                         placeholder="1 – 1000" min="1" max="1000"
                         disabled={formData.type === 'EQUIPMENT'}
                         className={`${inputBase} ${errors.capacity ? inputErr : ''}`} />
                  {formData.type === 'EQUIPMENT'
                    ? <p className="mt-1 text-xs text-slate-400">Auto-set to 1 for equipment</p>
                    : <FieldError msg={errors.capacity} />}
                </div>

                <div>
                  <Label>Area (sq ft)</Label>
                  <input type="number" name="areaSqFt" value={formData.areaSqFt} onChange={handleInputChange}
                         placeholder="Min 10 sq ft" min="10"
                         disabled={formData.type === 'EQUIPMENT'}
                         className={`${inputBase} ${errors.areaSqFt ? inputErr : ''}`} />
                  {formData.type === 'EQUIPMENT'
                    ? <p className="mt-1 text-xs text-slate-400">Not applicable for equipment</p>
                    : <FieldError msg={errors.areaSqFt} />}
                </div>

              </div>
            </SectionCard>

            {/* ── 2. Features ── */}
            <SectionCard id="features" title="Features" icon={MdOutlineTune}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {FEATURES.map(f => (
                  <FeatureCheckbox
                    key={f.name}
                    name={f.name}
                    label={f.label}
                    icon={f.icon}
                    checked={formData[f.name]}
                    onChange={handleInputChange}
                  />
                ))}
              </div>
            </SectionCard>

            {/* ── 3. Accessibility ── */}
            <SectionCard id="accessibility" title="Accessibility Features" icon={MdOutlineAccessible}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {A11Y_OPT.map(f => (
                  <FeatureCheckbox
                    key={f}
                    name={f}
                    label={f.replaceAll('_',' ')}
                    icon="♿"
                    checked={formData.accessibilityFeatures.includes(f)}
                    onChange={() => handleA11yToggle(f)}
                  />
                ))}
              </div>
            </SectionCard>

            {/* ── 4. Availability ── */}
            <SectionCard id="availability" title="Availability" icon={MdOutlineCalendarMonth}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div>
                  <Label required>Available From</Label>
                  <input type="time" name="availableFrom" value={formData.availableFrom} onChange={handleInputChange}
                         className={`${inputBase} ${errors.availableTime ? inputErr : ''}`} />
                </div>
                <div>
                  <Label required>Available To</Label>
                  <input type="time" name="availableTo" value={formData.availableTo} onChange={handleInputChange}
                         className={`${inputBase} ${errors.availableTime ? inputErr : ''}`} />
                </div>
                {errors.availableTime && (
                  <p className="md:col-span-2 text-xs font-semibold text-rose-500 flex items-center gap-1">
                    <FiAlertTriangle size={11} /> {errors.availableTime}
                  </p>
                )}
              </div>

              <Label required>Available Days</Label>
              <div className="flex flex-wrap gap-2 mt-1">
                {DAYS.map(day => (
                  <ToggleChip key={day} active={formData.availableDays.includes(day)} onClick={() => handleDayToggle(day)}>
                    {day}
                  </ToggleChip>
                ))}
              </div>
              <FieldError msg={errors.availableDays} />
            </SectionCard>

            {/* ── 5. Booking Settings ── */}
            <SectionCard id="booking" title="Booking Settings" icon={MdOutlineSettings}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <Label>Advance Booking Limit (days)</Label>
                  <input type="number" name="advanceBookingLimit" value={formData.advanceBookingLimit}
                         onChange={handleInputChange} placeholder="1 – 90" min="1" max="90"
                         className={`${inputBase} ${errors.advanceBookingLimit ? inputErr : ''}`} />
                  <FieldError msg={errors.advanceBookingLimit} />
                </div>
                <div>
                  <Label>Minimum Notice (hours)</Label>
                  <input type="number" name="minimumNoticeHours" value={formData.minimumNoticeHours}
                         onChange={handleInputChange} placeholder="0 – 48" min="0" max="48"
                         className={`${inputBase} ${errors.minimumNoticeHours ? inputErr : ''}`} />
                  <FieldError msg={errors.minimumNoticeHours} />
                </div>
              </div>
            </SectionCard>

            {/* ── 6. Status ── */}
            <SectionCard id="status" title="Status" icon={MdOutlineBuild}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <div>
                  <Label required>Current Status</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {STATUSES.map(s => (
                      <ToggleChip key={s} active={formData.status === s}
                                  onClick={() => setFormData(prev => ({ ...prev, status: s }))}>
                        {s.replaceAll('_',' ')}
                      </ToggleChip>
                    ))}
                  </div>
                </div>

                {formData.status === 'UNDER_MAINTENANCE' && (
                  <div>
                    <Label required>Maintenance End Date</Label>
                    <input type="date" name="maintenanceEndDate" value={formData.maintenanceEndDate}
                           onChange={handleInputChange}
                           min={new Date().toISOString().split('T')[0]}
                           className={`${inputBase} ${errors.maintenanceEndDate ? inputErr : ''}`} />
                    <FieldError msg={errors.maintenanceEndDate} />
                  </div>
                )}
              </div>
            </SectionCard>

            {/* ── Action Row ── */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
              <button type="button" onClick={checkConflicts}
                      className="px-5 py-2.5 rounded-xl text-sm font-bold border transition-all duration-200"
                      style={{ borderColor: '#2563eb', color: '#2563eb' }}
                      onMouseEnter={e => { e.currentTarget.style.background='#eff6ff'; }}
                      onMouseLeave={e => { e.currentTarget.style.background='transparent'; }}>
                Check Conflicts
              </button>

              <div className="flex items-center gap-3">
                <button type="button" onClick={() => navigate('/admin/resources')}
                        className="px-5 py-2.5 rounded-xl text-sm font-bold border border-slate-200 text-slate-500 hover:bg-slate-50 transition-all duration-200">
                  Cancel
                </button>

                <button type="submit" disabled={loading}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black text-white transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                        style={{ background: 'linear-gradient(135deg,#094886,#2563eb)', boxShadow: '0 4px 14px #094886/40' }}>
                  {loading
                    ? <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    : <FiSave size={15} />}
                  {isEditing ? 'Update Resource' : 'Create Resource'}
                </button>
              </div>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default ResourceForm;