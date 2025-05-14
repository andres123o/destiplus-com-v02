// src/lib/blogApi.ts
import type { ArticleData } from '@/types/blogIndivdual';

// --- DATOS DE PRUEBA COMPLETOS PARA ARTÍCULOS INDIVIDUALES ---
const ALL_SAMPLE_ARTICLES_DATA: ArticleData[] = [
  {
    slug: 'descubre-las-mejores-rutas-de-escalada-en-suesca',
    title: 'Descubre las Mejores Rutas de Escalada en Suesca para Principiantes y Expertos',
    category: 'Aventuras Épicas',
    author: 'Equipo Destiplus',
    publicationDate: '2025-05-15T10:00:00Z', // Formato ISO 8601 para datos
    displayDate: '15 de Mayo, 2025',      // Para mostrar
    readingTime: '8 min de lectura',
    heroImageUrl: 'https://res.cloudinary.com/destinoplus/image/upload/v1734236561/cajbjyr4g2g7oizfgweu.jpg',
    heroImageAlt: 'Escalador ascendiendo una imponente roca en Suesca bajo un cielo azul.',
    excerpt: 'Suesca es la meca de la escalada en Colombia. Te mostramos las rutas imperdibles, consejos de seguridad y por qué este destino es una experiencia transformadora para escaladores de todos los niveles.',
    metaDescription: 'Explora las mejores rutas de escalada en Suesca, Colombia. Consejos para principiantes y expertos, equipo necesario, seguridad y los paisajes más inolvidables. ¡Prepara tu aventura en Destiplus!',
    keywords: ['escalada suesca', 'rutas de escalada colombia', 'aventura cerca a bogotá', 'deportes extremos suesca', 'turismo aventura cundinamarca'],
    content: [
      { type: 'paragraph', text: 'Suesca, conocida como la cuna de la escalada en Colombia, ofrece un paraíso vertical para aventureros de todos los niveles. Desde imponentes paredes que desafían a los más experimentados hasta rutas amigables perfectas para quienes dan sus primeros pasos en este emocionante deporte, Suesca lo tiene todo. Prepárate para descubrir paisajes que te dejarán sin aliento y una conexión con la naturaleza que revitalizará tu espíritu.' },
      {
        type: 'image',
        url: 'https://res.cloudinary.com/destinoplus/image/upload/v1734234353/lkimdcu2qrowjwt4dcct.jpg',
        alt: 'Vista panorámica de las formaciones rocosas de Suesca al amanecer.',
        caption: 'Las imponentes formaciones rocosas de Suesca al amanecer, un espectáculo natural único.'
      },
      { type: 'paragraph', text: 'En este artículo, te guiaremos a través de las rutas más emblemáticas, te daremos consejos esenciales de seguridad y te mostraremos por qué Suesca no es solo un destino de escalada, sino una experiencia transformadora. ¡Atrévete a conquistar las alturas!' },
      { type: 'heading', level: 2, text: '¿Por Qué Suesca para Escalar?' },
      { type: 'paragraph', text: 'La roca arenisca de Suesca, con sus más de 500 rutas equipadas, ofrece una variedad inigualable. La adherencia es excelente y las formaciones geológicas crean desafíos para todos los gustos: placas técnicas, fisuras, techos y mucho más. Además, el entorno natural es simplemente espectacular, con el río Bogotá serpenteando al pie de las rocas y una vista panorámica del valle.'},
      { type: 'heading', level: 2, text: 'Preparativos Esenciales Antes de Escalar' },
      { type: 'paragraph', text: 'Antes de lanzarte a la aventura, es crucial estar bien preparado. Asegúrate de contar con el equipo adecuado: casco homologado, arnés en buen estado, cuerdas dinámicas (60m es un buen estándar para Suesca), cintas exprés (al menos 12), y pies de gato cómodos pero ajustados. Si eres principiante, considera contratar un guía certificado; en Suesca hay excelentes profesionales que te enseñarán las técnicas básicas y te llevarán por rutas seguras acordes a tu nivel. No olvides revisar el pronóstico del tiempo, llevar suficiente agua (mínimo 2 litros por persona), snacks energéticos (frutos secos, barras de cereal) y protección solar (gorra, gafas, bloqueador).' },
      {
        type: 'image',
        url: 'https://res.cloudinary.com/destinoplus/image/upload/v1734990366/gw9pwqit2yymx8peyj3e.jpg', // Reemplaza con imagen de equipo o preparación
        alt: 'Equipo esencial de escalada listo para la aventura en Suesca.',
        caption: 'Un equipo adecuado es tu mejor aliado en la roca.'
      },
      { type: 'heading', level: 3, text: 'Rutas Destacadas para Principiantes (Grados 5.6 - 5.9 YDS)' },
      { type: 'list', items: ['"El Elefante" (5.7): Ideal para familiarizarse con la roca y aprender movimientos básicos. Buena altura y vistas.', '"Las Chichas" (Varias rutas 5.6-5.8): Ofrece rutas cortas y bien protegidas, perfectas para ganar confianza y practicar el aseguramiento.', '"Caec" (Sector Escuela, varias 5.6-5.9): Un sector con varias opciones de baja dificultad y aproximación sencilla, excelente para cursos.'] },
      { type: 'heading', level: 2, text: 'Para los Más Experimentados (Grados 5.10+ YDS)' },
      { type: 'paragraph', text: 'Si ya tienes experiencia y buscas desafíos mayores, Suesca te espera con rutas que pondrán a prueba tu técnica y fuerza. Sectores como "El Nido del Águila" (rutas desplomadas y atléticas), "Cueva de las Cabras" (técnica y resistencia) o las exigentes vías en "La Reserva" son paradas obligatorias. Recuerda siempre escalar con responsabilidad, verificar el estado de los anclajes y, si es posible, ir con alguien que conozca bien la zona.'},
      { type: 'quote', text: '"La escalada no se trata de conquistar la montaña, sino de conquistarte a ti mismo."', cite: 'Ed Viesturs (adaptado)'},
      { type: 'paragraph', text: 'Cada ruta en Suesca es una historia, cada ascenso una memoria imborrable. La comunidad escaladora es vibrante y acogedora, siempre dispuesta a compartir consejos y sonrisas. ¡Nos vemos en la roca!' },
      {
        type: 'image',
        url: 'https://res.cloudinary.com/destinoplus/image/upload/v1736911873/rutas/la-lucirnaga/wlzdyxviuowjjyexjelq.jpg',
        alt: 'Escaladores disfrutando de una puesta de sol en Suesca.',
        caption: 'El momento perfecto para terminar una jornada de escalada: la puesta de sol sobre las rocas de Suesca.'
      }
    ],
    relatedArticles: [
      { slug: 'alojamientos-con-encanto-cerca-a-bogota', title: 'Alojamientos con Encanto en Suesca y Sesquilé', imageUrl: 'https://res.cloudinary.com/destinoplus/image/upload/v1733937504/alojamientos/casona-quesada/e2pi6ecstwuou0ghf7xa.jpg', category: 'Alojamientos'},
      { slug: 'miradores-secretos-paisajes-ocultos-suesca', title: 'Miradores Secretos y Paisajes Ocultos en Suesca', imageUrl: 'https://res.cloudinary.com/destinoplus/image/upload/v1736911873/rutas/la-lucirnaga/wlzdyxviuowjjyexjelq.jpg', category: 'Rutas y Paisajes'},
    ]
  },
  {
    slug: 'alojamientos-con-encanto-cerca-a-bogota',
    title: 'Alojamientos con Encanto en Suesca y Sesquilé: Escapadas Perfectas Cerca a Bogotá',
    category: 'Hospedaje Soñado',
    author: 'Ana Viajera - Destiplus',
    publicationDate: '2025-05-10T12:00:00Z',
    displayDate: '10 de Mayo, 2025',
    readingTime: '6 min de lectura',
    heroImageUrl: 'https://res.cloudinary.com/destinoplus/image/upload/v1733937504/alojamientos/casona-quesada/e2pi6ecstwuou0ghf7xa.jpg',
    heroImageAlt: 'Acogedora habitación de hotel boutique con vista a las montañas en Cundinamarca.',
    excerpt: 'Encuentra cabañas, glamping y hoteles boutique para una experiencia inolvidable cerca a Bogotá. Perfecto para una escapada de fin de semana en Suesca o Sesquilé.',
    metaDescription: 'Descubre los mejores alojamientos con encanto en Suesca y Sesquilé. Opciones de glamping, cabañas rústicas y hoteles boutique para tu escapada ideal cerca a Bogotá.',
    keywords: ['alojamientos suesca', 'hoteles sesquile', 'glamping cundinamarca', 'cabañas cerca bogota', 'escapadas fin de semana bogota', 'turismo rural'],
    content: [
        { type: 'paragraph', text: '¿Buscas desconectarte de la ciudad sin ir muy lejos? Suesca y Sesquilé, a poco más de una hora de Bogotá, ofrecen una variedad de alojamientos con encanto que te permitirán recargar energías en medio de la naturaleza imponente de Cundinamarca. Desde lujosos glampings con todas las comodidades hasta acogedoras cabañas y hoteles boutique llenos de carácter, hay opciones para todos los gustos y presupuestos.' },
        { type: 'heading', level: 2, text: 'Glamping: Conexión Total con la Naturaleza y Confort Moderno' },
        { type: 'paragraph', text: 'El glamping se ha convertido en una tendencia popular, y por buenas razones. Imagina despertar con el canto de los pájaros, disfrutar de una vista estrellada desde tu cómoda cama y tener acceso a baños privados y zonas comunes con estilo. Varios lugares en Suesca y Sesquilé ofrecen esta experiencia única, combinando la aventura del camping con el lujo de un hotel.'},
        { type: 'image', url: 'https://res.cloudinary.com/destinoplus/image/upload/v1734990366/gw9pwqit2yymx8peyj3e.jpg', alt: 'Interior de una carpa de glamping lujosa con decoración elegante.', caption: 'El glamping: aventura y comodidad en un solo lugar.'},
        { type: 'heading', level: 3, text: 'Cabañas y Casas de Campo: Privacidad y Autenticidad' },
        { type: 'paragraph', text: 'Para quienes buscan más privacidad o una experiencia más rústica, las cabañas y casas de campo son una excelente opción. Muchas cuentan con chimenea, cocina equipada y amplios jardines, ideales para ir en pareja, familia o con amigos. Disfruta de la tranquilidad del campo y la belleza de los paisajes andinos.'},
    ],
    relatedArticles: [
      { slug: 'descubre-las-mejores-rutas-de-escalada-en-suesca', title: 'Descubre las Mejores Rutas de Escalada en Suesca', imageUrl: 'https://res.cloudinary.com/destinoplus/image/upload/v1734236561/cajbjyr4g2g7oizfgweu.jpg', category: 'Aventuras Épicas' },
    ]
  }
  // Puedes añadir el artículo 'miradores-secretos-paisajes-ocultos-suesca' aquí también si quieres
];

/**
 * Simula la obtención de datos de un artículo por su slug.
 * En una aplicación real, esto haría una llamada a tu CMS o base de datos.
 */
export async function getArticleDataBySlug(slug: string): Promise<ArticleData | null> {
  console.log(`[API MOCK] Buscando artículo con slug: ${slug}`);
  // Simula un pequeño retraso de red
  // await new Promise(resolve => setTimeout(resolve, 100)); 
  
  const article = ALL_SAMPLE_ARTICLES_DATA.find(art => art.slug === slug);
  
  if (article) {
    console.log(`[API MOCK] Artículo encontrado: ${article.title}`);
    return article;
  } else {
    console.log(`[API MOCK] Artículo con slug "${slug}" no encontrado.`);
    return null;
  }
}

/**
 * Simula la obtención de una lista de artículos (para la página principal del blog, por ejemplo).
 */
export async function getAllArticlesForHomepage(): Promise<Pick<ArticleData, 'slug' | 'title' | 'category' | 'heroImageUrl' | 'excerpt'>[]> {
    return ALL_SAMPLE_ARTICLES_DATA.map(art => ({
        slug: art.slug,
        title: art.title,
        category: art.category,
        heroImageUrl: art.heroImageUrl,
        excerpt: art.excerpt,
    }));
}