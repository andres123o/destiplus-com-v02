// src/lib/types.ts

export interface ArticleData {
    slug: string;
    title: string;
    category: string;
    author: string;
    publicationDate: string; // Ejemplo: "2025-05-15" (formato ISO 8601 recomendado para datos)
    displayDate?: string;   // Ejemplo: "15 de Mayo, 2025" (para mostrar al usuario)
    readingTime: string;   // Ejemplo: "8 min de lectura"
    heroImageUrl: string;
    heroImageAlt: string;
    excerpt: string; // Breve descripción para listados y metadatos <meta> y OG
    metaDescription?: string; // Opcional, si quieres una meta descripción diferente al excerpt
    keywords?: string[];
    content: Array<{
      type: 'paragraph' | 'heading' | 'image' | 'list' | 'quote' | 'codeblock'; // Añade más tipos según necesites
      text?: string;
      level?: 2 | 3 | 4 | 5 | 6; // Solo para 'heading'
      language?: string; // Solo para 'codeblock'
      url?: string;             // Solo para 'image'
      alt?: string;             // Solo para 'image'
      caption?: string;         // Solo para 'image'
      items?: string[];         // Solo para 'list'
      cite?: string;            // Solo para 'quote'
    }>;
    relatedArticles?: Array<{
      slug: string;
      title: string;
      imageUrl: string;
      category?: string; // Opcional
    }>;
  }
  