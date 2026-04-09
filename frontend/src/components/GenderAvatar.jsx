import React from 'react';
import { User } from 'lucide-react';

const GenderAvatar = ({ sexo, size = 20, className = '' }) => {
  const isFemale = typeof sexo === 'string' && (sexo.toLowerCase() === 'femenino' || sexo.toLowerCase() === 'mujer');
  const isMale = typeof sexo === 'string' && (sexo.toLowerCase() === 'masculino' || sexo.toLowerCase() === 'hombre');

  const baseClasses = `w-full h-full flex items-center justify-center ${className}`;

  if (isFemale) {
    return (
      <div className={`${baseClasses} bg-pink-100 text-pink-500 dark:bg-pink-900/30 dark:text-pink-400`} title="Femenino">
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a4 4 0 0 1 4 4v2c0 1.5-1.5 2.5-3 3.5-1.5-1-3-2-3-3.5V6a4 4 0 0 1 2-4z"/>
          <path d="M18 16c0-2.5-2.5-4-6-4s-6 1.5-6 4v4h12v-4z"/>
          <path d="M12 12c-2 0-3 1-3 2v2M12 12c2 0 3 1 3 2v2"/>
        </svg>
      </div>
    );
  }

  if (isMale) {
    return (
      <div className={`${baseClasses} bg-blue-100 text-blue-500 dark:bg-blue-900/30 dark:text-blue-400`} title="Masculino">
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      </div>
    );
  }

  // Fallback genérico sin sexo definido
  return (
    <div className={`${baseClasses} bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500`} title="Usuario">
      <User size={size} />
    </div>
  );
};

export default GenderAvatar;
