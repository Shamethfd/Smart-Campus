import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiSave, FiX, FiUpload, FiCheck, FiAlertTriangle } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { API_BASE_URL } from '../lib/apiBase';

const ResourceForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [conflicts, setConflicts] = useState([]);

  // Log frontend port for debugging
  useEffect(() => {
    const frontendPort = window.location.port;
    console.log('Frontend running on port:', frontendPort);
    console.log('Full frontend URL:', window.location.origin);
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    type: '',
    building: '',
    floor: '',
    roomNumber: '',
    capacity: '',
    areaSqFt: '',
    hasAC: false,
    hasProjector: false,
    hasWhiteboard: false,
    hasWiFi: false,
    accessibilityFeatures: [],
    availableFrom: '08:00',
    availableTo: '18:00',
    availableDays: ['MON', 'TUE', 'WED', 'THU', 'FRI'],
    advanceBookingLimit: 30,
    minimumNoticeHours: 2,
    status: 'WORKING',
    maintenanceEndDate: '',
    imageUrls: [],
    virtualTourUrl: ''
  });

  const buildings = ['MAIN', 'ENGINEERING', 'SCIENCE', 'LIBRARY', 'ADMIN'];
  const types = ['LECTURE_HALL', 'COMPUTER_LAB', 'MEETING_ROOM', 'EQUIPMENT', 'AUDITORIUM', 'SMART_CLASSROOM'];
  const statuses = ['WORKING', 'OUT_OF_SERVICE', 'UNDER_MAINTENANCE'];
  const accessibilityOptions = ['WHEELCHAIR_RAMP', 'ELEVATOR', 'BRAILLE', 'HEARING_LOOP'];
  const daysOfWeek = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  useEffect(() => {
    if (isEditing) {
      fetchResource();
    }
  }, [id]);

  const fetchResource = async () => {
    try {
      setFetchLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/resources/${id}`);
      const resource = response.data;
      setFormData({
        ...resource,
        availableFrom: resource.availableFrom?.substring(0, 5) || '',
        availableTo: resource.availableTo?.substring(0, 5) || '',
        maintenanceEndDate: resource.maintenanceEndDate || ''
      });
    } catch (error) {
      toast.error('Failed to fetch resource');
      console.error('Error fetching resource:', error);
      navigate('/resources');
    } finally {
      setFetchLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Resource name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Resource name must be at least 3 characters long';
    } else if (formData.name.length > 100) {
      newErrors.name = 'Resource name must be less than 100 characters long';
    }

    if (!formData.type) {
      newErrors.type = 'Resource type is required';
    }

    if (!formData.building) {
      newErrors.building = 'Building is required';
    }

    if (!formData.floor) {
      newErrors.floor = 'Floor is required';
    } else if (formData.floor < 1) {
      newErrors.floor = 'Floor must be at least 1 (ground floor)';
    } else if (formData.floor > 10) {
      newErrors.floor = 'Floor must be 10 or less';
    }

    if (!formData.capacity) {
      newErrors.capacity = 'Capacity is required';
    } else if (formData.capacity < 1) {
      newErrors.capacity = 'Capacity must be at least 1 person';
    } else if (formData.capacity > 1000) {
      newErrors.capacity = 'Capacity must be 1000 or less people';
    }

    if (!formData.availableFrom || !formData.availableTo) {
      newErrors.availableTime = 'Available from and to times are required';
    } else if (formData.availableFrom >= formData.availableTo) {
      newErrors.availableTime = 'Available from time must be before available to time';
    }

    if (!formData.availableDays || formData.availableDays.length === 0) {
      newErrors.availableDays = 'At least one available day must be selected';
    }

    if (formData.advanceBookingLimit && formData.advanceBookingLimit < 1) {
      newErrors.advanceBookingLimit = 'Advance booking limit must be at least 1 day';
    } else if (formData.advanceBookingLimit > 90) {
      newErrors.advanceBookingLimit = 'Advance booking limit must be 90 days or less';
    }

    if (formData.minimumNoticeHours && formData.minimumNoticeHours < 0) {
      newErrors.minimumNoticeHours = 'Minimum notice hours cannot be negative';
    } else if (formData.minimumNoticeHours > 48) {
      newErrors.minimumNoticeHours = 'Minimum notice hours must be 48 hours or less';
    }

    if (formData.status === 'UNDER_MAINTENANCE' && !formData.maintenanceEndDate) {
      newErrors.maintenanceEndDate = 'Maintenance end date is required when status is "Under Maintenance"';
    }

    if (formData.areaSqFt && formData.areaSqFt < 10) {
      newErrors.areaSqFt = 'Area must be at least 10 square feet';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);
    try {
      const data = {
        ...formData,
        capacity: formData.type === 'EQUIPMENT' ? 1 : parseInt(formData.capacity),
        areaSqFt: formData.type === 'EQUIPMENT' ? null : formData.areaSqFt ? parseInt(formData.areaSqFt) : null,
        floor: parseInt(formData.floor),
        advanceBookingLimit: formData.advanceBookingLimit ? parseInt(formData.advanceBookingLimit) : 30,
        minimumNoticeHours: formData.minimumNoticeHours ? parseInt(formData.minimumNoticeHours) : 2,
        // Ensure required fields are properly set
        status: formData.status || 'WORKING',
        hasAC: Boolean(formData.hasAC),
        hasProjector: Boolean(formData.hasProjector),
        hasWhiteboard: Boolean(formData.hasWhiteboard),
        hasWiFi: Boolean(formData.hasWiFi),
        accessibilityFeatures: formData.accessibilityFeatures || [],
        availableDays: formData.availableDays || ['MON', 'TUE', 'WED', 'THU', 'FRI']
      };
      
      console.log('Sending data to backend:', data);
      console.log('Form data before processing:', formData);

      // Test connection first
      try {
        await axios.get(`${API_BASE_URL}/api/health`);
        console.log('Backend connection successful');
      } catch (connError) {
        console.error('Backend connection failed:', connError);
        toast.error(`Cannot connect to backend at ${API_BASE_URL}`);
        setLoading(false);
        return;
      }

      if (isEditing) {
        await axios.put(`${API_BASE_URL}/api/resources/${id}`, data);
        toast.success('Resource updated successfully');
      } else {
        await axios.post(`${API_BASE_URL}/api/resources`, data);
        toast.success('Resource created successfully');
      }
      
      navigate('/resources');
    } catch (error) {
      console.error('Full error details:', error);
      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      
      // Show detailed error message
      let errorMessage = isEditing ? 'Failed to update resource' : 'Failed to create resource';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
        setErrors({ submit: error.response.data.message });
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
        setErrors({ submit: error.response.data.error });
      } else if (error.message) {
        errorMessage = error.message;
        setErrors({ submit: error.message });
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const checkConflicts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/resources/check-conflict`, {
        params: {
          building: formData.building,
          type: formData.type,
          from: formData.availableFrom,
          to: formData.availableTo
        }
      });
      setConflicts(response.data);
    } catch (error) {
      console.error('Error checking conflicts:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleDayToggle = (day) => {
    setFormData(prev => ({
      ...prev,
      availableDays: prev.availableDays.includes(day)
        ? prev.availableDays.filter(d => d !== day)
        : [...prev.availableDays, day]
    }));
  };

  const handleAccessibilityToggle = (feature) => {
    setFormData(prev => ({
      ...prev,
      accessibilityFeatures: prev.accessibilityFeatures.includes(feature)
        ? prev.accessibilityFeatures.filter(f => f !== feature)
        : [...prev.accessibilityFeatures, feature]
    }));
  };

  if (fetchLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#094886]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {errors.submit && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 font-medium">{errors.submit}</p>
        </div>
      )}
      
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {isEditing ? 'Edit Resource' : 'Add New Resource'}
        </h1>
        <button
          onClick={() => navigate('/resources')}
          className="text-gray-500 hover:text-gray-700"
        >
          <FiX className="w-6 h-6" />
        </button>
      </div>

      {conflicts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <FiAlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <h3 className="text-red-800 font-medium">Booking Conflicts Detected</h3>
              <p className="text-red-700 text-sm mt-1">
                The following resources have conflicting time slots:
              </p>
              <ul className="list-disc list-inside text-red-700 text-sm mt-2">
                {conflicts.map(conflict => (
                  <li key={conflict.id}>{conflict.name} - {conflict.building}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Resource Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`input-field ${errors.name ? 'border-red-500' : ''}`}
                placeholder="Enter resource name (3-100 characters)"
              />
              {errors.name && <p className="error-message">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Resource Type *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className={`input-field ${errors.type ? 'border-red-500' : ''}`}
              >
                <option value="">Select type</option>
                {types.map(type => (
                  <option key={type} value={type}>{type.replace('_', ' ')}</option>
                ))}
              </select>
              {errors.type && <p className="error-message">{errors.type}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Building *
              </label>
              <select
                name="building"
                value={formData.building}
                onChange={handleInputChange}
                className={`input-field ${errors.building ? 'border-red-500' : ''}`}
              >
                <option value="">Select building</option>
                {buildings.map(building => (
                  <option key={building} value={building}>{building}</option>
                ))}
              </select>
              {errors.building && <p className="error-message">{errors.building}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Floor *
              </label>
              <input
                type="number"
                name="floor"
                value={formData.floor}
                onChange={handleInputChange}
                className={`input-field ${errors.floor ? 'border-red-500' : ''}`}
                placeholder="Enter floor number (1-10)"
                min="1"
                max="10"
              />
              {errors.floor && <p className="error-message">{errors.floor}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Room Number
              </label>
              <input
                type="text"
                name="roomNumber"
                value={formData.roomNumber}
                onChange={handleInputChange}
                className="input-field"
                placeholder="e.g., 101, A205"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Capacity *
              </label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleInputChange}
                className={`input-field ${errors.capacity ? 'border-red-500' : ''} ${formData.type === 'EQUIPMENT' ? 'bg-gray-100' : ''}`}
                placeholder="Enter capacity (1-1000 people)"
                min="1"
                max="1000"
                disabled={formData.type === 'EQUIPMENT'}
              />
              {errors.capacity && <p className="error-message">{errors.capacity}</p>}
              {formData.type === 'EQUIPMENT' && (
                <p className="text-sm text-gray-500 mt-1">Capacity is automatically set to 1 for equipment</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Area (sq ft)
              </label>
              <input
                type="number"
                name="areaSqFt"
                value={formData.areaSqFt}
                onChange={handleInputChange}
                className={`input-field ${errors.areaSqFt ? 'border-red-500' : ''} ${formData.type === 'EQUIPMENT' ? 'bg-gray-100' : ''}`}
                placeholder="Enter area in square feet (min: 10)"
                min="10"
                disabled={formData.type === 'EQUIPMENT'}
              />
              {errors.areaSqFt && <p className="error-message">{errors.areaSqFt}</p>}
              {formData.type === 'EQUIPMENT' && (
                <p className="text-sm text-gray-500 mt-1">Area is not applicable for equipment</p>
              )}
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Features</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'hasAC', label: 'Air Conditioning' },
              { name: 'hasProjector', label: 'Projector' },
              { name: 'hasWhiteboard', label: 'Whiteboard' },
              { name: 'hasWiFi', label: 'WiFi' }
            ].map(feature => (
              <label key={feature.name} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  name={feature.name}
                  checked={formData[feature.name]}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-[#094886] border-gray-300 rounded focus:ring-[#094886]"
                />
                <span className="text-sm text-gray-700">{feature.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Accessibility Features */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Accessibility Features</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {accessibilityOptions.map(feature => (
              <label key={feature} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.accessibilityFeatures.includes(feature)}
                  onChange={() => handleAccessibilityToggle(feature)}
                  className="w-4 h-4 text-[#094886] border-gray-300 rounded focus:ring-[#094886]"
                />
                <span className="text-sm text-gray-700">{feature.replace('_', ' ')}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Availability */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Availability</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Available From *
              </label>
              <input
                type="time"
                name="availableFrom"
                value={formData.availableFrom}
                onChange={handleInputChange}
                className={`input-field ${errors.availableTime ? 'border-red-500' : ''}`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Available To *
              </label>
              <input
                type="time"
                name="availableTo"
                value={formData.availableTo}
                onChange={handleInputChange}
                className={`input-field ${errors.availableTime ? 'border-red-500' : ''}`}
              />
            </div>
            {errors.availableTime && <p className="error-message md:col-span-2">{errors.availableTime}</p>}
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Available Days *
            </label>
            <div className="flex flex-wrap gap-2">
              {daysOfWeek.map(day => (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleDayToggle(day)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    formData.availableDays.includes(day)
                      ? 'bg-[#094886] text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
            {errors.availableDays && <p className="error-message">{errors.availableDays}</p>}
          </div>
        </div>

        {/* Booking Settings */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Booking Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Advance Booking Limit (days)
              </label>
              <input
                type="number"
                name="advanceBookingLimit"
                value={formData.advanceBookingLimit}
                onChange={handleInputChange}
                className={`input-field ${errors.advanceBookingLimit ? 'border-red-500' : ''}`}
                placeholder="30"
                min="1"
                max="90"
              />
              {errors.advanceBookingLimit && <p className="error-message">{errors.advanceBookingLimit}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Notice (hours)
              </label>
              <input
                type="number"
                name="minimumNoticeHours"
                value={formData.minimumNoticeHours}
                onChange={handleInputChange}
                className={`input-field ${errors.minimumNoticeHours ? 'border-red-500' : ''}`}
                placeholder="2"
                min="0"
                max="48"
              />
              {errors.minimumNoticeHours && <p className="error-message">{errors.minimumNoticeHours}</p>}
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="input-field"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{status.replace('_', ' ')}</option>
                ))}
              </select>
            </div>

            {formData.status === 'UNDER_MAINTENANCE' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Maintenance End Date *
                </label>
                <input
                  type="date"
                  name="maintenanceEndDate"
                  value={formData.maintenanceEndDate}
                  onChange={handleInputChange}
                  className={`input-field ${errors.maintenanceEndDate ? 'border-red-500' : ''}`}
                  min={new Date().toISOString().split('T')[0]}
                />
                {errors.maintenanceEndDate && <p className="error-message">{errors.maintenanceEndDate}</p>}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={checkConflicts}
            className="btn-secondary"
          >
            Check Conflicts
          </button>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => navigate('/resources')}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center space-x-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <FiSave className="w-4 h-4" />
              )}
              <span>{isEditing ? 'Update Resource' : 'Create Resource'}</span>
            </button>
          </div>
        </div>

        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{errors.submit}</p>
          </div>
        )}
      </form>
    </div>
  );
};

export default ResourceForm;
