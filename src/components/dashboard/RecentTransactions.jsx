import React from 'react';
import { useFinance } from '../../context/FinanceContext.jsx';
import Badge from '../common/Badge.jsx';

const CATEGORY_ICONS = {
  Food: '🍽️', Transport: '🚗', Shopping: '🛍️',
  Bills: '⚡', Entertainment: '🎬', Healthcare: '💊',
  Salary: '💰', Freelance: '💻', Investment: '📈', Other: '📦',
};

const RecentTransactions = ({ transactions }) => {
  const { formatCurrency, setCurrentPage } = useFinance();

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const today = new Date();
    const diff = Math.floor((today - d) / 86400000);
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    if (diff < 7) return `${diff} days ago`;
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="card p-5 animate-slide-up" style={{ animationDelay: '0.4s' }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-text-main">Recent Transactions</h3>
          <p className="text-xs text-text-muted mt-0.5">Your latest activity</p>
        </div>
        <button
          onClick={() => setCurrentPage('transactions')}
          className="text-xs text-brand-purple hover:text-brand-purple-hover font-medium transition-colors"
        >
          View all →
        </button>
      </div>

      <div className="space-y-1">
        {transactions.slice(0, 6).map((tx) => (
          <div
            key={tx.id}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-navy-elevated transition-all duration-150"
          >
            {/* Icon */}
            <div className="w-10 h-10 rounded-xl bg-navy-deep flex items-center justify-center text-lg flex-shrink-0">
              {CATEGORY_ICONS[tx.category] || '💳'}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-main truncate">{tx.description}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge variant={tx.type === 'income' ? 'income' : 'default'} size="xs">
                  {tx.category}
                </Badge>
                <span className="text-xs text-text-muted">{formatDate(tx.date)}</span>
              </div>
            </div>

            {/* Amount */}
            <div className="text-right flex-shrink-0">
              <p className={`text-sm font-bold ${tx.type === 'income' ? 'text-income' : 'text-expense'}`}>
                {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
              </p>
              <p className="text-xs text-text-muted">{tx.account.split(' ')[0]}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentTransactions;
