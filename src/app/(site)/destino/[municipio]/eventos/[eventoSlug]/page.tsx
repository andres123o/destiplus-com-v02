import React from 'react';
import { notFound } from 'next/navigation';
import { getEventoDataBySlug } from '@/lib/api-eventoProfile';
import EventoProfile from '@/components/features/eventos/eventoProfile'; // Ajusta ruta
import type { Metadata } from 'next';

// --- Metadata Dinámica ---
export async function generateMetadata(
  { params }: { params: Promise<{ eventoSlug: string, municipio: string }> }
): Promise<Metadata> {
  const { eventoSlug: slug, municipio } = await params
  const data = await getEventoDataBySlug(slug);

  if (!data || !data.evento || data.evento.length === 0) {
    return { title: 'Evento no Encontrado' };
  }

  const evento = data.evento[0];
  const title = `${evento.name || 'Evento'} | Destiplus`;
  const description = `Detalles del evento ${evento.name}: ${evento.itinerario?.substring(0, 150) || 'Participa en esta increíble experiencia.'}...`;
  const canonicalUrl = `https://www.destiplus.com/destino/${municipio}/eventos/${slug}`; // Actualiza dominio

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
export default async function EventoDetailPage(
  { params }: { params: Promise<{ eventoSlug: string, municipio: string }> }
) {
  const { eventoSlug: slug, municipio } = await params
  console.log(`Server: Rendering EventoDetailPage for slug (${slug}, ${municipio})`);

  const initialData = await getEventoDataBySlug(slug);

  if (!initialData) {
    console.log(`Server: Evento not found for slug: ${slug}. Triggering 404.`);
    notFound();
  }

   console.log(`Server: Evento data received for ${initialData.evento[0]?.name}. Rendering client component.`);
   return <EventoProfile initialData={initialData} />;
}