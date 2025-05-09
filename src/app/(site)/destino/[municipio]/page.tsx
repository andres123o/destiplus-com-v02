
import React from 'react';
import { notFound } from 'next/navigation';
// Importa las funciones necesarias de la API lib
import { getDestinoDataByMunicipio } from '@/lib/api-destino';
import type { DestinoData } from '@/types/destino';
// Ajusta la ruta si tu componente cliente tiene otro nombre/ubicación
import DestinoPageContent from '@/components/features/destino/destino';
import type { Metadata } from 'next';

interface DestinoPageProps {
  params: { municipio: string }; // <-- Recibe 'municipio' (ya decodificado por Next.js)
}

// --- Generación de Metadata Dinámica por Municipio ---
export async function generateMetadata(
  { params }: { params: Promise<{ municipio: string }> }
): Promise<Metadata> {
  const { municipio: municipioRaw } = await params
  // params.municipio viene decodificado (ej: "Villa de Leyva")
  const municipioName = municipioRaw;
  // Llama a la API con el nombre exacto
  const destino = await getDestinoDataByMunicipio(municipioName);

  if (!destino) {
    return { title: 'Destino no Encontrado' };
  }

  const title = `${destino.municipio || 'Destino'} | Destiplus - Guía Completa`;
  const description = `Explora ${destino.municipio || 'este destino'}: ${destino.descripcion?.substring(0, 150) || 'Descubre actividades, alojamiento, comida y más con nuestra guía inteligente'}.`;
  const imageUrl = destino.imagenes?.[0]?.img || '/placeholder-og-image.jpg';
  // Usamos el nombre original (decodificado) para la URL canónica visible en el tag
  // Next.js/Google manejarán la codificación/decodificación necesaria.
  const canonicalUrl = `https://www.destiplus.com/destino/${municipioName}`;

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      url: canonicalUrl, // URL Canónica
      images: [{ url: imageUrl }],
      type: 'website',
    },
    alternates: { canonical: canonicalUrl },
  };
}


// --- Componente de Página ---
export default async function DestinoPage(
  { params }: { params: Promise<{ municipio: string }> }
) {
  const { municipio: municipioRaw } = await params
  // params.municipio ya viene decodificado por Next.js
  const municipioName = municipioRaw;
  console.log(`Server: Rendering DestinoPage for municipio (${municipioName}), fetching data...`);

  // Llama a la función de API que busca por el nombre exacto del municipio
  const initialContent: DestinoData | null = await getDestinoDataByMunicipio(municipioName);

  if (!initialContent) {
    console.log(`Server: Destino not found for municipio: ${municipioName}. Triggering 404.`);
    notFound();
  }

   console.log(`Server: Destino data received for ${initialContent.municipio}. Rendering client component.`);

   // Pasamos el ID si vino con los datos, si no, podemos pasar el nombre como fallback
   const destinoId = initialContent.id || municipioName;

   return <DestinoPageContent initialContent={initialContent} destinoIdFromParam={destinoId} />;
}