import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import ProgressBar from '../common/ProgressBar';
import AlertBanner from '../common/AlertBanner';
import { IconTarget, IconTrendingUp, IconAlertTriangle } from '../common/Icons';

export const BudgetSummaryHeader = () => {
  const { budgets, formatCurrency } = useFinance();

  const totalLimit = budgets.reduce((acc, b) => acc + b.limit, 0);
  const totalSpent = budgets.reduce((acc, b) => acc + b.spent, 0);
  const remaining = totalLimit - totalSpent;
  const percentage = totalLimit > 0 ? Math.round((totalSpent / totalLimit) * 100) : 0;

  // Find any budgets that exceeded limit or near limit
  const exceededBudgets = budgets.filter((b) => b.spent >= b.limit);
  const nearLimitBudgets = budgets.filter((b) => b.spent >= b.limit * 0.8 && b.spent < b.limit);

  return (
    <div className="space-y-4 mb-6">
      {/* Alert banner if any budget exceeded */}
      {exceededBudgets.length > 0 && (
        <AlertBanner
          type="danger"
          title={`Budget Alert: ${exceededBudgets.length} Category Exceeded`}
          message={`You have exceeded your monthly spending limit for: ${exceededBudgets
            .map((b) => `${b.category} (${formatCurrency(b.spent)} / ${formatCurrency(b.limit)})`)
            .join(', ')}. Review and reallocate spending to stay on track.`}
        />
      )}

      {/* Near limit warning if applicable and not exceeded */}
      {exceededBudgets.length === 0 && nearLimitBudgets.length > 0 && (
        <AlertBanner
          type="warning"
          title={`Budget Notice: ${nearLimitBudgets.length} Category Approaching Limit`}
          message={`You are close to the limit on: ${nearLimitBudgets
            .map((b) => b.category)
            .join(', ')}. Consider moderating discretionary expenses for the rest of this month.`}
        />
      )}

      {/* Main Summary Metric Card */}
      <div className="bg-white rounded-2xl p-6 border border-brand-border shadow-card">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left stats column */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-1">
            {/* Total Budget */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] font-semibold text-brand-muted uppercase tracking-wider block mb-1">
                Total Budget
              </span>
              <p className="text-xl sm:text-2xl font-bold font-mono text-brand-text">
                {formatCurrency(totalLimit)}
              </p>
            </div>

            {/* Total Spent */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] font-semibold text-brand-muted uppercase tracking-wider block mb-1">
                Total Spent
              </span>
              <p className="text-xl sm:text-2xl font-bold font-mono text-brand-danger">
                {formatCurrency(totalSpent)}
              </p>
            </div>

            {/* Remaining Amount */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] font-semibold text-brand-muted uppercase tracking-wider block mb-1">
                Remaining
              </span>
              <p className={`text-xl sm:text-2xl font-bold font-mono ${
                remaining >= 0 ? 'text-brand-success' : 'text-brand-danger'
              }`}>
                {formatCurrency(remaining)}
              </p>
            </div>

            {/* Budget Utilization */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] font-semibold text-brand-muted uppercase tracking-wider block mb-1">
                Utilization
              </span>
              <p className="text-xl sm:text-2xl font-bold font-mono text-brand-blue">
                {percentage}%
              </p>
            </div>
          </div>

          {/* Right Progress gauge */}
          <div className="lg:w-72 bg-slate-50/70 p-4 rounded-xl border border-slate-100 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-brand-text">Monthly Limit Status</span>
              <span className={percentage >= 100 ? 'text-brand-danger' : percentage >= 80 ? 'text-brand-warning' : 'text-brand-teal'}>
                {percentage >= 100 ? 'Cap Exceeded' : percentage >= 80 ? 'Near Limit' : 'Healthy Pace'}
              </span>
            </div>
            <ProgressBar
              current={totalSpent}
              max={totalLimit}
              percentage={percentage}
              showLabel={false}
              height="h-3"
            />
            <p className="text-[11px] text-brand-muted text-right">
              {remaining >= 0 ? `${formatCurrency(remaining)} remaining this month` : `${formatCurrency(Math.abs(remaining))} over allocated limit`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetSummaryHeader;
