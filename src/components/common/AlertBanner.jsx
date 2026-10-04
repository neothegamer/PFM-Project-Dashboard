import React from 'react';
import { IconAlertTriangle, IconAlertCircle, IconCheck, IconX } from './Icons';

export const AlertBanner = ({
  type = 'warning',
  title,
  message,
  onClose,
  className = '',
  action
}) => {
  const styles = {
    warning: {
      bg: 'bg-amber-50 border-amber-200 text-amber-900',
      iconBg: 'bg-amber-100 text-amber-600',
      icon: IconAlertTriangle
    },
    danger: {
      bg: 'bg-red-50 border-red-200 text-red-900',
      iconBg: 'bg-red-100 text-brand-danger',
      icon: IconAlertCircle
    },
    success: {
      bg: 'bg-green-50 border-green-200 text-green-900',
      iconBg: 'bg-green-100 text-brand-success',
      icon: IconCheck
    },
    info: {
      bg: 'bg-blue-50 border-blue-200 text-blue-900',
      iconBg: 'bg-blue-100 text-brand-blue',
      icon: IconAlertCircle
    }
  };

  const current = styles[type] || styles.warning;
  const IconComponent = current.icon;

  return (
    <div className={`flex items-start gap-3 p-4 rounded-xl border ${current.bg} ${className}`}>
      <div className={`p-1.5 rounded-lg flex-shrink-0 ${current.iconBg}`}>
        <IconComponent className="w-4 h-4" />
      </div>

      <div className="flex-1 text-xs sm:text-sm">
        {title && <h4 className="font-semibold mb-0.5">{title}</h4>}
        <p className="opacity-90 leading-relaxed">{message}</p>
        {action && <div className="mt-2">{action}</div>}
      </div>

      {onClose && (
        <button
          onClick={onClose}
          className="text-current opacity-60 hover:opacity-100 transition-opacity p-1"
          aria-label="Dismiss alert"
        >
          <IconX className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default AlertBanner;
