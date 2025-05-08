'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { HandPlatter, Star, MapPin, Loader2, Sparkles, ArrowLeft, Share } from 'lucide-react'; // Iconos Lucide
import VotingModal from './votingModal'; // Ajusta ruta si es necesario
import NotificationModal from './notificacion'; // Ajusta ruta si es necesario
import axios from 'axios'; // Mantenemos axios como en el original
import { CldImage } from 'next-cloudinary';

// --- Helpers (definidos localmente) ---
function deg2rad(deg: number): number { // Recibe un número, devuelve un número
    return deg * (Math.PI / 180);
}
  
function getDistanceFromLatLonInMeters(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number { // Recibe 4 números, devuelve un número
  const R = 6371000; // Radio de la Tierra en metros
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distancia en metros
  return distance;
}

const formatCurrency = (amount: number | string | null | undefined): string => {
    // Convierte a número por si acaso llega como string
    const numericAmount = Number(amount);
  
    // Si no es un número válido (ej. null, undefined, texto), devuelve algo por defecto
    if (isNaN(numericAmount)) {
      // Puedes devolver 'N/A', '$ 0', '$ ---', o lo que prefieras
      return '$ 0';
    }
  
    // Usa la API Intl para formatear
    return new Intl.NumberFormat('es-CO', { // 'es-CO' para formato colombiano
      style: 'currency',        // Indica que es moneda
      currency: 'COP',          // Especifica Pesos Colombianos
      minimumFractionDigits: 0, // Sin decimales
      maximumFractionDigits: 0  // Sin decimales
    }).format(numericAmount); // Formatea el número
};

const API_BASE_URL = "https://tree-suesca-backend-production.up.railway.app/api/v1";


interface BurgerProfileClientProps {
    burgerId: string;
}

// --- Componente Principal ---
const BurgerProfileClient: React.FC<BurgerProfileClientProps> = ({ burgerId }) => {
    const router = useRouter();

    interface VotePayload {
        burger_id: number;
        rating: number;
        // Otros campos del formulario del modal si los envías
        email?: string;
        full_name?: string;
        recommendations?: string | null;
        origin?: string | null;
        burger_name?: string; // Opcional si el backend lo obtiene por ID
        restaurant_name?: string; // Opcional si el backend lo obtiene por ID
    }
    interface Participant {
        id: number;
        name: string;
        restaurant: string;
        image: string;
        logo: string;
        visitors: number;
        price: number;
        description: string;
        specialIngredient: string;
        votes: number;
        location: {
          lat: number;
          lng: number;
        };
    }
    const [participants, setParticipants] = useState<Participant[]>([
        {
          id: 1,
          name: "La Tropical Smash",
          restaurant: "Terraza",
          image: "https://res.cloudinary.com/destinoplus/image/upload/v1746721171/n7wcg2qtag12572xcj1l.jpg", // Cloudinary Public ID
          logo: "https://res.cloudinary.com/destinoplus/image/upload/v1746721281/wmz2sj60iuvl8eswhzdz.jpg", // Cloudinary Public ID
          visitors: 46,
          price: 16000,
          description: "Pan artesanal, carne de res madurada, queso mozzarella, lechuga romana, mayonesa cítrica y un toque dulce de piña caramelizada.",
          specialIngredient: "Piña caramelizada",
          votes: 0,
          location: { "lat": 5.100817, "lng": -73.799823 }
        },
        {
          id: 2,
          name: "Madurita Rebelde",
          restaurant: "Cacique Burguer",
          image: "https://res.cloudinary.com/destinoplus/image/upload/v1746721171/n7wcg2qtag12572xcj1l.jpg",
          logo: "https://res.cloudinary.com/destinoplus/image/upload/v1746721515/kdennvrlqzyd0lrmuec3.jpg",
          visitors: 38,
          price: 16000,
          description: "Una fusión única con carne de cerdo desmechada, queso cheddar, alioli de ajo rostizado y plátano maduro frito en forma de chips.",
          specialIngredient: "Plátano maduro frito",
          votes: 0,
          location: { "lat": 5.100817, "lng": -73.799823 }
        },
        {
          id: 3,
          name: "Bacon Jam",
          restaurant: "Arca Rock",
          image: "https://res.cloudinary.com/destinoplus/image/upload/v1746721171/n7wcg2qtag12572xcj1l.jpg",
          logo: "https://res.cloudinary.com/destinoplus/image/upload/v1746721490/zqbrxrfk5n59t1zkbkxo.jpg",
          visitors: 52,
          price: 16000,
          description: "Carne de res en doble medallón, queso americano, cebolla caramelizada y una generosa capa de mermelada de tocineta.",
          specialIngredient: "Mermelada de tocineta",
          votes: 0,
          location: { "lat": 5.100817, "lng": -73.799823 }
        },
        {
          id: 4,
          name: "Blue Beast",
          restaurant: "Lo Nuestro",
          image: "https://res.cloudinary.com/destinoplus/image/upload/v1746721171/n7wcg2qtag12572xcj1l.jpg",
          logo: "https://res.cloudinary.com/destinoplus/image/upload/v1746721854/mj7ew6hjdv24wqsp3rnh.jpg",
          visitors: 61,
          price: 16000,
          description: "Para paladares osados: carne de cordero, rúgula fresca, cebolla morada crujiente y un potente queso azul que lo cambia todo.",
          specialIngredient: "Queso azul",
          votes: 0,
          location: { "lat": 5.100817, "lng": -73.799823 }
        },
        {
          id: 5,
          name: "La Mexa Boom",
          restaurant: "Texas Burguer",
          image: "https://res.cloudinary.com/destinoplus/image/upload/v1746721171/n7wcg2qtag12572xcj1l.jpg",
          logo: "https://res.cloudinary.com/destinoplus/image/upload/v1746721792/udbn3mgoaero4yy4vlir.jpg",
          visitors: 46,
          price: 16000,
          description: "Carne con especias, doble queso, totopos triturados, crema agria y un cremoso y picante guacamole con jalapeño.",
          specialIngredient: "Guacamole con jalapeño",
          votes: 0,
          location: { "lat": 5.100817, "lng": -73.799823 }
        },
        {
          id: 6,
          name: "La Beet Queen",
          restaurant: "Crucero",
          image: "https://res.cloudinary.com/destinoplus/image/upload/v1746721171/n7wcg2qtag12572xcj1l.jpg",
          logo: "https://res.cloudinary.com/destinoplus/image/upload/v1746721472/o673xcuzwhloip00sakf.jpg",
          visitors: 38,
          price: 16000,
          description: "Hamburguesa veggie con portobellos grillados, queso de cabra, reducción balsámica y servida en un pan de remolacha que roba miradas.",
          specialIngredient: "Pan de remolacha",
          votes: 0,
          location: { "lat": 5.100817, "lng": -73.799823 }
        },
        {
          id: 7,
          name: "Crunch Pork Burger",
          restaurant: "Villa Hamburguesa",
          image: "https://res.cloudinary.com/destinoplus/image/upload/v1746721171/n7wcg2qtag12572xcj1l.jpg",
          logo: "https://res.cloudinary.com/destinoplus/image/upload/v1746721379/wh1gymjaeuhz2hlfg73j.jpg",
          visitors: 52,
          price: 16000,
          description: "Carne mixta (res y cerdo), cebollín, mayonesa de limón y un crocante e irresistible toque de chicharrón crocante.",
          specialIngredient: "Chicharrón crocante",
          votes: 0,
          location: { "lat": 5.100817, "lng": -73.799823 }
        },
        {
          id: 8,
          name: "La Samurai Rosa",
          restaurant: "Don Toño",
          image: "https://res.cloudinary.com/destinoplus/image/upload/v1746721171/n7wcg2qtag12572xcj1l.jpg",
          logo: "https://res.cloudinary.com/destinoplus/image/upload/v1746721357/smnu6jofmm3d86fjgmyx.jpg",
          visitors: 61,
          price: 16000,
          description: "Inspiración oriental: carne de wagyu, pepino encurtido, mayo sriracha y unos suaves aros de cebolla morada en tempura.",
          specialIngredient: "Aros de cebolla morada en tempura",
          votes: 0,
          location: { "lat": 5.100817, "lng": -73.799823 }
        },
        {
          id: 9,
          name: "Verde Letal",
          restaurant: "Palo Santo",
          image: "https://res.cloudinary.com/destinoplus/image/upload/v1746721171/n7wcg2qtag12572xcj1l.jpg",
          logo: "https://res.cloudinary.com/destinoplus/image/upload/v1746721330/cyw08ddfvmlhmqosarn2.jpg",
          visitors: 46,
          price: 16000,
          description: "Pechuga de pollo grillada, tomate confitado, queso provolone y un intenso pesto de albahaca que le da el alma al bocado.",
          specialIngredient: "Pesto de albahaca",
          votes: 0,
          location: { "lat": 5.100817, "lng": -73.799823 }
        },
        {
          id: 10,
          name: "La Vintagemelt",
          restaurant: "Amore Pizza",
          image: "https://res.cloudinary.com/destinoplus/image/upload/v1746721171/n7wcg2qtag12572xcj1l.jpg",
          logo: "https://res.cloudinary.com/destinoplus/image/upload/v1746721782/gordtfirjpujbiait6ur.jpg",
          visitors: 38,
          price: 16000,
          description: "Carne sellada en mantequilla, queso suizo, cebolla blanca salteada y unos aromáticos champiñones al vino tinto.",
          specialIngredient: "Champiñones al vino tinto",
          votes: 0,
          location: { "lat": 5.100817, "lng": -73.799823 }
        },
        {
          id: 11,
          name: "Golden Yolk",
          restaurant: "La Parrilla de Juancho",
          image: "https://res.cloudinary.com/destinoplus/image/upload/v1746721171/n7wcg2qtag12572xcj1l.jpg",
          logo: "https://res.cloudinary.com/destinoplus/image/upload/v1746721305/fjshp3eytuvai3z48ogy.jpg",
          visitors: 52,
          price: 16000,
          description: "Clásica con sorpresa: carne de res jugosa, cheddar fundido, tocineta ahumada y un brillante huevo pochado encima.",
          specialIngredient: "Huevo pochado",
          votes: 0,
          location: { "lat": 5.100817, "lng": -73.799823 }
        },
        {
          id: 12,
          name: "Maracupicante",
          restaurant: "Dorilocos La Roca",
          image: "https://res.cloudinary.com/destinoplus/image/upload/v1746721171/n7wcg2qtag12572xcj1l.jpg",
          logo: "https://res.cloudinary.com/destinoplus/image/upload/v1746721424/zzbgw6xporkrjbcflsrj.jpg",
          visitors: 61,
          price: 16000,
          description: "Doble carne, queso pepper jack, vegetales asados y una atrevida salsa de maracuyá picante que te hace sudar.",
          specialIngredient: "Salsa de maracuyá picante",
          votes: 0,
          location: { "lat": 5.100817, "lng": -73.799823 }
        },
        {
          id: 13,
          name: "Café & Fuego Burger",
          restaurant: "Cumbamba",
          image: "https://res.cloudinary.com/destinoplus/image/upload/v1746721171/n7wcg2qtag12572xcj1l.jpg",
          logo: "https://res.cloudinary.com/destinoplus/image/upload/v1746721401/bxyumnz1bwmuqllbwpat.jpg",
          visitors: 46,
          price: 16000,
          description: "Inspiración dark: pulled pork jugoso, cebolla crispy y una intensa BBQ de café que potencia el sabor de principio a fin.",
          specialIngredient: "Pulled pork en BBQ de café",
          votes: 0,
          location: { "lat": 5.100817, "lng": -73.799823 }
        },
        {
          id: 14,
          name: "La Tropical Inferno",
          restaurant: "Monopizza Gourmet",
          image: "https://res.cloudinary.com/destinoplus/image/upload/v1746721171/n7wcg2qtag12572xcj1l.jpg",
          logo: "https://res.cloudinary.com/destinoplus/image/upload/v1746721802/kjwd5jreolrrpcpzturq.jpg",
          visitors: 38,
          price: 16000,
          description: "Carne a la parrilla, queso costeño, lechuga fresca, cebolla crocante y el vibrante y exótico chutney de mango con habanero.",
          specialIngredient: "Chutney de mango con habanero",
          votes: 0,
          location: { "lat": 5.100817, "lng": -73.799823 }
        }
    ]);

    const [burgerData, setBurgerData] = useState<Participant | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBurgerForVote, setSelectedBurgerForVote] = useState<Participant | null>(null);
    const [isCheckingLocation, setIsCheckingLocation] = useState(false);
    const [locationError, setLocationError] = useState('');
    const [voteCount, setVoteCount] = useState<number | null>(null);
    const [isLoadingCount, setIsLoadingCount] = useState(true);
    const [hasVotedLocally, setHasVotedLocally] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState('');
    const [showNotificationModal, setShowNotificationModal] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');



    // Efecto para encontrar la hamburguesa actual y verificar voto local
    useEffect(() => {
        console.log("BurgerProfileClient: Buscando datos para burgerId:", burgerId);
        const burgerIdNum = parseInt(burgerId, 10);
        const currentBurger = participants.find(p => p.id === burgerIdNum);

        if (currentBurger) {
            setBurgerData(currentBurger);
            const votedKey = `voted_burger_${currentBurger.id}`;
            const alreadyVoted = localStorage.getItem(votedKey) === 'true';
            setHasVotedLocally(alreadyVoted);
            console.log(`Burger encontrada: ${currentBurger.name}, Votado localmente: ${alreadyVoted}`);
        } else {
            setBurgerData(null);
            setHasVotedLocally(false);
            console.error(`Burger con ID ${burgerId} no encontrada.`);
            // Opcional: Redirigir si no se encuentra
            // router.replace('/batalla'); // O a una página 404 personalizada
        }
        // Resetear otros estados
        setIsLoadingCount(true);
        setVoteCount(null);
        setLocationError('');
        setSubmitError('');
        setSubmitSuccess('');
    }, [burgerId]);

    // Efecto para obtener el conteo de votos
    useEffect(() => {
        const burgerIdNum = parseInt(burgerId, 10);
        if (burgerIdNum && burgerData) { // Solo si tenemos ID numérico y datos de la burger
            setIsLoadingCount(true);
            setVoteCount(null); // Resetear antes de buscar
            const source = axios.CancelToken.source();
            console.log(`Workspaceing vote count for burger ID: ${burgerIdNum}`);

            axios.get(`${API_BASE_URL}/votes/burger/${burgerIdNum}/count`, { cancelToken: source.token })
                .then(response => {
                    setVoteCount(response.data.vote_count ?? 0); // Asume 0 si no viene count
                })
                .catch(error => {
                    if (!axios.isCancel(error)) {
                        console.error("Error fetching vote count:", error);
                        setVoteCount(0); // Asume 0 en caso de error
                    }
                })
                .finally(() => {
                    setIsLoadingCount(false);
                });

            return () => { source.cancel('Fetching vote count canceled.'); };
        } else {
            setIsLoadingCount(false); // No buscar si no hay burgerId válido o burgerData
            setVoteCount(null);
        }
    }, [burgerId, burgerData]); // Ejecutar si cambia el ID o burgerData


    // --- HANDLERS ---

    const handleGoBack = () => router.back();

    const handleShare = () => {
        // (Misma lógica de compartir que en la respuesta anterior)
        if (navigator.share) {
          navigator.share({
            title: burgerData.name,
            text: `¡Mira esta increíble hamburguesa: ${burgerData.name} de ${burgerData.restaurant}!`,
            url: window.location.href,
          })
          .catch((error) => console.log('Error al compartir:', error));
        } else {
          alert('La función de compartir no está disponible en este navegador.');
        }
    };

    const handleDirections = () => {
        if (burgerData?.location?.lat && burgerData?.location?.lng) {
            const { lat, lng } = burgerData.location;
            // Abrir Google Maps con las coordenadas del restaurante
            const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
            window.open(url, '_blank', 'noopener,noreferrer');
        } else {
            alert("Ubicación del establecimiento no disponible.");
        }
    };

    const handleVote = () => {
    setLocationError(''); // Limpiar errores previos
    setSubmitError('');
    setSubmitSuccess('');
    setLocationError('');
    if (!burgerData || !burgerData.location || typeof burgerData.location.lat !== 'number' || typeof burgerData.location.lng !== 'number') {
      alert("La ubicación de este establecimiento no está configurada correctamente.");
      return;
    }

    if (!navigator.geolocation) {
      alert('La geolocalización no es soportada por tu navegador.');
      return;
    }

    setIsCheckingLocation(true); // Indicar que estamos buscando ubicación

    navigator.geolocation.getCurrentPosition(
      // --- Callback Éxito ---
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        const establishmentLat = burgerData.location.lat;
        const establishmentLng = burgerData.location.lng;

        console.log(`Ubicación usuario: ${userLat}, ${userLng}`);
        console.log(`Ubicación establecimiento: ${establishmentLat}, ${establishmentLng}`);

        const distance = getDistanceFromLatLonInMeters(
          userLat, userLng,
          establishmentLat, establishmentLng
        );

        console.log(`Distancia calculada: ${distance.toFixed(2)} metros`);

        const MAX_DISTANCE_METERS = 30; // Límite de distancia

        if (distance <= MAX_DISTANCE_METERS) {
          // ¡Dentro del rango! Abrir el modal
          console.log("Usuario dentro del rango.");
          setSelectedBurgerForVote(burgerData);
          setIsModalOpen(true);
        } else {
          // Fuera de rango
          console.log("Usuario fuera del rango.");
          setLocationError(`Estás a ${distance.toFixed(0)} metros. Debes estar a menos de ${MAX_DISTANCE_METERS} metros para votar.`);
          alert(`Estás demasiado lejos (${distance.toFixed(0)}m). Acércate al establecimiento (menos de ${MAX_DISTANCE_METERS}m) para poder votar.`);
        }
        setIsCheckingLocation(false); // Termina la comprobación
      },
      // --- Callback Error ---
      (error) => {
        setIsCheckingLocation(false); // Termina la comprobación
        let message = "No se pudo obtener tu ubicación. ";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message += "Permiso denegado. Por favor, habilita el acceso a la ubicación.";
            break;
          case error.POSITION_UNAVAILABLE:
            message += "Información de ubicación no disponible.";
            break;
          case error.TIMEOUT:
            message += "Se agotó el tiempo de espera para obtener la ubicación.";
            break;
          default:
            message += "Ocurrió un error desconocido.";
            break;
        }
        console.error("Error de Geolocalización:", error);
        setLocationError(message);
        alert(message); // Mostrar error al usuario
      },
      // --- Opciones ---
      {
        enableHighAccuracy: true, // Intenta obtener la ubicación más precisa posible
        timeout: 10000,          // Tiempo máximo de espera (10 segundos)
        maximumAge: 0            // No usar una ubicación en caché, obtener una nueva
      }
    );
    };

    const handleActualSubmitVote = async (voteData: { rating: number }) => { // Simplificado, asume que el modal pasa el rating
        if (!burgerData) return;
        const payload: VotePayload = {
            burger_id: burgerData.id,
            rating: voteData.rating
        };
        setSubmitError(''); setSubmitSuccess(''); setShowNotificationModal(false);
        console.log('Enviando voto:', payload);
        try {
            const response = await axios.post(
              `${API_BASE_URL}/votes/batalla`,
              voteData, // El objeto de datos va directamente como segundo argumento
              {
                  headers: {
                      'Content-Type': 'application/json',
                      // Otros headers si son necesarios
                  }
              }
            );
      
            if (response.status === 201) { // Específicamente 201 Creado
              console.log('Voto creado:', response.data);
              setIsModalOpen(false);
              setSubmitSuccess("¡Gracias por tu voto!");
              setVoteCount(prevCount => (prevCount !== null ? prevCount + 1 : 1));
              const votedKey = `voted_burger_${voteData.burger_id}`;
              localStorage.setItem(votedKey, 'true');
              setHasVotedLocally(true);
            } else {
               // Esto no debería ocurrir normalmente con axios si el status es 2xx,
               // pero lo dejamos por si acaso o si la API devuelve 200 en lugar de 201.
               console.warn("Respuesta inesperada con status 2xx:", response);
               // Tratar como éxito de todas formas?
               setIsModalOpen(false);
               // ... manejar como éxito ...
            }
      
          } catch (error) {
            console.error('Error al enviar el voto (axios):', error);
            setIsModalOpen(false); // Cierra el modal en cualquier error
      
            let userMessage = "Ocurrió un error al enviar tu voto. Inténtalo de nuevo."; // Mensaje por defecto
      
            if (error.response) {
                const detail = error.response.data?.detail;
      
                if (error.response.status === 409) { // Duplicado
                  console.warn('Voto duplicado detectado (409)');
                  setNotificationMessage("No puedes votar 2 veces por este participante");
                  setShowNotificationModal(true);
                  return;
                // ***** CORRECCIÓN: Manejar error 422 con un string *****
                } else if (error.response.status === 422) { // Error de validación
                  userMessage = "Hubo un problema con los datos enviados. Por favor, revisa el formulario.";
                  console.error("Detalles Validación (422):", detail);
                } else { // Otros errores del servidor
                  userMessage = typeof detail === 'string' ? detail : `Error del servidor (${error.response.status}).`;
                }
            } else if (error.request) { // Error de red
                userMessage = 'No se pudo conectar con el servidor. Verifica tu conexión.';
            } else { // Otros errores
                userMessage = `Ocurrió un error inesperado: ${error.message}`;
            }
            setSubmitError(userMessage); // Asigna el MENSAJE STRING al estado
          }
    };

    // --- RENDERIZADO ---
    if (!burgerData) {
        // Muestra un estado de carga o no encontrado si burgerData aún es null después del efecto
        return (
            <div className="loading-container">
                 <Loader2 className="animate-spin" size={48} />
                 <p>Buscando hamburguesa...</p>
             </div>
        );
    }

    // JSX principal del componente
    return (
        <div className="burger-profile-container">
            {/* Header */}
            <div className="burger-profile-header">
                <button className="burger-profile-back" onClick={handleGoBack} aria-label="Volver"><ArrowLeft /></button>
                <button className="burger-profile-share" onClick={handleShare} aria-label="Compartir"><Share /></button>
            </div>

            {/* Hero Image */}
            <div className="burger-profile-hero" style={{ position: 'relative', width:'100%', aspectRatio: '16/10' /* Ajusta */ }}>
                <CldImage
                    src={burgerData.image} // USA PUBLIC ID
                    alt={burgerData.name}
                    fill
                    priority
                    className="burger-profile-image" // Para estilos adicionales si necesitas
                    style={{ objectFit: 'cover' }}
                    sizes="100vw"
                />
            </div>

            {/* Content Area */}
            <div className="burger-profile-content">
                {/* Main Info */}
                <div className="burger-profile-main-info">
                    <h2 className="burger-profile-name">{burgerData.name}</h2>
                    <div className="burger-profile-restaurant-info-inline">
                        <CldImage src={burgerData.logo} alt={burgerData.restaurant} width={32} height={32} style={{ objectFit: 'contain', borderRadius:'50%' }} className="burger-profile-restaurant-logo-inline" />
                        <span className="burger-profile-restaurant-name-inline">{burgerData.restaurant}</span>
                    </div>
                    <div className="burger-profile-vote-count-inline">
                        <Star size={16} className="star-icon-inline" />
                        <span>{isLoadingCount ? '...' : (voteCount ?? 0)} Votos</span>
                    </div>
                    {burgerData.specialIngredient && (
                        <div className="burger-profile-special-tag">
                            <Sparkles size={16} className='sparkle-icon' />
                            <span>{burgerData.specialIngredient}</span>
                        </div>
                    )}
                     <div className="burger-profile-price-votes-area">
                        <p className={`${"burger-profile-card-price"} ${"prominent"}`}>
                            <strong>{formatCurrency(burgerData.price)}</strong>
                        </p>
                     </div>
                </div>

                {/* Description */}
                <div className="burger-profile-description-section">
                    <h3 className="section-title"><HandPlatter size={18} /> Descripción</h3>
                    <p className="description-text">
                        {burgerData.specialIngredient ? burgerData.description.split(burgerData.specialIngredient).map((part, index, array) => ( index === array.length - 1 ? part : <React.Fragment key={index}>{part}<span className="burger-profile-highlight">{burgerData.specialIngredient}</span></React.Fragment> )) : burgerData.description}
                    </p>
                </div>

                 {/* Messages */}
                <div className="burger-profile-messages">
                    {locationError && <p className={`${"form-message"} ${"error"}`}>{locationError}</p>}
                    {/* Errores/Éxito de Submit ahora se muestran en el modal */}
                </div>

                <div style={{ height: '100px' }}></div> {/* Spacer */}
            </div>

            {/* Fixed Actions */}
            <div className="burger-profile-actions">
                <button className={`${"burger-profile-btn"} ${"directions"}`} onClick={handleDirections} disabled={!burgerData.location?.lat}>
                     <MapPin size={18} /><span>Cómo llegar</span>
                 </button>
                 <button className={`${"burger-profile-btn"} ${"vote"}`} onClick={handleVote} disabled={isCheckingLocation || hasVotedLocally || !burgerData.location?.lat}>
                    {isCheckingLocation ? (<><Loader2 className="animate-spin" size={18} /><span>Verificando...</span></>)
                     : hasVotedLocally ? (<>✓<span> Votado</span></>)
                     : (<><Star size={18} /><span> Votar</span></>)}
                 </button>
            </div>

            {/* Modals */}
             {selectedBurgerForVote && (
                 <VotingModal
                     isOpen={isModalOpen}
                     onClose={() => setIsModalOpen(false)}
                     burger={selectedBurgerForVote}
                     onSubmit={handleActualSubmitVote}
                 />
             )}
             <NotificationModal
                 isOpen={showNotificationModal}
                 message={notificationMessage}
                 duration={submitSuccess ? 4000 : 8000}
                 onClose={() => setShowNotificationModal(false)}
                 type={submitError ? "error" : "success"}
             />
        </div>
    );
};

export default BurgerProfileClient;