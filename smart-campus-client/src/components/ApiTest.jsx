import axios from 'axios';
import { useState } from 'react';
import { API_BASE_URL } from '../lib/apiBase';

const ApiTest = () => {
  const [results, setResults] = useState([]);

  const testConnection = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/test`);
      setResults(prev => [...prev, { type: 'success', message: 'Backend connected!', data: response.data }]);
    } catch (error) {
      setResults(prev => [...prev, { type: 'error', message: `Connection failed: ${error.message}` }]);
    }
  };

  const testCreateResource = async () => {
    try {
      const testData = {
        name: 'Test Resource',
        type: 'LECTURE_HALL',
        building: 'MAIN',
        floor: 1,
        capacity: 50,
        availableFrom: '08:00',
        availableTo: '18:00',
        availableDays: ['MON', 'TUE', 'WED', 'THU', 'FRI'],
        status: 'WORKING'
      };
      
      const response = await axios.post(`${API_BASE_URL}/api/resources`, testData);
      setResults(prev => [...prev, { type: 'success', message: 'Resource created!', data: response.data }]);
    } catch (error) {
      setResults(prev => [...prev, { type: 'error', message: `Create failed: ${error.message}` }]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h2 className="text-2xl font-bold mb-4">API Connection Test</h2>
      
      <div className="space-y-4">
        <div className="flex space-x-4">
          <button
            onClick={testConnection}
            className="btn-primary"
          >
            Test Backend Connection
          </button>
          <button
            onClick={testCreateResource}
            className="btn-secondary"
          >
            Test Create Resource
          </button>
        </div>
        
        <div className="bg-gray-100 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Test Results:</h3>
          {results.map((result, index) => (
            <div key={index} className={`p-3 rounded ${
              result.type === 'success' ? 'bg-green-100 text-green-800' : 
              result.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
            }`}>
              <div className="font-medium">{result.type.toUpperCase()}</div>
              <div>{result.message}</div>
              {result.data && (
                <pre className="mt-2 text-xs bg-gray-50 p-2 rounded">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ApiTest;
