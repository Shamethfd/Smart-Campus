import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import ResourceList from './pages/ResourceList';
import ResourceDetail from './pages/ResourceDetail';
import ResourceForm from './pages/ResourceForm';
import SmartAdminDashboard from './pages/SmartAdminDashboard';
import CompareResources from './pages/CompareResources';
import QRScanner from './pages/QRScanner';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/resources" element={<ResourceList />} />
            <Route path="/resource/:id" element={<ResourceDetail />} />
            <Route path="/compare" element={<CompareResources />} />
            <Route path="/scan" element={<QRScanner />} />
            
            {/* Admin only routes */}
            <Route path="/resource/add" element={
              <ProtectedRoute adminOnly>
                <ResourceForm />
              </ProtectedRoute>
            } />
            <Route path="/resource/edit/:id" element={
              <ProtectedRoute adminOnly>
                <ResourceForm />
              </ProtectedRoute>
            } />
            <Route path="/smart-admin/dashboard" element={
              <ProtectedRoute adminOnly>
                <SmartAdminDashboard />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
        <Footer />
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

export default App;
