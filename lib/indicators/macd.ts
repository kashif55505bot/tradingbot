import { calculateEMA } from './ema';

export function calculateMACD(data: number[], fast: number = 12, slow: number = 26, signal: number = 9) {
  const emaFast = calculateEMA(data, fast);
  const emaSlow = calculateEMA(data, slow);
  
  const macdLine: number[] = [];
  for (let i = 0; i < emaFast.length; i++) {
    macdLine.push(emaFast[i] - emaSlow[i]);
  }
  
  const signalLine = calculateEMA(macdLine, signal);
  
  const histogram: number[] = [];
  const offset = signalLine.length - macdLine.length;
  for (let i = 0; i < signalLine.length; i++) {
    histogram.push(macdLine[i + offset] - signalLine[i]);
  }
  
  return { macd: macdLine, signal: signalLine, histogram };
}
