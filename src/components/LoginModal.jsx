import React, { useState } from 'react';
import { Mail, Lock, Key, ArrowLeft, AlertCircle, CheckCircle, Car } from 'lucide-react';
import { signInUser, signUpUser, checkEmailExists } from '../utils/supabaseClient';

export default function LoginModal({ onLoginSuccess }) {
  const [mode, setMode] = useState('login'); // 'login', 'signup', or 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const { data, error: authError } = await signInUser(email, password);
      if (authError) {
        setError(authError.message);
      } else {
        // Success
        if (onLoginSuccess) {
          onLoginSuccess(data.session);
        }
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred during sign in.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      // Check if email already exists
      const exists = await checkEmailExists(email);
      if (exists) {
        setError('An account with this email already exists.');
        setLoading(false);
        return;
      }

      // Call database signup which uses bcrypt (irreversible hashing)
      const { data, error: authError } = await signUpUser(email, password);
      if (authError) {
        setError(authError.message);
      } else {
        setSuccess('Registration successful! Please check your email for confirmation or sign in.');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred during sign up.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      // 1. Check if email/gmail exists or not
      const exists = await checkEmailExists(email);
      if (!exists) {
        setError("Gmail doesn't exist");
        setLoading(false);
        return;
      }

      // 2. If exists, show success message (without sending the actual email)
      setSuccess("Email exists! (Reset email sending skipped as requested)");
      setEmail('');
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setError(null);
    setSuccess(null);
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="login-overlay">
      <div className="login-card">
        <div className="text-center">
          <div className="login-logo">
            <Car size={36} className="text-white" />
          </div>
          <h2 className="text-2xl text-gradient mb-2" style={{ fontWeight: 700 }}>
            {mode === 'login' ? 'RideMint' : mode === 'signup' ? 'Create Account' : 'Reset Password'}
          </h2>
          <p className="text-muted mb-6">
            {mode === 'login' 
              ? 'Income & Expense Tracker for Drivers' 
              : mode === 'signup'
                ? 'Sign up to track your earnings & expenses'
                : 'Enter your email to verify and reset password'}
          </p>
        </div>

        {error && (
          <div className="login-alert login-alert-danger">
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="login-alert login-alert-success">
            <CheckCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>{success}</span>
          </div>
        )}

        {mode === 'login' ? (
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="form-group mb-0">
              <label className="form-label">Email Address</label>
              <div className="login-input-group">
                <input
                  type="email"
                  className="login-input"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
                <Mail size={18} className="login-input-icon" />
              </div>
            </div>

            <div className="form-group mb-2">
              <div className="flex justify-between items-center">
                <label className="form-label">Password</label>
                <button
                  type="button"
                  onClick={() => switchMode('forgot')}
                  className="login-link"
                  style={{ background: 'none', border: 'none', padding: 0 }}
                  disabled={loading}
                >
                  Forgot Password?
                </button>
              </div>
              <div className="login-input-group">
                <input
                  type="password"
                  className="login-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />
                <Lock size={18} className="login-input-icon" />
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full mt-2" disabled={loading}>
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Signing In...</span>
                </>
              ) : (
                'Sign In'
              )}
            </button>

            <div className="text-center mt-2" style={{ marginTop: '0.5rem' }}>
              <span className="text-muted text-sm">Don't have an account? </span>
              <button
                type="button"
                onClick={() => switchMode('signup')}
                className="login-link text-sm"
                style={{ background: 'none', border: 'none', padding: 0 }}
                disabled={loading}
              >
                Sign Up
              </button>
            </div>
          </form>
        ) : mode === 'signup' ? (
          <form onSubmit={handleSignUp} className="flex flex-col gap-4">
            <div className="form-group mb-0">
              <label className="form-label">Gmail / Email Address</label>
              <div className="login-input-group">
                <input
                  type="email"
                  className="login-input"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
                <Mail size={18} className="login-input-icon" />
              </div>
            </div>

            <div className="form-group mb-0">
              <label className="form-label">Password</label>
              <div className="login-input-group">
                <input
                  type="password"
                  className="login-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />
                <Lock size={18} className="login-input-icon" />
              </div>
            </div>

            <div className="form-group mb-2">
              <label className="form-label">Confirm Password</label>
              <div className="login-input-group">
                <input
                  type="password"
                  className="login-input"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  required
                />
                <Lock size={18} className="login-input-icon" />
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full mt-2" disabled={loading}>
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Creating Account...</span>
                </>
              ) : (
                'Sign Up'
              )}
            </button>

            <button
              type="button"
              onClick={() => switchMode('login')}
              className="btn btn-outline w-full flex items-center justify-center gap-2"
              disabled={loading}
            >
              <ArrowLeft size={16} />
              <span>Back to Login</span>
            </button>
          </form>
        ) : (
          <form onSubmit={handleForgotPassword} className="flex flex-col gap-4">
            <div className="form-group mb-2">
              <label className="form-label">Gmail / Email Address</label>
              <div className="login-input-group">
                <input
                  type="email"
                  className="login-input"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
                <Mail size={18} className="login-input-icon" />
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full mt-2" disabled={loading}>
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Verifying...</span>
                </>
              ) : (
                'Reset Password'
              )}
            </button>

            <button
              type="button"
              onClick={() => switchMode('login')}
              className="btn btn-outline w-full flex items-center justify-center gap-2"
              disabled={loading}
            >
              <ArrowLeft size={16} />
              <span>Back to Login</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
