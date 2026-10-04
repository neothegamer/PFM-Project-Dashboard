import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="bg-navy-elevated border border-border rounded-xl p-3 shadow-xl text-sm">
      <p className="font-semibold text-text-main mb-1">{d.name}</p>
      <p className="text-text-secondary">
        ₹{Number(d.value).toLocaleString('en-IN')}
        <span className="ml-2 text-text-muted">({d.payload.percentage}%)</span>
      </p>
    </div>
  );
};

const renderLegend = (props) => {
  const { payload } = props;
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3">
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color }} />
          <span className="text-xs text-text-secondary truncate">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

const ExpenseOverview = ({ data }) => (
  <div className="card p-5 animate-slide-up" style={{ animationDelay: '0.3s' }}>
    <div className="mb-4">
      <h3 className="text-base font-semibold text-text-main">Expense Distribution</h3>
      <p className="text-xs text-text-muted mt-0.5">Spending by category this month</p>
    </div>
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={80}
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.color} stroke="transparent" />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend content={renderLegend} />
      </PieChart>
    </ResponsiveContainer>
  </div>
);

export default ExpenseOverview;
