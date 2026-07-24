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
      const url = `${MEXC_BASE_URL}/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`MEXC API error: ${response.status}`);
      }
      
      const data = await response.json();
      
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
      const url = `${MEXC_BASE_URL}/ticker/price?symbol=${symbol}`;
      const response = await fetch(url);
      const data = await response.json();
      return parseFloat(data.price);
    } catch (error) {
      console.error('Error fetching current price:', error);
      throw error;
    }
  }
}
