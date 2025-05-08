// src/types/index.ts

// Estructura de un objeto Destino (ajusta según tu API)
export interface DestinoType {
  id: string | number;
  municipio: string;
  departamento: string;
  frase: string;
  img: string; // URL de la imagen
  calificacion?: number; // Opcional
  items?: Record<string, any>; // O una interfaz más específica
  slug: string;
}

// Estructura de un mensaje de Chat
export interface ChatMessage {
  text: string;
  sender: 'user' | 'ai';
}

// Puedes añadir más tipos/interfaces aquí