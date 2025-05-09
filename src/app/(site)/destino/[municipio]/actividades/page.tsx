import React from 'react';
import { fetchActividadListById } from '@/lib/api-listadoActividades'; // API de actividades
import type { ActividadListItem } from '@/types/listadoActividades'; // O @/types/actividad
import ListadoActividadesClient from '@/components/features/actividades/listadoActividades'; // Componente Cliente
import type { Metadata } from 'next';

interface ActividadesListPageProps {
  params: { municipio: string }; // Recibe nombre/slug municipio
}

// --- Metadata Dinámica ---
export async function generateMetadata(
  { params }: ActividadesListPageProps
): Promise<Metadata> {
  const municipioName = decodeURIComponent(params.municipio); // Decodifica por si acaso
  const title = `Actividades en ${municipioName} | Destiplus`;
  const description = `Encuentra las mejores actividades y experiencias en ${municipioName}: Caminatas, escalada, aventura y más.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://www.destiplus.com/destino/${params.municipio}/actividades`,
    },
  };
}


// --- Componente de Página ---
export default async function ActividadesListPage({ params }: ActividadesListPageProps) {
  const municipioParam = params.municipio;
  console.log(`Server: Rendering ActividadesListPage for municipio (${municipioParam})`);


  const destinoId = municipioParam === "Suesca" ? 1 : municipioParam === "Sesquile" ? 2 : "";

  console.log(`Server: Found Destino ID ${destinoId} for ${municipioParam}. Fetching actividades...`);

  // 2. Obtener lista de actividades usando el ID
  const initialActividades = await fetchActividadListById(destinoId);

  // 3. Filtrar inválidos en servidor
  const filtrarActividadesValidas = (data: ActividadListItem[]): ActividadListItem[] => {
      return data.filter(actividad =>
          actividad.name && actividad.name !== "Pendiente" &&
          actividad.img &&
          actividad.logo
      );
  };
  const validActividades = filtrarActividadesValidas(initialActividades);

  console.log(`Server: Received ${validActividades.length} valid actividades for ${municipioParam}. Rendering client component.`);

  // Renderiza el componente cliente
  return (
      <ListadoActividadesClient
          initialActividades={validActividades}
          municipio={municipioParam} // Pasa el nombre real
      />
  );
}