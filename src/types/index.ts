export type ButtonSize = 'normal' | 'large' | 'xl';
export type TextSize = 'normal' | 'large' | 'xl';
export type ContrastMode = 'normal' | 'high';
export type AccessMode = 'direct' | 'scanning';
export type PresetMode = 'direct' | 'simplified' | 'scanning' | 'custom';

export interface Category {
  id: string;
  name: string;
  iconName: string;
  description: string;
  colorClass: string;
}

export interface PhraseItem {
  id: string;
  categoryId: string;
  text: string;
  iconName: string;
  isFavorite?: boolean;
  isCustom?: boolean;
}

export interface MessageToken {
  id: string;
  phraseId?: string;
  text: string;
  iconName: string;
}

export interface UserSettings {
  buttonSize: ButtonSize;
  textSize: TextSize;
  contrast: ContrastMode;
  columns: number;
  accessMode: AccessMode;
  scanInterval: number; // in seconds, e.g. 1.5, 2.0, 2.5
  scanFeedbackSound: boolean;
  speechRate: number; // 0.7 to 1.3
  speechVoiceUri: string;
  activePreset: PresetMode;
  visibleCategories: string[];
  hasSeenWelcome: boolean;
}
