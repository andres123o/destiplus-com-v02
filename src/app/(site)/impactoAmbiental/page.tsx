// app/(site)/impactoAmbiental/page.tsx
import React from 'react';
import { fetchImpactoData } from '@/lib/api-impactoAmbiental';
import ImpactoAmbientalClient from '@/components/features/impactoAmbiental/impactoAmbiental';
import type { ImpactoData } from '@/types/ImpactoData'; // Importa el tipo

// Opcional: Metadata para SEO
export const metadata = {
  title: 'Impacto Ambiental - Destiplus',
  description: 'Descubre cómo tus viajes con Destiplus ayudan a reforestar y a construir un futuro más verde.',
};

// La página es un Async Server Component
export default async function ImpactoAmbientalPage() {
  let initialData: ImpactoData | null = null;
  let error: string | null = null;

  try {
    // Espera a que los datos se carguen en el servidor
    initialData = await fetchImpactoData();
  } catch (err) {
    console.error("Error fetching data for page:", err);
    if (err instanceof Error) {
        error = err.message; // Pasamos el mensaje de error al cliente
    } else {
        error = 'Ocurrió un error desconocido al cargar los datos.';
    }
    // Si ocurre un error aquí, podrías usar error.tsx para mostrar un error de página completa
    // o pasar el error al componente cliente como estamos haciendo aquí.
  }

  // Renderiza el componente cliente, pasándole los datos o el error
  return (
    <ImpactoAmbientalClient initialData={initialData} error={error} />
  );
}

// Opcional: Puedes añadir loading.tsx y error.tsx en esta carpeta
// para manejar esos estados de forma nativa en Next.js mientras
// se espera la data en el servidor.