'use client'; 

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation"; // Hook de enrutamiento de Next.js
import { CldImage } from 'next-cloudinary'; // ¡Importa CldImage!
import Image from 'next/image';

import { generateSlug } from '@/lib/utils'; //

// --- Iconos ---
import { MdExplore, MdError } from "react-icons/md";
// import { IoMdArrowDropdown } from "react-icons/io"; // No parece usarse en el JSX final
import { FaUserGroup } from "react-icons/fa6";
import { ChevronDown, X } from 'lucide-react'; // Iconos usados

// --- Componentes Hijos (Asegúrate que existan en estas rutas y estén adaptados) ---
import SearchBox from '@/components/features/home/SearchBox';
import FeedbackSection from '@/components/features/home/FeedbackSection';
import WelcomeModal from '@/components/features/home/WelcomeModal';
import DemoModal from '@/components/features/home/DemoModal';
import CategoriasBurbujas from '@/components/features/home/CategoriasBurbujas';
import ImpactoAmbientalCard from '@/components/features/home/ImpactoAmbientalCard';
import ChatAI from '@/components/features/home/ChatAI';
import AdSlider from '@/components/features/home/advertasing-slider'

// --- Servicios y Utils (Asegúrate que existan y funcionen) ---
import { consultarOpenAI } from "@/service/openIAService"; // Asumiendo que usa axios si es necesario
import { formatMarkdownText } from "@/lib/utils"; // Tu función para formatear markdown
import { DestinoType, ChatMessage } from '@/types/index'; // Tus definiciones de tipos

// --- Interfaz de Props ---
interface HomeClientProps {
  initialDestinos: DestinoType[]; // Recibe los destinos iniciales desde page.tsx
}

// --- Componente Cliente Principal ---
const HomeClient: React.FC<HomeClientProps> = ({ initialDestinos }) => {
  const router = useRouter();

  // --- Estados ---
  const [destinos, setDestinos] = useState<DestinoType[]>(initialDestinos); // Datos originales
  const [rutasFiltradas, setRutasFiltradas] = useState<DestinoType[]>(initialDestinos); // Datos a mostrar (filtrados)
  const [filtros, setFiltros] = useState<Record<string, Set<{ value: any }>>>({}); // Estado para filtros si los implementas más a fondo

  // Estados de UI
  const [loading, setLoading] = useState(false); // Para cargas iniciadas por el cliente (ej: AI)
  const [error, setError] = useState<string | null>(null); // Para errores del cliente

  // Estados de Modales y Chat
  // WelcomeModal ahora controla su propia visibilidad inicial
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [showChat, setShowChat] = useState(false);
  const [titleVisible, setTitleVisible] = useState(true); // Controla si se ve el título o el chat

  // --- Efectos ---
  useEffect(() => {
    // Inicializa los filtros basados en los datos iniciales cuando el componente monta o los datos cambian
    if (initialDestinos && initialDestinos.length > 0) {
      initializeFiltros(initialDestinos);
    }
    // Actualiza los estados si los datos iniciales cambian (útil si hay revalidación)
    setDestinos(initialDestinos);
    setRutasFiltradas(initialDestinos);
  }, [initialDestinos]);

  // Nota: El listener para el auto-resize del textarea se ha omitido aquí.
  // Es MEJOR práctica manejar ese listener DENTRO del componente SearchBox.tsx
  // para mantener la encapsulación. Si no lo haces allí, puedes descomentar
  // el useEffect correspondiente de respuestas anteriores aquí.


  // --- Funciones ---

  // Inicializa la estructura de filtros (si se usa para UI de filtros)
  const initializeFiltros = (data: DestinoType[]) => {
    const nuevosFiltros: Record<string, Set<{ value: any }>> = {};
    data.forEach((destino) => {
      if (destino.items && typeof destino.items === 'object') {
        Object.entries(destino.items).forEach(([key, value]) => {
          if (!nuevosFiltros[key]) nuevosFiltros[key] = new Set();
          // Compara valores (podría necesitar ajuste si son objetos complejos)
           if (!Array.from(nuevosFiltros[key]).some(item => JSON.stringify(item.value) === JSON.stringify(value))) {
               nuevosFiltros[key].add({ value });
            }
        });
      }
    });
    setFiltros(nuevosFiltros);
    // console.log("Filtros inicializados:", nuevosFiltros); // Para depuración
  };

  // Manejadores de Modales
  const handleDemoClick = () => {
    setShowDemoModal(true);
    if (window && window.gtag) { /* gtag event */ }
  };
  const handleCloseDemoModal = () => setShowDemoModal(false);
  // WelcomeModal maneja su propio cierre internamente ahora

  // Manejador Búsqueda con IA
  const handleAISearch = async (query: string) => {
    if (!query.trim()) return; // No buscar si está vacío

    setShowChat(true); // Muestra el contenedor del chat
    // Oculta el título con animación (asegúrate que la clase CSS 'title-fade-out' funcione)
    const titleElement = document.querySelector('.titulo-landing');
    if (titleElement) titleElement.classList.add('title-fade-out');
    setTimeout(() => setTitleVisible(false), 600); // Sincroniza con la animación CSS

    setAiLoading(true); // Muestra el indicador de carga en ChatAI
    setError(null); // Limpia errores previos
    setChatMessages(prev => [...prev, { text: query, sender: 'user' }]); // Muestra la pregunta del usuario

     // Limpiar Input - Idealmente SearchBox debería manejar esto internamente o vía callback
     setTimeout(() => {
         const searchInput = document.querySelector('.container-box-filter textarea') as HTMLTextAreaElement;
         if (searchInput) {
             searchInput.value = '';
             searchInput.style.height = 'auto'; // Resetear altura
             searchInput.dispatchEvent(new Event('input', { bubbles: true })); // Para que SearchBox sepa que cambió (si es necesario)
         }
     }, 100);

    try {
      const response = await consultarOpenAI(query); // Llama al servicio de IA
      setChatMessages(prev => [...prev, { text: response, sender: 'ai' }]); // Muestra la respuesta de la IA
    } catch (err: any) {
      console.error('Error consultando IA:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Lo siento, hubo un problema. Intenta de nuevo.';
      setChatMessages(prev => [...prev, { text: errorMsg, sender: 'ai' }]); // Muestra mensaje de error en el chat
      setError(errorMsg); // Guarda el error por si necesitas mostrarlo en otro lugar
    } finally {
      setAiLoading(false); // Oculta el indicador de carga
    }
  };

  // Manejador para Cerrar el Chat
  const handleCloseChat = () => {
    setShowChat(false); // Oculta el chat
    setChatMessages([]); // Limpia los mensajes
    // Muestra el título de nuevo (podrías añadir animación de entrada)
    setTitleVisible(true);
    // Restaura la lista completa de destinos si la IA la había modificado
    // (Actualmente la IA no modifica la lista, solo muestra texto)
    // setRutasFiltradas(destinos);
  };

  const handleNavigateToDestino = (item: DestinoType) => {
    const { id: destino_id, municipio } = item;
    // Verifica que municipio exista y no esté vacío
    if (!municipio) {
      console.error("Intento de navegar a destino sin municipio:", item);
      return; // No navegar si no hay municipio
    }

    // --- Inicio Bloque GTAG para Destino ---
    if (typeof window !== "undefined" && window.gtag) { // Usamos typeof para más seguridad
        window.gtag('event', 'destination_click', {
            event_category: 'Navigation',
            event_label: municipio,
            value: destino_id, // Asegúrate que destino_id sea un número si value debe serlo
            app_name: 'Home busqueda',
            screen_name: municipio, // Opcional pero útil
            timestamp: new Date().toISOString(),
            interaction_type: 'click'
        });
    } else {
        console.warn('Google Analytics (gtag) no está disponible.');
    }
    const encodedMunicipio = encodeURIComponent(municipio);
    router.push(`/destino/${encodedMunicipio}`);
  };


  const handleNavigateToImpacto = () => {
    console.log("Navegando a impacto ambiental");

    // --- Inicio Bloque GTAG para Impacto ---
    if (typeof window !== "undefined" && window.gtag) {
        window.gtag('event', 'impacto_ambiental_click', {
            event_category: 'Engagement',
            event_label: 'Reserva árbol', // O 'Ver Impacto Click' según prefieras
            app_name: 'Home busqueda',
            timestamp: new Date().toISOString(),
            interaction_type: 'click'
        });
    } else {
       // Puedes añadir un console.warn aquí también si quieres
       // console.warn('Google Analytics (gtag) no está disponible.');
    }
    // --- Fin Bloque GTAG ---

    // --- Navegación Next.js ---
    router.push('/impactoAmbiental'); // Esta ruta parece correcta según lo discutido
    // -------------------------
  };



  // Funciones Auxiliares para el renderizado
  const getBadgeType = (calificacion?: number): 'new' | 'popular' | null => {
    if (calificacion === undefined || calificacion === null) return null;
    if (calificacion === 0) return 'new';
    if (calificacion >= 4.6) return 'popular';
    return null;
  };
  const getDestinationType = (municipio: string): string => {
    // Podrías tener una lógica más compleja o datos desde la API aquí
    return municipio.toLowerCase() === "suesca" ? "Aventura" : "Trekking";
  };

  // --- JSX Renderizado ---
  return (
    <>
      {/* --- Header (Clases originales) --- */}
      <div className="header">
        <div className="title-header">
          <h5>Desti <span className="mas-home"><strong>plus</strong></span></h5>
        </div>
        <div className="back-home">
          <CldImage
            src="https://res.cloudinary.com/destinoplus/image/upload/v1732547115/tree_suesca_bdaba9.png" // O "tree_suesca_bdaba9" si prefieres
            alt="destiplus logo"
            width={55} 
            height={65}
          />
        </div>
      </div>

      {/* --- Sección Título / Chat (Clases originales) --- */}
      <div className='container-landing-2'>
        {titleVisible ? (
          <div className={`titulo-landing ${showChat ? 'title-fade-out' : ''}`}> {/* Clases originales + animación */}
            <h2>¿Planes cerca a Bogotá?</h2>
            <h3 className="subtitulo">
              Pregúntame lo que necesites: alojamientos, actividades, comida, miradores...
              ¡toda la info en un <span className="highlight">solo lugar</span>!
            </h3>
          </div>
        ) : (
          <div className={`chat-container ${showChat ? 'fade-in' : ''}`}> {/* Clases originales + animación */}
            <ChatAI
              messages={chatMessages}
              isLoading={aiLoading}
              formatTextFunction={formatMarkdownText} // Pasa la función importada
            />
            {/* Muestra botón cerrar solo si hay mensajes y no está cargando */}
            {chatMessages.length > 0 && !aiLoading && (
              <button className="close-chat-btn" onClick={handleCloseChat}>
                Cerrar conversación
              </button>
            )}
          </div>
        )}
      </div>

      {/* --- SearchBox (Clases originales) --- */}
      <div className="container-box-filter">
        <SearchBox
          onAISearch={handleAISearch} // Para búsqueda IA
        />
      </div>

      {/* --- Categorías y Demo (Componentes hijos) --- */}
      <CategoriasBurbujas onDemoClick={handleDemoClick} />

      <AdSlider />

      {/* --- Encabezado Lista Destinos (Clases originales) --- */}
      <div className="destinations-header">
        <div className="destinations-title-container">
          <h2 className="destinations-title">Destinos para este fin de semana</h2>
          <p className="destinations-subtitle">
            <ChevronDown size={18} className="arrow-down" />
            Da click en alguno y empieza a explorar
            <ChevronDown size={18} className="arrow-down" />
          </p>
        </div>
      </div>

      {/* --- Lista de Destinos (Clases originales) --- */}
      <div className="container-seccion-lista-home">
        {/* Verifica si hay destinos filtrados para mostrar */}
        {rutasFiltradas && rutasFiltradas.length > 0 ? (
          rutasFiltradas.map((item) => {
            const badgeType = getBadgeType(item.calificacion);
            return (
              <div
                key={item.id}
                className="destination-card" // Clase principal del card
                onClick={() => handleNavigateToDestino(item)}
                role="link"
                tabIndex={0}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleNavigateToDestino(item.id, item.municipio)}
                aria-label={`Explorar ${item.municipio}`}
              >
                <div className="image-section"> {/* Contenedor de la imagen y overlays */}
                  {/* ***** CAMBIO AQUÍ ***** */}
                  <CldImage
                    src={item.img} // Asume que item.img es el Public ID
                    alt={`Paisaje de ${item.municipio}`}
                    width={400}
                    className={'destination-image'}
                    crop="fill"
                    gravity="center"
                    height={300}
                    style={{ objectFit: 'cover' }}
                  />
                  {/* Badges (Nuevo/Popular) */}
                  <div className="destination-badges">
                    {badgeType && (
                      <span className={`badge ${badgeType}`}> {/* Clases: badge new | badge popular */}
                        {badgeType === 'new' ? 'Nuevo' : 'Popular'}
                      </span>
                    )}
                  </div>
                  {/* Rating (Estrellas) */}
                  <div className="destination-rating">
                    {item.calificacion !== undefined && item.calificacion >= 0 ? ( // Muestra si hay calificación >= 0
                      <>
                        {item.calificacion > 0 && <span>{item.calificacion.toFixed(1)}</span>} {/* Muestra número si > 0 */}
                        {/* Asume que tienes la estrella en public/utils/ */}
                        <Image // <-- Usa Image de next/image
                          src="/utils/icons8-estrella-48.png" // <-- Ruta desde la carpeta /public
                          alt="Estrella"
                          width={16}
                          height={16}
                          className="star-icon"
                          style={{ objectFit: 'cover' }}
                        />                      
                      </>
                    ) : null}
                  </div>
                </div>

                {/* Información del Destino */}
                <div className="destination-info">
                  <div className="destination-header">
                    <h3>{item.municipio}, {item.departamento}</h3>
                    <span className="destination-type"> {/* Tipo de destino (Aventura/Trekking) */}
                      {getDestinationType(item.municipio)}
                    </span>
                  </div>
                  <div className="destination-description">
                    <MdExplore className="explore-icon" />
                    <p>{item.frase}</p> {/* Frase descriptiva */}
                  </div>
                  <div className="explorar-boton"> {/* Contenedor inferior */}
                    <div className="destination-stats">
                      <FaUserGroup className="visitors-icon" />
                      <span>¡Sé de los primeros en explorar!</span> {/* O un dato real si lo tienes */}
                    </div>
                    {/* Botón (principalmente visual ya que el div es clickeable) */}
                    <button className="book-btn" tabIndex={-1}>Explorar</button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          // Mensaje si no hay destinos para mostrar
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem 1rem', color: '#666' }}>
            {initialDestinos.length === 0 ? // Si no hubo datos iniciales
              <p>No hay destinos cargados en este momento. ¡Vuelve pronto!</p>
              : // Si hubo datos pero el filtro no arrojó resultados
              <p>No se encontraron destinos que coincidan con tu búsqueda actual.</p>
            }
          </div>
        )}
      </div>

      {/* --- Impacto Ambiental Card (Componente hijo) --- */}
      <ImpactoAmbientalCard onClick={handleNavigateToImpacto} />

      {/* --- Feedback Section (Componente hijo) --- */}
      <FeedbackSection />

      {/* --- Modales (Componentes hijos, renderizado condicional interno/externo) --- */}
      <WelcomeModal /> {/* Controla su visibilidad internamente con localStorage */}
      <DemoModal isOpen={showDemoModal} onClose={handleCloseDemoModal} />

    </>
  );
};

export default HomeClient;