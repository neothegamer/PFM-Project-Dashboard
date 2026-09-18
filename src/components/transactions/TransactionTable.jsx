import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import Badge from '../common/Badge';
import EmptyState from '../common/EmptyState';
import {
  IconArrowUpRight,
  IconArrowDownLeft,
  IconTrash,
  IconCheck
} from '../common/Icons';

export const TransactionTable = ({ transactions, onResetFilters }) => {
  const { formatCurrency, deleteTransaction } = useFinance();
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const getCategoryVariant = (cat = '') => {
    const c = cat.toLowerCase();
    if (c.includes('food')) return 'primary';
    if (c.includes('shop')) return 'teal';
    if (c.includes('bill')) return 'danger';
    if (c.includes('transport')) return 'warning';
    if (c.includes('health')) return 'success';
    if (c.includes('salary') || c.includes('income') || c.includes('freelance') || c.includes('invest')) return 'success';
    return 'default';
  };

  if (transactions.length === 0) {
    return (
      <EmptyState
        title="No transactions found"
        description="We couldn't find any transactions matching your active filter criteria."
        actionLabel="Clear Filters"
        onAction={onResetFilters}
      />
    );
  }

  return (
    <div className="bg-white rounded-t-2xl border border-brand-border shadow-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-brand-border bg-slate-50/75 text-[11px] font-semibold text-brand-muted uppercase tracking-wider">
              <th className="py-3 px-4 sm:px-6">Description</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Account</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Amount</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {transactions.map((tx) => {
              const isIncome = tx.type === 'income';
              const isConfirming = deleteConfirmId === tx.id;

              return (
                <tr key={tx.id} className="hover:bg-slate-50/60 transition-colors">
                  {/* Description & Icon */}
                  <td className="py-4 px-4 sm:px-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        isIncome ? 'bg-green-50 text-brand-success' : 'bg-red-50 text-brand-danger'
                      }`}>
                        {isIncome ? (
                          <IconArrowDownLeft className="w-4 h-4" />
                        ) : (
                          <IconArrowUpRight className="w-4 h-4" />
                        )}
                      </div>
                      <div className="min-w-0 max-w-xs">
                        <p className="font-semibold text-brand-text truncate">{tx.description}</p>
                        {tx.notes && (
                          <p className="text-[11px] text-brand-muted truncate">{tx.notes}</p>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-4 px-4">
                    <Badge variant={getCategoryVariant(tx.category)} size="sm">
                      {tx.category}
                    </Badge>
                  </td>

                  {/* Account */}
                  <td className="py-4 px-4 text-xs font-medium text-slate-600 whitespace-nowrap">
                    {tx.account}
                  </td>

                  {/* Date */}
                  <td className="py-4 px-4 text-xs text-brand-muted whitespace-nowrap">
                    {tx.date}
                  </td>

                  {/* Status */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      <IconCheck className="w-3 h-3" />
                      {tx.status || 'Completed'}
                    </span>
                  </td>

                  {/* Amount */}
                  <td className="py-4 px-4 text-right font-mono font-bold whitespace-nowrap">
                    <span className={isIncome ? 'text-brand-success' : 'text-brand-danger'}>
                      {isIncome ? '+' : '-'}{formatCurrency(tx.amount)}
                    </span>
                  </td>

                  {/* Delete Action */}
                  <td className="py-4 px-4 text-center whitespace-nowrap">
                    {isConfirming ? (
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => {
                            deleteTransaction(tx.id);
                            setDeleteConfirmId(null);
                          }}
                          className="px-2 py-1 bg-brand-danger text-white rounded text-[10px] font-bold hover:bg-red-700"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="px-2 py-1 bg-slate-200 text-slate-700 rounded text-[10px]"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirmId(tx.id)}
                        className="p-1.5 text-slate-400 hover:text-brand-danger hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete transaction"
                      >
                        <IconTrash className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionTable;
