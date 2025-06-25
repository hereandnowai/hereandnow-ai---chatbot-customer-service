
import React from 'react';
import { COMPANY_NAME, COMPANY_IMAGE_URL, CHATBOT_NAME } from '../constants.ts'; 
import { Page } from '../types.ts';

interface HomePageProps {
  onStartChat: () => void;
  onNavigateToSettings: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onStartChat, onNavigateToSettings }) => {
  const chatbotNameStyle: React.CSSProperties = {
    backgroundImage: 'linear-gradient(135deg, #FCEEAA 0%, #F4D03F 30%, #E7A500 60%, #C89400 100%)', // Gold gradient
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
    textShadow: '1px 1px 1px rgba(122, 80, 0, 0.5), 0 0 6px rgba(255, 224, 115, 0.5), -0.5px -0.5px 0.5px rgba(255, 255, 240, 0.3)', // Darker depth, gold glow, subtle top highlight
    paddingBottom: '0.1em', 
    marginBottom: '-0.1em',
  };

  return (
    <div className="flex-grow flex flex-col items-center justify-center p-6 md:p-12 text-center bg-white dark:bg-[#021B4D] m-4 md:m-8 rounded-xl shadow-lg">
      <img 
        src={COMPANY_IMAGE_URL} 
        alt={`${COMPANY_NAME} Showcase`} 
        className="max-w-xs md:max-w-sm lg:max-w-md h-auto mb-8 rounded-lg shadow-xl border-2 border-[#A8C5FF] dark:border-[#0336FF]"
      />
      <h1 className="text-3xl md:text-4xl font-bold text-[#010F29] dark:text-[#F0F0F0] mb-2">
        Welcome to the <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-[#FFDE03] via-[#0336FF] to-[#FFDE03] animate-pulse">{COMPANY_NAME}</span> AI Support Portal
      </h1>
      <h2 className="text-xl md:text-2xl font-semibold mb-6 text-center">
        <span 
          className="font-bold inline-block"
          style={chatbotNameStyle}
        >
          {CHATBOT_NAME} 
        </span>
      </h2>
      <p className="text-lg md:text-xl text-[#02288C] dark:text-[#A8C5FF] mb-8 max-w-2xl">
        Our {CHATBOT_NAME} is here to help with your enquiries about {COMPANY_NAME}, assist with pre-booking meetings, and provide information about our classes.
      </p>
      <button
        onClick={onStartChat}
        className="px-8 py-4 bg-[#0336FF] hover:bg-[#02288C] text-white 
                   dark:bg-[#FFDE03] dark:hover:bg-[#E6C600] dark:text-[#0336FF] 
                   font-semibold rounded-lg text-lg
                   focus:outline-none focus:ring-4 focus:ring-[#5C8AFF] dark:focus:ring-[#0336FF]
                   transform hover:scale-105 transition duration-300 ease-in-out shadow-lg"
        aria-label={`Start chat with our ${CHATBOT_NAME}`}
      >
        Chat With Our AI Assistant
      </button>
      <p className="mt-8 text-sm text-[#02288C] dark:text-[#A8C5FF]">
        You can also find more information in our <button onClick={onNavigateToSettings} className="underline text-[#0058e0] hover:text-[#02288C] dark:text-[#FFDE03] dark:hover:text-[#E6C600]">Settings</button> section.
      </p>
    </div>
  );
};

export default HomePage;
