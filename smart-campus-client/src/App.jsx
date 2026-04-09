/**
 * App.jsx
 * Main application layout and router setup.
 *
 * Two layout shells:
 *   MainLayout    - sticky top Navbar + centred app-main
 *                   (regular user pages: /dashboard, /notifications)
 *   SidebarLayout - full-width, no Navbar
 *                   (admin pages that embed their own Sidebar)
 *
 * Route security:
 *   ProtectedRoute      - must be logged in
 *   RoleProtectedRoute  - must have ROLE_ADMIN
 */

import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import RoleProtectedRoute from './components/RoleProtectedRoute';

import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import NotificationPage from './pages/NotificationPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminPanel from './pages/AdminPanel';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminNotificationsPage from './pages/AdminNotificationsPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import OAuth2RedirectHandler from './components/OAuth2RedirectHandler';

function MainLayout() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="app-container">
      {isAuthenticated && <Navbar />}
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}

function SidebarLayout() {
  return <Outlet />;
}

function AdminRoute({ children }) {
  return (
    <ProtectedRoute>
      <RoleProtectedRoute requiredRole="ADMIN">{children}</RoleProtectedRoute>
    </ProtectedRoute>
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
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            },
          }}
        />

        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />

          <Route element={<SidebarLayout />}>
            <Route
              path="/admin/dashboard"
              element={<AdminRoute><AdminDashboard /></AdminRoute>}
            />
            <Route
              path="/admin/users"
              element={<AdminRoute><AdminUsersPage /></AdminRoute>}
            />
            <Route
              path="/admin/bookings"
              element={<AdminRoute><AdminPanel /></AdminRoute>}
            />
            <Route
              path="/admin/notifications"
              element={<AdminRoute><AdminNotificationsPage /></AdminRoute>}
            />
          </Route>

          <Route element={<MainLayout />}>
            <Route
              path="/dashboard"
              element={<ProtectedRoute><DashboardPage /></ProtectedRoute>}
            />
            <Route
              path="/notifications"
              element={<ProtectedRoute><NotificationPage /></ProtectedRoute>}
            />

            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
