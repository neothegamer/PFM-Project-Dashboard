import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import ProgressBar from '../common/ProgressBar';
import { IconCategory, IconEdit, IconTrash, IconAlertTriangle } from '../common/Icons';

export const BudgetCard = ({ budget, onEdit, onDelete }) => {
  const { formatCurrency } = useFinance();

  const percentage = budget.limit > 0 ? Math.round((budget.spent / budget.limit) * 100) : 0;
  const remaining = budget.limit - budget.spent;
  const isExceeded = percentage >= 100;
  const isNearLimit = percentage >= 80 && !isExceeded;

  return (
    <div className={`bg-white rounded-2xl p-5 sm:p-6 border transition-all duration-200 shadow-card hover:shadow-card-hover flex flex-col justify-between relative overflow-hidden ${
      isExceeded ? 'border-red-200 ring-1 ring-red-200' : isNearLimit ? 'border-amber-200' : 'border-brand-border'
    }`}>
      {/* Top Banner highlight if exceeded */}
      {isExceeded && (
        <div className="absolute top-0 left-0 right-0 bg-brand-danger text-white text-[10px] font-bold uppercase tracking-wider py-0.5 px-3 flex items-center justify-center gap-1">
          <IconAlertTriangle className="w-3 h-3" />
          Budget Limit Exceeded
        </div>
      )}

      <div className={isExceeded ? 'pt-3' : ''}>
        {/* Category & Action Buttons */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-xs ${
              isExceeded ? 'bg-red-50 text-brand-danger' : isNearLimit ? 'bg-amber-50 text-brand-warning' : 'bg-blue-50 text-brand-blue'
            }`}>
              <IconCategory category={budget.category} className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-brand-text leading-tight">
                {budget.category}
              </h4>
              <p className="text-xs text-brand-muted">
                {budget.notes || 'Monthly target category'}
              </p>
            </div>
          </div>

          {/* Edit / Delete icons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(budget)}
              className="p-1.5 text-slate-400 hover:text-brand-blue hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit Budget"
            >
              <IconEdit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(budget)}
              className="p-1.5 text-slate-400 hover:text-brand-danger hover:bg-red-50 rounded-lg transition-colors"
              title="Delete Budget"
            >
              <IconTrash className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Spent vs Limit Big Numbers */}
        <div className="flex items-baseline justify-between mb-2">
          <div>
            <span className="text-[11px] font-semibold text-brand-muted uppercase tracking-wider block">
              Spent
            </span>
            <span className={`text-xl font-bold font-mono ${isExceeded ? 'text-brand-danger' : 'text-brand-text'}`}>
              {formatCurrency(budget.spent)}
            </span>
          </div>

          <div className="text-right">
            <span className="text-[11px] font-semibold text-brand-muted uppercase tracking-wider block">
              Limit
            </span>
            <span className="text-base font-bold font-mono text-slate-500">
              {formatCurrency(budget.limit)}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="my-3">
          <ProgressBar
            current={budget.spent}
            max={budget.limit}
            showLabel={true}
            height="h-2.5"
          />
        </div>
      </div>

      {/* Footer: Remaining Amount status */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-brand-muted">Remaining Balance</span>
        <span className={`font-mono font-bold ${remaining >= 0 ? 'text-brand-success' : 'text-brand-danger'}`}>
          {remaining >= 0 ? formatCurrency(remaining) : `-${formatCurrency(Math.abs(remaining))}`}
        </span>
      </div>
    </div>
  );
};

export default BudgetCard;
