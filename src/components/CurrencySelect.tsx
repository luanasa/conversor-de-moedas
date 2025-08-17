import React, { useState, useRef, useEffect } from 'react';
import { Currency } from '../types/currency';
import { ChevronDown, Search } from 'lucide-react';

interface CurrencySelectProps {
  currencies: Currency[];
  selectedCurrency: Currency;
  onSelect: (currency: Currency) => void;
  label: string;
  favorites: string[];
  onToggleFavorite: (currencyCode: string) => void;
}

export function CurrencySelect({
  currencies,
  selectedCurrency,
  onSelect,
  label,
  favorites,
  onToggleFavorite
}: CurrencySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const selectRef = useRef<HTMLDivElement>(null);

  const filteredCurrencies = currencies.filter(currency =>
    currency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    currency.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const favoriteCurrencies = filteredCurrencies.filter(c => favorites.includes(c.code));
  const otherCurrencies = filteredCurrencies.filter(c => !favorites.includes(c.code));

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={selectRef}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-left shadow-sm hover:border-blue-500 dark:hover:border-blue-400 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all duration-200"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-xl">{selectedCurrency.flag}</span>
            <div>
              <div className="font-medium text-gray-900 dark:text-white">
                {selectedCurrency.code}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {selectedCurrency.name}
              </div>
            </div>
          </div>
          <ChevronDown className={`w-5 h-5 text-gray-400 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-80 overflow-hidden">
          <div className="p-3 border-b border-gray-200 dark:border-gray-600">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar moeda..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          
          <div className="overflow-y-auto max-h-64">
            {favoriteCurrencies.length > 0 && (
              <div>
                <div className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50">
                  Favoritas
                </div>
                {favoriteCurrencies.map((currency) => (
                  <CurrencyOption
                    key={`fav-${currency.code}`}
                    currency={currency}
                    isSelected={currency.code === selectedCurrency.code}
                    isFavorite={true}
                    onSelect={() => {
                      onSelect(currency);
                      setIsOpen(false);
                      setSearchTerm('');
                    }}
                    onToggleFavorite={() => onToggleFavorite(currency.code)}
                  />
                ))}
              </div>
            )}
            
            {otherCurrencies.length > 0 && (
              <div>
                {favoriteCurrencies.length > 0 && (
                  <div className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50">
                    Outras moedas
                  </div>
                )}
                {otherCurrencies.map((currency) => (
                  <CurrencyOption
                    key={currency.code}
                    currency={currency}
                    isSelected={currency.code === selectedCurrency.code}
                    isFavorite={false}
                    onSelect={() => {
                      onSelect(currency);
                      setIsOpen(false);
                      setSearchTerm('');
                    }}
                    onToggleFavorite={() => onToggleFavorite(currency.code)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

interface CurrencyOptionProps {
  currency: Currency;
  isSelected: boolean;
  isFavorite: boolean;
  onSelect: () => void;
  onToggleFavorite: () => void;
}

function CurrencyOption({ currency, isSelected, isFavorite, onSelect, onToggleFavorite }: CurrencyOptionProps) {
  return (
    <div className={`flex items-center justify-between px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
      <div className="flex items-center space-x-3 flex-1" onClick={onSelect}>
        <span className="text-lg">{currency.flag}</span>
        <div>
          <div className={`font-medium ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'}`}>
            {currency.code}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {currency.name}
          </div>
        </div>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite();
        }}
        className={`p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ${isFavorite ? 'text-yellow-500' : 'text-gray-400'}`}
      >
        ★
      </button>
    </div>
  );
}