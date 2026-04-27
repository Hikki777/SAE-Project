import React from 'react';
import { motion } from 'framer-motion';

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  icon: Icon,
  className = '', 
  disabled,
  onClick,
  type = 'button',
  ...props 
}) {
  const baseClasses = "relative inline-flex items-center justify-center font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden shadow-sm";
  
  const variants = {
    primary: "bg-gradient-to-br from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-primary-500/30 border border-primary-500/50",
    secondary: "bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100 backdrop-blur-md border border-gray-200 dark:border-gray-600",
    danger: "bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-red-500/30 border border-red-500/50",
    warning: "bg-gradient-to-br from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-amber-500/30 border border-amber-500/50",
    success: "bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-green-500/30 border border-green-500/50",
    outline: "bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-300 dark:border-gray-600 shadow-none",
    ghost: "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 shadow-none"
  };

  const sizes = {
    sm: "py-1.5 px-3 text-sm rounded-lg gap-1.5",
    md: "py-2.5 px-5 text-sm rounded-xl gap-2",
    lg: "py-3 px-6 text-base rounded-xl gap-2",
    icon: "p-2 rounded-xl"
  };

  const isSolid = ['primary', 'danger', 'warning', 'success'].includes(variant);

  return (
    <motion.button
      type={type}
      whileTap={disabled || loading ? {} : { scale: 0.97 }}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {/* Shine effect for solid colored buttons */}
      {isSolid && (
        <div className="absolute inset-x-0 top-0 h-px bg-white/30 pointer-events-none" />
      )}
      
      {loading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : Icon ? (
        <Icon size={size === 'sm' ? 16 : size === 'icon' ? 18 : 20} className={children ? "flex-shrink-0" : ""} />
      ) : null}
      {children}
    </motion.button>
  );
}
