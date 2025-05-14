// src/components/features/blog/single-article/ArticlePageClient.tsx
'use client';

import React, { useState, useEffect, ElementType } from 'react';
import Link from 'next/link';
import { CldImage } from 'next-cloudinary';

import Header from '@/components/features/home/header'; // Ajusta ruta si es necesario
// Si vas a usar CSS global desde src/style/blog/blog-individual.css:
// NO necesitas la siguiente línea:
// import styles from './single-article.module.css'; 
import type { ArticleData } from '@/types/blogIndivdual'; // Importa el tipo desde tu archivo centralizado

// Componente para renderizar el contenido dinámicamente
const ArticleContentRenderer = ({ contentItem }: { contentItem: ArticleData['content'][0] }) => {
  // Usa nombres de clase globales directamente si no usas CSS Modules aquí
  switch (contentItem.type) {
    case 'paragraph':
      return <p className="article-paragraph">{contentItem.text}</p>; // Sin 'styles.'
    case 'heading':
      const Tag = `h${contentItem.level}` as ElementType;
      return <Tag className={`article-heading-${contentItem.level}`}>{contentItem.text}</Tag>; // Sin 'styles.'
    case 'image':
      return (
        <figure className="article-inline-image-figure"> {/* Sin 'styles.' */}
          <CldImage
            src={contentItem.url || ''}
            alt={contentItem.alt || 'Imagen del artículo'}
            width={800} height={500} crop="fill" gravity="center" quality="auto"
            className="article-inline-image" // Sin 'styles.'
          />
          {contentItem.caption && <figcaption className="article-image-caption">{contentItem.caption}</figcaption>} {/* Sin 'styles.' */}
        </figure>
      );
    case 'list':
      return (
        <ul className="article-list"> {/* Sin 'styles.' */}
          {contentItem.items?.map((item: string, index: number) => (<li key={index}>{item}</li>))}
        </ul>
      );
    case 'quote': // Nuevo tipo de contenido
      return <blockquote className="article-blockquote"><p>{contentItem.text}</p>{contentItem.cite && <cite>{contentItem.cite}</cite>}</blockquote>;
    // Añade más casos según tu tipo ArticleData
    default: return null;
  }
};

interface ArticlePageClientProps {
  article: ArticleData;
}

const ArticlePageClient: React.FC<ArticlePageClientProps> = ({ article }) => {
  const [currentClientUrl, setCurrentClientUrl] = useState<string>('');

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentClientUrl(window.location.href);
    }
  }, []);

  const handleCopyLink = () => {
    if (currentClientUrl) {
      navigator.clipboard.writeText(currentClientUrl)
        .then(() => alert('¡Enlace copiado al portapapeles!'))
        .catch(err => {
          console.error('Error al copiar el enlace: ', err);
          alert('Error al copiar el enlace.');
        });
    }
  };

  if (!article) {
    return <div>Artículo no encontrado.</div>;
  }

  const encodedTitle = encodeURIComponent(article.title);
  const encodedCurrentClientUrl = encodeURIComponent(currentClientUrl);
  
  // Formatear fecha para mostrar (si tienes displayDate, úsalo, si no, formatea publicationDate)
  const displayPublicationDate = article.displayDate || 
    new Date(article.publicationDate).toLocaleDateString('es-CO', { // Ajusta el locale como necesites
      year: 'numeric', month: 'long', day: 'numeric' 
    });


  return (
    <>
      <Header />
      <main>
        <article className="article-page-container"> {/* Sin 'styles.' */}
          {/* CABECERA DEL ARTÍCULO */}
          <header className="article-header"> {/* Sin 'styles.' */}
            <div className="article-header-image-wrapper"> {/* Sin 'styles.' */}
              <CldImage
                src={article.heroImageUrl}
                alt={article.heroImageAlt}
                fill
                crop="fill"
                gravity="center"
                quality="auto"
                fetchPriority="high"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1200px"
                className="article-header-image" // Sin 'styles.'
              />
              <div className="article-header-overlay"></div> {/* Sin 'styles.' */}
            </div>
            <div className="article-header-content"> {/* Sin 'styles.' */}
              <span className="article-category-badge">{article.category}</span> {/* Sin 'styles.' */}
              <h1 className="article-title">{article.title}</h1> {/* Sin 'styles.' */}
              <div className="article-meta"> {/* Sin 'styles.' */}
                <span>Por {article.author}</span>
                <span>&bull;</span>
                <span>{displayPublicationDate}</span>
                <span>&bull;</span>
                <span>{article.readingTime}</span>
              </div>
            </div>
          </header>

          {/* CUERPO DEL ARTÍCULO */}
          <div className="article-body"> {/* Sin 'styles.' */}
            <div className="main-content-column"> {/* Sin 'styles.' */}
              {article.content.map((contentItem, index) => (
                <ArticleContentRenderer key={index} contentItem={contentItem} />
              ))}
            </div>
          </div>
          
          {/* BOTONES DE COMPARTIR */}
          <section className="share-section"> {/* Sin 'styles.' */}
            <h3>¡Comparte esta aventura!</h3>
            <div className="share-buttons"> {/* Sin 'styles.' */}
              {currentClientUrl && (
                <>
                  <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodedCurrentClientUrl}`} className="share-button-facebook" target="_blank" rel="noopener noreferrer"> {/* Sin 'styles.' */}
                    <i className="fab fa-facebook-f"></i> Facebook
                  </a>
                  <a href={`https://twitter.com/intent/tweet?url=${encodedCurrentClientUrl}&text=${encodedTitle}`} className="share-button-twitter" target="_blank" rel="noopener noreferrer"> {/* Sin 'styles.' */}
                    <i className="fab fa-twitter"></i> Twitter
                  </a>
                  <a href={`https://wa.me/?text=${encodedTitle}%20${encodedCurrentClientUrl}`} className="share-button-whatsapp" target="_blank" rel="noopener noreferrer"> {/* Sin 'styles.' */}
                    <i className="fab fa-whatsapp"></i> WhatsApp
                  </a>
                </>
              )}
              <button onClick={handleCopyLink} className="share-button-copy-link"> {/* Sin 'styles.' */}
                <i className="fas fa-link"></i> Copiar Enlace
              </button>
            </div>
          </section>

          {/* ARTÍCULOS RELACIONADOS */}
          {article.relatedArticles && article.relatedArticles.length > 0 && (
            <section className="related-articles-section"> {/* Sin 'styles.' */}
              <h2 className="related-articles-title">También te podría interesar</h2> {/* Sin 'styles.' */}
              <div className="related-articles-grid"> {/* Sin 'styles.' */}
                {article.relatedArticles.map(related => (
                  <Link href={`/suesca-blog/${related.slug}`} key={related.slug} className="related-article-card"> {/* Sin 'styles.' */}
                    <CldImage
                      src={related.imageUrl}
                      alt={related.title}
                      width={400} height={250} crop="fill" gravity="center"
                      className="related-article-image" // Sin 'styles.'
                    />
                    <h5 className="related-article-card-title">{related.title}</h5> {/* Sin 'styles.' */}
                  </Link>
                ))}
              </div>
            </section>
          )}
        </article>
      </main>
    </>
  );
};

export default ArticlePageClient;