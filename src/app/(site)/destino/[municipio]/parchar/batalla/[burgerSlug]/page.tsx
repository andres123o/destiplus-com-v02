// app/(site)/burger-profile/[burgerId]/page.tsx

import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import BurgerProfileClient from '@/components/features/eventos/no-fijos/perfil-burguer'; // Ajusta ruta al cliente

interface BurgerProfilePageProps {
  params: { burgerSlug: string };
}

// --- Metadata Dinámica (lee de datos hardcodeados) ---
export async function generateMetadata(
  { params }: BurgerProfilePageProps
): Promise<Metadata> {
  const burgerIdNum = parseInt(params.burgerSlug, 10);


  const title = ` Batalla de Hamburguesas en Suesca, la mejor de la región.`;
  const description = `Descubre las mejores burger de Suesca, la propuesta Suescana para la Batalla de Hamburguesas. Ingredientes: panela, mango, maduro, lulo, piña, naranja, champiñones, café, vino, maracuyá, uchuva, maíz, frutos rojos y pimentón.`;
  // Construye URL de Cloudinary para OG image (asegúrate que NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME esté definido)
  const ogImageUrl = `https://res.cloudinary.com/destinoplus/image/upload/v1746721138/dcyghr6nulheihralqbg.jpg`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://www.destiplus.com/destino/Suesca/parchar/batalla/${burgerIdNum}`,
    },
    openGraph: {
      title: `Vota por ${burgerIdNum} en la Batalla de Hamburguesas!`,
      url: `https://www.destiplus.com/destino/Suesca/parchar/batalla/${burgerIdNum}`,
      type: 'article',
    },
  };
}


// --- Componente de Página ---
export default function BurgerProfilePage({ params }: BurgerProfilePageProps) {
  console.log(`Server: Rendering BurgerProfilePage for burgerId (${params.burgerSlug})`);


  // Renderiza el componente cliente, pasándole solo el ID
  return <BurgerProfileClient burgerId={params.burgerSlug} />;
}