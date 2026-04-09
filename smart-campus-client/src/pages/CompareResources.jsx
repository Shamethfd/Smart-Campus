import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FiX, FiPlus, FiBarChart2, FiGrid } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { API_BASE_URL } from '../lib/apiBase';

const CompareResources = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    const ids = searchParams.get('ids');
    if (ids) {
      const idArray = ids.split(',').map(id => parseInt(id.trim()));
      setSelectedIds(idArray);
      fetchResources(idArray);
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  const fetchResources = async (ids) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/resources/compare?ids=${ids.join(',')}`);
      setResources(response.data);
    } catch (error) {
      toast.error('Failed to fetch resources for comparison');
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToComparison = (id) => {
    if (selectedIds.length >= 4) {
      toast.error('Maximum 4 resources can be compared at once');
      return;
    }
    const newIds = [...selectedIds, id];
    setSelectedIds(newIds);
    setSearchParams({ ids: newIds.join(',') });
    fetchResources(newIds);
  };

  const removeFromComparison = (id) => {
    const newIds = selectedIds.filter(selectedId => selectedId !== id);
    setSelectedIds(newIds);
    setSearchParams({ ids: newIds.join(',') });
    if (newIds.length > 0) {
      fetchResources(newIds);
    } else {
      setResources([]);
    }
  };

  const getComparisonData = () => {
    return resources.map(resource => ({
      name: resource.name,
      capacity: resource.capacity,
      area: resource.areaSqFt || 0,
      features: [
        resource.hasAC ? 1 : 0,
        resource.hasProjector ? 1 : 0,
        resource.hasWhiteboard ? 1 : 0,
        resource.hasWiFi ? 1 : 0
      ].reduce((a, b) => a + b, 0)
    }));
  };

  const getRadarData = () => {
    return [
      { feature: 'Capacity', fullMark: 1000 },
      { feature: 'Area', fullMark: 1000 },
      { feature: 'Features', fullMark: 4 },
      { feature: 'Availability', fullMark: 10 },
      { feature: 'Accessibility', fullMark: 4 }
    ];
  };

  const getRadarValues = (resource) => {
    return {
      capacity: (resource.capacity / 1000) * 100,
      area: ((resource.areaSqFt || 0) / 1000) * 100,
      features: [
        resource.hasAC ? 1 : 0,
        resource.hasProjector ? 1 : 0,
        resource.hasWhiteboard ? 1 : 0,
        resource.hasWiFi ? 1 : 0
      ].reduce((a, b) => a + b, 0) * 25,
      availability: (resource.availableDays?.length || 0) * 14.3,
      accessibility: (resource.accessibilityFeatures?.length || 0) * 25
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#094886]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Compare Resources</h1>
          <p className="text-gray-600 mt-1">
            {selectedIds.length} resource{selectedIds.length !== 1 ? 's' : ''} selected for comparison
          </p>
        </div>
        <Link to="/resources" className="btn-secondary flex items-center space-x-2">
          <FiPlus className="w-4 h-4" />
          <span>Add Resources</span>
        </Link>
      </div>

      {selectedIds.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-4">No resources selected for comparison</div>
          <Link to="/resources" className="btn-primary">
            Browse Resources to Compare
          </Link>
        </div>
      ) : (
        <>
          {/* Selected Resources */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <div className="flex items-center justify-between">
              <span className="text-blue-800 font-medium">
                Selected Resources ({selectedIds.length}/4)
              </span>
              <div className="flex flex-wrap gap-2">
                {resources.map(resource => (
                  <div
                    key={resource.id}
                    className="bg-white px-3 py-1 rounded-full text-sm border border-blue-300 flex items-center space-x-2"
                  >
                    <span>{resource.name}</span>
                    <button
                      onClick={() => removeFromComparison(resource.id)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FiX className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Comparison Table */}
          {resources.length > 0 && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Feature
                    </th>
                    {resources.map(resource => (
                      <th key={resource.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {resource.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 font-medium text-gray-900">Type</td>
                    {resources.map(resource => (
                      <td key={resource.id} className="px-6 py-4 text-gray-500">
                        {resource.type?.replace('_', ' ')}
                      </td>
                    ))}
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">Building</td>
                    {resources.map(resource => (
                      <td key={resource.id} className="px-6 py-4 text-gray-500">
                        {resource.building}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium text-gray-900">Floor</td>
                    {resources.map(resource => (
                      <td key={resource.id} className="px-6 py-4 text-gray-500">
                        {resource.floor}
                      </td>
                    ))}
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">Room</td>
                    {resources.map(resource => (
                      <td key={resource.id} className="px-6 py-4 text-gray-500">
                        {resource.roomNumber || '-'}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium text-gray-900">Capacity</td>
                    {resources.map(resource => (
                      <td key={resource.id} className="px-6 py-4 text-gray-500">
                        {resource.capacity}
                      </td>
                    ))}
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">Area (sq ft)</td>
                    {resources.map(resource => (
                      <td key={resource.id} className="px-6 py-4 text-gray-500">
                        {resource.areaSqFt || '-'}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium text-gray-900">Available Hours</td>
                    {resources.map(resource => (
                      <td key={resource.id} className="px-6 py-4 text-gray-500">
                        {resource.availableFrom} - {resource.availableTo}
                      </td>
                    ))}
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">Air Conditioning</td>
                    {resources.map(resource => (
                      <td key={resource.id} className="px-6 py-4 text-gray-500">
                        {resource.hasAC ? '✓' : '✗'}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium text-gray-900">Projector</td>
                    {resources.map(resource => (
                      <td key={resource.id} className="px-6 py-4 text-gray-500">
                        {resource.hasProjector ? '✓' : '✗'}
                      </td>
                    ))}
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">Whiteboard</td>
                    {resources.map(resource => (
                      <td key={resource.id} className="px-6 py-4 text-gray-500">
                        {resource.hasWhiteboard ? '✓' : '✗'}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium text-gray-900">WiFi</td>
                    {resources.map(resource => (
                      <td key={resource.id} className="px-6 py-4 text-gray-500">
                        {resource.hasWiFi ? '✓' : '✗'}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Charts */}
          {resources.length > 1 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Capacity Comparison */}
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Capacity Comparison</h2>
                <div className="h-80">
                  <BarChart data={getComparisonData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="capacity" fill="#094886" />
                  </BarChart>
                </div>
              </div>

              {/* Features Comparison */}
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Features Comparison</h2>
                <div className="h-80">
                  <BarChart data={getComparisonData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="features" fill="#2563eb" />
                  </BarChart>
                </div>
              </div>
            </div>
          )}

          {/* Radar Chart */}
          {resources.length > 0 && resources.length <= 3 && (
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Overall Comparison</h2>
              <div className="h-96">
                <RadarChart data={getRadarData()}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="feature" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  {resources.map((resource, index) => (
                    <Radar
                      key={resource.id}
                      name={resource.name}
                      dataKey={Object.keys(getRadarValues(resource))}
                      stroke={['#094886', '#2563eb', '#10b981'][index]}
                      fill={['#094886', '#2563eb', '#10b981'][index]}
                      fillOpacity={0.3}
                    />
                  ))}
                  <Tooltip />
                  <Legend />
                </RadarChart>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-center mt-8 space-x-4">
            <Link to="/resources" className="btn-secondary">
              Back to Resources
            </Link>
            <button className="btn-primary">
              Export Comparison
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CompareResources;
