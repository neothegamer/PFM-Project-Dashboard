import React from 'react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  ...props
}) => {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple/50 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-brand-purple hover:bg-brand-purple-hover text-white hover:scale-[1.02] hover:shadow-glow active:scale-[0.98]',
    secondary: 'bg-navy-elevated hover:bg-border text-text-main border border-border hover:scale-[1.01] active:scale-[0.99]',
    ghost: 'text-text-secondary hover:text-text-main hover:bg-navy-elevated',
    danger: 'bg-danger/10 hover:bg-danger/20 text-danger border border-danger/30',
    success: 'bg-success/10 hover:bg-success/20 text-success border border-success/30',
    outline: 'border border-brand-purple/50 text-brand-purple hover:bg-brand-purple/10',
  };

  const sizes = {
    xs: 'px-2.5 py-1.5 text-xs',
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
