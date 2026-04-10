/**
 * LoginPage.jsx
 * The Auth landing page.
 * 
 * Uses @react-oauth/google's GoogleLogin button.
 * On success: sends credential to backend, stores JWT, redirects to dashboard.
 * Also includes a hidden toggle for Admin (Email/Password) login.
 * 
 * Member 4 - Auth UI
 */

import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { credentialLogin } from '../services/authApi';
import { saveToken } from '../utils/tokenUtils';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button';
import Card, { CardBody } from '../components/ui/Card';

export default function LoginPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [showAdmin, setShowAdmin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect immediately
  const from = location.state?.from?.pathname || '/dashboard';
  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true });
  }, [isAuthenticated, navigate, from]);

  const handleGoogleLogin = () => {
    // Exact redirect routing to Spring Boot
    window.location.href = "http://localhost:8081/oauth2/authorization/google";
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !password) {
      toast.error('Email and password required');
      return;
    }
    setLoading(true);
    try {
      const res = await credentialLogin(trimmedEmail, password);
      if (res.success && res.data?.token) {
        saveToken(res.data.token);
        toast.success('Admin login successful!');
        window.location.href = '/admin/users';
      } else {
        toast.error(res.message || 'Login failed. Invalid credentials.');
      }
    } catch (err) {
      const data = err.response?.data;
      const apiMsg =
        data?.message ||
        (data?.fieldErrors &&
          Object.values(data.fieldErrors).filter(Boolean).join(' '));
      const hint =
        err.code === 'ERR_NETWORK' || err.message === 'Network Error'
          ? 'Cannot reach API. Is the backend running on port 8081?'
          : '';
      toast.error(apiMsg || hint || 'Login failed. Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-dvh overflow-hidden bg-slate-50">
      <div className="pointer-events-none absolute -right-24 -top-24 h-[420px] w-[420px] rounded-full bg-blue-300/40 blur-3xl" />
      <div className="pointer-events-none absolute -left-28 bottom-[-120px] h-[420px] w-[420px] rounded-full bg-fuchsia-300/40 blur-3xl" />

      <div className="mx-auto flex min-h-dvh w-full max-w-lg items-center px-4 py-10">
        <Card className="w-full overflow-hidden">
          <CardBody className="p-8">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-blue-600 text-2xl shadow-md">
              🏛️
            </div>

            <h1 className="mt-5 text-center text-2xl font-extrabold tracking-tight text-slate-900">
              Smart Campus
            </h1>
            <p className="mt-1 text-center text-sm font-semibold text-primary">
              Operations Hub
            </p>
            <p className="mt-4 text-center text-sm text-slate-600">
              Sign in with your university Google account to access the campus management system.
            </p>

            <div className="my-6 flex items-center gap-3 text-xs font-extrabold tracking-widest text-slate-400">
              <div className="h-px flex-1 bg-slate-200" />
              <span>CONTINUE WITH</span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <Button
              type="button"
              variant="secondary"
              size="lg"
              onClick={handleGoogleLogin}
              className="w-full bg-[#4285F4] hover:bg-[#3976da]"
            >
              <svg className="h-[18px] w-[18px] fill-current" viewBox="0 0 24 24">
                <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"></path>
              </svg>
              Sign in with Google
            </Button>

            <div className="mt-4 text-center">
              <button
                onClick={() => setShowAdmin(!showAdmin)}
                className="text-xs font-bold text-indigo-600 underline-offset-4 hover:underline"
              >
                {showAdmin ? 'Hide Admin Login' : 'System Administrator Login'}
              </button>
            </div>

            {showAdmin && (
              <form
                onSubmit={handleAdminLogin}
                className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left"
              >
                <p className="mb-3 text-sm font-extrabold text-slate-700">Admin Access</p>
                <div className="mb-3">
                  <label className="mb-1 block text-xs font-bold text-slate-500">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="mb-1 block text-xs font-bold text-slate-500">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    required
                  />
                </div>
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? 'Authenticating…' : 'Sign In as Admin'}
                </Button>
              </form>
            )}

            <p className="mt-6 text-center text-xs font-semibold text-slate-400">
              🔒 Secured with OAuth 2.0 & JWT · IT3030 PAF Assignment 2026
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}





