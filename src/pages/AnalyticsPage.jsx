import React from 'react';
import { useFinance } from '../context/FinanceContext.jsx';
import { Icon } from '../components/common/Icons.jsx';

import HealthMetrics from '../components/analytics/HealthMetrics.jsx';
import BudgetPerformanceChart from '../components/analytics/BudgetPerformanceChart.jsx';
import MonthlyTrendChart from '../components/analytics/MonthlyTrendChart.jsx';
import SavingsTrendChart from '../components/analytics/SavingsTrendChart.jsx';

const AnalyticsPage = () => {
  const {
    summary,
    categorySpending,
    formatCurrency,
    transactions,
    budgets,
  } = useFinance();

  const expenseTransactions = transactions.filter(
    (transaction) => transaction.type === 'expense'
  );

  const incomeTransactions = transactions.filter(
    (transaction) => transaction.type === 'income'
  );

  const totalIncome = incomeTransactions.reduce(
    (sum, transaction) => sum + Number(transaction.amount || 0),
    0
  );

  const totalExpenses = expenseTransactions.reduce(
    (sum, transaction) => sum + Number(transaction.amount || 0),
    0
  );

  const averageExpense =
    expenseTransactions.length > 0
      ? totalExpenses / expenseTransactions.length
      : 0;

  const savingsRate =
    totalIncome > 0
      ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100)
      : 0;

  const spendingRatio =
    totalIncome > 0
      ? Math.round((totalExpenses / totalIncome) * 100)
      : 0;

  const topCategory =
    categorySpending && categorySpending.length > 0
      ? categorySpending[0]
      : null;

  return (
    <div className="space-y-6 max-w-7xl">

      {/* =========================================================
          PAGE HEADER
      ========================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">

        <div>
          <div className="flex items-center gap-2 mb-2">

            <div className="w-8 h-8 rounded-lg bg-brand-purple/10 text-brand-purple flex items-center justify-center">
              <Icon name="trendingUp" size={17} />
            </div>

            <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Financial Intelligence
            </span>

          </div>

          <h2 className="text-2xl font-bold text-text-main">
            Analytics
          </h2>

          <p className="text-sm text-text-secondary mt-1">
            Understand your spending patterns, savings performance, and budget health.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-navy-card border border-border shadow-sm text-xs">

          <span className="w-2 h-2 rounded-full bg-success animate-pulse" />

          <span className="text-text-secondary">
            Live financial overview
          </span>

        </div>

      </div>


      {/* =========================================================
          FINANCIAL HEALTH
      ========================================================= */}
      <HealthMetrics />


      {/* =========================================================
          ADDITIONAL INSIGHTS
      ========================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Average Transaction */}
        <div className="bg-navy-card rounded-2xl p-5 border border-border shadow-sm">

          <div className="flex items-start justify-between">

            <div>

              <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                Avg. Transaction
              </p>

              <p className="text-xl font-bold text-text-main mt-2">
                {formatCurrency(averageExpense)}
              </p>

              <p className="text-xs text-text-secondary mt-1">
                Average expense size
              </p>

            </div>

            <div className="w-10 h-10 rounded-xl bg-brand-cyan/10 text-brand-cyan flex items-center justify-center">
              <Icon name="activity" size={18} />
            </div>

          </div>

        </div>


        {/* Top Category */}
        <div className="bg-navy-card rounded-2xl p-5 border border-border shadow-sm">

          <div className="flex items-start justify-between">

            <div className="min-w-0">

              <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                Top Spending Category
              </p>

              <p className="text-xl font-bold text-text-main mt-2 truncate">
                {topCategory ? topCategory.name : 'No data'}
              </p>

              <p className="text-xs text-text-secondary mt-1">
                {topCategory
                  ? `${topCategory.percentage || 0}% of expenses`
                  : 'Add transactions to see insights'}
              </p>

            </div>

            <div className="w-10 h-10 rounded-xl bg-brand-purple/10 text-brand-purple flex items-center justify-center flex-shrink-0">
              <Icon name="pieChart" size={18} />
            </div>

          </div>

        </div>


        {/* Budget Status */}
        <div className="bg-navy-card rounded-2xl p-5 border border-border shadow-sm">

          <div className="flex items-start justify-between">

            <div>

              <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                Budget Status
              </p>

              <p className="text-xl font-bold text-text-main mt-2">
                {budgets.length}
              </p>

              <p className="text-xs text-text-secondary mt-1">
                Active budgets
              </p>

            </div>

            <div className="w-10 h-10 rounded-xl bg-brand-cyan/10 text-brand-cyan flex items-center justify-center">
              <Icon name="target" size={18} />
            </div>

          </div>

        </div>


        {/* Spending Ratio */}
        <div className="bg-navy-card rounded-2xl p-5 border border-border shadow-sm">

          <div className="flex items-start justify-between">

            <div>

              <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                Spending Ratio
              </p>

              <p className="text-xl font-bold text-danger mt-2">
                {spendingRatio}%
              </p>

              <p className="text-xs text-text-secondary mt-1">
                Income used for expenses
              </p>

            </div>

            <div className="w-10 h-10 rounded-xl bg-danger/10 text-danger flex items-center justify-center">
              <Icon name="activity" size={18} />
            </div>

          </div>

        </div>

      </div>


      {/* =========================================================
          MAIN ANALYTICS CHARTS
      ========================================================= */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

        <MonthlyTrendChart />

        <BudgetPerformanceChart />

      </div>


      {/* =========================================================
          SAVINGS TREND
      ========================================================= */}
      <SavingsTrendChart />


      {/* =========================================================
          SPENDING BREAKDOWN
      ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Category Breakdown */}
        <div className="lg:col-span-2 bg-navy-card rounded-2xl p-5 sm:p-6 border border-border shadow-sm">

          <div className="flex items-center justify-between mb-5">

            <div>

              <h3 className="text-base font-bold text-text-main">
                Spending by Category
              </h3>

              <p className="text-xs text-text-secondary mt-0.5">
                Where your money is going
              </p>

            </div>

            <div className="w-9 h-9 rounded-lg bg-brand-cyan/10 text-brand-cyan flex items-center justify-center">
              <Icon name="pieChart" size={17} />
            </div>

          </div>


          {categorySpending && categorySpending.length > 0 ? (

            <div className="space-y-4">

              {categorySpending.slice(0, 7).map((category, index) => {

                const percentage = Number(category.percentage || 0);

                return (
                  <div key={`${category.name}-${index}`}>

                    <div className="flex items-center justify-between mb-1.5">

                      <div className="flex items-center gap-2 min-w-0">

                        <span
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{
                            backgroundColor:
                              category.color || '#2563EB',
                          }}
                        />

                        <span className="text-sm font-medium text-text-main truncate">
                          {category.name}
                        </span>

                      </div>

                      <div className="flex items-center gap-3">

                        <span className="text-xs text-text-secondary">
                          {percentage}%
                        </span>

                        <span className="text-sm font-semibold text-text-main">
                          {formatCurrency(category.value)}
                        </span>

                      </div>

                    </div>


                    <div className="h-2 bg-navy-elevated rounded-full overflow-hidden">

                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(percentage, 100)}%`,
                          backgroundColor:
                            category.color || '#2563EB',
                        }}
                      />

                    </div>

                  </div>
                );

              })}

            </div>

          ) : (

            <div className="py-10 text-center">

              <div className="w-12 h-12 mx-auto rounded-xl bg-navy-elevated text-text-secondary flex items-center justify-center mb-3">

                <Icon name="pieChart" size={20} />

              </div>

              <p className="text-sm font-medium text-text-main">
                No spending data available
              </p>

              <p className="text-xs text-text-secondary mt-1">
                Add expense transactions to see your spending breakdown.
              </p>

            </div>

          )}

        </div>


        {/* Financial Summary */}
        <div className="bg-navy-card rounded-2xl p-5 sm:p-6 border border-border shadow-sm">

          <div className="flex items-center gap-3 mb-5">

            <div className="w-9 h-9 rounded-lg bg-brand-purple/10 text-brand-purple flex items-center justify-center">
              <Icon name="activity" size={17} />
            </div>

            <div>

              <h3 className="text-base font-bold text-text-main">
                Financial Summary
              </h3>

              <p className="text-xs text-text-secondary mt-0.5">
                Current financial position
              </p>

            </div>

          </div>


          <div className="space-y-4">

            <div className="flex items-center justify-between py-3 border-b border-border">

              <span className="text-sm text-text-secondary">
                Income
              </span>

              <span className="text-sm font-semibold text-success">
                {formatCurrency(totalIncome)}
              </span>

            </div>


            <div className="flex items-center justify-between py-3 border-b border-border">

              <span className="text-sm text-text-secondary">
                Expenses
              </span>

              <span className="text-sm font-semibold text-danger">
                {formatCurrency(totalExpenses)}
              </span>

            </div>


            <div className="flex items-center justify-between py-3 border-b border-border">

              <span className="text-sm text-text-secondary">
                Balance
              </span>

              <span className="text-sm font-semibold text-brand-cyan">
                {formatCurrency(totalIncome - totalExpenses)}
              </span>

            </div>


            <div className="flex items-center justify-between py-3">

              <span className="text-sm text-text-secondary">
                Savings Rate
              </span>

              <span className="text-sm font-bold text-brand-purple">
                {savingsRate}%
              </span>

            </div>

          </div>


          <div className="mt-5 rounded-xl bg-navy-elevated border border-border p-4">

            <div className="flex items-start gap-3">

              <div className="w-8 h-8 rounded-lg bg-success/10 text-success flex items-center justify-center flex-shrink-0">
                <Icon name="check" size={16} />
              </div>

              <div>

                <p className="text-xs font-semibold text-text-main">
                  Financial Summary
                </p>

                <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                  {summary.savings >= 0
                    ? 'Your recorded income currently exceeds your recorded expenses.'
                    : 'Your recorded expenses currently exceed your recorded income.'}
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>


      {/* =========================================================
          BOTTOM SUMMARY
      ========================================================= */}
      <div className="bg-gradient-to-r from-brand-purple/10 to-brand-cyan/10 rounded-2xl p-5 border border-brand-purple/20">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

          <div>

            <h3 className="text-sm font-bold text-text-main">
              Keep improving your financial health
            </h3>

            <p className="text-xs text-text-secondary mt-1">
              Monitor your spending trends regularly and adjust your budgets when necessary.
            </p>

          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-brand-purple">

            <Icon name="trendingUp" size={15} />

            Data-driven decisions

          </div>

        </div>

      </div>

    </div>
  );
};

export default AnalyticsPage;