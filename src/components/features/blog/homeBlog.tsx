// src/app/(site)/blog/ArticlesHome.tsx
'use client'; // Añadido por si implementas interacciones futuras aquí

import React from 'react';
import Link from 'next/link';
import { CldImage } from 'next-cloudinary';
import Header from "@/components/features/home/header";
// Asumiendo que tienes Font Awesome configurado o usarás otros iconos
// import '@fortawesome/fontawesome-free/css/all.min.css'; // Si usas Font Awesome

// --- Datos de Ejemplo (Reemplazar con fetching real) ---
const sampleArticles = [
    { slug: 'descubre-las-mejores-rutas-de-escalada-en-suesca', title: 'Descubre las Mejores Rutas de Escalada en Suesca para Principiantes y Expertos', category: 'Actividades', imageUrl: 'https://res.cloudinary.com/destinoplus/image/upload/v1734236561/cajbjyr4g2g7oizfgweu.jpg', excerpt: 'Suesca es la meca de la escalada en Colombia. Te mostramos las rutas imperdibles...' },
    { slug: 'alojamientos-con-encanto-cerca-a-bogota', title: 'Alojamientos con Encanto en Suesca y Sesquilé: Escapadas Perfectas Cerca a Bogotá', category: 'Alojamientos', imageUrl: 'https://res.cloudinary.com/destinoplus/image/upload/v1733937504/alojamientos/casona-quesada/e2pi6ecstwuou0ghf7xa.jpg', excerpt: 'Encuentra cabañas, glamping y hoteles boutique para una experiencia inolvidable...' },
    { slug: 'miradores-secretos-paisajes-ocultos-suesca', title: 'Miradores Secretos y Paisajes Ocultos que Debes Explorar en Suesca', category: 'Rutas y Paisajes', imageUrl: 'https://res.cloudinary.com/destinoplus/image/upload/v1736911873/rutas/la-lucirnaga/wlzdyxviuowjjyexjelq.jpg', excerpt: 'Más allá de las rocas, Suesca esconde vistas panorámicas que te dejarán sin aliento...' },
    // Puedes añadir más artículos aquí si quieres mostrar más recientes
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
            crop="fill" // Asegura que la imagen cubra, puede recortar
            gravity="center" // Centra el recorte
            style={{ objectFit: 'cover' }}
            className="article-card-image" // Para transiciones CSS
            loading="lazy" // Carga diferida
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


// --- Componente Principal de la Home del Blog (Rediseñado) ---
export default function ArticlesHome() {

    // Obtenemos solo los artículos necesarios para la vista previa
    const recentArticles = sampleArticles.slice(0, 3); // Mostrar solo los 3 más recientes
    const currentYear = new Date().getFullYear();

    return (
        <>
            <Header />
            <div className="blog-header-hero">
                {/* CldImage para el fondo */}
                <CldImage
                    src={'https://res.cloudinary.com/destinoplus/image/upload/v1733787476/restaurantes/zfikrmhjh6e0hizcth2o.jpg'} // URL de tu imagen en Cloudinary
                    alt="Paisaje inspirador del blog de Destiplus" // Texto alternativo descriptivo
                    fill // Hace que la imagen rellene el contenedor padre (.blog-header-hero)
                    crop="fill" // Similar a background-size: cover
                    gravity="center" // Centra la imagen si se recorta
                    quality="auto"
                    fetchPriority="high" // Prioriza la carga de esta imagen LCP (Largest Contentful Paint)
                    sizes="100vw" // Si el hero siempre va a ocupar el ancho de la ventana
                    className="blog-header-hero-image" // Clase para aplicar z-index y object-fit
                />
                <div className="blog-header-overlay"></div>
                <div className="blog-header-content">
                    <h1 className="blog-title">Descubre <span className="highlight-plus">Destiplus</span> Blog</h1>
                    <p className="blog-subtitle">
                    Ideas, guías y secretos de Suesca, Sesquilé y los tesoros cerca de Bogotá.
                    </p>
                </div>
            </div>
            
            <div className="blog-page-container">
                {/* Sección: Últimos Artículos */}
                <section className="recent-articles-section">
                    <h2 className="section-title-article">Últimos Artículos</h2>
                    {recentArticles && recentArticles.length > 0 ? (
                        <div className="article-grid recent-articles-grid">
                            {recentArticles.map((article) => (
                                <Link key={article.slug} href={`/suesca-blog/${article.slug}`} className="article-card-link">
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
                </section>
            </div>


            <footer className="site-footer">
                <div className="footer-content-container">
                    {/* Sección superior opcional del footer */}
                    <div className="footer-promo-section">
                    <h2>¿Listo para tu próxima aventura?</h2>
                    <p>Descubre los tesoros escondidos de Suesca, Sesquilé y sus alrededores.</p>
                    <Link href="https://www.destiplus.com/" className="promo-button">
                        Explora Destinos
                    </Link>
                    </div>

                    <div className="footer-main">
                    <div className="footer-column footer-about">
                        <h4 className="footer-logo">
                        Desti<span className="highlight-plus">plus</span>
                        </h4>
                        <p>
                        Tu guía para experiencias inolvidables cerca a Bogotá.
                        Aventura, cultura y naturaleza te esperan.
                        </p>
                    </div>

                    <div className="footer-column footer-links">
                        <h5>Enlaces Rápidos</h5>
                        <ul>
                        <li><Link href="https://www.destiplus.com/">Home</Link></li>
                        <li><Link href="https://www.destiplus.com/destino/Suesca">Suesca</Link></li>
                        <li><Link href="https://www.destiplus.com/destino/Sesquile">Sesquilé</Link></li>
                        </ul>
                    </div>
                    <div className="footer-column footer-legal">
                        <h5>Legal</h5>
                        <ul>
                        <li><Link href="/politica-de-privacidad">Política de Privacidad</Link></li>
                        <li><Link href="/terminos-y-condiciones">Términos y Condiciones</Link></li>
                        <li><Link href="/contacto">Contacto</Link></li>
                        </ul>
                    </div>

                    <div className="footer-column footer-social">
                        <h5>Síguenos</h5>
                        <div className="social-icons">
                        <a href="https://www.instagram.com/desti.plus/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                            <i className="fab fa-instagram"></i>
                        </a>
                        <a href="https://www.tiktok.com/@desti.plus" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                            <i className="fab fa-tiktok"></i>
                        </a>
                        {/* Añade más redes si es necesario */}
                        </div>
                    </div>
                    </div>

                    <div className="footer-bottom">
                    <p>&copy; {currentYear} Destiplus. Todos los derechos reservados.</p>
                    <p>Diseñado con <i className="fas fa-heart" style={{ color: 'var(--primary-color)' }}></i> en Suesca, Colombia.</p>
                    </div>
                </div>
            </footer>
        </> // Fin de blog-page-container
    );
}