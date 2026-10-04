import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext.jsx';
import { Icon } from '../common/Icons.jsx';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { id: 'transactions', label: 'Transactions', icon: 'transactions' },
  { id: 'accounts', label: 'Accounts', icon: 'accounts' },
  { id: 'budget', label: 'Budget', icon: 'budget' },
  { id: 'analytics', label: 'Analytics', icon: 'analytics' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
];

const Sidebar = ({ collapsed = false, onClose = null }) => {
  const { currentPage, setCurrentPage, user, logoutUser } = useFinance();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  const navigate = (page) => {
    setCurrentPage(page);
    if (onClose) onClose();
  };

  const handleLogout = () => {
    logoutUser();
    if (onClose) onClose();
  };

  return (
    <aside className="flex flex-col h-full bg-navy-secondary border-r border-border">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-border">
        <div className="w-8 h-8 rounded-lg bg-brand-purple flex items-center justify-center flex-shrink-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="1" x2="12" y2="23"/>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          </svg>
        </div>
        {!collapsed && (
          <div>
            <span className="text-base font-bold text-text-main">PFM</span>
            <span className="text-base font-bold text-brand-purple ml-0.5">Dashboard</span>
          </div>
        )}
        {onClose && (
          <button
            onClick={onClose}
            className="ml-auto p-1 text-text-muted hover:text-text-main rounded-lg transition-colors lg:hidden"
            aria-label="Close menu"
          >
            <Icon name="x" size={18} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1" aria-label="Main navigation">
        {NAV_ITEMS.map((item) => {
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              className={`w-full nav-item ${isActive ? 'nav-item-active' : ''}`}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon name={item.icon} size={18} />
              {!collapsed && <span>{item.label}</span>}
              {isActive && !collapsed && (
                <span className="ml-auto w-1.5 h-1.5 bg-brand-purple rounded-full" />
              )}
            </button>
          );
        })}
      </nav>

      {/* User Profile & Logout */}
      <div className="border-t border-border px-3 py-4 space-y-1">
        <button
          onClick={() => navigate('settings')}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-navy-elevated transition-all duration-200"
        >
          <div className="w-8 h-8 rounded-full bg-brand-purple/20 border border-brand-purple/30 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-brand-purple">{initials}</span>
          </div>
          {!collapsed && (
            <div className="flex-1 text-left min-w-0">
              <p className="text-sm font-medium text-text-main truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-text-muted truncate">{user?.email || ''}</p>
            </div>
          )}
        </button>

        {showLogoutConfirm ? (
          <div className="px-3 py-2 bg-danger/10 border border-danger/20 rounded-lg">
            <p className="text-xs text-text-secondary mb-2">Sign out?</p>
            <div className="flex gap-2">
              <button
                onClick={handleLogout}
                className="flex-1 text-xs py-1 bg-danger/20 text-danger rounded hover:bg-danger/30 transition-colors"
              >
                Yes
              </button>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 text-xs py-1 bg-navy-elevated text-text-secondary rounded hover:bg-border transition-colors"
              >
                No
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full nav-item text-danger hover:text-danger hover:bg-danger/10"
          >
            <Icon name="logout" size={18} />
            {!collapsed && <span>Logout</span>}
          </button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
