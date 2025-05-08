'use client';

import React, { useEffect } from 'react';
// import ReactGA from 'react-ga4'; // O usa window.gtag directamente
import { MdError } from "react-icons/md";

// Importa los sub-componentes que ya migraste (verifica nombres/rutas)
import Header from '@/components/features/destino/header';
import DescripcionCarousel from '@/components/features/destino/descripcion';
import ViewpointsSection from '@/components/features/destino/ViewpointsSection';
import PopularActivities from '@/components/features/destino/popularActivities';
import AccommodationsSection from '@/components/features/destino/AccommodationsSection';
import DiscoverSection from '@/components/features/destino/DiscoverSection';
import DestinationInfo from '@/components/features/destino/DestinationInfo';
import { CldImage } from 'next-cloudinary'; // ¡Importa CldImage!

import type { DestinoData } from '@/types/destino'; // Importa tu tipo principal

// --- Helper de Analytics (igual que antes) ---
const Analytics = {
  trackTimeSpent: (municipio: string | undefined | null, timeSpent: number) => {
    try {
      if (typeof window === 'undefined' || !window.gtag) return;
      if (timeSpent < 0) return;
      window.gtag('event', 'tiempo_destino', { /*...*/ });
      if (process.env.NODE_ENV === 'development') { /*...*/ }
    } catch (error) { /*...*/ }
  },
  // trackError ya no se llama desde aquí para errores de fetch
};
// --- Fin Analytics Helper ---

// --- Props del Componente ---
interface DestinoPageContentProps {
    initialContent: DestinoData; // Recibe los datos (asegurado que no es null por page.tsx)
    destinoIdFromParam: string | number; // Recibe el ID/Slug
}

// --- Componente Principal de UI ---
const DestinoPageContent: React.FC<DestinoPageContentProps> = ({ initialContent, destinoIdFromParam }) => {

    // --- Efecto para Trackear Tiempo (Mantenido) ---
    useEffect(() => {
        if (!initialContent?.municipio) return;
        const startTime = Date.now();
        return () => {
            const timeSpent = Math.round((Date.now() - startTime) / 1000);
            Analytics.trackTimeSpent(initialContent.municipio, timeSpent);
        };
    }, [initialContent?.municipio]);

    // Extraemos los datos para pasarlos fácilmente
    // Usamos '?? []' o '?? {}' como fallback por si la API no devuelve alguna propiedad opcional
    const {
      municipio = 'Destino',
      imagenes = [],
      frase = '',
      descripcion = '',
      epocas = null,
      clima = null,
      seguridad = null,
      transporte = null,
      alojamientos = [],
      tendencias = [],
      // Asegúrate que estas propiedades existan en tu interfaz DestinoData y en la respuesta API
      // restaurantes = [],
      // bares = [],
      // actividades = [],
      // eventos = [],
    } = initialContent;

    // Recreamos objetos para pasar a componentes hijos si mantienen esa estructura de props
     const infoDesParaDescripcion = { imagenes, frase, descripcion, municipio };
     const infoDesParaTips = { municipio, epocas, clima, seguridad, transporte };

    return (
        <>
            <Header destino={municipio} />

            <DescripcionCarousel
                destino={infoDesParaDescripcion}
                destino_id={destinoIdFromParam}
            />

            {/* Banner Ad con next/image */}
            <div className='banner-ads'>
                 <CldImage
                    src='https://res.cloudinary.com/destinoplus/image/upload/v1741362727/pptjxoehzinr0ciqxjyy.jpg'
                    alt="Publicidad Destiplus" // Alt más descriptivo
                    width={1200} // Ancho intrínseco o deseado grande
                    height={200} // Alto intrínseco o deseado - AJUSTA ESTOS VALORES
                    priority // Marcar como priority si es visible pronto? O quitar si no.
                 />
            </div>

            <AccommodationsSection
                alojamientos={alojamientos}
                destino_id={destinoIdFromParam}
                municipio={initialContent.municipio || ''}
            />

            <div className='separador'></div>

            <DiscoverSection
                destino_id={destinoIdFromParam}
                pueblo={municipio}
            />

             <div className='container-tendencias-miradores'>
                <PopularActivities contenido={tendencias} />
                <ViewpointsSection
                    imagenes={imagenes}
                    destino_id={destinoIdFromParam}
                    municipio={municipio}
                />
             </div>

            <DestinationInfo
                destino={infoDesParaTips}
            />
        </>
    );
}

export default DestinoPageContent;