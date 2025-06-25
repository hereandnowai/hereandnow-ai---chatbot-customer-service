
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChatMessage, MessageSender, Page, Language } from './types.ts';
import { initializeChat, sendMessageToGemini, translateTextViaGemini, clearChatInstance } from './services/geminiService.ts';
import ChatInterface from './components/ChatInterface.tsx';
import HomePage from './components/HomePage.tsx';
import SettingsPage from './components/SettingsPage.tsx';
import LoginPage from './components/LoginPage.tsx'; 
import { 
    COMPANY_NAME, 
    COMPANY_LOGO_URL, 
    INITIAL_BOT_GREETING, 
    CHATBOT_NAME,
    CHAT_SUGGESTED_PROMPTS,
    SUPPORTED_LANGUAGES,
    DEFAULT_LANGUAGE_CODE
} from './constants.ts';

type Theme = 'light' | 'dark';

// Speech Recognition Type Definitions (omitted for brevity, assume they are the same)
interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string; 
  readonly message: string; 
}
interface SpeechRecognitionAlternative {
  readonly transcript: string; 
  readonly confidence: number; 
}
interface SpeechRecognitionResult {
  readonly isFinal: boolean; 
  readonly length: number; 
  item(index: number): SpeechRecognitionAlternative; 
  [index: number]: SpeechRecognitionAlternative; 
}
interface SpeechRecognitionResultList {
  readonly length: number; 
  item(index: number): SpeechRecognitionResult; 
  [index: number]: SpeechRecognitionResult; 
}
interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number; 
  readonly results: SpeechRecognitionResultList; 
}
interface SpeechRecognitionStatic {
  new(): SpeechRecognition;
}
interface SpeechRecognition extends EventTarget {
  grammars: any; 
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  serviceURI?: string; 
  start(): void;
  stop(): void;
  abort(): void;
  onaudiostart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onsoundstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onsoundend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onaudioend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onnomatch: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null; 
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
}

declare global {
  interface Window {
    SpeechRecognition: SpeechRecognitionStatic | undefined;
    webkitSpeechRecognition: SpeechRecognitionStatic | undefined;
  }
}

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [chatInitialized, setChatInitialized] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>('HOME');
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    return (savedTheme === 'light' || savedTheme === 'dark') ? savedTheme : 'dark';
  });
  const [selectedLanguageCode, setSelectedLanguageCode] = useState<string>(() => {
    return localStorage.getItem('selectedLanguage') || DEFAULT_LANGUAGE_CODE;
  });
  const [currentUser, setCurrentUser] = useState<string | null>(() => {
    return localStorage.getItem('currentUser');
  });
  const [redirectToAfterLogin, setRedirectToAfterLogin] = useState<Page | null>(null);

  const isLoggedIn = !!currentUser;

  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isMicrophoneSupported, setIsMicrophoneSupported] = useState<boolean>(true);
  const [microphoneError, setMicrophoneError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const selectedLanguageCodeRef = useRef(selectedLanguageCode);

  useEffect(() => {
    selectedLanguageCodeRef.current = selectedLanguageCode;
    localStorage.setItem('selectedLanguage', selectedLanguageCode);
  }, [selectedLanguageCode]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', currentUser);
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newLangCode = event.target.value;
    setSelectedLanguageCode(newLangCode);
    if (chatInitialized && messages.length > 0 && messages[0].text.includes(COMPANY_NAME)) {
        translateInitialGreeting(newLangCode, true);
    }
  };
  
  const findLanguageName = (code: string, type: 'englishName' | 'name' = 'englishName'): string => {
    return SUPPORTED_LANGUAGES.find(lang => lang.code === code)?.[type] || 'English';
  };

  const translateInitialGreeting = async (targetLangCode: string, replaceCurrent: boolean = false) => {
    let greetingText = INITIAL_BOT_GREETING;
    if (targetLangCode !== DEFAULT_LANGUAGE_CODE) {
      const targetLangName = findLanguageName(targetLangCode);
      try {
        setIsLoading(true);
        greetingText = await translateTextViaGemini(INITIAL_BOT_GREETING, findLanguageName(DEFAULT_LANGUAGE_CODE), targetLangName);
      } catch (translateError) {
        console.error("Failed to translate initial greeting:", translateError);
        greetingText = INITIAL_BOT_GREETING + (translateError instanceof Error ? ` (Translation to ${targetLangName} failed)` : '');
      } finally {
        setIsLoading(false);
      }
    }
    
    const newGreetingMessage: ChatMessage = {
      id: crypto.randomUUID(),
      text: greetingText,
      sender: MessageSender.BOT,
      timestamp: new Date(),
      languageCode: targetLangCode,
    };

    if (replaceCurrent && messages.length > 0) {
        setMessages(prev => [newGreetingMessage, ...prev.slice(1)]);
    } else if (!replaceCurrent) {
        setMessages([newGreetingMessage]);
    }
  };

  const initChatSession = useCallback(async () => {
    if (chatInitialized || !isLoggedIn) return; // Only init if logged in
    try {
      initializeChat();
      await translateInitialGreeting(selectedLanguageCodeRef.current);
      setChatInitialized(true);
      setError(null);
    } catch (e) {
      let initErrorMessage = "An unknown error occurred during initialization.";
      if (e instanceof Error) {
        initErrorMessage = `Failed to initialize chatbot: ${e.message}. Please ensure API_KEY is correctly configured and try refreshing.`;
      }
      setError(initErrorMessage);
      setMessages([]);
      setChatInitialized(false);
    }
  }, [chatInitialized, isLoggedIn]);

  useEffect(() => {
    if (currentPage === 'CHAT' && isLoggedIn && !chatInitialized) {
      initChatSession();
    }
  }, [currentPage, isLoggedIn, chatInitialized, initChatSession]);


  useEffect(() => {
    // Page access control
    if (currentPage === 'CHAT' && !isLoggedIn) {
      setRedirectToAfterLogin('CHAT');
      setCurrentPage('LOGIN');
    } else if (currentPage === 'LOGIN' && isLoggedIn) {
      setCurrentPage(redirectToAfterLogin || 'HOME');
      setRedirectToAfterLogin(null);
    }
  }, [currentPage, isLoggedIn, redirectToAfterLogin]);


  useEffect(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      setIsMicrophoneSupported(false);
      setMicrophoneError("Speech recognition is not supported by your browser.");
    } else {
      setIsMicrophoneSupported(true);
    }
  }, []);

  const handleToggleRecording = useCallback(() => {
    if (!isMicrophoneSupported) return;

    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
    } else {
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognitionAPI) {
        setMicrophoneError("Speech recognition API not found.");
        return;
      }
      
      const recognition = new SpeechRecognitionAPI();
      recognition.continuous = false; 
      recognition.interimResults = true; 
      recognition.lang = selectedLanguageCodeRef.current;

      recognition.onstart = () => setIsRecording(true);
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interimTranscript = '';
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        setUserInput(finalTranscript + interimTranscript);
      };
      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        let errMsg = `Speech recognition error: ${event.error}.`;
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          errMsg = "Microphone access denied. Please enable microphone permissions in your browser settings and refresh.";
        } else if (event.error === 'no-speech') {
          errMsg = "No speech was detected. Please try again.";
        } else if (event.error === 'language-not-supported') {
            errMsg = `The selected language (${findLanguageName(selectedLanguageCodeRef.current, 'name')}) is not supported for speech input by your browser.`;
        }
        setMicrophoneError(errMsg);
        setIsRecording(false);
      };
      recognition.onend = () => setIsRecording(false);
      try {
        recognition.start();
        recognitionRef.current = recognition;
      } catch (err) {
        console.error("Error starting speech recognition:", err);
        setMicrophoneError("Could not start speech recognition. Please ensure microphone is available and permissions are granted.");
        setIsRecording(false);
      }
    }
  }, [isRecording, isMicrophoneSupported]);

  const processAndSendUserMessage = useCallback(async (messageText: string) => {
    if (!messageText.trim() || isLoading || !chatInitialized || !isLoggedIn) return;

    if (isRecording && recognitionRef.current) {
        recognitionRef.current.stop(); 
    }

    const currentSelectedLangCode = selectedLanguageCodeRef.current;
    const userMessageLangName = findLanguageName(currentSelectedLangCode);

    const newUserMessage: ChatMessage = {
      id: crypto.randomUUID(),
      text: messageText,
      sender: MessageSender.USER,
      timestamp: new Date(),
      languageCode: currentSelectedLangCode,
    };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setUserInput(''); 
    setIsLoading(true);
    setError(null);

    let textToSendToBot = messageText;
    let translationErrorOccurred = false;

    try {
      if (currentSelectedLangCode !== DEFAULT_LANGUAGE_CODE) {
        try {
          textToSendToBot = await translateTextViaGemini(messageText, userMessageLangName, findLanguageName(DEFAULT_LANGUAGE_CODE));
        } catch (transError) {
          console.error("User input translation error:", transError);
          textToSendToBot = messageText;
          translationErrorOccurred = true;
        }
      }

      const botResponseInEnglish = await sendMessageToGemini(textToSendToBot);
      let finalBotResponseForUser = botResponseInEnglish;

      if (currentSelectedLangCode !== DEFAULT_LANGUAGE_CODE) {
        try {
          finalBotResponseForUser = await translateTextViaGemini(botResponseInEnglish, findLanguageName(DEFAULT_LANGUAGE_CODE), userMessageLangName);
        } catch (transError) {
          console.error("Bot response translation error:", transError);
          finalBotResponseForUser = botResponseInEnglish;
          finalBotResponseForUser += ` (Note: Translation to ${userMessageLangName} failed. Displaying in English.)`;
        }
      }
      
      if (translationErrorOccurred && currentSelectedLangCode !== DEFAULT_LANGUAGE_CODE) {
          finalBotResponseForUser = `(Note: There was an issue understanding your input in ${userMessageLangName}. I'll try my best based on the original.)\n\n${finalBotResponseForUser}`;
      }

      const newBotMessage: ChatMessage = {
        id: crypto.randomUUID(),
        text: finalBotResponseForUser,
        sender: MessageSender.BOT,
        timestamp: new Date(),
        languageCode: currentSelectedLangCode,
        originalText: (currentSelectedLangCode !== DEFAULT_LANGUAGE_CODE) ? botResponseInEnglish : undefined,
      };
      setMessages((prevMessages) => [...prevMessages, newBotMessage]);

    } catch (e) {
      const errorMessageText = e instanceof Error ? e.message : "An unknown error occurred.";
      const errorBotMessage: ChatMessage = {
        id: crypto.randomUUID(),
        text: `Sorry, something went wrong: ${errorMessageText}`,
        sender: MessageSender.BOT,
        timestamp: new Date(),
        languageCode: currentSelectedLangCode,
      };
      setMessages((prevMessages) => [...prevMessages, errorBotMessage]);
      setError(`Failed to get response: ${errorMessageText}`);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, chatInitialized, isRecording, isLoggedIn]);

  const handleSendMessage = useCallback(() => {
    processAndSendUserMessage(userInput);
  }, [userInput, processAndSendUserMessage]);

  const handleSuggestedPromptClick = useCallback((prompt: string) => {
    processAndSendUserMessage(prompt);
  }, [processAndSendUserMessage]);

  const handleLoginSuccess = (username: string) => {
    setCurrentUser(username);
    setCurrentPage(redirectToAfterLogin || 'CHAT'); 
    setRedirectToAfterLogin(null);
    if (!chatInitialized) {
        initChatSession();
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setChatInitialized(false); 
    clearChatInstance(); // Clear the Gemini chat instance
    setMessages([]); 
    setCurrentPage('HOME');
  };
  
  const navigateTo = (page: Page) => {
    if (page === 'CHAT' && !isLoggedIn) {
        setRedirectToAfterLogin('CHAT');
        setCurrentPage('LOGIN');
    } else {
        setCurrentPage(page);
    }
  };


  const renderPage = () => {
    switch (currentPage) {
      case 'HOME':
        return <HomePage onStartChat={() => navigateTo('CHAT')} onNavigateToSettings={() => navigateTo('SETTINGS')} />;
      case 'LOGIN':
        return <LoginPage onLoginSuccess={handleLoginSuccess} onNavigateToHome={() => navigateTo('HOME')} />;
      case 'CHAT':
        if (!isLoggedIn) { 
            return (
                <div className="flex-grow flex flex-col justify-center items-center p-4 text-center">
                    <p className="text-[#0336FF] dark:text-[#FFDE03] text-lg">Please log in to access the chat.</p>
                    <button
                        onClick={() => setCurrentPage('LOGIN')}
                        className="mt-4 px-6 py-2 bg-[#0336FF] hover:bg-[#02288C] text-white dark:bg-[#FFDE03] dark:hover:bg-[#E6C600] dark:text-[#0336FF] rounded-lg font-semibold"
                    >
                        Go to Login
                    </button>
                </div>
            );
        }
        if (error && !chatInitialized) { 
             return (
                <div className="flex-grow flex flex-col justify-center items-center p-4 md:p-8 text-center">
                    <div className="bg-[#FFFBE6] dark:bg-[#332A00] border-l-4 border-[#FBC02D] dark:border-[#FFDE03] text-[#B8860B] dark:text-[#FFDE03] p-6 rounded-md shadow-md max-w-lg" role="alert">
                        <p className="font-bold text-lg">Chat Initialization Error</p>
                        <p className="mt-2">{error}</p>
                        <p className="mt-4 text-sm">Please ensure your Gemini API key is correctly configured. If you are developing locally and don't have an environment variable set up, you can temporarily set <code>window.API_KEY = "YOUR_API_KEY"</code> in your browser's developer console and refresh the page. <strong>This is for development purposes only.</strong></p>
                        <button
                            onClick={() => {
                                setError(null);
                                initChatSession();
                            }}
                            className="mt-6 px-4 py-2 bg-[#FBC02D] hover:bg-[#E6A700] dark:bg-[#FFDE03] dark:hover:bg-[#E6C600] text-[#010F29] dark:text-[#0336FF] rounded transition-colors font-semibold"
                        >
                            Retry Initialization
                        </button>
                    </div>
                </div>
            );
        }
        if (!chatInitialized && !error) { 
             return (
                <div className="flex-grow flex justify-center items-center h-full">
                    <p className="text-[#0336FF] dark:text-[#FFDE03] text-xl animate-pulse">Initializing Chatbot...</p>
                </div>
            );
        }
        return (
          <ChatInterface
            messages={messages}
            userInput={userInput}
            onInputChange={setUserInput}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            isRecording={isRecording}
            isMicrophoneSupported={isMicrophoneSupported}
            onToggleRecording={handleToggleRecording}
            microphoneError={microphoneError}
            suggestedPrompts={!isLoading && chatInitialized ? CHAT_SUGGESTED_PROMPTS : undefined}
            onSuggestedPromptClick={handleSuggestedPromptClick}
          />
        );
      case 'SETTINGS':
        return <SettingsPage />;
      default:
        setCurrentPage('HOME'); 
        return <HomePage onStartChat={() => navigateTo('CHAT')} onNavigateToSettings={() => navigateTo('SETTINGS')} />;
    }
  };

  const NavLink: React.FC<{ page: Page; label: string }> = ({ page, label }) => (
    <button
      onClick={() => navigateTo(page)}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors
        ${currentPage === page && !(page === 'LOGIN' && isLoggedIn) 
          ? 'bg-[#0336FF] text-white dark:bg-[#FFDE03] dark:text-[#0336FF]'
          : 'text-[#02288C] dark:text-[#A8C5FF] hover:bg-[#D6E4FF] dark:hover:bg-[#0336FF] hover:text-[#0058e0] dark:hover:text-[#FFDE03]'
        }`}
      aria-current={currentPage === page ? 'page' : undefined}
    >
      {label}
    </button>
  );

  return (
    <div className="flex flex-col h-screen antialiased bg-[#EBF4FF] dark:bg-[#010F29]">
      <header className="p-4 bg-white dark:bg-[#021B4D] shadow-md flex items-center justify-between sticky top-0 z-50 border-b border-[#A8C5FF] dark:border-[#0336FF]">
        <div className="flex items-center space-x-3">
            <img src={COMPANY_LOGO_URL} alt={`${COMPANY_NAME} Logo`} className="h-10 w-10 rounded-full border-2 border-[#0336FF] dark:border-[#FFDE03]" />
            <div>
                <h1 className="text-xl font-bold tracking-tight text-[#0058e0] dark:text-[#FFDE03]">{COMPANY_NAME}</h1>
                <h2 className="text-sm text-[#5C8AFF] dark:text-[#A8C5FF]">
                    {currentPage === 'LOGIN' ? 'User Login' : currentPage === 'CHAT' ? CHATBOT_NAME : currentPage === 'SETTINGS' ? 'Application Settings' : 'AI Support Portal'}
                    {isLoggedIn && currentUser && currentPage !== 'LOGIN' && <span className="text-xs"> (User: {currentUser})</span>}
                </h2>
            </div>
        </div>
        <div className="flex items-center space-x-1 sm:space-x-2">
            <nav className="hidden sm:flex space-x-1">
                <NavLink page="HOME" label="Home" />
                <NavLink page="CHAT" label="Chat" />
                <NavLink page="SETTINGS" label="Settings" />
            </nav>
            <div className="relative">
                <select
                    id="language-select"
                    value={selectedLanguageCode}
                    onChange={handleLanguageChange}
                    className="p-2 rounded-md bg-white dark:bg-[#02288C] text-[#0336FF] dark:text-[#FFDE03] border border-[#A8C5FF] dark:border-[#0336FF] focus:ring-2 focus:ring-[#0336FF] dark:focus:ring-[#FFDE03] text-sm appearance-none pr-7"
                    aria-label="Select language"
                >
                    {SUPPORTED_LANGUAGES.map(lang => (
                        <option key={lang.code} value={lang.code}>{lang.name}</option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#0336FF] dark:text-[#FFDE03]">
                   <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.516 7.548c.436-.446 1.043-.48 1.576 0L10 10.405l2.908-2.857c.533-.48 1.141-.446 1.574 0 .436.445.408 1.197 0 1.615-.406.418-4.695 4.502-4.695 4.502a1.095 1.095 0 01-1.576 0S5.922 9.581 5.516 9.163c-.409-.418-.436-1.17 0-1.615z"/></svg>
                </div>
            </div>
            
            {isLoggedIn ? (
                <button
                    onClick={handleLogout}
                    className="p-2 rounded-md hover:bg-[#D6E4FF] dark:hover:bg-[#0336FF] text-[#5C8AFF] dark:text-[#A8C5FF] hover:text-[#0058e0] dark:hover:text-[#FFDE03] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0336FF] dark:focus:ring-[#FFDE03] text-sm font-medium"
                    aria-label="Logout"
                >
                   Logout
                </button>
            ) : (
                <button
                    onClick={() => navigateTo('LOGIN')}
                    className="p-2 rounded-md hover:bg-[#D6E4FF] dark:hover:bg-[#0336FF] text-[#5C8AFF] dark:text-[#A8C5FF] hover:text-[#0058e0] dark:hover:text-[#FFDE03] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0336FF] dark:focus:ring-[#FFDE03] text-sm font-medium"
                    aria-label="Login"
                >
                   Login
                </button>
            )}

            <button
                onClick={toggleTheme}
                className="p-2 rounded-md hover:bg-[#D6E4FF] dark:hover:bg-[#0336FF] text-[#5C8AFF] dark:text-[#A8C5FF] hover:text-[#0058e0] dark:hover:text-[#FFDE03] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0336FF] dark:focus:ring-[#FFDE03]"
                aria-label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
            >
                {theme === 'light' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21c3.089 0 5.897-1.256 7.874-3.295a9.756 9.756 0 011.128-2.703z" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                         <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v.01M6.31 6.31l-.01.01M21.69 6.31l-.01.01M12 20.99v.01M4.31 17.69l.01.01M19.69 17.69l.01.01M3 12h.01M20.99 12h.01M12 6a6 6 0 110 12 6 6 0 010-12z" />
                    </svg>
                )}
            </button>
            <div className="sm:hidden">
                 <select
                    className="p-2 rounded-md bg-[#D6E4FF] dark:bg-[#0336FF] text-[#0336FF] dark:text-[#FFDE03] border border-[#A8C5FF] dark:border-[#FFDE03] focus:ring-[#0336FF] dark:focus:ring-[#FFDE03]"
                    value={currentPage}
                    onChange={(e) => navigateTo(e.target.value as Page)}
                    aria-label="Main navigation"
                 >
                    <option value="HOME">Home</option>
                    <option value="LOGIN" disabled={isLoggedIn}>Login</option>
                    <option value="CHAT" disabled={!isLoggedIn && currentPage !== 'LOGIN'}>Chat</option>
                    <option value="SETTINGS">Settings</option>
                 </select>
            </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col overflow-y-auto">
        {renderPage()}
      </main>

      <footer className="p-3 bg-white dark:bg-[#021B4D] text-center text-xs text-[#5C8AFF] dark:text-[#A8C5FF] border-t border-[#A8C5FF] dark:border-[#0336FF]">
        &copy; {new Date().getFullYear()} {COMPANY_NAME} / RASHINI S [AI Products Engineering Team]. Powered by Gemini. All Rights Reserved.
      </footer>
    </div>
  );
};

export default App;
