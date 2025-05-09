import React from 'react';
import { fetchRestauranteListById } from '@/lib/api-listadoRestaurantes'; // API de restaurantes
import type { RestauranteListItem } from '@/types/listadoRestaurantes'; // O @/types/restaurante
import ListadoRestaurantesClient from '@/components/features/restaurantes/listadoRestaurantes'; // Componente Cliente
import type { Metadata } from 'next';

interface RestaurantesListPageProps {
  params: { municipio: string }; // Recibe nombre/slug municipio
}

// --- Metadata Dinámica ---
export async function generateMetadata(
  { params }: RestaurantesListPageProps
): Promise<Metadata> {
  const municipioName = decodeURIComponent(params.municipio);
  const title = `Restaurantes en ${municipioName} | Destiplus`;
  const description = `Descubre dónde comer en ${municipioName}. Encuentra los mejores restaurantes, precios y ambientes.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://www.destiplus.com/destino/${params.municipio}/restaurantes`, // URL Canónica
    },
     alternates: { canonical: `https://www.destiplus.com/destino/${params.municipio}/restaurantes` }
  };
}


// --- Componente de Página ---
export default async function RestaurantesListPage({ params }: RestaurantesListPageProps) {
  const municipioParam = params.municipio; // Puede ser nombre o slug
  console.log(`Server: Rendering RestaurantesListPage for municipio (${municipioParam})`);

  const destinoId = municipioParam === "Suesca" ? 1 : municipioParam === "Sesquile" ? 2 : "";

  // 2. Obtener lista de restaurantes usando el ID
  const initialRestaurantes = await fetchRestauranteListById(destinoId);

  // 3. Filtrar inválidos en servidor
  const filtrarRestaurantesValidos = (data: RestauranteListItem[]): RestauranteListItem[] => {
      return data.filter(restaurante =>
          restaurante.name && restaurante.name !== "Pendiente" &&
          restaurante.img &&
          restaurante.logo
      );
  };
  const validRestaurantes = filtrarRestaurantesValidos(initialRestaurantes);

  console.log(`Server: Received ${validRestaurantes.length} valid restaurantes for ${municipioParam}. Rendering client component.`);

  // Renderiza el componente cliente
  return (
      <ListadoRestaurantesClient
          initialRestaurantes={validRestaurantes}
          municipio={municipioParam} // Pasa el nombre real
      />
  );
}