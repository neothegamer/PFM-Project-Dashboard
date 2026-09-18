import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-navy-elevated border border-border rounded-xl p-3 shadow-xl text-sm">
      <p className="font-semibold text-text-main mb-2">{label}</p>
      {payload.map(p => (
        <div key={p.name} className="flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.fill }} />
          <span className="text-text-secondary capitalize">{p.name}:</span>
          <span className="font-semibold text-text-main">
            ₹{Number(p.value).toLocaleString('en-IN')}
          </span>
        </div>
      ))}
    </div>
  );
};

const IncomeExpenseChart = ({ data }) => (
  <div className="card p-5 animate-slide-up" style={{ animationDelay: '0.2s' }}>
    <div className="flex items-center justify-between mb-5">
      <div>
        <h3 className="text-base font-semibold text-text-main">Income vs Expenses</h3>
        <p className="text-xs text-text-muted mt-0.5">Last 6 months comparison</p>
      </div>
      <div className="flex items-center gap-4 text-xs">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-purple" />
          <span className="text-text-secondary">Income</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-expense" />
          <span className="text-text-secondary">Expenses</span>
        </span>
      </div>
    </div>
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} barGap={4} barCategoryGap="30%">
        <CartesianGrid strokeDasharray="3 3" stroke="#1E3A4F" vertical={false} />
        <XAxis dataKey="month" tick={{ fill: '#64748B', fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis
          tick={{ fill: '#64748B', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`}
          width={45}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(139,92,246,0.05)' }} />
        <Bar dataKey="income" name="income" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
        <Bar dataKey="expenses" name="expenses" fill="#FB7185" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default IncomeExpenseChart;
