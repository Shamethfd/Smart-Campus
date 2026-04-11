/**
 * RoleProtectedRoute.jsx
 * Redirects users who lack the required role to an "Unauthorized" page.
 * 
 * Usage: Wrap admin-only routes:
 *   <Route path="/admin/users" element={
 *     <ProtectedRoute>
 *       <RoleProtectedRoute requiredRole="ADMIN">
 *         <AdminUsersPage />
 *       </RoleProtectedRoute>
 *     </ProtectedRoute>
 *   } />
 * 
 * Member 4 - Role-Based Route Protection
 */

import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function normalizeRole(role) {
  if (role == null) return '';
  return String(role).replace(/^ROLE_/i, '').toUpperCase();
}

/** Dev/demo: AdminLoginButton sets localStorage role to "admin" without changing JWT claims. */
function hasLocalDemoAdmin() {
  try {
    return localStorage.getItem('role') === 'admin';
  } catch {
    return false;
  }
}

export default function RoleProtectedRoute({ children, requiredRole }) {
  const { user } = useAuth();
  const need = normalizeRole(requiredRole);
  const actual = normalizeRole(user?.role);

  if (need === 'ADMIN') {
    const allowed = actual === 'ADMIN' || hasLocalDemoAdmin();
    if (!allowed) {
      return <Navigate to="/unauthorized" replace />;
    }
    return children;
  }

  if (actual !== need) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
