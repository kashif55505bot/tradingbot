import { reactiveTrail } from './reactiveTrail';

interface IndicatorData {
  ema20: number;
  ema50: number;
  ema200: number;
  rsi: number;
  macd: { histogram: number };
  volume: { ratio: number };
}

export function aggregateSignals(price: number, indicators: IndicatorData) {
  // Reactive Trail strategy
  const reactive = reactiveTrail(price, indicators);
  
  // Abhi sirf reactive trail hai, baqi strategies baad mein add karenge
  const signals = {
    reactiveTrail: reactive,
  };

  // Final verdict
  const longCount = Object.values(signals).filter(s => s.type === 'LONG').length;
  const shortCount = Object.values(signals).filter(s => s.type === 'SHORT').length;
  
  let verdict = 'NEUTRAL';
  if (longCount > shortCount) verdict = 'BULLISH';
  else if (shortCount > longCount) verdict = 'BEARISH';
  
  if (longCount >= 3) verdict = 'STRONG BULLISH';
  else if (shortCount >= 3) verdict = 'STRONG BEARISH';

  // Average confidence
  const totalConfidence = Object.values(signals).reduce((sum, s) => sum + s.confidence, 0);
  const avgConfidence = Math.round(totalConfidence / Object.values(signals).length);

  return {
    signals,
    verdict,
    confidence: avgConfidence,
    timestamp: new Date().toISOString()
  };
}
