import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext.jsx';
import { Icon } from '../components/common/Icons.jsx';
import api from '../services/api.js';

const ForgotPasswordPage = () => {
  const { setCurrentPage } = useFinance();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      // Always show success afterwards — don't leak which emails exist.
      await api.auth.forgotPassword(email.trim().toLowerCase());
      setSent(true);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
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
          <button
            onClick={() => setCurrentPage('landing')}
            className="inline-flex items-center gap-2 mb-6"
          >
            <div className="w-9 h-9 rounded-xl bg-brand-purple flex items-center justify-center">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <span className="text-xl font-bold text-text-main">
              PFM <span className="text-brand-purple">Dashboard</span>
            </span>
          </button>
          <h1 className="text-2xl font-bold text-text-main">Reset your password</h1>
          <p className="text-text-secondary mt-1 text-sm">
            We'll email you a secure reset link
          </p>
        </div>

        <div className="card p-6 sm:p-8">
          {sent ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 rounded-full bg-income/10 border border-income/30 flex items-center justify-center mx-auto mb-4">
                <Icon name="check" size={22} className="text-income" />
              </div>
              <h2 className="text-lg font-semibold text-text-main">Check your email</h2>
              <p className="text-sm text-text-secondary mt-2">
                If an account exists for <span className="text-text-main">{email}</span>,
                a password reset link is on its way. It expires in 1 hour.
              </p>
              <button
                onClick={() => setCurrentPage('login')}
                className="btn-primary w-full py-3 text-sm mt-6"
              >
                Back to Sign In
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

              <div className="mb-6">
                <label htmlFor="email" className="label">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`input-field ${error ? 'border-danger focus:ring-danger/40' : ''}`}
                  placeholder="you@example.com"
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
                    Sending...
                  </span>
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </form>
          )}
        </div>

        {!sent && (
          <p className="text-center mt-5 text-sm text-text-secondary">
            Remembered it?{' '}
            <button
              onClick={() => setCurrentPage('login')}
              className="text-brand-purple hover:text-brand-purple-hover font-semibold transition-colors"
            >
              Back to Sign In
            </button>
          </p>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
