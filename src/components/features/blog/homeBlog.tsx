// src/app/(site)/blog/ArticlesHome.tsx
'use client'; // Añadido por si implementas interacciones futuras aquí

import React from 'react';
import Link from 'next/link';
import { CldImage } from 'next-cloudinary';
// Asumiendo que tienes Font Awesome configurado o usarás otros iconos
// import '@fortawesome/fontawesome-free/css/all.min.css'; // Si usas Font Awesome

// --- Datos de Ejemplo (Reemplazar con fetching real) ---
const sampleArticles = [
    { slug: 'descubre-las-mejores-rutas-de-escalada-en-suesca', title: 'Descubre las Mejores Rutas de Escalada en Suesca para Principiantes y Expertos', category: 'Actividades', imageUrl: 'https://res.cloudinary.com/destinoplus/image/upload/v1734236561/cajbjyr4g2g7oizfgweu.jpg', excerpt: 'Suesca es la meca de la escalada en Colombia. Te mostramos las rutas imperdibles...' },
    { slug: 'alojamientos-con-encanto-cerca-a-bogota', title: 'Alojamientos con Encanto en Suesca y Sesquilé: Escapadas Perfectas Cerca a Bogotá', category: 'Alojamientos', imageUrl: 'https://res.cloudinary.com/destinoplus/image/upload/v1733937504/alojamientos/casona-quesada/e2pi6ecstwuou0ghf7xa.jpg', excerpt: 'Encuentra cabañas, glamping y hoteles boutique para una experiencia inolvidable...' },
    { slug: 'miradores-secretos-paisajes-ocultos-suesca', title: 'Miradores Secretos y Paisajes Ocultos que Debes Explorar en Suesca', category: 'Rutas y Paisajes', imageUrl: 'https://res.cloudinary.com/destinoplus/image/upload/v1736911873/rutas/la-lucirnaga/wlzdyxviuowjjyexjelq.jpg', excerpt: 'Más allá de las rocas, Suesca esconde vistas panorámicas que te dejarán sin aliento...' },
    // Puedes añadir más artículos aquí si quieres mostrar más recientes
];

// --- Categorías Destacadas (Para las tarjetas visuales) ---
const featuredCategories = [
    { name: 'Aventuras', slug: 'actividades', imageUrl: 'https://res.cloudinary.com/destinoplus/image/upload/v1734234353/lkimdcu2qrowjwt4dcct.jpg', iconClass: 'fas fa-hiking' }, // Reemplaza con tus URLs reales
    { name: 'Alojamientos', slug: 'alojamientos', imageUrl: 'https://res.cloudinary.com/destinoplus/image/upload/v1734990366/gw9pwqit2yymx8peyj3e.jpg', iconClass: 'fas fa-bed' },
    { name: 'Rutas y Paisajes', slug: 'rutas-y-paisajes', imageUrl: 'https://res.cloudinary.com/destinoplus/image/upload/v1737039685/rutas/las-tres-viejas/dzutjgpjps467997u5fm.jpg', iconClass: 'fas fa-map-marked-alt' },
    { name: 'Sabores Únicos', slug: 'restaurantes', imageUrl: 'https://res.cloudinary.com/destinoplus/image/upload/v1736722535/restaurantes/nixcal/iiwpzg8z9mtqpqaa2vi0.jpg', iconClass: 'fas fa-utensils' },
];

// --- Componente Tarjeta de Artículo ---
interface ArticleCardProps {
  title: string;
  imageUrl: string;
  category: string;
  excerpt: string;
}
const ArticleCard: React.FC<ArticleCardProps> = ({ title, imageUrl, category, excerpt }) => {
  return (
    <div className="article-card">
       <div className="article-card-image-wrapper">
         <CldImage
            src={imageUrl}
            alt={title}
            fill // Rellena el contenedor
            // Usar 'crop' y 'gravity' o 'style' con 'objectFit', elige uno:
            // Opción 1:
            crop="fill" // Asegura que la imagen cubra, puede recortar
            gravity="center" // Centra el recorte
            // Opción 2 (si prefieres usar CSS object-fit via style prop):
            // style={{ objectFit: 'cover' }}
            className="article-card-image" // Para transiciones CSS
            loading="lazy" // Carga diferida
            // Considera añadir 'sizes' para optimización de imagen responsiva
            // sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
         <span className="article-card-category">{category}</span>
       </div>
       <div className="article-card-content">
         <h3 className="article-card-title">{title}</h3>
         <p className="article-card-excerpt">{excerpt}</p>
       </div>
     </div>
  );
};

// --- Componente: Tarjeta Visual de Categoría ---
interface CategoryHighlightCardProps {
    name: string;
    slug: string;
    imageUrl: string;
    iconClass: string; // Clases de Font Awesome u otro sistema de iconos
}
const CategoryHighlightCard: React.FC<CategoryHighlightCardProps> = ({ name, slug, imageUrl, iconClass }) => {
    return (
        <Link href={`/blog/categoria/${slug}`} className="category-highlight-card">
            <div className="category-highlight-image">
                <CldImage
                    src={imageUrl}
                    alt={name}
                    fill
                    // Elige una opción: style con objectFit o crop/gravity
                    // Opción 1:
                    style={{ objectFit: 'cover' }}
                    // Opción 2:
                    // crop="fill"
                    // gravity="center"
                    loading="lazy"
                    // sizes="(max-width: 768px) 50vw, 25vw" // Ajusta sizes según tu grid
                />
            </div>
            <div className="category-highlight-overlay"></div>
            <div className="category-highlight-content">
                {/* Asegúrate de tener FontAwesome u otro sistema de iconos configurado */}
                <i className={iconClass}></i>
                <h4>{name}</h4>
            </div>
        </Link>
    );
};


// --- Componente Principal de la Home del Blog (Rediseñado) ---
export default function ArticlesHome() {

    // Obtenemos solo los artículos necesarios para la vista previa
    const recentArticles = sampleArticles.slice(0, 3); // Mostrar solo los 3 más recientes

    return (
        <div className="blog-page-container">
            {/* Encabezado del Blog */}
            <div className="blog-header">
                <h1 className="blog-title">Descubre <span className="highlight-plus">Destiplus</span> Blog</h1>
                <p className="blog-subtitle">
                    Ideas, guías y secretos de Suesca, Sesquilé y los tesoros cerca de Bogotá.
                </p>
            </div>

            {/* Sección: Explorar por Categoría */}
            <section className="category-highlight-section">
                <h2 className="section-title">Explora por Categoría</h2>
                <div className="category-highlight-grid">
                    {featuredCategories.map((category) => (
                        <CategoryHighlightCard
                            key={category.slug}
                            name={category.name}
                            slug={category.slug}
                            imageUrl={category.imageUrl}
                            iconClass={category.iconClass}
                        />
                    ))}
                </div>
            </section>

            {/* Sección: Últimos Artículos */}
            <section className="recent-articles-section">
                 <h2 className="section-title">Últimos Artículos</h2>
                {recentArticles && recentArticles.length > 0 ? (
                    <div className="article-grid recent-articles-grid">
                        {recentArticles.map((article) => (
                            <Link key={article.slug} href={`/blog/${article.slug}`} className="article-card-link">
                                <ArticleCard
                                    title={article.title}
                                    imageUrl={article.imageUrl}
                                    category={article.category}
                                    excerpt={article.excerpt}
                                />
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="no-articles-message">
                        <p>Pronto encontrarás nuevos artículos aquí.</p>
                    </div>
                )}
                 {/* Botón para ver todos los artículos */}
                <div className="view-all-button-container">
                    {/* Ajusta este enlace a la ruta correcta donde listarás todos los artículos */}
                    <Link href="/blog/articulos" className="view-all-btn">
                        <span>Ver Todos los Artículos</span>
                        {/* Asegúrate de tener FontAwesome u otro sistema de iconos */}
                        <i className="fas fa-arrow-right"></i>
                    </Link>
                </div>
            </section>

        </div> // Fin de blog-page-container
    );
}