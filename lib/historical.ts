import { MEXCClient } from './mexc';

export async function getHistoricalData(coin: string, days: number = 30) {
  const client = MEXCClient.getInstance();
  const klines = await client.getKlines(coin, '1d', days);
  
  return klines.map(k => ({
    date: new Date(k.openTime).toISOString().split('T')[0],
    open: k.open,
    high: k.high,
    low: k.low,
    close: k.close,
    volume: k.volume
  }));
}
