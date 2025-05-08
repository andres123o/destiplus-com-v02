
import React from 'react';
import { notFound } from 'next/navigation';
import { getRutaMapDataBySlug, /* fetchAllRutaMapIdentifiers */ } from '@/lib/api-mapa'; // Ajusta ruta
import type { RutaMapData } from '@/types/mapa'; // Ajusta ruta
import RutaMapaClient from '@/components/features/rutas/mapa'; // Ajusta ruta
import type { Metadata } from 'next';

interface RutaMapaPageProps {
  params: { mapaSlug: string }; // Recibe slug
}

// --- Metadata ---
export async function generateMetadata({ params }: RutaMapaPageProps): Promise<Metadata> {
  const slug = params.mapaSlug;
  // Podrías buscar datos aquí para un título más dinámico, pero requiere API call extra
  // const data = await getRutaMapDataBySlug(slug);
  // const title = data ? `Mapa: ${data.nombre} | Destiplus` : 'Mapa de Ruta | Destiplus';
  const title = `Mapa de Ruta: ${decodeURIComponent(slug).replace(/-/g, ' ')} | Destiplus`; // Título genérico

  return {
    title,
    description: `Sigue la ruta en el mapa interactivo.`,
    robots: { index: false, follow: false }, // Generalmente no quieres indexar páginas de mapa activo
  };
}

// --- Static Params ---
// export async function generateStaticParams() {
//    const paths = await fetchAllRutaMapIdentifiers();
//    return paths.map((p) => ({ slug: p.slug }));
// }

// --- Componente Página ---
export default async function RutaMapaPage({ params }: RutaMapaPageProps) {
  const slug = params.mapaSlug;
  console.log(`Server: Rendering RutaMapaPage for slug (${slug})`);

  // Fetch inicial de datos del mapa
  const initialRutaData = await getRutaMapDataBySlug(slug);

  if (!initialRutaData) {
    console.log(`Server: Ruta map data not found for slug: ${slug}. Triggering 404.`);
    notFound();
  }

   console.log(`Server: Ruta map data received for ${initialRutaData.nombre}. Rendering client component.`);
   return <RutaMapaClient initialRutaData={initialRutaData} />; // Pasa los datos al cliente
}