import React from 'react';
import { motion } from 'framer-motion';

export function Card({ children, className = '', animate = false, noPadding = false, glow = false, ...props }) {
  const baseClasses = glow 
    ? "bg-bg-secondary/80 backdrop-blur-lg shadow-glow border border-accent/20 rounded-xl overflow-hidden relative transition-all duration-300"
    : "bg-bg-secondary/70 backdrop-blur-lg border border-white/5 rounded-xl overflow-hidden relative transition-all duration-300 hover:shadow-glow";
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
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent pointer-events-none" />
        <div className="relative z-10">{children}</div>
      </motion.div>
    );
  }

  return (
    <div className={`${baseClasses} ${paddingClasses} ${className}`} {...props}>
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent pointer-events-none" />
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
    <h3 className={`text-xl font-bold tracking-tight text-text-primary ${className}`}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className = '' }) {
  return (
    <p className={`text-sm text-text-secondary ${className}`}>
      {children}
    </p>
  );
}
