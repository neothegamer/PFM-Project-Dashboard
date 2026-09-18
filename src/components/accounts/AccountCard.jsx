import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import {
  IconCreditCard,
  IconBuilding,
  IconRefresh,
  IconCheck
} from '../common/Icons';

export const AccountCard = ({ account }) => {
  const { formatCurrency } = useFinance();
  const isCredit = account.type === 'Credit Card';

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-brand-border shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between relative overflow-hidden group">
      {/* Subtle top accent border */}
      <div
        className="absolute top-0 left-0 right-0 h-1.5"
        style={{ backgroundColor: account.color || '#2563EB' }}
      />

      <div>
        {/* Top header: Institution & Type badge */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-xs"
              style={{ backgroundColor: account.color || '#2563EB' }}
            >
              {account.institution?.substring(0, 2).toUpperCase() || 'BK'}
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-brand-text leading-tight">
                {account.name}
              </h4>
              <p className="text-xs text-brand-muted">{account.institution}</p>
            </div>
          </div>

          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
            {account.type}
          </span>
        </div>

        {/* Account Number & Card Visual */}
        <div className="flex items-center justify-between text-xs text-brand-muted font-mono mb-4 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
          <span>Account</span>
          <span className="font-semibold text-brand-text tracking-widest">{account.accountNumber}</span>
        </div>

        {/* Balance Display */}
        <div className="mb-2">
          <span className="text-[11px] font-semibold uppercase text-brand-muted tracking-wider block mb-1">
            {isCredit ? 'Current Outstanding' : 'Current Balance'}
          </span>
          <h3 className={`text-2xl font-bold font-mono tracking-tight ${
            isCredit ? 'text-brand-danger' : 'text-brand-text'
          }`}>
            {formatCurrency(account.balance)}
          </h3>
        </div>

        {/* Credit Limit / Available if credit card */}
        {isCredit && account.creditLimit && (
          <div className="text-xs text-brand-muted flex justify-between pt-1 border-t border-slate-100 mt-2">
            <span>Limit: {formatCurrency(account.creditLimit)}</span>
            <span className="text-brand-teal font-semibold">
              Avail: {formatCurrency(account.availableBalance)}
            </span>
          </div>
        )}
      </div>

      {/* Footer: Sync Status */}
      <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-brand-muted">
        <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
          <IconCheck className="w-3.5 h-3.5" />
          {account.status || 'Connected'}
        </span>
        <span className="flex items-center gap-1 text-[11px]">
          <IconRefresh className="w-3 h-3 text-slate-400" />
          {account.lastSync || 'Recently'}
        </span>
      </div>
    </div>
  );
};

export default AccountCard;
