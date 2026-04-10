import { Link } from 'react-router-dom';
import { FiSearch, FiGrid, FiCalendar, FiSettings, FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import AdminLoginButton from '../components/AdminLoginButton';

const Home = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem('role');
    setIsAdmin(role === 'admin');
  }, []);

  const features = [
    {
      icon: FiGrid,
      title: 'Browse Resources',
      description: 'Explore available rooms, labs, and equipment across campus',
      link: '/resources',
      color: 'bg-blue-500'
    },
    {
      icon: FiSearch,
      title: 'Compare Resources',
      description: 'Compare multiple resources side by side to make informed decisions',
      link: '/compare',
      color: 'bg-green-500'
    },
    {
      icon: FiCalendar,
      title: 'Book Resources',
      description: 'Schedule and manage bookings for campus facilities',
      link: '/resources',
      color: 'bg-purple-500'
    },
    {
      icon: FiSettings,
      title: 'Smart Admin Dashboard',
      description: 'Manage resources, view analytics, and system settings',
      link: '/smart-admin/dashboard',
      color: 'bg-orange-500',
      adminOnly: true
    }
  ];

  const stats = [
    { label: 'Total Resources', value: '150+', description: 'Rooms, labs, and equipment' },
    { label: 'Active Bookings', value: '89', description: 'Currently scheduled' },
    { label: 'Buildings', value: '5', description: 'Across campus' },
    { label: 'Satisfaction', value: '98%', description: 'User rating' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#094886] to-[#2563eb] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Smart Campus Resource Management
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Efficiently manage and book campus resources with our comprehensive platform. 
              Find the perfect space for your needs in seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/resources" className="btn-secondary text-lg px-8 py-3">
                Browse Resources
              </Link>
              {isAdmin && (
                <Link to="/smart-admin/dashboard" className="bg-white text-[#094886] px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors text-lg font-medium inline-block">
                  Smart Admin Dashboard
                </Link>
              )}
              <AdminLoginButton />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-[#094886] mb-2">{stat.value}</div>
                <div className="text-lg font-semibold text-gray-900 mb-1">{stat.label}</div>
                <div className="text-sm text-gray-600">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need in One Platform
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our comprehensive system provides all the tools you need for efficient resource management.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features
              .filter(feature => !feature.adminOnly || isAdmin)
              .map((feature, index) => (
                <Link
                  key={index}
                  to={feature.link}
                  className="card hover:shadow-xl transition-all duration-300 group"
                >
                  <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {feature.description}
                  </p>
                  <div className="flex items-center text-[#094886] font-medium group-hover:text-[#2563eb] transition-colors">
                    Get Started
                    <FiArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* Quick Actions Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Quick Actions
            </h2>
            <p className="text-xl text-gray-600">
              Get started with these common tasks
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiSearch className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Find a Resource</h3>
              <p className="text-gray-600 mb-4">
                Search and filter through all available resources to find exactly what you need.
              </p>
              <Link to="/resources" className="btn-secondary inline-block">
                Search Now
              </Link>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiCalendar className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Make a Booking</h3>
              <p className="text-gray-600 mb-4">
                Reserve rooms, labs, or equipment for your classes, meetings, or events.
              </p>
              <Link to="/resources" className="btn-secondary inline-block">
                Book Now
              </Link>
            </div>

            {isAdmin && (
              <div className="card text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiSettings className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Manage Resources</h3>
                <p className="text-gray-600 mb-4">
                  Add, edit, or remove resources and manage system settings.
                </p>
                <Link to="/smart-admin/dashboard" className="btn-secondary inline-block">
                  Manage Now
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Why Choose Smart Campus?
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <FiCheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Easy to Use</h3>
                    <p className="text-gray-600">Intuitive interface designed for students and faculty</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <FiCheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Real-time Availability</h3>
                    <p className="text-gray-600">See up-to-date availability and booking status</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <FiCheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Mobile Friendly</h3>
                    <p className="text-gray-600">Access the system from any device, anywhere</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#094886] to-[#2563eb] rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Get Started Today</h3>
              <p className="text-blue-100 mb-6">
                Join thousands of students and faculty already using Smart Campus to manage their resource needs efficiently.
              </p>
              <Link to="/resources" className="bg-white text-[#094886] px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium inline-block">
                Explore Resources
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
