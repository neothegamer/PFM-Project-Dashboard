import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Icon } from '../common/Icons';

const HealthMetrics = () => {
  const { summary, formatCurrency } = useFinance();

  const income = Number(summary?.totalIncome || 0);
  const expenses = Number(summary?.totalExpenses || 0);
  const balance = Number(summary?.balance ?? income - expenses);

  const savingsRate =
    income > 0
      ? Math.round(((income - expenses) / income) * 100)
      : 0;

  const spendingRatio =
    income > 0
      ? Math.min(100, Math.round((expenses / income) * 100))
      : 0;

  const metrics = [
    {
      title: 'Total Income',
      value: formatCurrency(income),
      description: 'Money received',
      type: 'income',
      icon: 'trendingUp',
      color: 'success',
    },
    {
      title: 'Total Expenses',
      value: formatCurrency(expenses),
      description: 'Money spent',
      type: 'expense',
      icon: 'trendingDown',
      color: 'danger',
    },
    {
      title: 'Current Balance',
      value: formatCurrency(balance),
      description: 'Available balance',
      type: 'balance',
      icon: 'wallet',
      color: 'brand-cyan',
    },
  ];

  return (
    <div className="space-y-4">

      {/* =====================================================
          MAIN FINANCIAL CARDS
      ===================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">

        {metrics.map((metric) => (

          <div
            key={metric.title}
            className="bg-navy-card border border-border rounded-2xl p-5 shadow-sm transition-all duration-200 hover:border-brand-purple/30"
          >

            <div className="flex items-start justify-between gap-4">

              <div className="min-w-0">

                <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                  {metric.title}
                </p>

                <h3 className="mt-2 text-2xl font-bold text-text-main truncate">
                  {metric.value}
                </h3>

                <p className="mt-1 text-xs text-text-secondary">
                  {metric.description}
                </p>

              </div>


              {/* Icon */}
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  metric.type === 'income'
                    ? 'bg-success/10 text-success'
                    : metric.type === 'expense'
                    ? 'bg-danger/10 text-danger'
                    : 'bg-brand-cyan/10 text-brand-cyan'
                }`}
              >

                <Icon
                  name={metric.icon}
                  size={19}
                />

              </div>

            </div>


            {/* Small indicator */}
            <div className="mt-5 h-1.5 w-full rounded-full bg-navy-elevated overflow-hidden">

              <div
                className={`h-full rounded-full ${
                  metric.type === 'income'
                    ? 'bg-success'
                    : metric.type === 'expense'
                    ? 'bg-danger'
                    : 'bg-brand-cyan'
                }`}
                style={{
                  width:
                    metric.type === 'income'
                      ? '100%'
                      : metric.type === 'expense'
                      ? `${Math.min(spendingRatio, 100)}%`
                      : `${Math.min(
                          income > 0
                            ? Math.max(
                                0,
                                (balance / income) * 100
                              )
                            : 0,
                          100
                        )}%`,
                }}
              />

            </div>

          </div>

        ))}

      </div>


      {/* =====================================================
          SAVINGS RATE + SPENDING VS INCOME
      ===================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Savings Rate */}
        <div className="bg-navy-card border border-border rounded-2xl p-5 shadow-sm">

          <div className="flex items-center justify-between gap-4">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-xl bg-success/10 text-success flex items-center justify-center">
                <Icon name="piggyBank" size={18} />
              </div>

              <div>

                <h3 className="font-semibold text-text-main">
                  Savings Rate
                </h3>

                <p className="text-xs text-text-secondary mt-0.5">
                  {savingsRate}% of your income remains after expenses.
                </p>

              </div>

            </div>

            <span className="text-2xl font-bold text-success">
              {savingsRate}%
            </span>

          </div>


          <div className="mt-5 h-2.5 rounded-full bg-navy-elevated overflow-hidden">

            <div
              className="h-full rounded-full bg-success transition-all duration-500"
              style={{
                width: `${Math.min(
                  100,
                  Math.max(0, savingsRate)
                )}%`,
              }}
            />

          </div>

        </div>


        {/* Spending vs Income */}
        <div className="bg-navy-card border border-border rounded-2xl p-5 shadow-sm">

          <div className="flex items-center justify-between gap-4">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-xl bg-danger/10 text-danger flex items-center justify-center">
                <Icon name="activity" size={18} />
              </div>

              <div>

                <h3 className="font-semibold text-text-main">
                  Spending vs Income
                </h3>

                <p className="text-xs text-text-secondary mt-0.5">
                  {spendingRatio}% of your income has been spent.
                </p>

              </div>

            </div>

            <span className="text-2xl font-bold text-danger">
              {spendingRatio}%
            </span>

          </div>


          <div className="mt-5 h-2.5 rounded-full bg-navy-elevated overflow-hidden">

            <div
              className="h-full rounded-full bg-danger transition-all duration-500"
              style={{
                width: `${Math.min(
                  100,
                  Math.max(0, spendingRatio)
                )}%`,
              }}
            />

          </div>

        </div>

      </div>

    </div>
  );
};

export default HealthMetrics;