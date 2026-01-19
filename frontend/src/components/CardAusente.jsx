import { motion } from 'framer-motion';
import { Check, SkipForward } from 'lucide-react';

export default function CardAusente({ persona, onJustificar, onOmitir }) {
  // Construct photo URL from foto_path if available
  const fotoUrl = persona.foto_path ? `/uploads/${persona.foto_path}` : null;
  
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
          <p className="persona-detalle">
            {persona.tipo === 'alumno' 
              ? `Estudiante - ${persona.grado} ${persona.seccion || ''}` 
              : `${persona.cargo || 'Personal'}`}
          </p>
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
