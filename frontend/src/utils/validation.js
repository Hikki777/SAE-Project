/**
 * Calcula la fortaleza de una contraseña
 * @param {string} password - Contraseña a evaluar
 * @returns {object} - { strength: 'weak'|'medium'|'strong', score: 0-100, feedback: string }
 */
export const calculatePasswordStrength = (password) => {
  if (!password) {
    return { strength: 'weak', score: 0, feedback: 'Ingresa una contraseña' };
  }

  let score = 0;
  const feedback = [];

  // Longitud (máximo 40 puntos)
  if (password.length >= 8) score += 10;
  if (password.length >= 12) score += 15;
  if (password.length >= 16) score += 15;

  // Contiene letras minúsculas (10 puntos)
  if (/[a-z]/.test(password)) {
    score += 10;
  } else {
    feedback.push('Agrega letras minúsculas');
  }

  // Contiene letras mayúsculas (10 puntos)
  if (/[A-Z]/.test(password)) {
    score += 10;
  } else {
    feedback.push('Agrega letras mayúsculas');
  }

  // Contiene números (15 puntos)
  if (/\d/.test(password)) {
    score += 15;
  } else {
    feedback.push('Agrega números');
  }

  // Contiene caracteres especiales (15 puntos)
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    score += 15;
  } else {
    feedback.push('Agrega símbolos especiales');
  }

  // Determinar fortaleza
  let strength = 'weak';
  if (score >= 70) strength = 'strong';
  else if (score >= 40) strength = 'medium';

  return {
    strength,
    score,
    feedback: feedback.length > 0 ? feedback.join(', ') : '¡Contraseña segura!'
  };
};

/**
 * Valida el formato de un email
 * @param {string} email - Email a validar
 * @returns {boolean} - true si es válido
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida que la contraseña cumpla con los requisitos mínimos
 * @param {string} password - Contraseña a validar
 * @returns {object} - { isValid: boolean, errors: string[] }
 */
export const validatePassword = (password) => {
  const errors = [];

  if (password.length < 8) {
    errors.push('Debe tener al menos 8 caracteres');
  }

  if (!/[a-zA-Z]/.test(password)) {
    errors.push('Debe contener al menos una letra');
  }

  if (!/\d/.test(password)) {
    errors.push('Debe contener al menos un número');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};
