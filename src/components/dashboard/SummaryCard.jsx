import React from 'react';
import { Icon } from '../common/Icons.jsx';

const SummaryCard = ({ title, value, change, positive, icon, color, delay = 0 }) => (
  <div
    className="card p-5 hover:-translate-y-1 hover:shadow-card-hover transition-all duration-300 animate-slide-up"
    style={{ animationDelay: `${delay}s` }}
  >
    <div className="flex items-start justify-between mb-3">
      <p className="text-sm font-medium text-text-secondary">{title}</p>
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
        <Icon name={icon} size={18} />
      </div>
    </div>
    <p className="text-2xl font-bold text-text-main mb-1.5">{value}</p>
    <div className="flex items-center gap-1.5">
      <Icon
        name={positive ? 'arrowUp' : 'arrowDown'}
        size={14}
        className={positive ? 'text-success' : 'text-danger'}
      />
      <span className={`text-xs font-medium ${positive ? 'text-success' : 'text-danger'}`}>{change}</span>
      <span className="text-xs text-text-muted">vs last month</span>
    </div>
  </div>
);

export default SummaryCard;
