import React from 'react';
import { motion } from 'framer-motion';

export function Card({ children, className = '', animate = false, noPadding = false, ...props }) {
  const baseClasses = "bg-white/70 dark:bg-gray-900/60 backdrop-blur-xl shadow-xl shadow-gray-200/50 dark:shadow-black/40 border border-white/50 dark:border-gray-800/50 rounded-2xl overflow-hidden relative";
  const paddingClasses = noPadding ? '' : 'p-5 sm:p-6';
  
  if (animate) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className={`${baseClasses} ${paddingClasses} ${className}`}
        {...props}
      >
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/40 dark:via-white/5 to-transparent pointer-events-none" />
        <div className="relative z-10">{children}</div>
      </motion.div>
    );
  }

  return (
    <div className={`${baseClasses} ${paddingClasses} ${className}`} {...props}>
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/40 dark:via-white/5 to-transparent pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={`mb-4 flex flex-col gap-1 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '' }) {
  return (
    <h3 className={`text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100 ${className}`}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className = '' }) {
  return (
    <p className={`text-sm text-gray-500 dark:text-gray-400 ${className}`}>
      {children}
    </p>
  );
}
