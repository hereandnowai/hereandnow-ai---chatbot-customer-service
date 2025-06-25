
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { SYSTEM_INSTRUCTION } from '../constants.ts';

let ai: GoogleGenAI | null = null;
let chatInstance: Chat | null = null;

const getApiKey = (): string | undefined => {
  // @ts-ignore
  return typeof process !== 'undefined' && process.env && process.env.API_KEY ? process.env.API_KEY : window.API_KEY;
};

const ensureAiInitialized = (): GoogleGenAI => {
  if (!ai) {
    const apiKey = getApiKey();
    if (!apiKey) {
      console.error("API_KEY is not set for AI initialization.");
      throw new Error("API_KEY is not configured. AI services cannot function.");
    }
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
}

export const initializeChat = (): Chat => {
  ensureAiInitialized(); // Ensures 'ai' is initialized
  
  if (!chatInstance) {
    if (!ai) throw new Error("GoogleGenAI instance not available for chat initialization."); // Should be caught by ensureAiInitialized
    chatInstance = ai.chats.create({
      model: 'gemini-2.5-flash-preview-04-17',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });
  }
  return chatInstance;
};

export const clearChatInstance = (): void => {
  chatInstance = null;
  // console.log("Chat instance cleared."); // Optional: for debugging
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  if (!chatInstance) {
    try {
      initializeChat();
    } catch (error) {
      if (error instanceof Error) {
        return `Error initializing chat: ${error.message}`;
      }
      return "An unknown error occurred while initializing chat.";
    }
  }
  
  if (!chatInstance) { 
     return "Chat not initialized. Cannot send message.";
  }

  try {
    const response: GenerateContentResponse = await chatInstance.sendMessage({ message });
    return response.text;
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    if (error instanceof Error) {
        if (error.message.includes("API key not valid")) {
             return "There was an issue with the API configuration. Please contact support.";
        }
         return `Sorry, I encountered an error: ${error.message}. Please try again later.`;
    }
    return "Sorry, I encountered an unknown error. Please try again later.";
  }
};

export const translateTextViaGemini = async (
  text: string,
  sourceLangName: string, // e.g., "Spanish"
  targetLangName: string  // e.g., "English"
): Promise<string> => {
  const currentAi = ensureAiInitialized(); // Ensures 'ai' is initialized and available

  const prompt = `Translate the following text from ${sourceLangName} to ${targetLangName}.
IMPORTANT: Respond ONLY with the translated text and nothing else. Do not add any introductory phrases, explanations, or any text other than the direct translation.

Text to translate:
"${text}"`;

  try {
    const response: GenerateContentResponse = await currentAi.models.generateContent({
        model: 'gemini-2.5-flash-preview-04-17',
        contents: prompt,
        config: {
          temperature: 0.2, // Lower temperature for more deterministic translation
        }
    });
    return response.text.trim();
  } catch (error) {
    console.error(`Error translating text from ${sourceLangName} to ${targetLangName}:`, error);
    if (error instanceof Error) {
        throw new Error(`Translation service failed: ${error.message}. Original text: "${text}"`);
    }
    throw new Error(`Unknown error during translation. Original text: "${text}"`);
  }
};