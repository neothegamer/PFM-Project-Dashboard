import React from 'react';

const LoadingState = ({ rows = 3, type = 'cards' }) => {
  if (type === 'cards') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="card p-5 animate-pulse">
            <div className="h-3 bg-navy-elevated rounded w-2/3 mb-4"/>
            <div className="h-6 bg-navy-elevated rounded w-1/2 mb-3"/>
            <div className="h-2 bg-navy-elevated rounded w-3/4"/>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="card p-4 animate-pulse flex items-center gap-4">
            <div className="h-9 w-9 bg-navy-elevated rounded-full flex-shrink-0"/>
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-navy-elevated rounded w-1/3"/>
              <div className="h-2 bg-navy-elevated rounded w-1/4"/>
            </div>
            <div className="h-4 bg-navy-elevated rounded w-20"/>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'chart') {
    return (
      <div className="card p-5 animate-pulse">
        <div className="h-4 bg-navy-elevated rounded w-1/3 mb-6"/>
        <div className="h-48 bg-navy-elevated rounded"/>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      <div className="w-8 h-8 border-2 border-brand-purple border-t-transparent rounded-full animate-spin"/>
    </div>
  );
};

export default LoadingState;
