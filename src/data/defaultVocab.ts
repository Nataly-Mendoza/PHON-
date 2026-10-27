import { Category, PhraseItem, UserSettings } from '../types';

export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'basicas',
    name: 'Necesidades básicas',
    iconName: 'Droplets',
    description: 'Comida, bebida, descanso y asistencia personal',
    colorClass: 'border-blue-500 bg-blue-50 text-blue-900',
  },
  {
    id: 'salud',
    name: 'Salud y bienestar',
    iconName: 'Activity',
    description: 'Dolor, medicación, postura y confort físico',
    colorClass: 'border-sky-600 bg-sky-50 text-sky-950',
  },
  {
    id: 'emociones',
    name: 'Emociones',
    iconName: 'HeartHandshake',
    description: 'Estados de ánimo, sentimientos y cómo me encuentro',
    colorClass: 'border-indigo-600 bg-indigo-50 text-indigo-950',
  },
  {
    id: 'conversacion',
    name: 'Conversación',
    iconName: 'MessageSquare',
    description: 'Saludos, acuerdos, opiniones y respuestas sociales',
    colorClass: 'border-blue-700 bg-blue-50 text-blue-950',
  },
  {
    id: 'actividades',
    name: 'Actividades cotidianas',
    iconName: 'Compass',
    description: 'Música, descanso, entretenimiento y salidas',
    colorClass: 'border-cyan-600 bg-cyan-50 text-cyan-950',
  },
  {
    id: 'relaciones',
    name: 'Personas y relaciones',
    iconName: 'Users',
    description: 'Familiares, asistentes, médicos y privacidad',
    colorClass: 'border-blue-600 bg-blue-50 text-blue-950',
  },
  {
    id: 'estudio_trabajo',
    name: 'Trabajo, estudio y trámites',
    iconName: 'Laptop',
    description: 'Dispositivos, consultas, tiempos y decisiones',
    colorClass: 'border-slate-700 bg-slate-50 text-slate-900',
  },
  {
    id: 'personalizados',
    name: 'Personalizados',
    iconName: 'Bookmark',
    description: 'Tus frases propias y favoritas creadas en PHONÉ',
    colorClass: 'border-amber-600 bg-amber-50 text-amber-950',
  },
];

export const INITIAL_PHRASES: PhraseItem[] = [
  // Necesidades básicas
  { id: 'b-1', categoryId: 'basicas', text: 'Tengo sed', iconName: 'Droplets', isFavorite: true },
  { id: 'b-2', categoryId: 'basicas', text: 'Quiero ir al baño', iconName: 'Bath', isFavorite: true },
  { id: 'b-3', categoryId: 'basicas', text: 'Necesito ayuda', iconName: 'Handshake', isFavorite: true },
  { id: 'b-4', categoryId: 'basicas', text: 'Quiero descansar', iconName: 'Bed', isFavorite: true },
  { id: 'b-5', categoryId: 'basicas', text: 'Tengo hambre', iconName: 'Utensils', isFavorite: false },
  { id: 'b-6', categoryId: 'basicas', text: 'Tengo frío', iconName: 'ThermometerSnowflake', isFavorite: false },
  { id: 'b-7', categoryId: 'basicas', text: 'Tengo calor', iconName: 'ThermometerSun', isFavorite: false },
  { id: 'b-8', categoryId: 'basicas', text: 'Me siento incómodo/a', iconName: 'AlertCircle', isFavorite: false },

  // Salud y bienestar
  { id: 's-1', categoryId: 'salud', text: 'Me duele algo', iconName: 'AlertCircle', isFavorite: true },
  { id: 's-2', categoryId: 'salud', text: 'Necesito mi medicamento', iconName: 'Pill', isFavorite: true },
  { id: 's-3', categoryId: 'salud', text: 'Necesito cambiar de postura', iconName: 'RefreshCw', isFavorite: true },
  { id: 's-4', categoryId: 'salud', text: 'Me siento mareado/a', iconName: 'Activity', isFavorite: false },
  { id: 's-5', categoryId: 'salud', text: 'Estoy cansado/a', iconName: 'Bed', isFavorite: false },
  { id: 's-6', categoryId: 'salud', text: 'Me cuesta respirar bien', iconName: 'Activity', isFavorite: false },
  { id: 's-7', categoryId: 'salud', text: 'Ya me siento mejor', iconName: 'CheckCircle2', isFavorite: false },
  { id: 's-8', categoryId: 'salud', text: 'Por favor, acomoda mi cabeza', iconName: 'RefreshCw', isFavorite: false },

  // Emociones
  { id: 'e-1', categoryId: 'emociones', text: 'Estoy contento/a', iconName: 'Smile', isFavorite: true },
  { id: 'e-2', categoryId: 'emociones', text: 'Me siento frustrado/a', iconName: 'Frown', isFavorite: true },
  { id: 'e-3', categoryId: 'emociones', text: 'Me siento tranquilo/a', iconName: 'HeartHandshake', isFavorite: false },
  { id: 'e-4', categoryId: 'emociones', text: 'Estoy preocupado/a', iconName: 'AlertCircle', isFavorite: false },
  { id: 'e-5', categoryId: 'emociones', text: 'Necesito un momento', iconName: 'Clock', isFavorite: true },
  { id: 'e-6', categoryId: 'emociones', text: 'Me siento agradecido/a', iconName: 'Sparkles', isFavorite: false },
  { id: 'e-7', categoryId: 'emociones', text: 'Tengo paciencia', iconName: 'Clock', isFavorite: false },

  // Conversación
  { id: 'c-1', categoryId: 'conversacion', text: 'Hola, ¿cómo estás?', iconName: 'MessageSquare', isFavorite: true },
  { id: 'c-2', categoryId: 'conversacion', text: 'Buenos días', iconName: 'Smile', isFavorite: false },
  { id: 'c-3', categoryId: 'conversacion', text: 'Muchas gracias', iconName: 'HeartHandshake', isFavorite: true },
  { id: 'c-4', categoryId: 'conversacion', text: 'Por favor, espera', iconName: 'Clock', isFavorite: true },
  { id: 'c-5', categoryId: 'conversacion', text: 'Estoy de acuerdo', iconName: 'ThumbsUp', isFavorite: true },
  { id: 'c-6', categoryId: 'conversacion', text: 'No estoy de acuerdo', iconName: 'ThumbsDown', isFavorite: true },
  { id: 'c-7', categoryId: 'conversacion', text: 'Quiero hablar contigo', iconName: 'MessageSquare', isFavorite: true },
  { id: 'c-8', categoryId: 'conversacion', text: 'No entiendo', iconName: 'HelpCircle', isFavorite: true },
  { id: 'c-9', categoryId: 'conversacion', text: 'Quiero decidir por mí', iconName: 'UserCheck', isFavorite: true },
  { id: 'c-10', categoryId: 'conversacion', text: 'Hasta luego', iconName: 'MessageSquare', isFavorite: false },

  // Actividades cotidianas
  { id: 'a-1', categoryId: 'actividades', text: 'Quiero escuchar música', iconName: 'Music', isFavorite: true },
  { id: 'a-2', categoryId: 'actividades', text: 'Quiero ver la tele o videos', iconName: 'Tv', isFavorite: false },
  { id: 'a-3', categoryId: 'actividades', text: 'Quiero salir a dar una vuelta', iconName: 'Compass', isFavorite: true },
  { id: 'a-4', categoryId: 'actividades', text: 'Quiero leer', iconName: 'BookOpen', isFavorite: false },
  { id: 'a-5', categoryId: 'actividades', text: 'Quiero estar acompañado/a', iconName: 'Users', isFavorite: false },
  { id: 'a-6', categoryId: 'actividades', text: 'Quiero estar solo/a un momento', iconName: 'Clock', isFavorite: false },

  // Personas y relaciones
  { id: 'p-1', categoryId: 'relaciones', text: 'Quiero ver a mi familia', iconName: 'Users', isFavorite: true },
  { id: 'p-2', categoryId: 'relaciones', text: 'Necesito a mi asistente', iconName: 'User', isFavorite: true },
  { id: 'p-3', categoryId: 'relaciones', text: 'Quiero hablar con el médico', iconName: 'Activity', isFavorite: false },
  { id: 'p-4', categoryId: 'relaciones', text: 'Quiero privacidad', iconName: 'Shield', isFavorite: true },
  { id: 'p-5', categoryId: 'relaciones', text: 'Necesito llamar a alguien', iconName: 'PhoneCall', isFavorite: false },
  { id: 'p-6', categoryId: 'relaciones', text: 'Te aprecio mucho', iconName: 'HeartHandshake', isFavorite: false },

  // Trabajo, estudio y trámites
  { id: 't-1', categoryId: 'estudio_trabajo', text: 'Necesito mi computadora', iconName: 'Laptop', isFavorite: true },
  { id: 't-2', categoryId: 'estudio_trabajo', text: 'Necesito más tiempo', iconName: 'Clock', isFavorite: true },
  { id: 't-3', categoryId: 'estudio_trabajo', text: 'Quiero revisar mi correo', iconName: 'Mail', isFavorite: false },
  { id: 't-4', categoryId: 'estudio_trabajo', text: 'Tengo una duda', iconName: 'HelpCircle', isFavorite: true },
  { id: 't-5', categoryId: 'estudio_trabajo', text: 'Quiero tomar notas', iconName: 'FileText', isFavorite: false },
  { id: 't-6', categoryId: 'estudio_trabajo', text: 'Todo está listo', iconName: 'CheckCircle2', isFavorite: false },

  // Personalizados iniciales
  { id: 'cust-1', categoryId: 'personalizados', text: 'Por favor, mírame cuando te hablo', iconName: 'Smile', isFavorite: true, isCustom: true },
  { id: 'cust-2', categoryId: 'personalizados', text: 'Dame un minuto para terminar la idea', iconName: 'Clock', isFavorite: true, isCustom: true },
];

export const DEFAULT_SETTINGS: UserSettings = {
  buttonSize: 'large',
  textSize: 'large',
  contrast: 'normal',
  columns: 4,
  accessMode: 'direct',
  scanInterval: 2.0,
  scanFeedbackSound: true,
  speechRate: 0.95,
  speechVoiceUri: '',
  activePreset: 'direct',
  visibleCategories: DEFAULT_CATEGORIES.map(c => c.id),
  hasSeenWelcome: false,
};

export const PRESET_CONFIGS: Record<'direct' | 'simplified' | 'scanning', Partial<UserSettings>> = {
  direct: {
    activePreset: 'direct',
    accessMode: 'direct',
    buttonSize: 'large',
    textSize: 'large',
    contrast: 'normal',
    columns: 4,
  },
  simplified: {
    activePreset: 'simplified',
    accessMode: 'direct',
    buttonSize: 'xl',
    textSize: 'xl',
    contrast: 'normal',
    columns: 2,
  },
  scanning: {
    activePreset: 'scanning',
    accessMode: 'scanning',
    buttonSize: 'large',
    textSize: 'large',
    scanInterval: 2.0,
    scanFeedbackSound: true,
    columns: 3,
  },
};
