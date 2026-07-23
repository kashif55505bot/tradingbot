import { calculateEMA } from './ema';

export interface MACDResult {
  macd: number[];
  signal: number[];
  histogram: number[];
}

export function calculateMACD(data: number[], fast: number = 12, slow: number = 26, signal: number = 9): MACDResult {
  const emaFast = calculateEMA(data, fast);
  const emaSlow = calculateEMA(data, slow);
  
  // MACD line = EMA12 - EMA26
  const macdLine: number[] = [];
  const offset = slow - fast;
  for (let i = 0; i < emaFast.length; i++) {
    macdLine.push(emaFast[i] - emaSlow[i]);
  }
  
  // Signal line = EMA9 of MACD
  const signalLine = calculateEMA(macdLine, signal);
  
  // Histogram = MACD - Signal
  const histogram: number[] = [];
  const offset2 = signalLine.length - macdLine.length;
  for (let i = 0; i < signalLine.length; i++) {
    histogram.push(macdLine[i + offset2] - signalLine[i]);
  }
  
  return {
    macd: macdLine,
    signal: signalLine,
    histogram: histogram
  };
}
