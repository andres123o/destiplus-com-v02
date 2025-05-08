// app/(site)/destino/[municipio]/bares/page.tsx

import React from 'react';
import { notFound } from 'next/navigation';
import { fetchBarListById } from '@/lib/api-listadoBares';         // API de bares
import type { BarListItem } from '@/types/ListadoBar';        // O @/types/bar
import ListadoBaresClient from '@/components/features/bares/ListadoBaresClient'; // Componente Cliente
import type { Metadata } from 'next';

interface BaresListPageProps {
  params: { municipio: string }; // Recibe nombre/slug del municipio
}

// --- Metadata Dinámica ---
export async function generateMetadata(
  { params }: BaresListPageProps
): Promise<Metadata> {
  const municipioName = decodeURIComponent(params.municipio);
  const title = `Bares y Cafés en ${municipioName} | Destiplus`;
  const description = `Encuentra los mejores bares y cafés en ${municipioName} para disfrutar con amigos.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://www.destiplus.com/destino/${params.municipio}/bares`, // URL Canónica
    },
    alternates: { canonical: `https://www.destiplus.com/destino/${params.municipio}/bares` }
  };
}


// --- Componente de Página ---
export default async function BaresListPage({ params }: BaresListPageProps) {
  const municipioParam = params.municipio;
  console.log(`Server: Rendering BaresListPage for municipio (${municipioParam})`);


  const destinoId = municipioParam == 'Suesca' ? 1 : municipioParam == 'Sesquile' ? 2 : "";

  // 2. Obtener lista de bares usando el ID
  const initialBares = await fetchBarListById(destinoId);

  // 3. Filtrar inválidos en servidor
  const filtrarBaresValidos = (data: BarListItem[]): BarListItem[] => {
      return data.filter(bar =>
          bar.name && bar.name !== "Pendiente" &&
          bar.img &&
          bar.logo
      );
  };
  const validBares = filtrarBaresValidos(initialBares);

  console.log(`Server: Received ${validBares.length} valid bares for ${municipioParam}. Rendering client component.`);

  // Renderiza el componente cliente
  return (
      <ListadoBaresClient
          initialBares={validBares}
          municipio={municipioParam} // Pasa el nombre real
      />
  );
}