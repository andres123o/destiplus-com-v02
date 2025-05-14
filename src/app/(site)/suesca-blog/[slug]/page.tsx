// src/app/(site)/blog/[slug]/page.tsx
import React from 'react';
import type { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';

import ArticlePageClient from '@/components/features/blog/blog-individual';
import type { ArticleData } from '@/types/blogIndivdual'; // Importa desde tu archivo de tipos
import { getArticleDataBySlug } from '@/lib/api-blogIndividual'; // Importa desde tu "API" de prueba

type Props = {
  params: { slug: string };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = params.slug;
  const article = await getArticleDataBySlug(slug);

  if (!article) {
    return {
      title: 'Artículo no encontrado | Destiplus',
      description: 'El artículo que buscas no existe o ha sido movido.',
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.destiplus.com';
  const ogImages = article.heroImageUrl ? [{ url: article.heroImageUrl, width: 1200, height: 630, alt: article.heroImageAlt }] : [];

  return {
    title: `${article.title} | Destiplus Blog`,
    description: article.metaDescription || article.excerpt,
    keywords: article.keywords || [article.category.toLowerCase(), ...article.title.toLowerCase().split(' ').slice(0,5)], // Primeras 5 palabras del título
    openGraph: {
      title: `${article.title} | Destiplus Blog`,
      description: article.metaDescription || article.excerpt,
      url: `${siteUrl}/blog/${article.slug}`, // Ajusta si tu ruta base es diferente (ej. /suesca-blog/)
      type: 'article',
      publishedTime: article.publicationDate, // Debe ser formato ISO 8601 (YYYY-MM-DDTHH:mm:ssZ)
      modifiedTime: article.publicationDate, // O una fecha de última modificación
      authors: [article.author], // Puedes poner la URL de un perfil de autor si lo tienes
      section: article.category, // La categoría del artículo
      tags: article.keywords,    // Puedes usar las keywords como tags también
      images: ogImages,
    },
    twitter: {
        card: 'summary_large_image',
        title: `${article.title} | Destiplus Blog`,
        description: article.metaDescription || article.excerpt,
        images: ogImages,
        // site: '@tuUsuarioTwitter', // Opcional: tu usuario de Twitter
        // creator: '@usuarioAutorTwitter', // Opcional: usuario del autor si lo tienes
    },
    alternates: { // URL Canónica
        canonical: `/suesca-blog/${article.slug}`, // Ajusta si tu ruta base es diferente
    }
  };
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const articleData = await getArticleDataBySlug(params.slug);

  if (!articleData) {
    notFound();
  }

  return <ArticlePageClient article={articleData} />;
}