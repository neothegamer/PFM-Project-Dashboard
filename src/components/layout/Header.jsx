import React, { useState, useRef, useEffect } from 'react';
import { useFinance } from '../../context/FinanceContext.jsx';
import { Icon } from '../common/Icons.jsx';

const PAGE_TITLES = {
  dashboard: 'Dashboard',
  transactions: 'Transactions',
  accounts: 'Accounts',
  budget: 'Budget',
  analytics: 'Analytics',
  settings: 'Settings',
};

const NOTIFICATIONS = [
  { id: 1, text: 'Entertainment budget 109% used — over limit!', type: 'danger', time: '2 min ago' },
  { id: 2, text: 'Salary of ₹1,45,000 credited to HDFC account', type: 'income', time: '2 hrs ago' },
  { id: 3, text: 'Food budget at 84% — approaching limit', type: 'warning', time: '1 day ago' },
];

const Topbar = ({ onMenuClick }) => {
  const { currentPage, user } = useFinance();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const { setCurrentPage, logoutUser } = useFinance();
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <header className="h-16 flex items-center justify-between px-4 sm:px-6 bg-navy-secondary border-b border-border flex-shrink-0">
      {/* Left: Menu + Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="p-2 text-text-muted hover:text-text-main hover:bg-navy-elevated rounded-lg transition-all duration-200 lg:hidden"
          aria-label="Open menu"
        >
          <Icon name="menu" size={20} />
        </button>
        <h1 className="text-lg font-semibold text-text-main">
          {PAGE_TITLES[currentPage] || 'Dashboard'}
        </h1>
      </div>

      {/* Right: Search + Notifications + Profile */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="hidden sm:flex items-center gap-2 bg-navy-card border border-border rounded-lg px-3 py-2 w-48 lg:w-64">
          <Icon name="search" size={16} className="text-text-muted" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent text-sm text-text-main placeholder-text-muted outline-none w-full"
            aria-label="Search"
          />
        </div>

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
            className="relative p-2 text-text-muted hover:text-text-main hover:bg-navy-elevated rounded-lg transition-all duration-200"
            aria-label={`Notifications (${NOTIFICATIONS.length} unread)`}
          >
            <Icon name="bell" size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-12 w-80 bg-navy-secondary border border-border rounded-xl shadow-2xl z-50 animate-scale-in overflow-hidden">
              <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <span className="text-sm font-semibold text-text-main">Notifications</span>
                <span className="text-xs text-brand-purple font-medium cursor-pointer hover:underline">Mark all read</span>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {NOTIFICATIONS.map(n => (
                  <div key={n.id} className="px-4 py-3 hover:bg-navy-elevated transition-colors border-b border-border/50 last:border-0">
                    <div className="flex gap-3">
                      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.type === 'danger' ? 'bg-danger' : n.type === 'income' ? 'bg-income' : 'bg-warning'}`} />
                      <div>
                        <p className="text-sm text-text-main leading-snug">{n.text}</p>
                        <p className="text-xs text-text-muted mt-1">{n.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
            className="flex items-center gap-2 p-1.5 hover:bg-navy-elevated rounded-lg transition-all duration-200"
            aria-label="Profile menu"
          >
            <div className="w-8 h-8 rounded-full bg-brand-purple/20 border border-brand-purple/40 flex items-center justify-center">
              <span className="text-xs font-bold text-brand-purple">{initials}</span>
            </div>
            <Icon name="chevronDown" size={14} className="text-text-muted hidden sm:block" />
          </button>

          {showProfile && (
            <div className="absolute right-0 top-12 w-52 bg-navy-secondary border border-border rounded-xl shadow-2xl z-50 animate-scale-in overflow-hidden">
              <div className="px-4 py-3 border-b border-border">
                <p className="text-sm font-semibold text-text-main">{user?.name}</p>
                <p className="text-xs text-text-muted truncate">{user?.email}</p>
              </div>
              <div className="py-1">
                <button
                  onClick={() => { setCurrentPage('settings'); setShowProfile(false); }}
                  className="w-full text-left px-4 py-2.5 text-sm text-text-secondary hover:text-text-main hover:bg-navy-elevated transition-colors"
                >
                  Settings
                </button>
                <button
                  onClick={() => { logoutUser(); setShowProfile(false); }}
                  className="w-full text-left px-4 py-2.5 text-sm text-danger hover:bg-danger/10 transition-colors"
                >
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
