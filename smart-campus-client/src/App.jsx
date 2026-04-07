import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState } from 'react';
import './App.css';
import BookingRequest from './pages/BookingRequest';
import UserDashboard from './pages/UserDashboard';
import AdminPanel from './pages/AdminPanel';

function App() {
  const [isAdmin] = useState(false); // TODO: Get this from authentication

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <nav className="bg-white shadow-lg sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <Link to="/" className="text-2xl font-bold text-indigo-600">
                Smart Campus
              </Link>
              <div className="flex gap-4">
                <Link
                  to="/book"
                  className="px-4 py-2 text-gray-700 hover:text-indigo-600 font-semibold transition duration-200"
                >
                  Book Resource
                </Link>
                <Link
                  to="/dashboard"
                  className="px-4 py-2 text-gray-700 hover:text-indigo-600 font-semibold transition duration-200"
                >
                  My Bookings
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition duration-200"
                  >
                    Admin Panel
                  </Link>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/book" element={<BookingRequest />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </div>
    </Router>
  );
}

function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Smart Campus Booking System
        </h1>
        <p className="text-xl text-gray-700 mb-12">
          Manage your resource bookings efficiently
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-4xl mb-4">📅</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Book a Resource</h2>
            <p className="text-gray-600 mb-6">
              Select from available rooms, labs, and equipment for your preferred date and time
            </p>
            <Link
              to="/book"
              className="inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition duration-200"
            >
              Start Booking
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-4xl mb-4">📋</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">View Bookings</h2>
            <p className="text-gray-600 mb-6">
              Check your booking history, status, and manage your active bookings
            </p>
            <Link
              to="/dashboard"
              className="inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition duration-200"
            >
              View Dashboard
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-4xl mb-4">⚙️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Admin Control</h2>
            <p className="text-gray-600 mb-6">
              Review pending requests and manage all bookings in the system
            </p>
            <button
              disabled
              className="inline-block px-6 py-3 bg-gray-400 text-white font-semibold rounded-lg cursor-not-allowed"
            >
              Admin Panel
            </button>
          </div>
        </div>

        <div className="mt-16 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-2">1</div>
              <h3 className="font-semibold text-gray-900 mb-2">Request</h3>
              <p className="text-gray-600 text-sm">Submit a booking request for your desired resource</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-2">2</div>
              <h3 className="font-semibold text-gray-900 mb-2">Pending Review</h3>
              <p className="text-gray-600 text-sm">Admin reviews your booking request</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-2">3</div>
              <h3 className="font-semibold text-gray-900 mb-2">Approval</h3>
              <p className="text-gray-600 text-sm">Admin approves or rejects your request</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-2">4</div>
              <h3 className="font-semibold text-gray-900 mb-2">Confirmed</h3>
              <p className="text-gray-600 text-sm">Your booking is confirmed and ready to use</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
