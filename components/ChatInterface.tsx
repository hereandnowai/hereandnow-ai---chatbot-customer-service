
import React, { useRef, useEffect } from 'react';
import { ChatMessage, MessageSender } from '../types.ts'; 
import MessageBubble from './MessageBubble.tsx';
import { COMPANY_LOGO_URL } from '../constants.ts';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  userInput: string;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  isLoading: boolean;
  isRecording: boolean;
  isMicrophoneSupported: boolean;
  onToggleRecording: () => void;
  microphoneError: string | null;
  suggestedPrompts?: string[];
  onSuggestedPromptClick?: (prompt: string) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  userInput,
  onInputChange,
  onSendMessage,
  isLoading,
  isRecording,
  isMicrophoneSupported,
  onToggleRecording,
  microphoneError,
  suggestedPrompts,
  onSuggestedPromptClick,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !isLoading && userInput.trim()) {
      onSendMessage();
    }
  };

  const MicIcon = ({ recording }: { recording: boolean }) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24" 
      strokeWidth="1.5" 
      stroke="currentColor" 
      className={`w-6 h-6 ${recording ? 'text-[#E6A700] dark:text-[#FFDE03]' : 'text-[#02288C] dark:text-[#A8C5FF] group-hover:text-[#0058e0] dark:group-hover:text-[#FFDE03]'}`}
    >
      {recording ? (
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z" /> 
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15c-1.125 0-2.25-.338-3.166-.933a2.251 2.251 0 01-1.293-2.067V7.5a4.5 4.5 0 019 0v4.5a2.251 2.251 0 01-1.292 2.067A10.457 10.457 0 0112 15z" />
      )}
    </svg>
  );

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#010F29] shadow-xl rounded-lg overflow-hidden mx-auto max-w-4xl w-full my-0 md:my-4 border border-[#A8C5FF] dark:border-[#0336FF]">
      {/* Message Display Area */}
      <div className="flex-grow p-6 space-y-4 overflow-y-auto bg-[#EBF4FF] dark:bg-[#021B4D]">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {isLoading && messages.length > 0 && messages[messages.length-1].sender === MessageSender.USER && ( 
          <div className="flex justify-start mb-4">
             <div className="flex items-end max-w-xs md:max-w-md lg:max-w-lg flex-row">
                <img 
                    src={COMPANY_LOGO_URL}
                    alt="Bot Avatar" 
                    className="w-8 h-8 rounded-full mr-2 self-start border-2 border-[#0336FF] dark:border-[#FFDE03]" 
                />
                <div className="p-3 rounded-lg shadow-md bg-[#D6E4FF] dark:bg-[#0336FF] text-[#010F29] dark:text-[#FFDE03] rounded-bl-none">
                    <p className="text-sm italic">Assistant is typing...</p>
                </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts Area */}
      {suggestedPrompts && suggestedPrompts.length > 0 && !userInput && !isLoading && onSuggestedPromptClick && (
        <div className="p-3 border-t border-[#A8C5FF] dark:border-[#0336FF] bg-white dark:bg-[#010F29]">
          <p className="text-xs text-center mb-2 text-[#02288C] dark:text-[#A8C5FF]">Or try one of these:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {suggestedPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => onSuggestedPromptClick(prompt)}
                className="px-3 py-1.5 text-sm bg-[#D6E4FF] hover:bg-[#A8C5FF] text-[#0336FF] 
                           dark:bg-[#0336FF] dark:hover:bg-[#02288C] dark:text-[#FFDE03]
                           rounded-full font-medium transition duration-150 ease-in-out
                           focus:outline-none focus:ring-2 focus:ring-[#5C8AFF] dark:focus:ring-[#FFDE03]"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 border-t border-[#A8C5FF] dark:border-[#0336FF] bg-white dark:bg-[#010F29]">
        <div className="flex items-center space-x-2">
          {isMicrophoneSupported && (
            <button
              onClick={onToggleRecording}
              disabled={isLoading || !isMicrophoneSupported}
              className={`p-3 rounded-lg group
                         ${isRecording ? 'bg-[#FFF9C4] dark:bg-[#4D4200] ring-2 ring-[#FBC02D] dark:ring-[#FFDE03]' : 
                                         'bg-[#D6E4FF] dark:bg-[#02288C] hover:bg-[#A8C5FF] dark:hover:bg-[#0336FF]'}
                         focus:outline-none focus:ring-2 ${isRecording ? 'focus:ring-[#FBC02D] dark:focus:ring-[#FFDE03]' : 'focus:ring-[#0336FF] dark:focus:ring-[#FFDE03]'} 
                         transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed`}
              aria-label={isRecording ? "Stop recording" : "Start recording"}
              title={isRecording ? "Stop recording" : "Start recording"}
            >
              <MicIcon recording={isRecording} />
            </button>
          )}
          <input
            type="text"
            value={userInput}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isRecording ? "Listening..." : "Type your message..."}
            disabled={isLoading}
            className="flex-grow p-3 border border-[#A8C5FF] dark:border-[#0336FF] rounded-lg 
                       text-[#010F29] dark:text-[#F0F0F0] bg-white dark:bg-[#021B4D]
                       focus:ring-2 focus:ring-[#0336FF] dark:focus:ring-[#FFDE03]
                       focus:border-transparent dark:focus:border-transparent outline-none transition duration-150 ease-in-out"
            aria-label="Chat input field"
          />
          <button
            onClick={onSendMessage}
            disabled={isLoading || !userInput.trim()}
            className="px-6 py-3 bg-[#0336FF] hover:bg-[#02288C] text-white 
                       dark:bg-[#FFDE03] dark:hover:bg-[#E6C600] dark:text-[#0336FF]
                       rounded-lg font-semibold focus:outline-none 
                       focus:ring-2 focus:ring-[#5C8AFF] dark:focus:ring-[#0336FF] focus:ring-opacity-75
                       transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Send message"
          >
            Send
          </button>
        </div>
        {microphoneError && (
          <p className="text-xs text-[#D97706] dark:text-[#FFDE03] mt-2 text-center" role="alert">
            {microphoneError}
          </p>
        )}
         {!isMicrophoneSupported && (
             <p className="text-xs text-[#02288C] dark:text-[#A8C5FF] opacity-75 mt-2 text-center">
                Speech input is not supported by your browser.
             </p>
         )}
      </div>
    </div>
  );
};

export default ChatInterface;
