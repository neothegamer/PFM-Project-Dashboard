import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { IconCheck } from '../common/Icons';

export const PreferencesSection = () => {
  const { user, setUser } = useFinance();

  const [prefs, setPrefs] = useState({
    budgetAlerts: user?.preferences?.budgetAlerts ?? true,
    weeklyReport: user?.preferences?.weeklyReport ?? true,
    largeTransactionAlerts: user?.preferences?.largeTransactionAlerts ?? true,
    emailNotifications: user?.preferences?.emailNotifications ?? true,
  });

  const [saved, setSaved] = useState(false);

  const toggle = (key) => {
    setPrefs((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      setUser((u) => ({
        ...u,
        preferences: updated,
      }));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      return updated;
    });
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-brand-border shadow-card">
      <div className="flex items-center justify-between pb-5 border-b border-slate-100 mb-6">
        <div>
          <h3 className="text-base font-bold text-brand-text">Notification & App Preferences</h3>
          <p className="text-xs text-brand-muted">Customize how and when you receive financial alerts</p>
        </div>
        {saved && (
          <span className="inline-flex items-center gap-1 text-xs text-brand-success font-semibold bg-green-50 px-3 py-1 rounded-full animate-fadeIn">
            <IconCheck className="w-3.5 h-3.5" />
            Preferences updated
          </span>
        )}
      </div>

      <div className="space-y-4">
        {/* Toggle 1: Budget Alerts */}
        <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
          <div>
            <h4 className="text-sm font-semibold text-brand-text">Budget Limit Alerts</h4>
            <p className="text-xs text-brand-muted">
              Notify me when spending in any category reaches 80% or exceeds 100%
            </p>
          </div>
          <button
            type="button"
            onClick={() => toggle('budgetAlerts')}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
              prefs.budgetAlerts ? 'bg-brand-blue' : 'bg-slate-300'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                prefs.budgetAlerts ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Toggle 2: Weekly Report */}
        <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
          <div>
            <h4 className="text-sm font-semibold text-brand-text">Weekly Financial Digest</h4>
            <p className="text-xs text-brand-muted">
              Receive a weekly summary email with cash flow analytics every Sunday
            </p>
          </div>
          <button
            type="button"
            onClick={() => toggle('weeklyReport')}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
              prefs.weeklyReport ? 'bg-brand-blue' : 'bg-slate-300'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                prefs.weeklyReport ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Toggle 3: Large Transactions */}
        <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
          <div>
            <h4 className="text-sm font-semibold text-brand-text">Large Transaction Warnings</h4>
            <p className="text-xs text-brand-muted">
              Alert immediately on any single transaction exceeding ₹10,000
            </p>
          </div>
          <button
            type="button"
            onClick={() => toggle('largeTransactionAlerts')}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
              prefs.largeTransactionAlerts ? 'bg-brand-blue' : 'bg-slate-300'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                prefs.largeTransactionAlerts ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreferencesSection;
