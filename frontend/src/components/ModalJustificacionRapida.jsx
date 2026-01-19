import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { X, ArrowRight, Upload } from 'lucide-react';
import { excusasAPI } from '../api/endpoints';
import toast from 'react-hot-toast';

export default function ModalJustificacionRapida({ persona, fecha, onGuardar, onCancelar }) {
  const [formData, setFormData] = useState({
    motivo: '',
    descripcion: '',
    archivo: null
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.motivo) {
      toast.error('Selecciona un motivo');
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append('tipo', persona.tipo); // Changed from persona_tipo to tipo
      data.append('motivo', formData.motivo);
      data.append('fecha_ausencia', fecha);
      
      if (persona.tipo === 'alumno') {
        data.append('alumno_id', persona.id);
      } else {
        data.append('personal_id', persona.id);
      }
      
      if (formData.descripcion) {
        data.append('descripcion', formData.descripcion);
      }
      
      if (formData.archivo) {
        data.append('archivo', formData.archivo);
      }

      await excusasAPI.create(data);
      toast.success('✅ Justificación registrada');
      onGuardar(persona);
    } catch (error) {
      console.error('Error creando justificación:', error);
      toast.error('Error: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onCancelar();
    }
  };

  return createPortal(
    <div 
      className="modal-overlay"
      onClick={onCancelar}
      onKeyDown={handleKeyDown}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="modal-justificacion-rapida"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Justificar Ausencia
          </h3>
          <button
            onClick={onCancelar}
            className="btn-close"
            aria-label="Cerrar"
          >
            <X size={24} />
          </button>
        </div>

        {/* Información de la persona */}
        <div className="persona-info-header">
          <div className="persona-avatar-large">
            {(() => {
              // Use foto_path from backend if available
              const fotoUrl = persona.foto_path ? `/uploads/${persona.foto_path}` : null;
              
              return fotoUrl ? (
                <>
                  <img 
                    src={fotoUrl} 
                    alt={`${persona.nombres} ${persona.apellidos}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'block';
                    }}
                  />
                  <div 
                    className="text-5xl flex items-center justify-center w-full h-full"
                    style={{ display: 'none' }}
                  >
                    {persona.tipo === 'alumno' ? '👨‍🎓' : '👨‍🏫'}
                  </div>
                </>
              ) : (
                <div className="text-5xl">
                  {persona.tipo === 'alumno' ? '👨‍🎓' : '👨‍🏫'}
                </div>
              );
            })()}
          </div>
          <div>
            <h4 className="text-lg font-bold text-gray-900 dark:text-white">
              {persona.nombres} {persona.apellidos}
            </h4>
            <p className="text-gray-600 dark:text-gray-400">
              {persona.tipo === 'alumno' 
                ? `${persona.grado} ${persona.seccion || ''} - ${persona.carnet}` 
                : `${persona.cargo} - ${persona.carnet}`}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              📅 {new Date(fecha).toLocaleDateString('es-ES', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}
            </p>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="modal-form">
          {/* Motivo */}
          <div className="form-group">
            <label className="form-label required">Motivo</label>
            <select
              value={formData.motivo}
              onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
              className="form-select"
              required
              autoFocus
            >
              <option value="">Seleccionar motivo...</option>
              <option value="Enfermedad">🤒 Enfermedad</option>
              <option value="Cita médica">🏥 Cita médica</option>
              <option value="Asunto familiar">👨‍👩‍👧 Asunto familiar</option>
              <option value="Emergencia">🚨 Emergencia</option>
              <option value="Otro">📝 Otro</option>
            </select>
          </div>

          {/* Descripción */}
          <div className="form-group">
            <label className="form-label">Descripción (opcional)</label>
            <textarea
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              className="form-textarea"
              placeholder="Detalles adicionales..."
              rows="3"
            />
          </div>

          {/* Archivo */}
          <div className="form-group">
            <label className="form-label">Evidencia (opcional)</label>
            <div className="file-input-wrapper">
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => setFormData({ ...formData, archivo: e.target.files[0] })}
                className="file-input"
                id="archivo-justificacion"
              />
              <label htmlFor="archivo-justificacion" className="file-input-label">
                <Upload size={18} />
                {formData.archivo ? formData.archivo.name : 'Seleccionar archivo...'}
              </label>
            </div>
            <small className="text-gray-500 dark:text-gray-400">
              PDF o imagen. Máx 5MB.
            </small>
          </div>

          {/* Botones */}
          <div className="modal-actions">
            <button
              type="button"
              onClick={onCancelar}
              className="btn-secondary"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary flex items-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="spinner-small" />
                  Guardando...
                </>
              ) : (
                <>
                  Guardar y Siguiente
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Atajo de teclado */}
        <div className="keyboard-hint">
          <kbd>Esc</kbd> para cerrar
        </div>
      </motion.div>
    </div>,
    document.body
  );
}
