'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Heart, Star, Users, MapPin, Calendar, Clock, Navigation2, Mountain, Share2 } from 'lucide-react';
import FiltrosTitulo from "@/components/common/titulo-filtro"; // Verifica ruta
import { CldImage } from 'next-cloudinary';
import type { RutaListItem, ComentarioItem } from '@/types/listadoRutas'; // Ajusta ruta
import { generateSlug } from '@/lib/utils';
import { fetchRutaComentarios } from '@/lib/api-listadoRutas'; // Importa la función para obtener comentarios


// Componente para Avatar
interface UserAvatarProps {
    imageSrc?: string | null;
    alt?: string | null;
    index: number;
}
const UserAvatar: React.FC<UserAvatarProps> = ({ imageSrc, alt, index }) => {
    // Usa CldImage para optimización y fallback
    return (
        <div
            className="avatar" // Tu clase CSS
            style={{ marginLeft: index > 0 ? '-8px' : '0' }} // Estilo original para superposición
            title={alt || 'Usuario'}
        >
             <CldImage
                src={imageSrc || 'URL_IMAGEN_POR_DEFECTO_AVATAR'} // Necesitas una imagen por defecto
                alt={alt || 'Avatar de usuario'}
                width={32} // Tamaño pequeño para avatar
                height={32} // Tamaño pequeño para avatar
                crop="thumb" // Ideal para avatares
                gravity="face" // Intenta centrar en cara
                className="avatar-image" // Clase para border-radius: 50% en CSS
                // Opcional: añade un placeholder
                // placeholder="blur"
                // blurDataURL="..."
             />
        </div>
    );
};

// Componente para Grupo de Avatares (con fetch de comentarios)
interface UserAvatarsProps {
    rutaId: number | string;
}
const UserAvatars: React.FC<UserAvatarsProps> = ({ rutaId }) => {
    const [comentarios, setComentarios] = useState<ComentarioItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true; // Flag para evitar updates si se desmonta
        const obtenerComentarios = async () => {
            if (!rutaId) {
                setLoading(false);
                return;
            };
            setLoading(true);
            setError(null);
            try {
                const data = await fetchRutaComentarios(rutaId);
                if (isMounted) {
                    setComentarios(data);
                }
            } catch (err) {
                console.error(`Error al cargar comentarios client-side para ruta ${rutaId}:`, err);
                if (isMounted) {
                    setError(err instanceof Error ? err.message : 'Error al cargar comentarios');
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        obtenerComentarios();

        return () => { isMounted = false; }; // Cleanup
    }, [rutaId]);

    // Mostrar placeholders mientras carga o si hay error/no hay comentarios
    if (loading || error || comentarios.length === 0) {
        return (
            <div className="avatar-group">
                {/* Placeholder avatars */}
                <div className="avatar placeholder"></div>
                <div className="avatar placeholder" style={{ marginLeft: '-8px' }}></div>
            </div>
        );
    }

    // Mostrar avatares reales
    return (
        <div className="avatar-group">
            {comentarios.slice(0, 3).map((comentario, index) => (
                <UserAvatar
                    key={comentario.id}
                    imageSrc={comentario.foto_usuario}
                    alt={comentario.nombre_usuario}
                    index={index}
                />
            ))}
        </div>
    );
};


// --- Props Interface para ListadoRutasClient ---
interface ListadoRutasClientProps {
  initialRutas: RutaListItem[];
  municipio: string;
}
const ListadoRutasClient: React.FC<ListadoRutasClientProps> = ({ initialRutas, municipio }) => {
  const router = useRouter();

  // Estado para Filtros y Lista Filtrada
  const [filtros, setFiltros] = useState<Record<string, Set<{value: string | number | boolean}>>>({});
  const [rutasFiltradas, setRutasFiltradas] = useState<RutaListItem[]>(initialRutas);
  const [filtroSeleccionado, setFiltroSeleccionado] = useState<string | number | boolean | null>(null);

  // Efecto para Generar Filtros Disponibles
  useEffect(() => {
    const nuevosFiltros: Record<string, Set<{value: string | number | boolean}>> = {};
    initialRutas.forEach((ruta) => { // Variable 'ruta'
      if (ruta.items && typeof ruta.items === 'object') {
          Object.entries(ruta.items).forEach(([key, value]) => {
             if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
                 if (!nuevosFiltros[key]) nuevosFiltros[key] = new Set();
                  if (!Array.from(nuevosFiltros[key]).some(item => item.value === value)) {
                      nuevosFiltros[key].add({ value });
                  }
             }
          });
      }
    });
    setFiltros(nuevosFiltros);
    setRutasFiltradas(initialRutas);
    setFiltroSeleccionado(null);
  }, [initialRutas]);

  // Manejo de Clic en Filtro
   const manejarClickFiltro = (key: string, value: {value: string | number | boolean}) => {
     const filterValue = value.value;
     setFiltroSeleccionado(filterValue);
     const filtradas = initialRutas.filter(ruta => // Variable 'ruta'
         ruta.items && ruta.items[key] === filterValue
     );
     setRutasFiltradas(filtradas);
   };

   // Manejo de Clic en Card (Navegación)
    const handleCardClick = (ruta: RutaListItem) => {
        const name = ruta.nombre;

        const path = `/destino/${encodeURIComponent(municipio)}/rutas/${encodeURIComponent(name)}`;
        console.log("Navigating to Ruta Detail:", path);
        router.push(path);
    };

    // Función texto avatares (igual)
     const getUserCountText = (ruta: RutaListItem): string => {
         // Convierte a número para comparar, maneja null/undefined
         const calificacionNum = Number(ruta.calificacion);
         const completaronNum = Number(ruta.completaron_ruta);

         if (isNaN(calificacionNum) || calificacionNum === 0) {
             return "¡Recién agregada!";
         } else if (!isNaN(completaronNum) && completaronNum > 0) {
             return `${completaronNum} personas completaron esta ruta`;
         } else {
             return "¡Visitada recientemente!";
         }
     };

  // --- Renderizado JSX ---
  return (
    <>
      {/* Helmet se maneja en page.tsx */}
       {/* Reusa clase o crea 'rutas-container' */}
      <div className="actividades-container">
        <FiltrosTitulo
          nombre={`Rutas y Miradores en ${municipio}`} // Título dinámico
          filtros={filtros}
          filtroSeleccionado={filtroSeleccionado}
          manejarClick={manejarClickFiltro}
        />

        <div className="container-seccion-lista-rutas"> {/* Tu clase para grid de rutas */}
          {rutasFiltradas.map((item) => ( // Cambiado a 'item' para consistencia con JSX interno
            <div
                key={item.id || item.nombre}
                onClick={() => handleCardClick(item)}
                className="container-item-lista-rutas" // Tu card de ruta
                role="link" tabIndex={0}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleCardClick(item)}
                aria-label={`Ver detalles de la ruta ${item.nombre}`}
            >
                <div className="route-social"> {/* Botones sociales */}
                    <button className="interaction-button" onClick={(e) => { e.stopPropagation(); /* Lógica Fav */ }}><Heart className="icon2" size={14}/></button>
                    <button className="interaction-button" onClick={(e) => { e.stopPropagation(); /* Lógica Share */ }}><Share2 className="icon2" size={14}/></button>
                </div>

                <CldImage // Imagen de la ruta
                    src={item.img}
                    alt={item.nombre}
                    className="container-img-ruta" // Clase para estilos de imagen
                    width={400} // Ajusta
                    height={250} // Ajusta
                    crop="fill" gravity="center" loading="lazy"
                    // sizes="..."
                />

                 {/* Rating Badge */}
                 <div className="rating-badge">
                   {/* Convertir a número para comparar */}
                    {Number(item.calificacion) === 0 || !item.calificacion ? ('Nuevo') : (`${Number(item.calificacion).toFixed(1)} ★`)}
                 </div>

                 <div className="container-info-ruta"> {/* Info debajo de la imagen */}
                    <h3 className="route-title">{item.nombre}</h3>
                    <div className="route-stats"> {/* Tiempo, Distancia, Terreno */}
                       <div className="stat-item"><Clock className="icon2" size={12}/><span>{item.tiempo} min</span></div>
                       <div className="stat-item"><Navigation2 className="icon2" size={12}/><span>{item.distancia} km</span></div>
                       <div className="stat-item"><Mountain className="icon2" size={12}/><span>{item.terreno}</span></div>
                    </div>
                    <div className="route-footer"> {/* Avatares y botón */}
                       <div className="user-count">
                            <UserAvatars rutaId={item.id!} /> {/* Pasa el ID de la ruta, asegura que no sea undefined con '!' si estás seguro que existe */}
                            <span>{getUserCountText(item)}</span>
                       </div>
                       <button className="ver-ruta-btn"> {/* Este botón es redundante si toda la card es clickeable */}
                            Ver Ruta
                       </button>
                    </div>
                 </div>
            </div>
          ))}
        </div>
        {/* Mensaje si no hay resultados */}
        {rutasFiltradas.length === 0 && filtroSeleccionado && (
             <p className="no-results-message">No hay rutas con el filtro seleccionado.</p>
        )}
      </div>
    </>
  );
};

export default ListadoRutasClient;