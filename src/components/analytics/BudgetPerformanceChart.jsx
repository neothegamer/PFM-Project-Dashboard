import React from 'react';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import { useFinance } from '../../context/FinanceContext';
import { IconTarget } from '../common/Icons';

export const BudgetPerformanceChart = () => {
  const { budgets, formatCurrency } = useFinance();

  const data = budgets.map((budget) => ({
    category: budget.category,
    limit: Number(budget.limit || 0),
    spent: Number(budget.spent || 0),
    exceeded:
      Number(budget.spent || 0) >
      Number(budget.limit || 0),
  }));

  const CustomTooltip = ({
    active,
    payload,
    label,
  }) => {
    if (active && payload && payload.length) {
      const limit = Number(payload[0]?.value || 0);
      const spent = Number(payload[1]?.value || 0);
      const variance = limit - spent;

      return (
        <div className="bg-navy-deep border border-border text-text-main p-3 rounded-xl shadow-xl text-xs space-y-2">

          <p className="font-semibold text-text-main border-b border-border pb-2">
            {label} Performance
          </p>

          <p className="text-text-secondary flex justify-between gap-4">
            <span>Budget Limit:</span>

            <span className="font-mono font-bold text-text-main">
              {formatCurrency(limit)}
            </span>
          </p>

          <p className="text-brand-cyan flex justify-between gap-4">
            <span>Actual Spent:</span>

            <span className="font-mono font-bold">
              {formatCurrency(spent)}
            </span>
          </p>

          <p className="flex justify-between gap-4 pt-2 border-t border-border">

            <span className="text-text-secondary">
              Variance:
            </span>

            <span
              className={`font-mono font-bold ${
                variance >= 0
                  ? 'text-success'
                  : 'text-danger'
              }`}
            >
              {formatCurrency(variance)}
            </span>

          </p>

        </div>
      );
    }

    return null;
  };

  return (
    <div className="bg-navy-card rounded-2xl p-5 sm:p-6 border border-border shadow-sm">

      <div className="flex items-center justify-between mb-4">

        <div>

          <h3 className="text-base font-bold text-text-main flex items-center gap-2">

            <IconTarget className="w-4 h-4 text-brand-cyan" />

            Budget vs. Actual Spending

          </h3>

          <p className="text-xs text-text-secondary mt-1">
            Category adherence and variance comparison
          </p>

        </div>

        <div className="flex items-center gap-4 text-xs">

          <div className="flex items-center gap-1.5">

            <span className="w-2.5 h-2.5 rounded-sm bg-slate-500" />

            <span className="text-text-secondary font-medium">
              Budget Limit
            </span>

          </div>

          <div className="flex items-center gap-1.5">

            <span className="w-2.5 h-2.5 rounded-sm bg-brand-cyan" />

            <span className="text-text-secondary font-medium">
              Actual Spent
            </span>

          </div>

        </div>

      </div>


      <div className="w-full h-64">

        <ResponsiveContainer width="100%" height="100%">

          <BarChart
            data={data}
            margin={{
              top: 10,
              right: 15,
              left: -15,
              bottom: 0,
            }}
            barGap={4}
          >

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#1E3A4F"
            />

            <XAxis
              dataKey="category"
              tickLine={false}
              axisLine={{
                stroke: '#1E3A4F',
              }}
              tick={{
                fill: '#94A3B8',
                fontSize: 11,
              }}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{
                fill: '#94A3B8',
                fontSize: 11,
              }}
              tickFormatter={(value) =>
                `₹${value / 1000}k`
              }
            />

            <Tooltip content={<CustomTooltip />} />

            <Bar
              dataKey="limit"
              name="Limit"
              fill="#475569"
              radius={[4, 4, 0, 0]}
              maxBarSize={24}
            />

            <Bar
              dataKey="spent"
              name="Spent"
              fill="#2DD4BF"
              radius={[4, 4, 0, 0]}
              maxBarSize={24}
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
};

export default BudgetPerformanceChart;