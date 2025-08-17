import React from 'react';
import { Trash2, Clock } from 'lucide-react';
import { ConversionResult } from '../types/currency';
import { format } from 'date-fns';

interface ConversionHistoryProps {
  history: ConversionResult[];
  onClear: () => void;
  onSelectConversion: (conversion: ConversionResult) => void;
}

export function ConversionHistory({ history, onClear, onSelectConversion }: ConversionHistoryProps) {
  if (history.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center">
        <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-500 dark:text-gray-400">
          Nenhuma conversão realizada ainda
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Histórico de Conversões
        </h3>
        <button
          onClick={onClear}
          className="flex items-center space-x-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          <span>Limpar</span>
        </button>
      </div>
      
      <div className="p-4 space-y-3">
        {history.map((conversion) => (
          <div
            key={conversion.id}
            onClick={() => onSelectConversion(conversion)}
            className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-lg">{conversion.fromCurrency.flag}</span>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {conversion.fromAmount} {conversion.fromCurrency.code} → {conversion.toAmount.toFixed(4)} {conversion.toCurrency.code}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Taxa: {conversion.rate.toFixed(6)}
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-400">
                {format(new Date(conversion.timestamp), 'HH:mm')}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}