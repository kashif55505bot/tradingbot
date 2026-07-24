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

export interface CoinInfo {
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  status: string;
}

export class MEXCClient {
  private static instance: MEXCClient;
  private allCoins: string[] = [];
  private allCoinInfo: CoinInfo[] = [];
  
  static getInstance(): MEXCClient {
    if (!MEXCClient.instance) {
      MEXCClient.instance = new MEXCClient();
    }
    return MEXCClient.instance;
  }

  // Get all USDT pairs from MEXC
  async getAllUSDTpairs(): Promise<string[]> {
    try {
      // Check cache
      if (this.allCoins.length > 0) {
        return this.allCoins;
      }

      const url = `${MEXC_BASE_URL}/exchangeInfo`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`MEXC API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Filter only USDT pairs that are trading
      const usdtPairs = data.symbols
        .filter((s: any) => 
          s.quoteAsset === 'USDT' && 
          s.status === 'TRADING' &&
          s.isSpotTradingAllowed === true
        )
        .map((s: any) => s.symbol)
        .sort();
      
      this.allCoins = usdtPairs;
      this.allCoinInfo = data.symbols
        .filter((s: any) => s.quoteAsset === 'USDT' && s.status === 'TRADING')
        .map((s: any) => ({
          symbol: s.symbol,
          baseAsset: s.baseAsset,
          quoteAsset: s.quoteAsset,
          status: s.status
        }));
      
      return this.allCoins;
    } catch (error) {
      console.error('Error fetching symbols:', error);
      // Return fallback list if API fails
      return this.getFallbackCoins();
    }
  }

  // Fallback coins if API fails
  private getFallbackCoins(): string[] {
    return [
      'BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'XRPUSDT', 
      'DOGEUSDT', 'ADAUSDT', 'DOTUSDT', 'LINKUSDT',
      'MATICUSDT', 'AVAXUSDT', 'UNIUSDT', 'ATOMUSDT',
      'LTCUSDT', 'BCHUSDT', 'NEARUSDT', 'APTUSDT',
      'ARBUSDT', 'OPUSDT', 'INJUSDT', 'SUIUSDT',
      'PEPEUSDT', 'WIFUSDT', 'BONKUSDT', 'FLOKIUSDT',
      'SEIUSDT', 'TIAUSDT', 'PYTHUSDT', 'JUPUSDT',
      'ONDOUSDT', 'STRKUSDT', 'ENAUSDT', 'ETHFIUSDT'
    ];
  }

  async getKlines(symbol: string, interval: string, limit: number = 200): Promise<KlineData[]> {
    try {
      const symbolUpper = symbol.toUpperCase();
      const url = `${MEXC_BASE_URL}/klines?symbol=${symbolUpper}&interval=${interval}&limit=${limit}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Coin ${symbolUpper} not found on MEXC.`);
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

  // Search coins by name
  async searchCoins(query: string): Promise<string[]> {
    const allCoins = await this.getAllUSDTpairs();
    const upperQuery = query.toUpperCase();
    
    return allCoins
      .filter(c => 
        c.includes(upperQuery) || 
        c.replace('USDT', '').includes(upperQuery)
      )
      .slice(0, 20);
  }
}
