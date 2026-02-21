import { motion } from 'framer-motion';
import { Check, SkipForward } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const BASE_URL = API_URL.replace('/api', '');

export default function CardAusente({ persona, onJustificar, onOmitir }) {
  const getFotoUrl = () => {
    if (persona.foto_path) {
      return persona.foto_path.startsWith('http') 
        ? persona.foto_path 
        : `${BASE_URL}/uploads/${persona.foto_path}`;
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
    
    return `${BASE_URL}/uploads/${directory}/${prefix}_${cleanCarnet}.png`;
  };

  const fotoUrl = getFotoUrl();
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, x: -100 }}
      transition={{ duration: 0.3 }}
      className="card-ausente"
    >
      <div className="card-content">
        {/* Foto de persona */}
        <div className="persona-avatar">
          {fotoUrl ? (
            <img 
              src={fotoUrl} 
              alt={`${persona.nombres} ${persona.apellidos}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback a emoji si la imagen no carga
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'block';
              }}
            />
          ) : null}
          <div 
            className="text-4xl flex items-center justify-center w-full h-full"
            style={{ display: fotoUrl ? 'none' : 'flex' }}
          >
            {persona.tipo === 'alumno' ? '👨‍🎓' : '👨‍🏫'}
          </div>
        </div>

        {/* Información */}
        <div className="persona-info">
          <h4 className="persona-nombre">
            {persona.nombres} {persona.apellidos}
          </h4>
          
          {/* Mostrar información específica según tipo */}
          {persona.tipo === 'alumno' ? (
            // Para alumnos: grado, carrera, especialidad
            <div className="flex flex-col gap-1 mt-1">
              <p className="persona-detalle">
                {persona.grado}
                {persona.seccion && ` - Sección ${persona.seccion}`}
              </p>
              {(persona.carrera || persona.especialidad) && (
                <div className="flex flex-wrap gap-1">
                  {persona.carrera && (
                    <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full font-semibold">
                      {persona.carrera}
                    </span>
                  )}
                  {persona.especialidad && (
                    <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs rounded-full font-semibold">
                      {persona.especialidad}
                    </span>
                  )}
                </div>
              )}
            </div>
          ) : (
            // Para personal: cargo y grado guía
            <div className="flex flex-col gap-1 mt-1">
              <p className="persona-detalle">
                {persona.cargo || 'Personal'}
              </p>
              {persona.grado_guia && (
                <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs rounded-full font-semibold inline-block">
                  Grado Guía: {persona.grado_guia}
                </span>
              )}
            </div>
          )}
          
          <p className="persona-carnet">ID: {persona.carnet}</p>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="card-actions">
        <button
          onClick={() => onJustificar(persona)}
          className="btn-justificar"
          title="Justificar ausencia"
        >
          <Check size={18} />
          Justificar
        </button>
        <button
          onClick={() => onOmitir(persona)}
          className="btn-omitir"
          title="Omitir por ahora"
        >
          <SkipForward size={18} />
          Omitir
        </button>
      </div>
    </motion.div>
  );
}
