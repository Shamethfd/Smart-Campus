/**
 * LoginPage.jsx
 * The Google Sign-In landing page.
 * 
 * Uses @react-oauth/google's GoogleLogin button.
 * On success: sends credential to backend, stores JWT, redirects to dashboard.
 * 
 * Member 4 - Auth UI
 */

import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function LoginPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // If already logged in, redirect immediately
  const from = location.state?.from?.pathname || '/dashboard';
  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true });
  }, [isAuthenticated, navigate, from]);

  const handleGoogleLogin = () => {
    // Exact redirect routing to Spring Boot
    window.location.href = "http://localhost:8081/oauth2/authorization/google";
  };

  return (
    <div className="login-page">
      {/* Background decorative blobs */}
      <div className="login-page__blob login-page__blob--1" />
      <div className="login-page__blob login-page__blob--2" />

      <div className="login-card">
        {/* Logo */}
        <div className="login-card__logo">
          <span className="login-card__logo-icon">🏛️</span>
        </div>

        {/* Heading */}
        <h1 className="login-card__title">Smart Campus</h1>
        <p className="login-card__subtitle">Operations Hub</p>
        <p className="login-card__desc">
          Sign in with your university Google account to access the campus management system.
        </p>

        {/* Divider */}
        <div className="login-card__divider">
          <span>Continue with</span>
        </div>

        {/* Google Login Button */}
        <div className="login-card__google-btn">
          <button 
            type="button" 
            className="google-button" 
            onClick={handleGoogleLogin}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              padding: '12px 16px',
              backgroundColor: '#4285F4',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}
          >
            Sign in with Google
          </button>
        </div>

        {/* Footer note */}
        <p className="login-card__note">
          🔒 Secured with OAuth 2.0 · IT3030 PAF Assignment 2026
        </p>
      </div>
    </div>
  );
}
