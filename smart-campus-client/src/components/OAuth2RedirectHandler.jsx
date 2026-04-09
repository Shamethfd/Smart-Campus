import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { saveToken } from '../utils/tokenUtils';

/**
 * Handles the redirect from the Spring Boot backend after a successful OAuth2 login.
 * The backend redirects to /oauth2/redirect?token=xxx
 * This component extracts the token, saves it, and redirects to the dashboard.
 */
export default function OAuth2RedirectHandler() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');

    if (token) {
      saveToken(token);
      // Force reload so AuthContext picks up the new token
      window.location.href = '/dashboard';
    } else {
      console.error('No token found in OAuth2 redirect URL');
      navigate('/login?error=oauth2_failure', { replace: true });
    }
  }, [location, navigate]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
      <h2 style={{ color: '#4285F4' }}>Authenticating...</h2>
      <p>Securely logging you in.</p>
    </div>
  );
}
