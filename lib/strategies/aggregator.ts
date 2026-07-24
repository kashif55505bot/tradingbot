import { reactiveTrail } from './reactiveTrail';
import { chochSetup } from './chochSetup';
import { fvgEntries } from './fvgEntries';
import { srForce } from './srForce';
import { chartPatterns } from './chartPatterns';
import { mlNeural } from './mlNeural';

interface IndicatorData {
  ema20: number;
  ema50: number;
  ema200: number;
  rsi: number;
  macd: { histogram: number };
  volume: { ratio: number };
}

export function aggregateSignals(price: number, indicators: IndicatorData) {
  // Sab strategies ko call karein
  const signals = {
    reactiveTrail: reactiveTrail(price, indicators),
    chochSetup: chochSetup(price, indicators),
    fvgEntries: fvgEntries(price, indicators),
    srForce: srForce(price, indicators),
    chartPatterns: chartPatterns(price, indicators),
    mlNeural: mlNeural(price, indicators),
  };

  // Final verdict - count LONG/SHORT
  const longCount = Object.values(signals).filter(s => s.type === 'LONG').length;
  const shortCount = Object.values(signals).filter(s => s.type === 'SHORT').length;
  
  let verdict = 'NEUTRAL';
  if (longCount > shortCount) verdict = 'BULLISH';
  else if (shortCount > longCount) verdict = 'BEARISH';
  
  if (longCount >= 4) verdict = 'STRONG BULLISH';
  else if (shortCount >= 4) verdict = 'STRONG BEARISH';

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
