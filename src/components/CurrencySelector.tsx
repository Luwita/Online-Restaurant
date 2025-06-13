import React from 'react';
import { DollarSign, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
}

const currencies: Currency[] = [
  { code: 'ZMW', name: 'Zambian Kwacha', symbol: 'K', flag: '🇿🇲' },
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', flag: '🇿🇦' },
  { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh', flag: '🇰🇪' },
];

interface CurrencySelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CurrencySelector({ isOpen, onClose }: CurrencySelectorProps) {
  const { state, dispatch } = useApp();

  const handleCurrencyChange = (currencyCode: string) => {
    dispatch({ type: 'SET_CURRENCY', payload: currencyCode });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 text-center">
            <div className="flex items-center justify-center space-x-3 mb-2">
              <DollarSign className="w-6 h-6" />
              <h2 className="text-xl font-bold">Select Currency</h2>
            </div>
            <p className="text-green-100 text-sm">Choose your preferred currency</p>
          </div>

          {/* Currency Options */}
          <div className="p-6">
            <div className="space-y-3">
              {currencies.map((currency) => (
                <button
                  key={currency.code}
                  onClick={() => handleCurrencyChange(currency.code)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200 ${
                    state.currentCurrency === currency.code
                      ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-2 border-green-500/50 text-white'
                      : 'bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white border border-white/20'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{currency.flag}</span>
                    <div className="text-left">
                      <div className="font-medium">{currency.name}</div>
                      <div className="text-sm opacity-75">{currency.code} ({currency.symbol})</div>
                    </div>
                  </div>
                  {state.currentCurrency === currency.code && (
                    <Check className="w-5 h-5 text-green-400" />
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