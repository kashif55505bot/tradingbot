import { MEXCClient, KlineData } from '@/lib/mexc';
import { calculateEMA } from '@/lib/indicators/ema';
import { calculateRSI } from '@/lib/indicators/rsi';
import { calculateMACD } from '@/lib/indicators/macd';
import { generateFlashSignal } from '@/lib/strategies/flashSignal';
import { generateMainSignal } from '@/lib/strategies/mainSignal';
import { AnalysisResult, IndicatorData } from '@/types/signal';

export class AnalysisEngine {
  private mexcClient: MEXCClient;

  constructor() {
    this.mexcClient = MEXCClient.getInstance();
  }

  async analyze(coin: string): Promise<AnalysisResult> {
    try {
      const [flashData, mainData, priceData] = await Promise.all([
        this.mexcClient.getKlines(coin, '1m', 100),
        this.mexcClient.getKlines(coin, '15m', 100),
        this.mexcClient.getCurrentPrice(coin)
      ]);

      const price = priceData;
      const closes = flashData.map(d => d.close);

      const ema20 = calculateEMA(closes, 20);
      const ema50 = calculateEMA(closes, 50);
      const ema200 = calculateEMA(closes, 200);
      const rsi = calculateRSI(closes, 14);
      const macd = calculateMACD(closes, 12, 26, 9);
      
      const volumes = flashData.map(d => d.volume);
      const avgVolume = volumes.reduce((a, b) => a + b, 0) / volumes.length;
      const currentVolume = volumes[volumes.length - 1];
      const volumeRatio = currentVolume / avgVolume;

      const indicators: IndicatorData = {
        ema20: ema20[ema20.length - 1],
        ema50: ema50[ema50.length - 1],
        ema200: ema200[ema200.length - 1],
        rsi: rsi[rsi.length - 1],
        macd: {
          macd: macd.macd[macd.macd.length - 1],
          signal: macd.signal[macd.signal.length - 1],
          histogram: macd.histogram[macd.histogram.length - 1]
        },
        volume: {
          current: currentVolume,
          average: avgVolume,
          ratio: volumeRatio
        }
      };

      const flashSignal = generateFlashSignal(price, indicators, '1m');
      const mainSignal = generateMainSignal(price, indicators, '15m');

      const verdict = this.calculateVerdict(flashSignal, mainSignal);

      return {
        coin,
        flashSignal,
        mainSignal,
        verdict,
        timestamp: new Date().toISOString(),
        rawData: {
          flashData: flashData.slice(-10),
          mainData: mainData.slice(-10)
        }
      };
    } catch (error) {
      console.error('Analysis error:', error);
      throw error;
    }
  }

  private calculateVerdict(flash: any, main: any): string {
    if (flash.type === 'LONG' && main.type === 'LONG') {
      return 'STRONG BULLISH';
    } else if (flash.type === 'SHORT' && main.type === 'SHORT') {
      return 'STRONG BEARISH';
    } else if (flash.type === 'LONG' && main.type === 'NEUTRAL') {
      return 'BULLISH';
    } else if (flash.type === 'SHORT' && main.type === 'NEUTRAL') {
      return 'BEARISH';
    } else if (flash.type === 'LONG' && main.type === 'SHORT') {
      return 'MIXED - CONFLICTING SIGNALS';
    } else if (flash.type === 'SHORT' && main.type === 'LONG') {
      return 'MIXED - CONFLICTING SIGNALS';
    } else {
      return 'NEUTRAL';
    }
  }
}
