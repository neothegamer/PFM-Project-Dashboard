import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import {
  IconGrid,
  IconCreditCard,
  IconList,
  IconTarget,
  IconBarChart,
  IconSettings,
  IconLogOut,
  IconX,
  IconWallet
} from '../common/Icons';

export const MobileNav = ({ isOpen, onClose }) => {
  const { currentPage, setCurrentPage, logoutUser, user } = useFinance();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: IconGrid },
    { id: 'accounts', label: 'Accounts', icon: IconCreditCard },
    { id: 'transactions', label: 'Transactions', icon: IconList },
    { id: 'budget', label: 'Budget', icon: IconTarget },
    { id: 'analytics', label: 'Analytics', icon: IconBarChart },
    { id: 'settings', label: 'Settings', icon: IconSettings },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl flex flex-col justify-between z-10 animate-slideRight">
        <div>
          {/* Header */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-brand-border">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-brand-blue flex items-center justify-center text-white">
                <IconWallet className="w-4 h-4" />
              </div>
              <span className="font-bold text-base text-brand-text">FinFlow</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <IconX className="w-5 h-5" />
            </button>
          </div>

          {/* Nav */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentPage(item.id);
                    onClose();
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-brand-blue text-white shadow-sm'
                      : 'text-brand-muted hover:text-brand-text hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User info & Logout */}
        <div className="p-4 border-t border-brand-border bg-slate-50/50 space-y-3">
          <div className="text-xs">
            <p className="font-semibold text-brand-text">{user?.name}</p>
            <p className="text-brand-muted text-[11px]">{user?.email}</p>
          </div>
          <button
            onClick={() => {
              logoutUser();
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-brand-danger bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
          >
            <IconLogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileNav;
