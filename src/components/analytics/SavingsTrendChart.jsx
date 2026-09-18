import React from 'react';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import { useFinance } from '../../context/FinanceContext';
import { IconPiggyBank } from '../common/Icons';

export const SavingsTrendChart = () => {
  const {
    incomeVsExpenseHistory,
    formatCurrency,
  } = useFinance();

  let accumulated = 0;

  const savingsData = incomeVsExpenseHistory.map(
    (item) => {

      accumulated +=
        Number(item.income || 0) -
        Number(item.expenses || 0);

      return {
        month: item.month,
        monthlySavings:
          Number(item.income || 0) -
          Number(item.expenses || 0),
        totalAccumulated: accumulated,
      };
    }
  );

  const CustomTooltip = ({
    active,
    payload,
    label,
  }) => {

    if (active && payload && payload.length) {

      return (
        <div className="bg-navy-deep border border-border text-text-main p-3 rounded-xl shadow-xl text-xs space-y-2">

          <p className="font-semibold text-text-main border-b border-border pb-2">
            {label} Growth
          </p>

          <p className="text-brand-cyan flex justify-between gap-4">

            <span>
              Cumulative Reserve:
            </span>

            <span className="font-mono font-bold">
              {formatCurrency(
                payload[0]?.value || 0
              )}
            </span>

          </p>

          <p className="text-text-secondary flex justify-between gap-4">

            <span>
              Monthly Addition:
            </span>

            <span className="font-mono font-bold text-text-main">
              {formatCurrency(
                payload[0]?.payload
                  ?.monthlySavings || 0
              )}
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

            <IconPiggyBank className="w-4 h-4 text-brand-mint" />

            Cumulative Wealth & Savings Growth

          </h3>

          <p className="text-xs text-text-secondary mt-1">
            Retained earnings compounding trend
          </p>

        </div>

        <div className="flex items-center gap-2 text-xs">

          <span className="w-2.5 h-2.5 rounded-full bg-brand-mint" />

          <span className="text-text-secondary font-medium">
            Reserve Growth
          </span>

        </div>

      </div>


      <div className="w-full h-64">

        <ResponsiveContainer width="100%" height="100%">

          <AreaChart
            data={savingsData}
            margin={{
              top: 10,
              right: 15,
              left: -15,
              bottom: 0,
            }}
          >

            <defs>

              <linearGradient
                id="savingsGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >

                <stop
                  offset="5%"
                  stopColor="#2DD4BF"
                  stopOpacity={0.35}
                />

                <stop
                  offset="95%"
                  stopColor="#2DD4BF"
                  stopOpacity={0}
                />

              </linearGradient>

            </defs>


            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#1E3A4F"
            />


            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={{
                stroke: '#1E3A4F',
              }}
              tick={{
                fill: '#94A3B8',
                fontSize: 12,
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


            <Area
              type="monotone"
              dataKey="totalAccumulated"
              stroke="#2DD4BF"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#savingsGradient)"
            />

          </AreaChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
};

export default SavingsTrendChart;