export enum MessageSender {
  USER = 'USER',
  BOT = 'BOT',
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: MessageSender;
  timestamp: Date;
  originalText?: string; // For user messages if translation occurs
  translatedText?: string; // For bot messages if translation occurs
  languageCode?: string; // To store the language of the message
}

export type Page = 'HOME' | 'CHAT' | 'SETTINGS' | 'LOGIN';

export interface Language {
  code: string; // e.g., 'en-US', 'es-ES'
  name: string; // e.g., 'English (US)', 'Español (España)'
  englishName: string; // e.g., 'English', 'Spanish' - for translation prompts
}