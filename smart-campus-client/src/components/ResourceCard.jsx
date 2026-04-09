import { Link } from 'react-router-dom';
import { FiMapPin, FiUsers, FiClock, FiEdit, FiTrash2, FiEye, FiPlus } from 'react-icons/fi';
import { useState } from 'react';

const ResourceCard = ({ resource, onView, onEdit, onDelete, showActions = true, isSelected, onSelect }) => {
  const isAdmin = localStorage.getItem('role') === 'admin';

  const getStatusColor = (status) => {
    switch (status) {
      case 'WORKING':
        return 'bg-green-100 text-green-800';
      case 'OUT_OF_SERVICE':
        return 'bg-red-100 text-red-800';
      case 'UNDER_MAINTENANCE':
        return 'bg-yellow-100 text-yellow-800';
      case 'DELETED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="card hover:shadow-xl transition-all duration-300">
      {onSelect && (
        <div className="flex justify-start mb-2">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onSelect(resource.id, e.target.checked)}
            className="w-4 h-4 text-[#094886] border-gray-300 rounded focus:ring-[#094886]"
          />
        </div>
      )}
      
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{resource.name}</h3>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(resource.status)}`}>
            {resource.status.replace('_', ' ')}
          </span>
        </div>
        <div className="flex space-x-2">
          {showActions && (
            <>
              <button
                onClick={() => onView(resource.id)}
                className="text-blue-600 hover:text-blue-800 transition-colors"
                title="View Details"
              >
                <FiEye className="w-4 h-4" />
              </button>
              {isAdmin && (
                <>
                  <button
                    onClick={() => onEdit(resource.id)}
                    className="text-green-600 hover:text-green-800 transition-colors"
                    title="Edit"
                  >
                    <FiEdit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(resource.id)}
                    className="text-red-600 hover:text-red-800 transition-colors"
                    title="Delete"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center text-sm text-gray-600">
          <FiMapPin className="w-4 h-4 mr-2" />
          <span>{resource.building} - Floor {resource.floor}</span>
          {resource.roomNumber && <span className="ml-2">Room {resource.roomNumber}</span>}
        </div>

        <div className="flex items-center text-sm text-gray-600">
          <FiUsers className="w-4 h-4 mr-2" />
          <span>Capacity: {resource.capacity}</span>
        </div>

        <div className="flex items-center text-sm text-gray-600">
          <FiClock className="w-4 h-4 mr-2" />
          <span>
            {resource.availableFrom} - {resource.availableTo}
          </span>
        </div>

        <div className="flex flex-wrap gap-1 mt-3">
          {resource.hasAC && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">AC</span>
          )}
          {resource.hasProjector && (
            <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">Projector</span>
          )}
          {resource.hasWhiteboard && (
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Whiteboard</span>
          )}
          {resource.hasWiFi && (
            <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded">WiFi</span>
          )}
        </div>

        {resource.areaSqFt && (
          <div className="text-sm text-gray-500">
            Area: {resource.areaSqFt} sq ft
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <Link
          to={`/resource/${resource.id}`}
          className="btn-primary w-full text-center block"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ResourceCard;
