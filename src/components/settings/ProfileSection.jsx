import React, { useState, useEffect } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { IconCheck, IconAlertCircle, IconInfo } from '../common/Icons';

const ProfileSection = () => {
  // updateProfile → PUT /api/auth/me (name only — the backend has no email
  // change flow since email is the login identifier).
  // setCurrency drives formatCurrency across the whole dashboard.
  const { user, updateProfile, currency, setCurrency } = useFinance();

  const [name, setName] = useState(user?.name || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  // Session restore can populate `user` after this component mounts.
  useEffect(() => {
    if (user?.name) setName(user.name);
  }, [user?.name]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSaved(false);

    if (!name.trim()) {
      setError('Name is required.');
      return;
    }

    setSaving(true);
    try {
      await updateProfile({ name: name.trim() });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err.message || 'Could not save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    'w-full h-11 px-4 rounded-xl bg-navy-secondary border border-border text-text-main placeholder-text-muted text-sm outline-none transition-all duration-200 focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 disabled:opacity-60';

  return (
    <section className="bg-navy-card border border-border rounded-2xl shadow-sm overflow-hidden">

      {/* Header */}
      <div className="px-5 sm:px-6 py-5 border-b border-border">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand-purple/15 border border-brand-purple/25 flex items-center justify-center flex-shrink-0">
            <span className="text-lg font-bold text-brand-purple">
              {(name || user?.name || 'U').charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <h3 className="text-base font-bold text-text-main">
              Personal Profile
            </h3>
            <p className="text-xs text-text-secondary mt-1">
              Update your display name and regional preferences
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-5 sm:p-6">

        {/* Current account summary */}
        <div className="mb-6 p-4 rounded-xl bg-navy-secondary border border-border">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-text-main">
                {user?.name || '—'}
              </p>
              <p className="text-xs text-text-secondary mt-1">
                {user?.email || '—'}
              </p>
            </div>
            <span className="inline-flex items-center self-start sm:self-auto px-3 py-1.5 rounded-full bg-brand-purple/10 border border-brand-purple/20 text-xs font-semibold text-brand-purple">
              Personal Account
            </span>
          </div>
        </div>

        {/* Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Full name — editable, persists to backend */}
          <div>
            <label
              htmlFor="profile-name"
              className="block text-sm font-medium text-text-secondary mb-2"
            >
              Full Name <span className="text-danger">*</span>
            </label>
            <input
              id="profile-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={saving}
              className={inputClass}
              placeholder="Enter your full name"
            />
          </div>

          {/* Email — read-only (login identifier, no backend change flow) */}
          <div>
            <label
              htmlFor="profile-email"
              className="block text-sm font-medium text-text-secondary mb-2"
            >
              Email Address
            </label>
            <input
              id="profile-email"
              type="email"
              value={user?.email || ''}
              disabled
              className={`${inputClass} cursor-not-allowed`}
            />
            <p className="mt-1.5 text-[11px] text-text-secondary flex items-center gap-1">
              <IconInfo size={12} />
              Email is your login identifier and cannot be changed.
            </p>
          </div>

          {/* Preferred currency — drives formatCurrency everywhere */}
          <div>
            <label
              htmlFor="profile-currency"
              className="block text-sm font-medium text-text-secondary mb-2"
            >
              Preferred Currency
            </label>
            <select
              id="profile-currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className={`${inputClass} cursor-pointer`}
            >
              <option value="₹">₹ — Indian Rupee (INR)</option>
              <option value="$">$ — US Dollar (USD)</option>
              <option value="€">€ — Euro (EUR)</option>
              <option value="£">£ — British Pound (GBP)</option>
            </select>
            <p className="mt-1.5 text-[11px] text-text-secondary">
              Applies to all amounts across the dashboard.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 pt-5 border-t border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="min-h-[20px]">
            {error && (
              <div className="flex items-center gap-2 text-sm text-danger">
                <IconAlertCircle size={15} />
                <span>{error}</span>
              </div>
            )}
            {!error && saved && (
              <div className="flex items-center gap-2 text-sm text-success">
                <div className="w-6 h-6 rounded-full bg-success/10 flex items-center justify-center">
                  <IconCheck size={14} />
                </div>
                <span>Profile changes saved successfully.</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-brand-purple hover:bg-brand-purple-hover text-white text-sm font-semibold transition-all duration-200 hover:shadow-glow focus:outline-none focus:ring-2 focus:ring-brand-purple/40 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-none"
          >
            {saving ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving…
              </>
            ) : (
              <>
                {saved && <IconCheck size={16} />}
                {saved ? 'Changes Saved' : 'Save Profile Changes'}
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
};

export default ProfileSection;
