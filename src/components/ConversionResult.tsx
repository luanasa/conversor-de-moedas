import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { ConversionResult as ConversionResultType } from '../types/currency';

interface ConversionResultProps {
  result: ConversionResultType | null;
}

export function ConversionResult({ result }: ConversionResultProps) {
  const [copied, setCopied] = useState(false);

  if (!result) return null;

  const handleCopy = async () => {
    const text = `${result.fromAmount} ${result.fromCurrency.code} = ${result.toAmount.toFixed(6)} ${result.toCurrency.code}`;
    
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 animate-in fade-in duration-500">
      <div className="text-center">
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          Resultado da conversão
        </div>
        
        <div className="flex items-center justify-center space-x-4 mb-4">
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {result.fromAmount}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {result.fromCurrency.code}
            </div>
          </div>
          
          <div className="text-2xl text-gray-400">≈</div>
          
          <div className="text-left">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {result.toAmount.toFixed(6)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {result.toCurrency.code}
            </div>
          </div>
        </div>
        
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
          Taxa: 1 {result.fromCurrency.code} = {result.rate.toFixed(6)} {result.toCurrency.code}
        </div>
        
        <button
          onClick={handleCopy}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors duration-200"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Copiado!' : 'Copiar resultado'}</span>
        </button>
      </div>
    </div>
  );
}