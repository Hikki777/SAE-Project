import { motion } from 'framer-motion';
import { Check, SkipForward } from 'lucide-react';

export default function CardAusente({ persona, onJustificar, onOmitir }) {
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
        {/* Icono de persona */}
        <div className="persona-avatar">
          {persona.tipo === 'alumno' ? '👨‍🎓' : '👨‍🏫'}
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
