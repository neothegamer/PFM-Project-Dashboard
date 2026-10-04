import React from 'react';

const Badge = ({ children, variant = 'default', size = 'sm', className = '' }) => {
  const variants = {
    default: 'bg-navy-elevated text-text-secondary border border-border',
    income: 'bg-income/10 text-income border border-income/20',
    expense: 'bg-expense/10 text-expense border border-expense/20',
    success: 'bg-success/10 text-success border border-success/20',
    warning: 'bg-warning/10 text-warning border border-warning/20',
    danger: 'bg-danger/10 text-danger border border-danger/20',
    purple: 'bg-brand-purple/10 text-brand-purple border border-brand-purple/20',
    cyan: 'bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20',
    healthy: 'bg-success/10 text-success border border-success/20',
    approaching: 'bg-warning/10 text-warning border border-warning/20',
    over: 'bg-danger/10 text-danger border border-danger/20',
  };

  const sizes = {
    xs: 'px-1.5 py-0.5 text-[10px]',
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  };

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${variants[variant] || variants.default} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
