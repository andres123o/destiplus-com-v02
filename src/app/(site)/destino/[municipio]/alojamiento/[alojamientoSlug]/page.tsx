// app/(site)/destino/[municipio]/alojamiento/[alojamientoSlug]/page.tsx

import React from 'react';
import { notFound } from 'next/navigation';
import { getAlojamientoDataBySlug } from '@/lib/api-alojamientoProfile';
import AlojamientoProfile from '@/components/features/alojamientos/alojamientoProfile'; // Importa el Client Component
import type { Metadata } from 'next';

interface AlojamientoDetailPageProps {
  params: {
    municipio: string;       // ej: "Suesca" (decodificado)
    alojamientoSlug: string; // ej: "hostal-la-roca" (decodificado)
  }
}

// --- Metadata Dinámica ---
export async function generateMetadata(
  { params }: AlojamientoDetailPageProps,
): Promise<Metadata> {
  const slug = params.alojamientoSlug;
  const data = await getAlojamientoDataBySlug(slug);

  if (!data || !data.alojamiento || data.alojamiento.length === 0) {
    return { title: 'Alojamiento no Encontrado' };
  }

  const alojamiento = data.alojamiento[0]; // Tomamos el primero del array
  const title = `${alojamiento.name} en ${data.municipio || params.municipio} | Destiplus`;
  const description = `Detalles, servicios y reserva de ${alojamiento.name}. ${alojamiento.detalle?.substring(0, 150) || 'Encuentra tu estadía ideal.'}...`;
  const imageUrl = alojamiento.img || '/placeholder-og-image.jpg'; // Imagen principal
  const canonicalUrl = `https://www.destiplus.com/destino/${params.municipio}/alojamiento/${slug}`; // Actualiza dominio

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      url: canonicalUrl,
      images: [{ url: imageUrl }],
      type: 'website', // O 'product.group' si aplica
    },
    alternates: { canonical: canonicalUrl },
  };
}

// --- (Opcional) generateStaticParams ---
// Si quieres generar estas páginas estáticamente, necesitas devolver todos los pares posibles
// export async function generateStaticParams() {
//   const paths = await fetchAllAlojamientoPaths(); // Necesitas crear esta función en la API lib
//   return paths.map(path => ({
//     municipio: path.municipio,
//     alojamientoSlug: path.alojamientoSlug,
//   }));
// }

// --- Componente de Página ---
export default async function AlojamientoDetailPage({ params }: AlojamientoDetailPageProps) {
  const slug = params.alojamientoSlug;
  console.log(`Server: Rendering AlojamientoDetailPage for slug (${slug}) in municipio (${params.municipio})`);

  const initialData = await getAlojamientoDataBySlug(slug);

  if (!initialData) {
    console.log(`Server: Alojamiento not found for slug: ${slug}. Triggering 404.`);
    notFound();
  }

  console.log(`Server: Alojamiento data received for ${initialData.alojamiento[0].name}. Rendering client component.`);

  // Renderiza el componente cliente pasando los datos
  // No necesitamos pasar municipio/slug como props separadas si ya están en initialData
  return <AlojamientoProfile initialData={initialData} />;
}