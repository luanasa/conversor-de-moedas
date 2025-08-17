import { ExchangeRates, HistoricalRate } from '../types/currency';

const API_BASE_URL = 'https://api.exchangerate-api.com/v4';
const FALLBACK_API_URL = 'https://api.fixer.io/latest';

export class ExchangeService {
  private static cache = new Map<string, { data: ExchangeRates; timestamp: number }>();
  private static CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  static async getRates(baseCurrency: string = 'USD'): Promise<ExchangeRates> {
    const cacheKey = `rates_${baseCurrency}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/latest/${baseCurrency}`);
      if (!response.ok) throw new Error('Primary API failed');
      
      const data = await response.json();
      const rates = data.rates;
      
      this.cache.set(cacheKey, { data: rates, timestamp: Date.now() });
      return rates;
    } catch (error) {
      console.error('Failed to fetch exchange rates:', error);
      
      // Fallback to mock data for demo purposes
      return this.getMockRates(baseCurrency);
    }
  }

  static async getHistoricalRates(
    fromCurrency: string,
    toCurrency: string,
    days: number = 30
  ): Promise<HistoricalRate[]> {
    // For demo purposes, generate mock historical data
    const rates: HistoricalRate[] = [];
    const baseRate = Math.random() * 2 + 0.5; // Random base rate
    
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Generate realistic fluctuation (±5% from base rate)
      const variation = (Math.random() - 0.5) * 0.1;
      const rate = baseRate * (1 + variation);
      
      rates.push({
        date: date.toISOString().split('T')[0],
        rate: Number(rate.toFixed(6))
      });
    }
    
    return rates;
  }

  static convert(amount: number, fromRate: number, toRate: number): number {
    if (fromRate === toRate) return amount;
    return (amount / fromRate) * toRate;
  }

  private static getMockRates(baseCurrency: string): ExchangeRates {
    const mockRates: ExchangeRates = {
      USD: baseCurrency === 'USD' ? 1 : 1.0,
      EUR: baseCurrency === 'EUR' ? 1 : 0.85,
      GBP: baseCurrency === 'GBP' ? 1 : 0.73,
      BRL: baseCurrency === 'BRL' ? 1 : 5.2,
      JPY: baseCurrency === 'JPY' ? 1 : 110.0,
      CAD: baseCurrency === 'CAD' ? 1 : 1.25,
      AUD: baseCurrency === 'AUD' ? 1 : 1.35,
      CHF: baseCurrency === 'CHF' ? 1 : 0.92,
      CNY: baseCurrency === 'CNY' ? 1 : 6.45,
      INR: baseCurrency === 'INR' ? 1 : 74.5,
      BTC: baseCurrency === 'BTC' ? 1 : 0.000023,
      ETH: baseCurrency === 'ETH' ? 1 : 0.00035,
    };
    
    return mockRates;
  }
}