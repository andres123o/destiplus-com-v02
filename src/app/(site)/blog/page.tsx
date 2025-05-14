// src/app/(site)/blog/page.tsx
import React from 'react';
import ArticlesHome from '@/components/features/blog/homeBlog'; // Importamos el componente principal

// Metadata (opcional pero recomendado para SEO)
import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Blog | Destiplus - Descubre Suesca y Alrededores',
  description: 'Ideas, guías y secretos de Suesca, Sesquilé y los tesoros cerca de Bogotá. Encuentra inspiración para tu próximo viaje.',
  // Añade más metadatos si es necesario (OpenGraph, etc.)
};


// La página simplemente renderiza el componente principal
export default function BlogPage() {
  return <ArticlesHome />;
}