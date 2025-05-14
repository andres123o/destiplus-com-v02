// src/app/(site)/blog/page.tsx
import React from 'react';
import ArticlesHome from '@/components/features/blog/homeBlog'; // Importamos el componente principal

// Metadata (opcional pero recomendado para SEO)
import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Blog | Destiplus - Descubre Suesca y Alrededores',
  description: 'Ideas, guías y secretos de Suesca, Sesquilé y los tesoros cerca de Bogotá. Encuentra inspiración para tu próximo viaje.',
  openGraph: {
    title: 'Blog | Destiplus - Descubre Suesca y Alrededores',
    description: 'Ideas, guías y secretos de Suesca, Sesquilé y los tesoros cerca de Bogotá. Encuentra inspiración para tu próximo viaje.',
    url: 'https://www.destiplus.com/suesca-blog',
    images: [{ url: 'https://res.cloudinary.com/destinoplus/image/upload/v1737306298/x7txklnm5pjlbzsxedqv.jpg' }],
 },
};


// La página simplemente renderiza el componente principal
export default function BlogPage() {
  return <ArticlesHome />;
}