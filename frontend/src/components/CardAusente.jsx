import { motion } from 'framer-motion';
import { Check, SkipForward } from 'lucide-react';
import { BASE_URL } from '../api/client';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

export default function CardAusente({ persona, onJustificar, onOmitir }) {
  const getFotoUrl = () => {
    if (persona.foto_path) {
      return persona.foto_path.startsWith('http') 
        ? persona.foto_path 
        : `${BASE_URL}/api/uploads/${persona.foto_path}`;
    }
    
    if (!persona.carnet) return null;
    const cleanCarnet = String(persona.carnet).trim();
    const tipo = persona.tipo;
    
    let directory = '';
    let prefix = '';
    
    if (tipo === 'alumno' || tipo === 'Alumno') {
      directory = 'alumnos';
      prefix = 'alumno';
    } else {
      if (cleanCarnet.startsWith('DIR-') || cleanCarnet.startsWith('SDIR-')) {
        directory = 'directores';
        prefix = 'director';
      } else if (cleanCarnet.startsWith('D-')) {
        directory = 'docentes';
        prefix = 'docentes';
      } else {
        directory = 'personal';
        prefix = 'personal';
      }
    }
    
    return `${BASE_URL}/api/uploads/${directory}/${prefix}_${cleanCarnet}.png`;
  };

  const fotoUrl = getFotoUrl();
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, x: -100 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <Card noPadding animate={false} className="overflow-hidden flex flex-col group">
        <div className="flex flex-col sm:flex-row p-4 gap-4">
          {/* Foto de persona */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gray-100 dark:bg-gray-800 flex-shrink-0 relative overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700">
            {fotoUrl ? (
              <img 
                src={fotoUrl} 
                alt={`${persona.nombres} ${persona.apellidos}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div 
              className="absolute inset-0 text-3xl flex items-center justify-center"
              style={{ display: fotoUrl ? 'none' : 'flex' }}
            >
              {persona.tipo === 'alumno' ? '👨‍🎓' : '👨‍🏫'}
            </div>
          </div>

          {/* Información */}
          <div className="flex-1 flex flex-col justify-center">
            <h4 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white leading-tight">
              {persona.nombres} {persona.apellidos}
            </h4>
            
            {persona.tipo === 'alumno' ? (
              <div className="flex flex-col gap-1 mt-1">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {persona.grado}
                  {persona.seccion && ` - Sección ${persona.seccion}`}
                </p>
                {(persona.carrera || persona.especialidad) && (
                  <div className="flex flex-wrap gap-1">
                    {persona.carrera && (
                      <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full font-bold uppercase tracking-wider">
                        {persona.carrera}
                      </span>
                    )}
                    {persona.especialidad && (
                      <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs rounded-full font-bold uppercase tracking-wider">
                        {persona.especialidad}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-1 mt-1">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {persona.cargo || 'Personal'}
                </p>
                {persona.grado_guia && (
                  <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs rounded-full font-bold inline-block w-fit">
                    Grado Guía: {persona.grado_guia}
                  </span>
                )}
              </div>
            )}
            <p className="text-xs text-gray-500 mt-2 font-mono">ID: {persona.carnet}</p>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="grid grid-cols-2 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800">
          <Button
            variant="ghost"
            className="rounded-none border-r border-gray-200 dark:border-gray-700 text-gray-500 hover:text-gray-700 py-3"
            onClick={() => onOmitir(persona)}
            icon={SkipForward}
          >
            Omitir
          </Button>
          <Button
            variant="ghost"
            className="rounded-none text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 py-3"
            onClick={() => onJustificar(persona)}
            icon={Check}
          >
            Justificar
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
