import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext.jsx';
import { Icon } from '../components/common/Icons.jsx';

const getStrength = (pw) => {
  if (!pw) return { score: 0, label: '', color: '' };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const map = [
    { score: 0, label: '', color: '' },
    { score: 1, label: 'Weak', color: 'bg-danger' },
    { score: 2, label: 'Fair', color: 'bg-warning' },
    { score: 3, label: 'Good', color: 'bg-brand-cyan' },
    { score: 4, label: 'Strong', color: 'bg-success' },
  ];
  return map[score] || map[0];
};

const RegisterPage = () => {
  const { setCurrentPage, loginUser } = useFinance();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', terms: false });
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const strength = getStrength(form.password);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Full name is required.';
    if (!form.email) errs.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Please enter a valid email address.';
    if (!form.password) errs.password = 'Password is required.';
    else if (form.password.length < 8) errs.password = 'Password must be at least 8 characters.';
    if (!form.confirm) errs.confirm = 'Please confirm your password.';
    else if (form.password !== form.confirm) errs.confirm = 'Passwords do not match.';
    if (!form.terms) errs.terms = 'You must accept the terms to continue.';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    loginUser({ name: form.name, email: form.email, phone: '', currency: '₹' });
    setLoading(false);
  };

  const field = (id, label, type, placeholder, key, extraRight = null) => (
    <div className="mb-4">
      <label htmlFor={id} className="label">{label}</label>
      <div className="relative">
        <input
          id={id}
          type={type}
          value={form[key]}
          onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
          className={`input-field ${extraRight ? 'pr-11' : ''} ${errors[key] ? 'border-danger' : ''}`}
          placeholder={placeholder}
          aria-describedby={errors[key] ? `${id}-error` : undefined}
        />
        {extraRight}
      </div>
      {errors[key] && (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-danger flex items-center gap-1">
          <Icon name="alertTriangle" size={12} /> {errors[key]}
        </p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-navy-deep flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-brand-purple/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-income/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <button onClick={() => setCurrentPage('landing')} className="inline-flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-xl bg-brand-purple flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="1" x2="12" y2="23"/>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
            </div>
            <span className="text-xl font-bold text-text-main">PFM <span className="text-brand-purple">Dashboard</span></span>
          </button>
          <h1 className="text-2xl font-bold text-text-main">Create your account</h1>
          <p className="text-text-secondary mt-1 text-sm">Get started with your financial journey</p>
        </div>

        <div className="card p-6 sm:p-8">
          <form onSubmit={handleSubmit} noValidate>
            {field('name', 'Full Name', 'text', 'Sana Khan', 'name')}
            {field('email', 'Email Address', 'email', 'you@example.com', 'email')}

            {/* Password with strength */}
            <div className="mb-4">
              <label htmlFor="password" className="label">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  className={`input-field pr-11 ${errors.password ? 'border-danger' : ''}`}
                  placeholder="Min. 8 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main"
                  aria-label="Toggle password visibility"
                >
                  <Icon name={showPw ? 'eyeOff' : 'eye'} size={18} />
                </button>
              </div>
              {/* Strength indicator */}
              {form.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4].map(i => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength.score ? strength.color : 'bg-navy-elevated'}`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs font-medium ${strength.score >= 3 ? 'text-success' : strength.score === 2 ? 'text-warning' : 'text-danger'}`}>
                    {strength.label}
                  </p>
                </div>
              )}
              {errors.password && (
                <p className="mt-1 text-xs text-danger flex items-center gap-1">
                  <Icon name="alertTriangle" size={12} /> {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="mb-4">
              <label htmlFor="confirm" className="label">Confirm Password</label>
              <input
                id="confirm"
                type="password"
                value={form.confirm}
                onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))}
                className={`input-field ${errors.confirm ? 'border-danger' : form.confirm && form.confirm === form.password ? 'border-success/50' : ''}`}
                placeholder="Re-enter password"
              />
              {form.confirm && form.confirm === form.password && (
                <p className="mt-1 text-xs text-success flex items-center gap-1">
                  <Icon name="check" size={12} /> Passwords match
                </p>
              )}
              {errors.confirm && (
                <p className="mt-1 text-xs text-danger flex items-center gap-1">
                  <Icon name="alertTriangle" size={12} /> {errors.confirm}
                </p>
              )}
            </div>

            {/* Terms */}
            <div className="mb-6">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.terms}
                  onChange={e => setForm(f => ({ ...f, terms: e.target.checked }))}
                  className="mt-0.5 w-4 h-4 rounded border-border bg-navy-secondary accent-brand-purple"
                />
                <span className="text-sm text-text-secondary leading-snug">
                  I agree to the{' '}
                  <span className="text-brand-purple cursor-pointer hover:underline">Terms of Service</span>
                  {' '}and{' '}
                  <span className="text-brand-purple cursor-pointer hover:underline">Privacy Policy</span>
                </span>
              </label>
              {errors.terms && (
                <p className="mt-1 text-xs text-danger flex items-center gap-1">
                  <Icon name="alertTriangle" size={12} /> {errors.terms}
                </p>
              )}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-sm">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : 'Create Account'}
            </button>
          </form>
        </div>

        <p className="text-center mt-5 text-sm text-text-secondary">
          Already have an account?{' '}
          <button
            onClick={() => setCurrentPage('login')}
            className="text-brand-purple hover:text-brand-purple-hover font-semibold transition-colors"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
