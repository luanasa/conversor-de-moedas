import React, { useState, useEffect, useCallback } from 'react';
import { ArrowUpDown, TrendingUp } from 'lucide-react';
import { Currency, ConversionResult, ExchangeRates, HistoricalRate } from '../types/currency';
import { allCurrencies } from '../data/currencies';
import { ExchangeService } from '../services/exchangeService';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { CurrencySelect } from './CurrencySelect';
import { AmountInput } from './AmountInput';
import { ConversionResult as ConversionResultComponent } from './ConversionResult';
import { ConversionHistory } from './ConversionHistory';
import { ExchangeChart } from './ExchangeChart';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import { DarkModeToggle } from './DarkModeToggle';
import { useDarkMode } from '../hooks/useDarkMode';

export function CurrencyConverter() {
  const [fromCurrency, setFromCurrency] = useState<Currency>(allCurrencies[0]);
  const [toCurrency, setToCurrency] = useState<Currency>(allCurrencies[1]);
  const [fromAmount, setFromAmount] = useState<string>('1');
  const [toAmount, setToAmount] = useState<string>('');
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates>({});
  const [historicalData, setHistoricalData] = useState<HistoricalRate[]>([]);
  const [loading, setLoading] = useState(false);
  const [chartLoading, setChartLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversionResult, setConversionResult] = useState<ConversionResult | null>(null);
  const [history, setHistory] = useLocalStorage<ConversionResult[]>('conversion-history', []);
  const [favorites, setFavorites] = useLocalStorage<string[]>('favorite-currencies', ['USD', 'EUR', 'BRL']);
  const [isDark, setIsDark] = useDarkMode();

  // Load exchange rates
  const loadExchangeRates = useCallback(async (baseCurrency: string = 'USD') => {
    setLoading(true);
    setError(null);
    
    try {
      const rates = await ExchangeService.getRates(baseCurrency);
      setExchangeRates(rates);
    } catch (err) {
      setError('Falha ao carregar as taxas de câmbio. Tente novamente.');
      console.error('Error loading exchange rates:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load historical data
  const loadHistoricalData = useCallback(async () => {
    setChartLoading(true);
    
    try {
      const data = await ExchangeService.getHistoricalRates(
        fromCurrency.code, 
        toCurrency.code, 
        30
      );
      setHistoricalData(data);
    } catch (err) {
      console.error('Error loading historical data:', err);
    } finally {
      setChartLoading(false);
    }
  }, [fromCurrency.code, toCurrency.code]);

  // Convert currencies
  const convertCurrency = useCallback(() => {
    const amount = parseFloat(fromAmount);
    if (isNaN(amount) || amount <= 0) {
      setToAmount('');
      setConversionResult(null);
      return;
    }

    const fromRate = exchangeRates[fromCurrency.code] || 1;
    const toRate = exchangeRates[toCurrency.code] || 1;
    const result = ExchangeService.convert(amount, fromRate, toRate);
    const rate = toRate / fromRate;
    
    setToAmount(result.toFixed(6));
    
    const conversion: ConversionResult = {
      id: Date.now().toString(),
      fromCurrency,
      toCurrency,
      fromAmount: amount,
      toAmount: result,
      rate,
      timestamp: new Date(),
    };
    
    setConversionResult(conversion);
    
    // Add to history
    setHistory(prev => {
      const newHistory = [conversion, ...prev.slice(0, 4)];
      return newHistory;
    });
  }, [fromAmount, fromCurrency, toCurrency, exchangeRates, setHistory]);

  // Swap currencies
  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setFromAmount(toAmount);
  };

  // Toggle favorite currency
  const toggleFavorite = (currencyCode: string) => {
    setFavorites(prev => {
      if (prev.includes(currencyCode)) {
        return prev.filter(code => code !== currencyCode);
      } else {
        return [...prev, currencyCode];
      }
    });
  };

  // Select conversion from history
  const selectConversion = (conversion: ConversionResult) => {
    setFromCurrency(conversion.fromCurrency);
    setToCurrency(conversion.toCurrency);
    setFromAmount(conversion.fromAmount.toString());
    setConversionResult(conversion);
    setToAmount(conversion.toAmount.toFixed(6));
  };

  // Clear history
  const clearHistory = () => {
    setHistory([]);
  };

  // Effects
  useEffect(() => {
    loadExchangeRates();
  }, [loadExchangeRates]);

  useEffect(() => {
    if (Object.keys(exchangeRates).length > 0) {
      convertCurrency();
    }
  }, [convertCurrency, exchangeRates]);

  useEffect(() => {
    loadHistoricalData();
  }, [loadHistoricalData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Conversor de Moedas
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Conversão em tempo real com mais de 20 moedas e criptomoedas
            </p>
          </div>
          <DarkModeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
        </div>

        {error && (
          <div className="mb-6">
            <ErrorMessage message={error} onRetry={() => loadExchangeRates()} />
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main Converter */}
          <div className="xl:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* From Currency */}
                <div>
                  <CurrencySelect
                    currencies={allCurrencies}
                    selectedCurrency={fromCurrency}
                    onSelect={setFromCurrency}
                    label="De"
                    favorites={favorites}
                    onToggleFavorite={toggleFavorite}
                  />
                  <div className="mt-4">
                    <AmountInput
                      value={fromAmount}
                      onChange={setFromAmount}
                      currency={fromCurrency.code}
                      label="Quantidade"
                      placeholder="Digite o valor"
                    />
                  </div>
                </div>

                {/* Swap Button */}
                <div className="flex md:flex-col items-center justify-center">
                  <button
                    onClick={swapCurrencies}
                    className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white p-3 rounded-full shadow-lg transition-all duration-200 transform hover:scale-110 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                    aria-label="Trocar moedas"
                  >
                    <ArrowUpDown className="w-5 h-5" />
                  </button>
                </div>

                {/* To Currency */}
                <div>
                  <CurrencySelect
                    currencies={allCurrencies}
                    selectedCurrency={toCurrency}
                    onSelect={setToCurrency}
                    label="Para"
                    favorites={favorites}
                    onToggleFavorite={toggleFavorite}
                  />
                  <div className="mt-4">
                    <AmountInput
                      value={toAmount}
                      onChange={() => {}} // Read-only
                      currency={toCurrency.code}
                      label="Resultado"
                      placeholder="0.00"
                      disabled={true}
                    />
                  </div>
                </div>
              </div>

              {loading && (
                <div className="mt-6 flex justify-center">
                  <LoadingSpinner text="Carregando taxas..." />
                </div>
              )}
            </div>

            {/* Conversion Result */}
            {conversionResult && !loading && (
              <ConversionResultComponent result={conversionResult} />
            )}

            {/* Exchange Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Gráfico Histórico
                  </h3>
                </div>
              </div>
              
              {chartLoading ? (
                <div className="p-8">
                  <LoadingSpinner text="Carregando dados históricos..." />
                </div>
              ) : (
                <div className="p-6">
                  <ExchangeChart
                    data={historicalData}
                    fromCurrency={fromCurrency.code}
                    toCurrency={toCurrency.code}
                    isDark={isDark}
                  />
                </div>
              )}
            </div>
          </div>

          {/* History Sidebar */}
          <div>
            <ConversionHistory
              history={history}
              onClear={clearHistory}
              onSelectConversion={selectConversion}
            />
          </div>
        </div>
      </div>
    </div>
  );
}