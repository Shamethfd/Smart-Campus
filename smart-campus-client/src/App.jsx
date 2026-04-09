/**
 * App.jsx
 * Main application layout and router setup.
 * 
 * Sets up:
 * - Google OAuth Provider context
 * - Custom AuthProvider context
 * - React Router
 * - Toast notification container
 * 
 * Member 4 - App Setup
 */

import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import RoleProtectedRoute from './components/RoleProtectedRoute';

// Pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import NotificationPage from './pages/NotificationPage';
import AdminUsersPage from './pages/AdminUsersPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import OAuth2RedirectHandler from './components/OAuth2RedirectHandler';

// Main Layout component (includes Navbar)
function MainLayout() {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="app-container">
      {/* Show Navbar only if logged in */}
      {isAuthenticated && <Navbar />}
      
      {/* Page content */}
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}

function App() {
  return (
      <AuthProvider>
        <Router>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#333',
                color: '#fff',
                borderRadius: '8px',
                padding: '16px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }
            }}
          />
          
          <Routes>
            {/* Public route */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />

            {/* Protected routes wrapped in MainLayout */}
            <Route element={<MainLayout />}>
              
              {/* Common protected routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } />
              <Route path="/notifications" element={
                <ProtectedRoute>
                  <NotificationPage />
                </ProtectedRoute>
              } />

              {/* Admin-only protected routes */}
              <Route path="/admin/users" element={
                <ProtectedRoute>
                  <RoleProtectedRoute requiredRole="ADMIN">
                    <AdminUsersPage />
                  </RoleProtectedRoute>
                </ProtectedRoute>
              } />

              {/* Error pages */}
              <Route path="/unauthorized" element={<UnauthorizedPage />} />

              {/* Default redirect (e.g. / -> /dashboard) */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
  );
}

export default App;
