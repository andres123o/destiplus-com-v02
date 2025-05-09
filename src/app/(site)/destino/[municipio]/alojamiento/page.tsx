import React from 'react';
import { fetchAlojamientoListById } from '@/lib/api-listaAlojamientos'; // Función para obtener alojamientos por ID
import type { AlojamientoListItem } from '@/types/listadoAlojamiento';
import ListadoAlojamientoClient from '@/components/features/alojamientos/listaAlojamientos'; // Importa el componente cliente
import type { Metadata } from 'next';



// --- Metadata Dinámica ---
export async function generateMetadata(
  { params }: { params: Promise<{ municipio: string }>}
): Promise<Metadata> {
  const { municipio: municipioRaw } = await params
  const municipioName = decodeURIComponent(municipioRaw); // Decodifica por si acaso
  const title = `Alojamientos en ${municipioName} | Destiplus`;
  const description = `Encuentra los mejores lugares para hospedarte en ${municipioName}. Hoteles, hostales, glamping y más.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://www.destiplus.com/destino/${params.municipio}/alojamientos`,
      // images: [...]
    },
  };
}

// --- Componente de Página ---
export default async function AlojamientosListPage(
  { params }: { params: Promise<{ municipio: string }>}
) {
  const { municipio: municipioParam } = await params; // Puede ser slug o nombre codificado
  console.log(`Server: Rendering AlojamientosListPage for municipio (${municipioParam})`);


  const destinoId = municipioParam === "Suesca" ? 1 : municipioParam === "Sesquile" ? 2 : "";

  console.log(`Server: Found Destino ID ${destinoId} for ${municipioParam}. Fetching alojamientos...`);

  // 2. Obtener lista de alojamientos usando el ID encontrado
  const initialAlojamientos = await fetchAlojamientoListById(destinoId);

  // 3. (Opcional pero recomendado) Filtrar inválidos en servidor
  const filtearAlojamientosValidos = (data: AlojamientoListItem[]): AlojamientoListItem[] => {
      return data.filter(alojamiento =>
          alojamiento.name && alojamiento.name !== "Pendiente" &&
          alojamiento.img //&& // ¿Realmente necesitas filtrar por logo aquí?
          // alojamiento.logo
      );
  };
  const validAlojamientos = filtearAlojamientosValidos(initialAlojamientos);

  console.log(`Server: Received ${validAlojamientos.length} valid alojamientos for ${municipioParam}. Rendering client component.`);

  // Renderiza el componente cliente
  return (
      <ListadoAlojamientoClient
          initialAlojamientos={validAlojamientos}
          municipio={municipioParam} // Pasa el nombre real del municipio
      />
  );
}