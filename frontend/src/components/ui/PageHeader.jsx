import React from 'react';
import { motion } from 'framer-motion';

export function PageHeader({ title, icon: Icon, children, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 ${className}`}
    >
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
        {Icon && (
          <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-xl text-blue-600 dark:text-blue-400">
             <Icon size={28} />
          </div>
        )}
        {title}
      </h2>
      <div className="flex flex-wrap items-center gap-3">
        {children}
      </div>
    </motion.div>
  );
}
