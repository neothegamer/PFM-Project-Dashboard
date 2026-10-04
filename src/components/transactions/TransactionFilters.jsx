import React from 'react';
import { IconSearch, IconFilter, IconX } from '../common/Icons';

export const TransactionFilters = ({
  search,
  setSearch,
  selectedCategory,
  setSelectedCategory,
  selectedAccount,
  setSelectedAccount,
  selectedType,
  setSelectedType,
  sortBy,
  setSortBy,
  categories,
  accounts,
  onReset
}) => {
  const hasActiveFilters = search || selectedCategory !== 'all' || selectedAccount !== 'all' || selectedType !== 'all' || sortBy !== 'date-desc';

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-brand-border shadow-card mb-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        {/* Search bar */}
        <div className="md:col-span-4 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <IconSearch className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by description or notes..."
            className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm rounded-xl border border-brand-border placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
            >
              <IconX className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Type Filter */}
        <div className="md:col-span-2">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full py-2 px-3 text-xs sm:text-sm rounded-xl border border-brand-border text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue"
          >
            <option value="all">All Types</option>
            <option value="income">Income (+)</option>
            <option value="expense">Expense (-)</option>
          </select>
        </div>

        {/* Category Filter */}
        <div className="md:col-span-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full py-2 px-3 text-xs sm:text-sm rounded-xl border border-brand-border text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Account Filter */}
        <div className="md:col-span-2">
          <select
            value={selectedAccount}
            onChange={(e) => setSelectedAccount(e.target.value)}
            className="w-full py-2 px-3 text-xs sm:text-sm rounded-xl border border-brand-border text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue"
          >
            <option value="all">All Accounts</option>
            {accounts.map((a) => (
              <option key={a.id} value={a.name}>
                {a.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Options */}
        <div className="md:col-span-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full py-2 px-3 text-xs sm:text-sm rounded-xl border border-brand-border text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="amount-high">Amount: High to Low</option>
            <option value="amount-low">Amount: Low to High</option>
          </select>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
          <span className="text-brand-muted">Filters active</span>
          <button
            onClick={onReset}
            className="text-brand-blue hover:underline font-semibold flex items-center gap-1"
          >
            <IconX className="w-3.5 h-3.5" />
            Reset all filters
          </button>
        </div>
      )}
    </div>
  );
};

export default TransactionFilters;
