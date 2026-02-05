import React from 'react';

const MultiLanguageSelector: React.FC = () => {
  return (
    <div className="text-gray-300">
      <label className="sr-only" htmlFor="language-select">Language</label>
      <select
        id="language-select"
        className="bg-transparent border border-white/20 text-sm text-gray-300 rounded px-3 py-2"
        defaultValue="en"
        onChange={() => { /* noop - implement i18n hook if available */ }}
      >
        <option value="en">English</option>
        <option value="es">Español</option>
        <option value="fr">Français</option>
        <option value="de">Deutsch</option>
      </select>
    </div>
  );
};

export default MultiLanguageSelector;
