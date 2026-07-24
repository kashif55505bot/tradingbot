// Using CoinGecko API instead of MEXC (more reliable for all coins)
const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3';

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
  private allCoins: string[] = [];
  
  static getInstance(): MEXCClient {
    if (!MEXCClient.instance) {
      MEXCClient.instance = new MEXCClient();
    }
    return MEXCClient.instance;
  }

  // Get all coins from CoinGecko
  async getAllCoins(): Promise<string[]> {
    try {
      if (this.allCoins.length > 0) {
        return this.allCoins;
      }

      const response = await fetch(
        `${COINGECKO_BASE_URL}/coins/list?include_platform=false`
      );
      
      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Convert to USDT format
      const coins = data
        .filter((coin: any) => coin.symbol)
        .map((coin: any) => `${coin.symbol.toUpperCase()}USDT`)
        .filter((symbol: string) => symbol.length <= 10) // Filter long symbols
        .slice(0, 200); // Limit for performance
      
      this.allCoins = coins;
      return this.allCoins;
    } catch (error) {
      console.error('Error fetching coins:', error);
      return this.getFallbackCoins();
    }
  }

  private getFallbackCoins(): string[] {
    return [
      'BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'XRPUSDT', 
      'DOGEUSDT', 'ADAUSDT', 'DOTUSDT', 'LINKUSDT',
      'MATICUSDT', 'AVAXUSDT', 'UNIUSDT', 'ATOMUSDT',
      'LTCUSDT', 'BCHUSDT', 'NEARUSDT', 'APTUSDT'
    ];
  }

  // Get OHLCV data from CoinGecko
  async getKlines(symbol: string, interval: string, limit: number = 100): Promise<KlineData[]> {
    try {
      // Convert symbol to CoinGecko format (e.g., BTCUSDT -> bitcoin)
      const coinId = await this.getCoinId(symbol);
      
      // Map interval to CoinGecko format
      const intervalMap: Record<string, string> = {
        '1m': '1m',
        '5m': '5m',
        '15m': '15m',
        '30m': '30m',
        '1h': '1h',
        '4h': '4h',
        '1d': '1d'
      };
      
      const days = interval === '1d' ? 30 : 7;
      const url = `${COINGECKO_BASE_URL}/coins/${coinId}/ohlc?days=${days}&vs_currency=usd`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data || data.length === 0) {
        throw new Error(`No data available for ${symbol}`);
      }
      
      return data.map((item: any[]) => ({
        openTime: item[0],
        open: item[1],
        high: item[2],
        low: item[3],
        close: item[4],
        volume: 0, // CoinGecko free API doesn't provide volume
        closeTime: item[0]
      }));
    } catch (error) {
      console.error('Error fetching klines:', error);
      throw error;
    }
  }

  // Get current price from CoinGecko
  async getCurrentPrice(symbol: string): Promise<number> {
    try {
      const coinId = await this.getCoinId(symbol);
      const url = `${COINGECKO_BASE_URL}/simple/price?ids=${coinId}&vs_currencies=usd`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status}`);
      }
      
      const data = await response.json();
      return data[coinId]?.usd || 0;
    } catch (error) {
      console.error('Error fetching price:', error);
      throw error;
    }
  }

  // Map symbol to CoinGecko ID
  private async getCoinId(symbol: string): Promise<string> {
    const symbolMap: Record<string, string> = {
      'BTCUSDT': 'bitcoin',
      'ETHUSDT': 'ethereum',
      'SOLUSDT': 'solana',
      'XRPUSDT': 'ripple',
      'DOGEUSDT': 'dogecoin',
      'ADAUSDT': 'cardano',
      'DOTUSDT': 'polkadot',
      'LINKUSDT': 'chainlink',
      'MATICUSDT': 'polygon',
      'AVAXUSDT': 'avalanche-2',
      'UNIUSDT': 'uniswap',
      'ATOMUSDT': 'cosmos',
      'LTCUSDT': 'litecoin',
      'BCHUSDT': 'bitcoin-cash',
      'NEARUSDT': 'near',
      'APTUSDT': 'aptos',
      'ARBUSDT': 'arbitrum',
      'OPUSDT': 'optimism',
      'INJUSDT': 'injective-protocol',
      'SUIUSDT': 'sui',
      'PEPEUSDT': 'pepe',
      'SEIUSDT': 'sei-network',
      'TIAUSDT': 'celestia',
      'PYTHUSDT': 'pyth-network',
      'JUPUSDT': 'jupiter',
      'ONDOUSDT': 'ondo-finance',
      'STRKUSDT': 'starknet',
      'ENAUSDT': 'ethena',
      'ETHFIUSDT': 'ether-fi',
      'WIFUSDT': 'dogwifcoin',
      'BONKUSDT': 'bonk',
      'FLOKIUSDT': 'floki'
    };

    // Clean symbol
    const cleanSymbol = symbol.replace('USDT', '').toLowerCase();
    
    // Try to find in map
    for (const [key, value] of Object.entries(symbolMap)) {
      if (key === symbol) return value;
    }
    
    // If not found, try using symbol directly
    const response = await fetch(
      `${COINGECKO_BASE_URL}/coins/${cleanSymbol}?localization=false&tickers=false&market_data=false&community_data=false&developer_data=false`
    );
    
    if (response.ok) {
      const data = await response.json();
      return data.id;
    }
    
    // Fallback: try searching
    const searchResponse = await fetch(
      `${COINGECKO_BASE_URL}/search?query=${cleanSymbol}`
    );
    const searchData = await searchResponse.json();
    
    if (searchData.coins && searchData.coins.length > 0) {
      return searchData.coins[0].id;
    }
    
    throw new Error(`Coin ${symbol} not found on CoinGecko`);
  }

  async searchCoins(query: string): Promise<string[]> {
    const allCoins = await this.getAllCoins();
    const upperQuery = query.toUpperCase();
    
    return allCoins
      .filter(c => 
        c.includes(upperQuery) || 
        c.replace('USDT', '').includes(upperQuery)
      )
      .slice(0, 20);
  }
}
