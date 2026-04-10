import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCamera, FiX, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { API_BASE_URL } from '../lib/apiBase';

const QRScanner = () => {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const videoRef = useRef(null);
  const navigate = useNavigate();

  const startScanning = () => {
    setScanning(true);
    setError(null);
    setResult(null);
    
    // Simulate QR code scanning (in real implementation, use react-qr-reader)
    setTimeout(() => {
      // Mock QR code result
      const mockResult = {
        text: 'Resource ID: 1\nName: Main Lecture Hall\nQR: mock-qr-code-123',
        format: 'QR_CODE'
      };
      setResult(mockResult);
      setScanning(false);
      handleQRResult(mockResult.text);
    }, 2000);
  };

  const stopScanning = () => {
    setScanning(false);
  };

  const handleQRResult = async (qrText) => {
    try {
      setLoading(true);
      
      // Extract resource ID from QR text
      const idMatch = qrText.match(/Resource ID: (\d+)/);
      if (idMatch) {
        const resourceId = parseInt(idMatch[1]);
        
        // Fetch resource details
        const response = await axios.get(`${API_BASE_URL}/api/resources/${resourceId}`);
        const resource = response.data;
        
        toast.success(`Resource found: ${resource.name}`);
        
        // Navigate to resource details
        navigate(`/resource/${resourceId}`);
      } else {
        setError('Invalid QR code format');
        toast.error('Invalid QR code');
      }
    } catch (error) {
      setError('Resource not found');
      toast.error('Resource not found');
      console.error('Error fetching resource:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetScanner = () => {
    setResult(null);
    setError(null);
    setScanning(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">QR Code Scanner</h1>
        <p className="text-gray-600 mt-2">
          Scan a QR code to quickly access resource information
        </p>
      </div>

      {/* Scanner Area */}
      <div className="card mb-8">
        <div className="relative">
          {/* Camera View */}
          <div className="bg-gray-100 rounded-lg overflow-hidden" style={{ height: '400px' }}>
            {scanning ? (
              <div className="w-full h-full flex items-center justify-center bg-black">
                <div className="text-white text-center">
                  <FiCamera className="w-16 h-16 mx-auto mb-4 animate-pulse" />
                  <p className="text-lg">Scanning...</p>
                  <p className="text-sm text-gray-300 mt-2">Position QR code within frame</p>
                </div>
              </div>
            ) : result ? (
              <div className="w-full h-full flex items-center justify-center bg-green-50">
                <div className="text-center">
                  <FiCheck className="w-16 h-16 mx-auto mb-4 text-green-600" />
                  <p className="text-lg font-medium text-green-800">QR Code Scanned Successfully</p>
                  <p className="text-sm text-green-600 mt-2">Redirecting to resource...</p>
                </div>
              </div>
            ) : error ? (
              <div className="w-full h-full flex items-center justify-center bg-red-50">
                <div className="text-center">
                  <FiAlertCircle className="w-16 h-16 mx-auto mb-4 text-red-600" />
                  <p className="text-lg font-medium text-red-800">Scanning Failed</p>
                  <p className="text-sm text-red-600 mt-2">{error}</p>
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <FiCamera className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg text-gray-600">Ready to Scan</p>
                  <p className="text-sm text-gray-500 mt-2">Click the button below to start scanning</p>
                </div>
              </div>
            )}
          </div>

          {/* Scanning Frame Overlay */}
          {scanning && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 border-2 border-white rounded-lg">
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-500 rounded-tl-lg"></div>
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-500 rounded-tr-lg"></div>
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-500 rounded-bl-lg"></div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-500 rounded-br-lg"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex justify-center mt-6 space-x-4">
          {!scanning && !result && !error && (
            <button
              onClick={startScanning}
              className="btn-primary flex items-center space-x-2"
            >
              <FiCamera className="w-4 h-4" />
              <span>Start Scanning</span>
            </button>
          )}
          
          {scanning && (
            <button
              onClick={stopScanning}
              className="btn-danger flex items-center space-x-2"
            >
              <FiX className="w-4 h-4" />
              <span>Stop Scanning</span>
            </button>
          )}
          
          {(result || error) && (
            <button
              onClick={resetScanner}
              className="btn-secondary flex items-center space-x-2"
            >
              <FiCamera className="w-4 h-4" />
              <span>Scan Again</span>
            </button>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiCamera className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Position QR Code</h3>
          <p className="text-gray-600">
            Hold your device steady and ensure the QR code is well-lit and clearly visible
          </p>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiCheck className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Auto-Detection</h3>
          <p className="text-gray-600">
            The scanner will automatically detect and decode the QR code when properly positioned
          </p>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiAlertCircle className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Access</h3>
          <p className="text-gray-600">
            Once scanned, you'll be immediately redirected to the resource details page
          </p>
        </div>
      </div>

      {/* Manual Entry */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Can't Scan?</h2>
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            If you're having trouble scanning the QR code, you can manually enter the resource ID:
          </p>
          <div className="flex justify-center space-x-4">
            <input
              type="number"
              placeholder="Enter Resource ID"
              className="input-field max-w-xs"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  const resourceId = parseInt(e.target.value);
                  if (resourceId) {
                    navigate(`/resource/${resourceId}`);
                  }
                }
              }}
            />
            <button
              onClick={() => {
                const input = document.querySelector('input[type="number"]');
                const resourceId = parseInt(input.value);
                if (resourceId) {
                  navigate(`/resource/${resourceId}`);
                } else {
                  toast.error('Please enter a valid resource ID');
                }
              }}
              className="btn-primary"
            >
              Go to Resource
            </button>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#094886] mx-auto mb-4"></div>
            <p className="text-gray-900">Loading resource information...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRScanner;
