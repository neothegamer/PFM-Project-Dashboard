import React, { useEffect, useState } from 'react';

const ProgressBar = ({ value, max = 100, color = 'purple', animated = true, className = '' }) => {
  const [width, setWidth] = useState(0);
  const pct = Math.min((value / max) * 100, 100);

  useEffect(() => {
    const timer = setTimeout(() => setWidth(pct), 100);
    return () => clearTimeout(timer);
  }, [pct]);

  const getColor = () => {
    if (color === 'auto') {
      if (pct >= 100) return 'bg-danger';
      if (pct >= 80) return 'bg-warning';
      return 'bg-success';
    }
    const map = {
      purple: 'bg-brand-purple',
      mint: 'bg-income',
      cyan: 'bg-brand-cyan',
      success: 'bg-success',
      warning: 'bg-warning',
      danger: 'bg-danger',
    };
    return map[color] || 'bg-brand-purple';
  };

  return (
    <div className={`w-full bg-navy-secondary rounded-full overflow-hidden ${className}`} style={{ height: '6px' }}>
      <div
        className={`h-full rounded-full transition-all duration-1000 ease-out ${getColor()}`}
        style={{ width: animated ? `${width}%` : `${pct}%` }}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemax={max}
        aria-valuemin={0}
      />
    </div>
  );
};

export default ProgressBar;
