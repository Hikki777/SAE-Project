import React from 'react';

export function Badge({ children, variant = 'default', className = '' }) {
  const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold";
  
  const variants = {
    default: "bg-bg-tertiary text-text-primary dark:bg-bg-tertiary dark:text-text-primary border border-border",
    primary: "bg-accent/20 text-accent dark:bg-accent/20 dark:text-accent border border-accent/50",
    success: "bg-status-success/20 text-status-success dark:bg-status-success/20 dark:text-status-success border border-status-success/50",
    warning: "bg-status-warning/20 text-status-warning dark:bg-status-warning/20 dark:text-status-warning border border-status-warning/50",
    danger: "bg-status-error/20 text-status-error dark:bg-status-error/20 dark:text-status-error border border-status-error/50",
    info: "bg-accent-light/20 text-accent-light dark:bg-accent-light/20 dark:text-accent-light border border-accent-light/50",
  };

  return (
    <span className={`${baseClasses} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
