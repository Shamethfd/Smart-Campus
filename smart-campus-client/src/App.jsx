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
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import RoleProtectedRoute from './components/RoleProtectedRoute';

import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import UserDashboard from './pages/UserDashboard';
import BookingRequest from './pages/BookingRequest';
import NotificationPage from './pages/NotificationPage';
import ResourceList from './pages/ResourceList';
import ResourceDetail from './pages/ResourceDetail';
import ResourceEntryRedirect from './pages/ResourceEntryRedirect';
import TicketPage from './pages/TicketPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminPanel from './pages/AdminPanel';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminNotificationsPage from './pages/AdminNotificationsPage';
import AdminTicketViewPage from './pages/AdminTicketViewPage';
import ResourceForm from './pages/ResourceForm';
import AdminEditResourcesPage from './pages/AdminEditResourcesPage';
import MyPreviousTicketsPage from './pages/MyPreviousTicketsPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import OAuth2RedirectHandler from './components/OAuth2RedirectHandler';

function MainLayout() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-dvh bg-slate-50 text-slate-900">
      {isAuthenticated && <Navbar />}
      <main className={isAuthenticated ? 'mx-auto w-full max-w-6xl px-4 pb-10 pt-24' : 'min-h-dvh'}>
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
            <Route
              path="/admin/tickets"
              element={<AdminRoute><AdminTicketViewPage /></AdminRoute>}
            />
            <Route
              path="/admin/resources"
              element={<AdminRoute><ResourceForm /></AdminRoute>}
            />
            <Route
              path="/admin/resources/manage"
              element={<AdminRoute><AdminEditResourcesPage /></AdminRoute>}
            />
            <Route
              path="/admin/edit-resources"
              element={<AdminRoute><AdminEditResourcesPage /></AdminRoute>}
            />
            <Route
              path="/resource/add"
              element={<AdminRoute><ResourceForm /></AdminRoute>}
            />
            <Route
              path="/resource/edit/:id"
              element={<AdminRoute><ResourceForm /></AdminRoute>}
            />
          </Route>

          <Route element={<MainLayout />}>
            <Route
              path="/dashboard"
              element={<ProtectedRoute><DashboardPage /></ProtectedRoute>}
            />
            <Route
              path="/my-bookings"
              element={<ProtectedRoute><UserDashboard /></ProtectedRoute>}
            />
            <Route
              path="/booking"
              element={<ProtectedRoute><BookingRequest /></ProtectedRoute>}
            />
            <Route
              path="/notifications"
              element={<ProtectedRoute><NotificationPage /></ProtectedRoute>}
            />
            <Route
              path="/resources"
              element={<ProtectedRoute><ResourceList /></ProtectedRoute>}
            />
            <Route
              path="/resource/:id"
              element={<ProtectedRoute><ResourceDetail /></ProtectedRoute>}
            />
            <Route
              path="/resource"
              element={<ProtectedRoute><ResourceEntryRedirect /></ProtectedRoute>}
            />
            <Route
              path="/tickets"
              element={<ProtectedRoute><TicketPage /></ProtectedRoute>}
            />
            <Route
              path="/my-previous-tickets"
              element={<ProtectedRoute><MyPreviousTicketsPage /></ProtectedRoute>}
            />

            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>

        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
