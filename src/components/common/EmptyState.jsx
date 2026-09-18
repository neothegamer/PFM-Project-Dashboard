import React from 'react';

const EmptyState = ({ title = 'No data found', message = 'Nothing to show here yet.', icon = null, action = null }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
    <div className="w-16 h-16 rounded-full bg-navy-elevated flex items-center justify-center mb-4">
      {icon || (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-muted">
          <circle cx="12" cy="12" r="10"/>
          <path d="M8 15h8M9 9h.01M15 9h.01"/>
        </svg>
      )}
    </div>
    <h3 className="text-base font-semibold text-text-secondary mb-1">{title}</h3>
    <p className="text-sm text-text-muted max-w-xs mb-4">{message}</p>
    {action}
  </div>
);

export default EmptyState;
