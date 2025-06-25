
import React, { useState } from 'react';
import { 
    COMPANY_NAME, 
    SETTINGS_APP_VERSION,
    SETTINGS_ABOUT_DESCRIPTION,
    SETTINGS_HOW_TO_USE,
    SETTINGS_KEY_FEATURES,
    SETTINGS_DATA_PRIVACY,
    SUPPORTED_LANGUAGES,
    COMPANY_CONTACT_DETAILS,
    COMPANY_SOCIAL_MEDIA
} from '../constants.ts';

const SettingsSectionContent: React.FC<{title: string; children: React.ReactNode}> = ({ title, children }) => (
    <div className="bg-white dark:bg-[#021B4D] p-6 rounded-lg shadow-md border border-[#A8C5FF] dark:border-[#0336FF]">
        <h2 className="text-2xl font-semibold text-[#0058e0] dark:text-[#FFDE03] mb-3 border-b-2 border-[#5C8AFF] dark:border-[#FFDE03] pb-2">{title}</h2>
        <div className="text-[#010F29] dark:text-[#A8C5FF] space-y-2 text-sm md:text-base">
            {children}
        </div>
    </div>
);

const SocialMediaIcon: React.FC<{ path: string; name: string }> = ({ path, name }) => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true" focusable="false">
    <title>{name}</title>
    <path d={path}></path>
  </svg>
);

type SettingKey = 'about' | 'howToUse' | 'features' | 'contact' | 'privacy';

const SettingsPage: React.FC = () => {
  const [selectedSettingKey, setSelectedSettingKey] = useState<SettingKey>('about');
  const supportedLanguageNames = SUPPORTED_LANGUAGES.map(lang => lang.name).join(', ');

  const settingsOptions = [
    {
      key: 'about' as SettingKey,
      title: 'About This App',
      content: (
        <>
          <p className="mb-2"><strong>Application Name:</strong> {COMPANY_NAME} AI Support Assistant</p>
          <p className="mb-2"><strong>Provided by:</strong> {COMPANY_NAME}</p>
          <p className="mb-2"><strong>Version:</strong> {SETTINGS_APP_VERSION}</p>
          <p className="mb-2">{SETTINGS_ABOUT_DESCRIPTION}</p>
          <p className="italic text-xs md:text-sm text-[#5C8AFF] dark:text-[#A8C5FF] opacity-75">Powered by Google Gemini</p>
        </>
      )
    },
    {
      key: 'howToUse' as SettingKey,
      title: 'How to Use This App',
      content: (
        <ul className="list-disc list-inside space-y-1 marker:text-[#0058e0] dark:marker:text-[#FFDE03]">
          {SETTINGS_HOW_TO_USE.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      )
    },
    {
      key: 'features' as SettingKey,
      title: 'Key Features',
      content: (
        <>
          <ul className="list-disc list-inside space-y-1 marker:text-[#0058e0] dark:marker:text-[#FFDE03]">
            {SETTINGS_KEY_FEATURES.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          <p className="mt-3 text-xs md:text-sm">Supported languages for interaction (via translation): {supportedLanguageNames}.</p>
        </>
      )
    },
    {
      key: 'contact' as SettingKey,
      title: 'Contact & Connect',
      content: (
        <>
          {COMPANY_CONTACT_DETAILS.email && (
            <p className="mb-1">
              <strong>Email:</strong> <a href={`mailto:${COMPANY_CONTACT_DETAILS.email}`} className="text-[#0058e0] hover:underline dark:text-[#FFDE03] dark:hover:text-[#FDD835]">{COMPANY_CONTACT_DETAILS.email}</a>
            </p>
          )}
          {COMPANY_CONTACT_DETAILS.website && (
            <p className="mb-3">
              <strong>Website:</strong> <a href={`https://${COMPANY_CONTACT_DETAILS.website}`} target="_blank" rel="noopener noreferrer" className="text-[#0058e0] hover:underline dark:text-[#FFDE03] dark:hover:text-[#FDD835]">{COMPANY_CONTACT_DETAILS.website}</a>
            </p>
          )}
          {COMPANY_SOCIAL_MEDIA && COMPANY_SOCIAL_MEDIA.length > 0 && (
            <div>
              <strong className="block mb-2 text-sm">Follow us:</strong>
              <ul className="flex flex-wrap gap-x-4 gap-y-2">
                {COMPANY_SOCIAL_MEDIA.map(social => (
                  <li key={social.name}>
                    <a 
                      href={social.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center space-x-2 text-[#0058e0] hover:underline dark:text-[#FFDE03] dark:hover:text-[#FDD835] transition-colors"
                      aria-label={`Follow ${COMPANY_NAME} on ${social.name}`}
                    >
                      <SocialMediaIcon path={social.iconPath} name={social.name} />
                      <span>{social.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )
    },
    {
      key: 'privacy' as SettingKey,
      title: 'Data Privacy',
      content: <p>{SETTINGS_DATA_PRIVACY}</p>
    }
  ];

  const selectedSetting = settingsOptions.find(opt => opt.key === selectedSettingKey);

  return (
    <div className="flex-grow flex flex-col md:flex-row p-4 md:p-8 overflow-y-auto text-[#010F29] dark:text-[#F0F0F0] gap-4 md:gap-6">
      <div className="md:w-1/4 lg:w-1/5 flex-shrink-0">
        <div className="bg-white dark:bg-[#021B4D] p-3 md:p-4 rounded-lg shadow-md border border-[#A8C5FF] dark:border-[#0336FF]">
          <h2 className="text-lg font-semibold text-[#0058e0] dark:text-[#FFDE03] mb-3 text-center md:text-left">Settings Menu</h2>
          <nav className="space-y-1">
            {settingsOptions.map(option => (
              <button
                key={option.key}
                onClick={() => setSelectedSettingKey(option.key)}
                className={`w-full text-left px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-150 ease-in-out
                  focus:outline-none focus:ring-2 focus:ring-opacity-50
                  ${selectedSettingKey === option.key 
                    ? 'bg-[#0336FF] text-white dark:bg-[#FFDE03] dark:text-[#0336FF] shadow-sm' 
                    : 'text-[#02288C] dark:text-[#A8C5FF] hover:bg-[#D6E4FF] dark:hover:bg-[#0336FF] hover:text-[#0058e0] dark:hover:text-[#FFDE03]'
                  }`}
                aria-current={selectedSettingKey === option.key ? 'page' : undefined}
              >
                {option.title}
              </button>
            ))}
          </nav>
        </div>
      </div>
      <div className="flex-grow md:w-3/4 lg:w-4/5">
        {selectedSetting && (
          <SettingsSectionContent title={selectedSetting.title}>
            {selectedSetting.content}
          </SettingsSectionContent>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
