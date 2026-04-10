import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiFilter, FiGrid, FiList, FiPlus, FiChevronLeft, FiChevronRight, FiEdit, FiTrash2, FiEye } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import ResourceCard from '../components/ResourceCard';
import axios from 'axios';
import { API_BASE_URL } from '../lib/apiBase';
import { getToken } from '../utils/tokenUtils';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const ResourceList = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [selectedResources, setSelectedResources] = useState(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [size, setSize] = useState(12);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    building: '',
    type: '',
    status: '',
    minCapacity: '',
    maxCapacity: '',
    sortBy: 'name',
    sortDir: 'asc'
  });

  useEffect(() => {
    const role = localStorage.getItem('role');
    setIsAdmin(role === 'admin');
  }, []);

  useEffect(() => {
    fetchResources();
  }, [currentPage, size, searchTerm, filters]);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        size: size,
        sortBy: filters.sortBy,
        sortDir: filters.sortDir
      });

      if (searchTerm) params.append('name', searchTerm);
      if (filters.building) params.append('building', filters.building);
      if (filters.type) params.append('type', filters.type);
      if (filters.status) params.append('status', filters.status);
      if (filters.minCapacity) params.append('minCapacity', filters.minCapacity);
      if (filters.maxCapacity) params.append('maxCapacity', filters.maxCapacity);

      const response = await api.get(`/api/resources?${params}`);
      const pageData = response.data?.data ?? response.data;
      setResources(pageData?.content ?? []);
      setTotalPages(pageData?.totalPages ?? 0);
      setTotalElements(pageData?.totalElements ?? 0);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        (error.response?.status === 401 ? 'Please login again to view resources' : null) ||
        'Failed to fetch resources';
      toast.error(message);
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(0);
    fetchResources();
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(0);
  };

  const handleResourceSelect = (id, checked) => {
    const newSelected = new Set(selectedResources);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedResources(newSelected);
  };

  const handleBulkDelete = async () => {
    if (selectedResources.size === 0) {
      toast.error('Please select resources to delete');
      return;
    }

    if (!confirm(`Are you sure you want to delete ${selectedResources.size} resource(s)?`)) {
      return;
    }

    try {
      await api.delete('/api/resources/bulk', {
        data: Array.from(selectedResources)
      });
      toast.success('Resources deleted successfully');
      setSelectedResources(new Set());
      fetchResources();
    } catch (error) {
      toast.error('Failed to delete resources');
      console.error('Error deleting resources:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this resource?')) {
      return;
    }

    try {
      await api.delete(`/api/resources/${id}`);
      toast.success('Resource deleted successfully');
      fetchResources();
    } catch (error) {
      toast.error('Failed to delete resource');
      console.error('Error deleting resource:', error);
    }
  };

  const buildings = ['MAIN', 'ENGINEERING', 'SCIENCE', 'LIBRARY', 'ADMIN'];
  const types = ['LECTURE_HALL', 'COMPUTER_LAB', 'MEETING_ROOM', 'EQUIPMENT', 'AUDITORIUM', 'SMART_CLASSROOM'];
  const statuses = ['WORKING', 'OUT_OF_SERVICE', 'UNDER_MAINTENANCE'];

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Resources</h1>
          <p className="text-gray-600 mt-1">
            {totalElements} resource{totalElements !== 1 ? 's' : ''} available
          </p>
        </div>
        {isAdmin && (
          <Link to="/resource/add" className="btn-primary flex items-center space-x-2">
            <FiPlus className="w-4 h-4" />
            <span>Add Resource</span>
          </Link>
        )}
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <FiSearch className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search resources by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="btn-secondary flex items-center space-x-2"
            >
              <FiFilter className="w-4 h-4" />
              <span>Filters</span>
            </button>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-[#094886] text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                <FiGrid className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-[#094886] text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                <FiList className="w-5 h-5" />
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 pt-4 border-t">
              <select
                value={filters.building}
                onChange={(e) => handleFilterChange('building', e.target.value)}
                className="input-field"
              >
                <option value="">All Buildings</option>
                {buildings.map(building => (
                  <option key={building} value={building}>{building}</option>
                ))}
              </select>

              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="input-field"
              >
                <option value="">All Types</option>
                {types.map(type => (
                  <option key={type} value={type}>{type.replace('_', ' ')}</option>
                ))}
              </select>

              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="input-field"
              >
                <option value="">All Status</option>
                {statuses.map(status => (
                  <option key={status} value={status}>{status.replace('_', ' ')}</option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Min Capacity"
                value={filters.minCapacity}
                onChange={(e) => handleFilterChange('minCapacity', e.target.value)}
                className="input-field"
              />

              <input
                type="number"
                placeholder="Max Capacity"
                value={filters.maxCapacity}
                onChange={(e) => handleFilterChange('maxCapacity', e.target.value)}
                className="input-field"
              />

              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="input-field"
              >
                <option value="name">Name</option>
                <option value="capacity">Capacity</option>
                <option value="building">Building</option>
                <option value="type">Type</option>
              </select>
            </div>
          )}
        </form>
      </div>

      {/* Bulk Actions */}
      {selectedResources.size > 0 && isAdmin && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-center justify-between">
          <span className="text-blue-800">
            {selectedResources.size} resource{selectedResources.size !== 1 ? 's' : ''} selected
          </span>
          <div className="flex space-x-2">
            <button
              onClick={handleBulkDelete}
              className="btn-danger flex items-center space-x-2"
            >
              <FiTrash2 className="w-4 h-4" />
              <span>Delete Selected</span>
            </button>
          </div>
        </div>
      )}

      {/* Resources Grid/List */}
      {resources.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-4">No resources found</div>
          {isAdmin && (
            <Link to="/resource/add" className="btn-primary">
              Add Your First Resource
            </Link>
          )}
        </div>
      ) : (
        <>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {resources.map(resource => (
                <ResourceCard
                  key={resource.id}
                  resource={resource}
                  onView={(id) => window.location.href = `/resource/${id}`}
                  onEdit={(id) => window.location.href = `/resource/edit/${id}`}
                  onDelete={handleDelete}
                  isSelected={selectedResources.has(resource.id)}
                  onSelect={handleResourceSelect}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedResources(new Set(resources.map(r => r.id)));
                          } else {
                            setSelectedResources(new Set());
                          }
                        }}
                        className="w-4 h-4 text-[#094886] border-gray-300 rounded focus:ring-[#094886]"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Building
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Capacity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {resources.map(resource => (
                    <tr key={resource.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedResources.has(resource.id)}
                          onChange={(e) => handleResourceSelect(resource.id, e.target.checked)}
                          className="w-4 h-4 text-[#094886] border-gray-300 rounded focus:ring-[#094886]"
                        />
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        <Link to={`/resource/${resource.id}`} className="hover:text-[#094886]">
                          {resource.name}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {resource.type.replace('_', ' ')}
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {resource.building}
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {resource.capacity}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          resource.status === 'WORKING' ? 'bg-green-100 text-green-800' :
                          resource.status === 'OUT_OF_SERVICE' ? 'bg-red-100 text-red-800' :
                          resource.status === 'UNDER_MAINTENANCE' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {resource.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <Link
                            to={`/resource/${resource.id}`}
                            className="text-blue-600 hover:text-blue-800"
                            title="View"
                          >
                            <FiEye className="w-4 h-4" />
                          </Link>
                          {isAdmin && (
                            <>
                              <Link
                                to={`/resource/edit/${resource.id}`}
                                className="text-green-600 hover:text-green-800"
                                title="Edit"
                              >
                                <FiEdit className="w-4 h-4" />
                              </Link>
                              <button
                                onClick={() => handleDelete(resource.id)}
                                className="text-red-600 hover:text-red-800"
                                title="Delete"
                              >
                                <FiTrash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          <div className="flex items-center justify-between mt-8">
            <div className="text-sm text-gray-700">
              Showing {resources.length > 0 ? currentPage * size + 1 : 0} to{' '}
              {Math.min((currentPage + 1) * size, totalElements)} of {totalElements} results
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                disabled={currentPage === 0}
                className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-3 py-1 text-sm">
                Page {currentPage + 1} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                disabled={currentPage >= totalPages - 1}
                className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ResourceList;
