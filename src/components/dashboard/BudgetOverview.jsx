import React from 'react';
import ProgressBar from '../common/ProgressBar.jsx';
import Badge from '../common/Badge.jsx';
import { useFinance } from '../../context/FinanceContext.jsx';

const BudgetOverview = ({ budgets }) => {
  const { formatCurrency, setCurrentPage } = useFinance();

  const getStatus = (pct) => {
    if (pct >= 100) return { label: 'Over Budget', variant: 'over' };
    if (pct >= 80) return { label: 'Approaching', variant: 'approaching' };
    return { label: 'Healthy', variant: 'healthy' };
  };

  return (
    <div className="card p-5 animate-slide-up" style={{ animationDelay: '0.35s' }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-text-main">Budget Overview</h3>
          <p className="text-xs text-text-muted mt-0.5">Monthly spending limits</p>
        </div>
        <button
          onClick={() => setCurrentPage('budget')}
          className="text-xs text-brand-purple hover:text-brand-purple-hover font-medium transition-colors"
        >
          Manage →
        </button>
      </div>

      <div className="space-y-4">
        {budgets.slice(0, 4).map((b) => {
          const pct = Math.round((b.spent / b.limit) * 100);
          const remaining = b.limit - b.spent;
          const status = getStatus(pct);

          return (
            <div key={b.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: b.color }} />
                  <span className="text-sm font-medium text-text-main">{b.category}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={status.variant} size="xs">{status.label}</Badge>
                  <span className={`text-xs font-semibold ${pct >= 100 ? 'text-danger' : pct >= 80 ? 'text-warning' : 'text-text-secondary'}`}>
                    {pct}%
                  </span>
                </div>
              </div>
              <ProgressBar value={b.spent} max={b.limit} color="auto" />
              <div className="flex justify-between text-xs text-text-muted">
                <span>Spent: {formatCurrency(b.spent)}</span>
                <span>{remaining < 0 ? <span className="text-danger">Over by {formatCurrency(Math.abs(remaining))}</span> : `Left: ${formatCurrency(remaining)}`}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BudgetOverview;
