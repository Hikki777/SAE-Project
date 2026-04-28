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
    primary: "bg-accent hover:bg-accent-light text-[#020617] shadow-glow border border-accent/50 hover:shadow-glow",
    secondary: "bg-bg-secondary/70 backdrop-blur-lg hover:bg-bg-tertiary text-text-primary border border-white/5",
    danger: "bg-danger hover:bg-danger-light text-white shadow-danger/30 border border-danger/50",
    warning: "bg-warning hover:bg-warning-light text-[#020617] shadow-warning/30 border border-warning/50",
    success: "bg-success hover:bg-success-light text-white shadow-success/30 border border-success/50",
    outline: "bg-transparent text-text-primary hover:bg-white/5 border border-white/5 shadow-none",
    ghost: "bg-transparent hover:bg-white/5 text-text-primary shadow-none"
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
