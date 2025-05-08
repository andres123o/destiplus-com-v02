// src/app/(site)/page.tsx  <--- ¡ESTE ES EL ARCHIVO PARA LA RUTA RAÍZ '/'!

import type { Metadata } from 'next';
// Importa TU componente cliente principal
import HomeClient from '@/components/features/home/HomeClient';
// Importa TU función para obtener datos
import { getDestinosIniciales } from '@/lib/api-home'; // O '@/lib/api-home' si renombraste el archivo .ts
// Importa TU tipo de dato

// Metadata para la página RAÍZ '/'
export const metadata: Metadata = {
  title: 'Destiplus | Tu Guía Inteligente para Puebliar Cerca a Bogotá',
  description: 'Encuentra fácil info de Suesca, Sesquilé y más: alojamiento, actividades, comida, rutas. ¡Pregúntale a nuestra IA!',
  openGraph: {
     title: 'Destiplus | Explora Cundinamarca con IA',
     description: 'Tu compañero de viaje para descubrir lo mejor de los pueblos cercanos a Bogotá.',
     url: 'https://www.destiplus.com/', // Cambia a tu dominio real
     // images: [ { url: 'https://www.destiplus.com/og-image.jpg' } ], // Imagen para compartir
  },
  keywords: ['turismo cundinamarca', 'pueblos cerca bogota', 'suesca', 'sesquile', 'planes fin de semana', 'viajes colombia', 'turismo con IA'],
};

// Componente ASÍNCRONO de servidor para la página RAÍZ '/'
export default async function HomePage() { // El nombre puede ser cualquiera, pero representa la página raíz
  console.log("Server: Rendering HomePage (/), fetching initial data...");

  // 1. Llama a tu función de API en el servidor
  const initialDestinos = await getDestinosIniciales();
  console.log(`Server: HomePage (/) received ${initialDestinos.length} initial destinos.`);

  // 2. Renderiza TU componente cliente, pasándole los datos
  return <HomeClient initialDestinos={initialDestinos} />;
}