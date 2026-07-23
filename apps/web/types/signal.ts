export type SignalType = 'LONG' | 'SHORT' | 'NEUTRAL';
export type Timeframe = '1m' | '3m' | '5m' | '15m' | '1H' | '4H';

export interface IndicatorData {
  ema20: number;
  ema50: number;
  ema200: number;
  rsi: number;
  macd: {
    macd: number;
    signal: number;
    histogram: number;
  };
  volume: {
    current: number;
    average: number;
    ratio: number;
  };
}

export interface Signal {
  type: SignalType;
  confidence: number;
  timeframe: Timeframe;
  prediction: string;
  reasoning: string[];
  indicators: IndicatorData;
}

export interface AnalysisResult {
  coin: string;
  flashSignal: Signal;
  mainSignal: Signal;
  verdict: string;
  timestamp: string;
  rawData?: any;
}
