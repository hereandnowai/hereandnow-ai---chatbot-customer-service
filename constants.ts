

import { Language } from './types.ts';

export const COMPANY_NAME = "HEREANDNOW AI RESEARCH INSTITUTE";
export const COMPANY_LOGO_URL = "https://raw.githubusercontent.com/hereandnowai/images/refs/heads/main/logos/HNAI%20Fevicon%20-Teal%20%26%20Golden%20Logo%20-%20DESIGN%203%20-%20Raj-03.png";
export const COMPANY_IMAGE_URL = "https://raw.githubusercontent.com/hereandnowai/images/refs/heads/main/logos/HNAI%20Title%20-Teal%20%26%20Golden%20Logo%20-%20DESIGN%203%20-%20Raj-07.png";

export const CHATBOT_NAME = "AI Support Assistant"; // Updated Name

export const INITIAL_BOT_GREETING = `Hello! I'm ${CHATBOT_NAME} from ${COMPANY_NAME}. How can I help you today? You can ask me about our institute, meeting schedules, or class information.`;

export const CHAT_SUGGESTED_PROMPTS: string[] = [
  "Tell me about the institute.",
  "How can I book a meeting?",
  "What classes do you offer?",
  "What are your key research areas?"
];

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en-US', name: 'English (US)', englishName: 'English' },
  { code: 'en-IN', name: 'English (India)', englishName: 'English' },
  { code: 'es-ES', name: 'Español (España)', englishName: 'Spanish' },
  { code: 'fr-FR', name: 'Français (France)', englishName: 'French' },
  { code: 'de-DE', name: 'Deutsch (Deutschland)', englishName: 'German' },
  { code: 'hi-IN', name: 'हिन्दी (भारत)', englishName: 'Hindi' },
  { code: 'ja-JP', name: '日本語 (日本)', englishName: 'Japanese' },
  { code: 'pt-BR', name: 'Português (Brasil)', englishName: 'Portuguese' },
  { code: 'ta-IN', name: 'தமிழ் (இந்தியா)', englishName: 'Tamil' },
  { code: 'ko-KR', name: '한국어 (대한민국)', englishName: 'Korean' },
  { code: 'it-IT', name: 'Italiano (Italia)', englishName: 'Italian' },
  { code: 'ar-SA', name: 'العربية (المملكة العربية السعودية)', englishName: 'Arabic' },
  { code: 'ru-RU', name: 'Русский (Россия)', englishName: 'Russian' },
  { code: 'zh-CN', name: '简体中文 (中国)', englishName: 'Chinese (Simplified)' },
];
export const DEFAULT_LANGUAGE_CODE = 'en-US';

// Settings Page Content
export const SETTINGS_APP_VERSION = "1.2.0 (Demo)"; // Version updated for login changes
export const SETTINGS_ABOUT_DESCRIPTION = `This application provides an AI-powered chat interface to assist users with inquiries related to ${COMPANY_NAME}. It can provide information about the institute, help with pre-booking meetings, and give details on class schedules.`;

export const SETTINGS_HOW_TO_USE: string[] = [
  "Navigate to the 'Login' page from the header or Home page.",
  "Enter any username and password of your choice to start your demo session. The username will be remembered for the session.",
  "Once logged in, go to the 'Chat' page.",
  "Type your questions or use the microphone for voice input in the chat interface.",
  "Select your preferred language from the dropdown menu for interaction (translations are handled by the AI).",
  "Use the suggested prompts for quick inquiries.",
  "Explore the 'Settings' page for more information about the app and its features.",
  "Toggle between light and dark themes using the sun/moon icon in the header.",
  "Log out using the 'Logout' button in the header when done."
];

export const SETTINGS_KEY_FEATURES: string[] = [
  "AI-powered responses for institute-related queries.",
  "Assistance with pre-booking meetings (information gathering).",
  "Information on class schedules and offerings.",
  "Multi-language support with automatic translation.",
  "Voice input for chat messages (browser dependent).",
  "Flexible demo login: use any username/password to simulate individual sessions.",
  "Responsive design for various screen sizes.",
  "User-friendly interface with light and dark themes."
];

export const SETTINGS_DATA_PRIVACY = `This is a demonstration application. For the purpose of this demo, chat interactions may be processed by Google's Gemini API. User-entered usernames for demo login, theme, and language preferences are stored locally in your browser. In a production environment, ${COMPANY_NAME} would have a comprehensive data privacy policy. For this demo, avoid entering sensitive personal information.`;


export const COMPANY_INFO_DATA = {
  name: COMPANY_NAME,
  description: "HEREANDNOW AI RESEARCH INSTITUTE is a forward-thinking organization dedicated to advancing the frontiers of Artificial Intelligence. We focus on cutting-edge research, development of innovative AI solutions, fostering a community of AI enthusiasts and professionals, and providing educational programs.",
  mission: "Our mission is to harness the power of AI to solve complex global challenges, educate the next generation of AI leaders, and create a better future for all.",
  vision: "We envision a world where AI seamlessly integrates with human endeavors, augmenting capabilities, unlocking new possibilities, and is accessible through quality education and research.",
  key_areas: ["Machine Learning", "Natural Language Processing", "Computer Vision", "Robotics", "AI Ethics", "Educational Programs", "AI Workshops"],
  contact: "For more detailed inquiries, or for follow-ups regarding meeting schedules or class registrations after our chat, our team will reach out. You can also visit our (fictional) website at www.hereandnow.ai."
};

const companyKeyAreasString = COMPANY_INFO_DATA.key_areas.join(', ');

export const SYSTEM_INSTRUCTION = `You are "${CHATBOT_NAME}," a professional, friendly, and helpful AI assistant for "${COMPANY_NAME}".
You communicate exclusively in English. If a user's query was translated from another language into English for you, your English response will be translated back to the user's language by the system.
Your primary goal is to assist users with their enquiries about the institute, help them with pre-booking meeting schedules, provide information about our classes and their schedules, and guide them on how to access and benefit from our institute's offerings.

Your main responsibilities:
1.  **Initial Greeting**: The system sends the first message: "${INITIAL_BOT_GREETING}". Your first response should directly address the user's subsequent query. Do not repeat the greeting.
2.  **General Enquiries**: Answer questions about ${COMPANY_NAME} using the information provided in COMPANY_INFO_DATA.
3.  **Meeting Pre-booking**:
    *   If a user expresses interest in scheduling or pre-booking a meeting:
    *   Explain that you can help them initiate this process.
    *   Politely request their full name, email address, the primary purpose or topic of the meeting, and any general preferred availability (e.g., "next week," "afternoons," specific days if they offer). Phrase this like: "I can certainly help you with scheduling a meeting. To get started, could you please provide your full name, email address, the main reason for the meeting, and any general preferences for dates or times?"
    *   Once you have this information, confirm receipt (e.g., "Thank you, [Name]. I have your request for a meeting about [purpose].").
    *   Then, inform them: "A member of the ${COMPANY_NAME} team will contact you at [user's email] to confirm the details and finalize the meeting schedule. We'll do our best to accommodate your preferences."
    *   Do NOT attempt to access or modify any calendar, or promise specific time slots. Your role is to gather information for a human follow-up.
4.  **Class Schedules & Information**:
    *   If a user asks about classes, courses, workshops, or their schedules:
    *   You can provide general information based on ${COMPANY_NAME}'s key areas (e.g., "We offer a range of programs and workshops in areas like Machine Learning, AI Ethics, and more.").
    *   If they ask for specific schedules, timings, or how to register/enroll:
        *   Politely request their full name and email address if not already provided.
        *   Inform them: "For the most up-to-date class schedules, specific timings, and registration details, our dedicated team can best assist you. I've noted your interest in [topic, if specified]. Someone from our team will email you at [user's email] with the latest information and guide you through the next steps. Would you like me to do that?"
        *   If they only want general information without providing details, you can say: "${COMPANY_NAME} focuses on several key areas such as ${companyKeyAreasString}, which often form the basis of our educational offerings. For detailed and current class information, our academic advisors or program coordinators are the best point of contact. I can note your general interest if you'd like."
5.  **Accessing Benefits / Getting Involved**:
    *   If a user asks how to access benefits from the institute, or how to get involved:
    *   Explain that benefits often come from engaging with research, participating in educational programs (courses/workshops), attending events, or exploring collaboration opportunities.
    *   To provide relevant guidance, ask clarifying questions like: "That's a great question! To help you get the most from ${COMPANY_NAME}, could you tell me a bit more about what kind of benefits or involvement you're looking for? For example, are you interested in our research, educational programs, potential collaborations, or something else?"
    *   Based on their response, provide general information and guide them towards the appropriate contact method (e.g., suggesting they provide their email for follow-up by a relevant team member).
6.  **Clarification and Information Gathering**: If a query is ambiguous, ask for clarification. If a query requires information you don't have, state that you don't have the specific information but can take their details for someone from the team to follow up.
7.  **Professionalism and Tone**: Maintain a professional, empathetic, and patient tone. Avoid jargon where possible, or explain it clearly. Do not express personal opinions or engage in off-topic conversations.
8.  **Scope Limitation**: Clearly state if a request is outside your capabilities (e.g., "I can't perform actions outside of providing information and initiating pre-bookings. For direct technical support or financial transactions, please refer to our official website or contact details provided by our team.").
9.  **Language Adherence**: Always respond in English, regardless of the original language of the user's query (as it will be translated for you). The system will handle translating your English response back to the user's language. Do not attempt to translate or acknowledge the original language directly.
10. **Data Privacy Reminder (Implicit)**: While you don't need to explicitly state a privacy policy in every message, your interactions should reflect respect for user data.`;

export const COMPANY_CONTACT_DETAILS = {
  email: "contact@hereandnow.ai (fictional)",
  website: "www.hereandnow.ai (fictional)"
  // Phone and address explicitly excluded as per user request
};

export const COMPANY_SOCIAL_MEDIA = [
  { name: 'LinkedIn', url: 'https://linkedin.com/company/hereandnow-ai-fictional', iconPath: 'M16.338 16.338H13.67V12.16c0-.996-.017-2.277-1.387-2.277-1.389 0-1.601 1.086-1.601 2.206v4.249H8.014V8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.71zM5.59 7.417a2.002 2.002 0 100-4.004 2.002 2.002 0 000 4.004zM6.887 16.338H4.29V8.59h2.597v7.748zM18 1H6c-1.103 0-2 .897-2 2v18c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2V3c0-1.103-.897-2-2-2z' }, // Example path for LinkedIn
  { name: 'X (Twitter)', url: 'https://twitter.com/hereandnowai_fictional', iconPath: 'M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z' }, // Example path for X
  { name: 'Facebook', url: 'https://facebook.com/hereandnowai.fictional', iconPath: 'M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.36 9.5 5.32V7.46H6.17v4.2h3.33V22h4.2V11.66h3.96l.67-4.2z' }, // Example path for Facebook
  { name: 'Instagram', url: 'https://instagram.com/hereandnowai_fictional', iconPath: 'M12 2.163c3.204 0 3.584.012 4.85.07 1.272.058 2.166.248 2.914.552.796.322 1.488.784 2.174 1.47S22.056 6.3 22.378 7.1c.304.748.494 1.642.552 2.914.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.058 1.272-.248 2.166-.552 2.914-.322.796-.784 1.488-1.47 2.174s-1.378 1.152-2.174 1.47c-.748.304-1.642.494-2.914.552-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.272-.058-2.166-.248-2.914-.552-.796-.322-1.488-.784-2.174-1.47S1.944 17.7 1.622 16.9c-.304-.748-.494-1.642-.552-2.914-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.058-1.272.248-2.166.552-2.914.322-.796.784-1.488 1.47-2.174S5.622 2.784 6.42.552C7.168.248 8.062.058 9.334.07 10.6.012 10.976 0 14.18 0zm0 2.88c-3.116 0-3.486.01-4.708.066-1.15.053-1.88.232-2.522.484-.69.278-1.254.677-1.816 1.24S1.9 8.27 1.62 8.96c-.252.642-.43 1.372-.484 2.523C1.08 12.632 1.07 13.002 1.07 16.12s.01 3.487.066 4.71c.053 1.15.232 1.88.484 2.522.278.69.677 1.254 1.24 1.816s1.125 1.136 1.816 1.417c.642.252 1.372.43 2.523.484 1.222.057 1.592.066 4.71.066s3.487-.01 4.71-.066c1.15-.053 1.88-.232 2.522-.484.69-.278 1.254-.677 1.816-1.24s1.136-1.125 1.417-1.816c.252-.642.43-1.372.484-2.523.057-1.222.066-1.592.066-4.71s-.01-3.487-.066-4.71c-.053-1.15-.232-1.88-.484-2.522-.278-.69-.677-1.254-1.24-1.816S17.72 2.223 16.9.917c-.642-.252-1.372-.43-2.523-.484C13.167 1.373 12.797 1.36 9.68 1.36h.002zm0 16.946a6.002 6.002 0 100-12.004 6.002 6.002 0 000 12.004zm0-9.61a3.607 3.607 0 110 7.214 3.607 3.607 0 010-7.214zm9.262-5.94a1.44 1.44 0 100-2.88 1.44 1.44 0 000 2.88z' }, // Example path for Instagram
];
