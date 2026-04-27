import React from 'react';

export function Badge({ children, variant = 'default', className = '' }) {
  const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold";
  
  const variants = {
    default: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
    primary: "bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-400",
    success: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    warning: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
    danger: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    info: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  };

  return (
    <span className={`${baseClasses} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
