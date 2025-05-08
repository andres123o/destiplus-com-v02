
import React from 'react';
import { notFound } from 'next/navigation';
import { getEstablecimientoData } from '@/lib/api-restaurante-bar'; // API de establecimiento
import type { EstablecimientoDetailData } from '@/types/restaurante-bar'; // O tu archivo de tipos
import EstablecimientoProfile from '@/components/features/restaurantes/restauranteBar'; // El componente cliente
import type { Metadata, ResolvingMetadata } from 'next';

interface EstablecimientoDetailPageProps {
  params: {
    municipio: string;   // ej: "restaurante" (decodificado)
    baresSlug: string; // ej: "Restaurante La Casona" (decodificado)
  }
}

// --- Metadata Dinámica ---
export async function generateMetadata(
  { params }: EstablecimientoDetailPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { municipio, baresSlug } = params;


  const title = `${baresSlug || 'Establecimiento'} | Destiplus`;
  // Ajusta la descripción según los datos disponibles
  const description = `Descubre ${municipio}. ${baresSlug|| 'Menú, horarios, contacto y más.'}`.substring(0, 160);
  // Construye la URL canónica
  const canonicalUrl = `https://www.destiplus.com/destino/${municipio}/bares/${baresSlug}`; // ¡Actualiza dominio!

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: canonicalUrl,
    },
    alternates: { canonical: canonicalUrl },
  };
}


// --- Componente de Página ---
export default async function EstablecimientoDetailPage({ params }: EstablecimientoDetailPageProps) {
  const { municipio, baresSlug } = params; // Recibe tipo y nombre decodificados

  console.log(`Server: Rendering EstablecimientoDetailPage for tipo, nombre (${baresSlug})`);
  
  const tipo = "bares"

  const initialData = await getEstablecimientoData(tipo, baresSlug)

  if (!initialData) {
    console.log(`Server: Establecimiento not found for ${tipo}/${baresSlug}. Triggering 404.`);
    notFound();
  }

   console.log(`Server: Establecimiento data received. Rendering client component.`);

   // Renderiza el componente cliente, pasando los datos completos
   return <EstablecimientoProfile initialData={initialData} tipoActual={tipo}  />;
}