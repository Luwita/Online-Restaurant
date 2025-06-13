import React from 'react';
import { Globe, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface Language {
  code: string;
  name: string;
  flag: string;
}

const languages: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ny', name: 'Chichewa', flag: '🇲🇼' },
  { code: 'bem', name: 'Bemba', flag: '🇿🇲' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'sw', name: 'Kiswahili', flag: '🇹🇿' },
];

interface MultiLanguageSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MultiLanguageSelector({ isOpen, onClose }: MultiLanguageSelectorProps) {
  const { state, dispatch } = useApp();

  const handleLanguageChange = (languageCode: string) => {
    dispatch({ type: 'SET_LANGUAGE', payload: languageCode });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 text-center">
            <div className="flex items-center justify-center space-x-3 mb-2">
              <Globe className="w-6 h-6" />
              <h2 className="text-xl font-bold">Select Language</h2>
            </div>
            <p className="text-purple-100 text-sm">Choose your preferred language</p>
          </div>

          {/* Language Options */}
          <div className="p-6">
            <div className="space-y-3">
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200 ${
                    state.currentLanguage === language.code
                      ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-2 border-purple-500/50 text-white'
                      : 'bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white border border-white/20'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{language.flag}</span>
                    <span className="font-medium">{language.name}</span>
                  </div>
                  {state.currentLanguage === language.code && (
                    <Check className="w-5 h-5 text-purple-400" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}