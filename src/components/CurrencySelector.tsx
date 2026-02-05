import React from 'react';

const CurrencySelector: React.FC = () => {
  return (
    <div className="text-gray-300">
      <label className="sr-only" htmlFor="currency-select">Currency</label>
      <select
        id="currency-select"
        className="bg-transparent border border-white/20 text-sm text-gray-300 rounded px-3 py-2"
        defaultValue="ZMW"
        onChange={() => { /* noop - integrate currency handling if available */ }}
      >
        <option value="ZMW">ZMW (K)</option>
        <option value="USD">USD ($)</option>
        <option value="EUR">EUR (€)</option>
        <option value="GBP">GBP (£)</option>
      </select>
    </div>
  );
};

export default CurrencySelector;
