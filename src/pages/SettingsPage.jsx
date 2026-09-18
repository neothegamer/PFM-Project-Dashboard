import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext.jsx';
import { Icon } from '../components/common/Icons.jsx';

import ProfileSection from '../components/settings/ProfileSection.jsx';
import PreferencesSection from '../components/settings/PreferencesSection.jsx';
import SecuritySection from '../components/settings/SecuritySection.jsx';
import AccountDangerSection from '../components/settings/AccountDangerSection.jsx';

const SettingsPage = () => {
  const { user } = useFinance();

  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    {
      id: 'profile',
      label: 'Profile',
      icon: 'user',
      description: 'Personal information',
    },
    {
      id: 'preferences',
      label: 'Preferences',
      icon: 'settings',
      description: 'Alerts and notifications',
    },
    {
      id: 'security',
      label: 'Security',
      icon: 'shield',
      description: 'Password and security',
    },
    {
      id: 'account',
      label: 'Account',
      icon: 'info',
      description: 'Account management',
    },
  ];

  const getInitials = (name) => {
    if (!name) return 'U';

    return name
      .split(' ')
      .filter(Boolean)
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const renderActiveSection = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileSection />;

      case 'preferences':
        return <PreferencesSection />;

      case 'security':
        return <SecuritySection />;

      case 'account':
        return <AccountDangerSection />;

      default:
        return <ProfileSection />;
    }
  };

  return (
    <div className="space-y-6 max-w-6xl page-enter">

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg bg-brand-purple/10 text-brand-purple flex items-center justify-center">
            <Icon name="settings" size={17} />
          </div>

          <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Account Control
          </span>
        </div>

        <h2 className="text-2xl font-bold text-text-main">
          Settings
        </h2>

        <p className="text-sm text-text-secondary mt-1">
          Manage your profile, preferences, security, and account settings.
        </p>
      </div>

      {/* User Overview */}
      <div className="bg-navy-card rounded-2xl p-5 border border-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

          <div className="flex items-center gap-4">

            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-purple to-brand-cyan text-white font-bold text-lg flex items-center justify-center">
              {getInitials(user?.name)}
            </div>

            <div>
              <h3 className="text-base font-bold text-text-main">
                {user?.name || 'User'}
              </h3>

              <p className="text-xs text-text-secondary mt-0.5">
                {user?.email || 'No email address'}
              </p>

              <div className="flex items-center gap-2 mt-2">

                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success/10 text-success text-[11px] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-success" />
                  Account Active
                </span>

                <span className="text-[11px] text-text-secondary">
                  FinFlow
                </span>

              </div>
            </div>

          </div>

          <div className="text-left sm:text-right">
            <p className="text-[11px] uppercase tracking-wider font-semibold text-text-secondary">
              Account Role
            </p>

            <p className="text-sm font-semibold text-text-main mt-1">
              {user?.role || 'Personal User'}
            </p>
          </div>

        </div>
      </div>

      {/* Settings Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[230px_minmax(0,1fr)] gap-5">

        {/* Navigation */}
        <aside className="bg-navy-card rounded-2xl p-2.5 border border-border h-fit">

          <div className="px-3 pt-2 pb-3">
            <p className="text-[10px] uppercase tracking-wider font-bold text-text-secondary">
              Settings Menu
            </p>
          </div>

          <div className="space-y-1">

            {tabs.map((tab) => {
              const active = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all duration-200 ${
                    active
                      ? 'bg-brand-purple/10 text-brand-purple border border-brand-purple/20'
                      : 'text-text-secondary hover:text-text-main hover:bg-navy-secondary'
                  }`}
                >

                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      active
                        ? 'bg-brand-purple text-white'
                        : 'bg-navy-elevated text-text-secondary'
                    }`}
                  >
                    <Icon name={tab.icon} size={16} />
                  </div>

                  <div className="min-w-0">

                    <p
                      className={`text-sm font-semibold ${
                        active
                          ? 'text-brand-purple'
                          : 'text-text-main'
                      }`}
                    >
                      {tab.label}
                    </p>

                    <p className="text-[10px] text-text-secondary mt-0.5 truncate">
                      {tab.description}
                    </p>

                  </div>

                </button>
              );
            })}

          </div>

        </aside>

        {/* Active Section */}
        <main className="min-w-0">
          {renderActiveSection()}
        </main>

      </div>

      {/* Security Notice */}
      <div className="flex items-start gap-3 p-4 rounded-2xl bg-brand-cyan/10 border border-brand-cyan/20">

        <div className="w-8 h-8 rounded-lg bg-navy-card text-brand-cyan flex items-center justify-center flex-shrink-0">
          <Icon name="shield" size={16} />
        </div>

        <div>
          <p className="text-xs font-bold text-text-main">
            Your financial information is private
          </p>

          <p className="text-xs text-text-secondary mt-1 leading-relaxed">
            Keep your account credentials secure and review your notification
            preferences regularly. FinFlow settings are designed to give you
            control over your financial dashboard experience.
          </p>
        </div>

      </div>

    </div>
  );
};

export default SettingsPage;