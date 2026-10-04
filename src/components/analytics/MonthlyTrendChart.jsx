import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

import { useFinance } from '../../context/FinanceContext';
import { IconTrendingUp } from '../common/Icons';

export const MonthlyTrendChart = () => {
  const { spendingTrendData, formatCurrency } = useFinance();

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-navy-deep border border-border text-text-main p-3 rounded-xl shadow-xl text-xs space-y-2">

          <p className="font-semibold text-text-main border-b border-border pb-2">
            {label}
          </p>

          <p className="text-brand-cyan flex justify-between gap-4">
            <span>Spent:</span>

            <span className="font-mono font-bold">
              {formatCurrency(payload[0]?.value || 0)}
            </span>
          </p>

          <p className="text-text-secondary flex justify-between gap-4">
            <span>Target Benchmark:</span>

            <span className="font-mono font-bold">
              {formatCurrency(payload[0]?.payload?.average || 0)}
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

            <IconTrendingUp className="w-4 h-4 text-brand-cyan" />

            Weekly Spending Trajectory

          </h3>

          <p className="text-xs text-text-secondary mt-1">
            Outflows vs. target budget velocity
          </p>

        </div>

        <div className="flex items-center gap-2 text-xs">

          <span className="w-2.5 h-2.5 rounded-full bg-brand-cyan" />

          <span className="text-text-secondary font-medium">
            Weekly Outflow
          </span>

        </div>

      </div>


      <div className="w-full h-64">

        <ResponsiveContainer width="100%" height="100%">

          <LineChart
            data={spendingTrendData}
            margin={{
              top: 10,
              right: 15,
              left: -15,
              bottom: 0,
            }}
          >

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#1E3A4F"
            />

            <XAxis
              dataKey="week"
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

            <ReferenceLine
              y={20000}
              stroke="#FBBF24"
              strokeDasharray="4 4"
              label={{
                value: 'Target Avg',
                fill: '#FBBF24',
                fontSize: 10,
                position: 'insideTopRight',
              }}
            />

            <Line
              type="monotone"
              dataKey="spent"
              stroke="#2DD4BF"
              strokeWidth={3}
              dot={{
                fill: '#2DD4BF',
                r: 4,
                strokeWidth: 2,
                stroke: '#10263A',
              }}
              activeDot={{
                r: 6,
                fill: '#22D3EE',
              }}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
};

export default MonthlyTrendChart;