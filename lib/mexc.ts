const MEXC_BASE_URL = 'https://api.mexc.com/api/v3';

export interface KlineData {
  openTime: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  closeTime: number;
}

export class MEXCClient {
  private static instance: MEXCClient;
  
  static getInstance(): MEXCClient {
    if (!MEXCClient.instance) {
      MEXCClient.instance = new MEXCClient();
    }
    return MEXCClient.instance;
  }

  async getKlines(symbol: string, interval: string, limit: number = 200): Promise<KlineData[]> {
    try {
      // Ensure symbol is uppercase
      const symbolUpper = symbol.toUpperCase();
      const url = `${MEXC_BASE_URL}/klines?symbol=${symbolUpper}&interval=${interval}&limit=${limit}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Coin ${symbolUpper} not found on MEXC. Please check the symbol.`);
        }
        throw new Error(`MEXC API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data || data.length === 0) {
        throw new Error(`No data available for ${symbolUpper}`);
      }
      
      return data.map((item: any[]) => ({
        openTime: item[0],
        open: parseFloat(item[1]),
        high: parseFloat(item[2]),
        low: parseFloat(item[3]),
        close: parseFloat(item[4]),
        volume: parseFloat(item[5]),
        closeTime: item[6]
      }));
    } catch (error) {
      console.error('Error fetching MEXC data:', error);
      throw error;
    }
  }

  async getCurrentPrice(symbol: string): Promise<number> {
    try {
      const symbolUpper = symbol.toUpperCase();
      const url = `${MEXC_BASE_URL}/ticker/price?symbol=${symbolUpper}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Price fetch failed for ${symbolUpper}`);
      }
      
      const data = await response.json();
      return parseFloat(data.price);
    } catch (error) {
      console.error('Error fetching current price:', error);
      throw error;
    }
  }

  // New: Get all available symbols
  async getAllSymbols(): Promise<string[]> {
    try {
      const url = `${MEXC_BASE_URL}/exchangeInfo`;
      const response = await fetch(url);
      const data = await response.json();
      
      // Filter only USDT pairs
      const symbols = data.symbols
        .filter((s: any) => s.quoteAsset === 'USDT')
        .map((s: any) => s.symbol);
      
      return symbols;
    } catch (error) {
      console.error('Error fetching symbols:', error);
      return [];
    }
  }
}
