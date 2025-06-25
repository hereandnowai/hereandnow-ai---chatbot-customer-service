
import React from 'react';
import { ChatMessage, MessageSender } from '../types.ts';
import { CHATBOT_NAME, COMPANY_LOGO_URL } from '../constants.ts';

interface MessageBubbleProps {
  message: ChatMessage;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === MessageSender.USER;

  const formatDate = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex items-end max-w-xs md:max-w-md lg:max-w-lg ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {!isUser && (
          <img 
            src={COMPANY_LOGO_URL} 
            alt="Bot Avatar" 
            className="w-8 h-8 rounded-full mr-2 self-start border-2 border-[#0336FF] dark:border-[#FFDE03]" 
          />
        )}
        <div 
          className={`p-3 rounded-lg shadow-md ${
            isUser 
              ? 'bg-[#0336FF] text-white dark:bg-[#FFDE03] dark:text-[#0336FF] rounded-br-none' 
              : 'bg-[#D6E4FF] text-[#010F29] dark:bg-[#0336FF] dark:text-[#FFDE03] rounded-bl-none'
          }`}
        >
          {!isUser && <p className="text-xs text-[#0336FF] dark:text-[#FFDE03] font-semibold mb-1">{CHATBOT_NAME}</p>}
          <p className="text-sm break-words">{message.text}</p>
          <p className={`text-xs mt-1 ${
              isUser 
                ? 'text-[#EBF4FF] dark:text-[#02288C] opacity-90 text-right' 
                : 'text-[#5C8AFF] dark:text-[#A8C5FF] opacity-90 text-left'
            }`}
          >
            {formatDate(message.timestamp)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
