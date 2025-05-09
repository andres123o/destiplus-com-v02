'use client';

import React, { useState, useEffect } from 'react';
import {  Loader2  } from 'lucide-react'; // Iconos Lucide

interface Participant {
    id: number;
    name: string;
    restaurant: string;
    image: string; // Cloudinary Public ID
    logo: string;  // Cloudinary Public ID
    visitors: number;
    price: number;
    description: string;
    specialIngredient: string;
    votes: number; // Votos iniciales (puede ser actualizado dinámicamente por el estado)
    location: {
      lat: number;
      lng: number;
    };
}
  
interface VotePayload {
    email: string;
    full_name: string;
    rating: number; // Ya convertido a número
    recommendations: string | null; // Puede ser nulo
    origin: string | null;          // Puede ser nulo
    burger_name: string;
    restaurant_name: string;
  burger_id: number;
}

interface VotingModalProps {
  isOpen: boolean;
  onClose: () => void;
  burger: Participant | null; // La hamburguesa por la que se vota
  onSubmit: (voteData: VotePayload) => Promise<void> | void; // Función que envía el voto (puede ser async)
}

const VotingModal: React.FC<VotingModalProps> = ({ isOpen, onClose, burger, onSubmit }) => {
  // Estados del formulario
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [rating, setRating] = useState(''); // Se mantiene como string para el input type="number"
  const [recommendations, setRecommendations] = useState('');
  const [origin, setOrigin] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null); // Para errores del formulario

  // Resetea el formulario cuando el modal se cierra o cambia la hamburguesa
  useEffect(() => {
    if (!isOpen) {
      setEmail('');
      setFullName('');
      setRating('');
      setRecommendations('');
      setOrigin('');
      setIsSubmitting(false);
      setFormError(null); // Limpia error del formulario
    }
  }, [isOpen]);

  // No renderizar si no está abierto o no hay hamburguesa
  if (!isOpen || !burger) {
    return null;
  }

  // Manejador del envío del formulario
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null); // Limpiar error previo

    // Validación simple (puedes añadir más)
    const numericRating = parseInt(rating, 10);
    if (isNaN(numericRating) || numericRating < 1 || numericRating > 10) {
        setFormError("La calificación debe ser un número entre 1 y 10.");
        return;
    }

    setIsSubmitting(true); // Deshabilita botón

    const voteData: VotePayload = {
      email: email,
      full_name: fullName,
      rating: numericRating,
      recommendations: recommendations || null, // Enviar null si está vacío
      origin: origin || null, // Enviar null si está vacío
      burger_name: burger.name,
      restaurant_name: burger.restaurant,
      burger_id: burger.id
    };

    try {
        // Llama a la función onSubmit pasada desde el padre
        await onSubmit(voteData);
        // Si onSubmit es exitoso, el componente padre (BurgerProfileClient)
        // debería cerrar el modal y mostrar mensaje de éxito.
        // No necesitamos llamar a onClose() aquí directamente si el padre lo hace.
    } catch (error) {
         // Si onSubmit lanza un error (ej. fallo de red no manejado en padre), lo mostramos aquí
         console.error("Error en onSubmit desde VotingModal:", error);
         setFormError("No se pudo enviar el voto. Inténtalo de nuevo.");
    } finally {
         // Reactivar botón SÓLO si el modal NO se cierra automáticamente por el padre
         // En nuestro caso, BurgerProfileClient cierra el modal, así que no es necesario reactivar aquí.
         // Si quisiéramos permitir reintentos DESDE el modal, haríamos:
         // setIsSubmitting(false);
    }
  };

  // Clic en overlay (igual)
  const handleOverlayClick = () => { if (!isSubmitting) onClose(); };
  const handleContentClick = (e: React.MouseEvent) => { e.stopPropagation(); };

  return (
    <div className="voting-modal-overlay" onClick={handleOverlayClick}> {/* Mantener clases */}
      <div className="voting-modal-content" onClick={handleContentClick}>
        <button className="modal-close-btn" onClick={onClose} disabled={isSubmitting}>&times;</button>
        <h3 className="modal-title">
          Vota por: <span className="modal-burger-name">{burger.name}</span>
          <span className="modal-restaurant-name">de {burger.restaurant}</span>
        </h3>

        <form onSubmit={handleSubmit} className="modal-form">
          {/* Campo Email */}
          <div className="modal-form-group">
            <label htmlFor="email-vote" className="modal-label">Correo Electrónico:</label>
            <input type="email" id="email-vote" className="modal-input" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isSubmitting} />
          </div>
          {/* Campo Nombre Completo */}
          <div className="modal-form-group">
            <label htmlFor="fullName-vote" className="modal-label">Nombre y Apellidos:</label>
            <input type="text" id="fullName-vote" className="modal-input" value={fullName} onChange={(e) => setFullName(e.target.value)} required disabled={isSubmitting} />
          </div>
          {/* Campo Calificación */}
          <div className="modal-form-group">
            <label htmlFor="rating-vote" className="modal-label">Calificación (1-10):</label>
            <input type="number" id="rating-vote" className="modal-input" value={rating} onChange={(e) => setRating(e.target.value)} min="1" max="10" required disabled={isSubmitting} />
          </div>
          {/* Campo Recomendaciones */}
          <div className="modal-form-group">
            <label htmlFor="recommendations-vote" className="modal-label">Recomendaciones (Opcional):</label>
            <textarea id="recommendations-vote" className="modal-textarea" value={recommendations} onChange={(e) => setRecommendations(e.target.value)} rows={3} disabled={isSubmitting} />
          </div>
          {/* Campo Origen */}
          <div className="modal-form-group">
            <label htmlFor="origin-vote" className="modal-label">¿De dónde nos visitas? (Opcional):</label>
            <input type="text" id="origin-vote" className="modal-input" value={origin} onChange={(e) => setOrigin(e.target.value)} disabled={isSubmitting} />
          </div>

          {/* Mensaje de error del formulario */}
          {formError && <p className="form-message error" style={{textAlign: 'center', marginTop: '-10px', marginBottom: '15px'}}>{formError}</p>}

          {/* Botón Enviar */}
          <button type="submit" className="modal-submit-btn" disabled={isSubmitting}>
            {isSubmitting ? (<><Loader2 className="animate-spin" size={18} /> Enviando...</>) : 'Enviar Voto'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VotingModal;