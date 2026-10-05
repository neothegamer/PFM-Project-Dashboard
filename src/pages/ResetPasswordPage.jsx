import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext.jsx';
import { Icon } from '../components/common/Icons.jsx';
import api from '../services/api.js';

// The reset link in the email looks like:
//   https://finflow-pfm.vercel.app/#reset-password?token=XXXX
// so the token lives in the hash query string.
function getTokenFromHash() {
  const qs = window.location.hash.split('?')[1] || '';
  return new URLSearchParams(qs).get('token') || '';
}

const ResetPasswordPage = () => {
  const { setCurrentPage } = useFinance();
  const [token] = useState(getTokenFromHash);
  const [form, setForm] = useState({ password: '', confirm: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await api.auth.resetPassword({ token, password: form.password });
      setDone(true);
    } catch (err) {
      setError(err.message || 'Reset failed. Please request a new link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-deep flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-purple/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-mint/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-brand-purple/10 border border-brand-purple/30 flex items-center justify-center mx-auto mb-4">
            <Icon name="lock" size={22} className="text-brand-purple" />
          </div>
          <h1 className="text-2xl font-bold text-text-main">Choose a new password</h1>
          <p className="text-text-secondary mt-1 text-sm">
            Make it strong — at least 8 characters
          </p>
        </div>

        <div className="card p-6 sm:p-8">
          {done ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 rounded-full bg-income/10 border border-income/30 flex items-center justify-center mx-auto mb-4">
                <Icon name="check" size={22} className="text-income" />
              </div>
              <h2 className="text-lg font-semibold text-text-main">Password updated</h2>
              <p className="text-sm text-text-secondary mt-2">
                You can now sign in with your new password.
              </p>
              <button
                onClick={() => setCurrentPage('login')}
                className="btn-primary w-full py-3 text-sm mt-6"
              >
                Sign In
              </button>
            </div>
          ) : !token ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 rounded-full bg-danger/10 border border-danger/30 flex items-center justify-center mx-auto mb-4">
                <Icon name="alertCircle" size={22} className="text-danger" />
              </div>
              <h2 className="text-lg font-semibold text-text-main">Invalid reset link</h2>
              <p className="text-sm text-text-secondary mt-2">
                This link is missing its token or is malformed. Please request a new one.
              </p>
              <button
                onClick={() => setCurrentPage('forgot-password')}
                className="btn-primary w-full py-3 text-sm mt-6"
              >
                Request New Link
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              {error && (
                <div className="mb-4 p-3 bg-danger/10 border border-danger/30 rounded-lg text-danger text-sm flex items-center gap-2">
                  <Icon name="alertTriangle" size={16} />
                  {error}
                </div>
              )}

              <div className="mb-4">
                <label htmlFor="password" className="label">
                  New password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={form.password}
                    onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                    className={`input-field pr-11 ${error ? 'border-danger focus:ring-danger/40' : ''}`}
                    placeholder="Enter a new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    <Icon name={showPassword ? 'eyeOff' : 'eye'} size={18} />
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="confirm" className="label">
                  Confirm new password
                </label>
                <input
                  id="confirm"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={form.confirm}
                  onChange={(e) => setForm((f) => ({ ...f, confirm: e.target.value }))}
                  className="input-field"
                  placeholder="Repeat the new password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 text-sm"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Updating...
                  </span>
                ) : (
                  'Update Password'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
