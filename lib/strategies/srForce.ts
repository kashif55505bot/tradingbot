interface IndicatorData {
  ema20: number;
  ema50: number;
  ema200: number;
  rsi: number;
  macd: { histogram: number };
  volume: { ratio: number };
}

export function srForce(price: number, indicators: IndicatorData) {
  let score = 0;
  let direction: 'LONG' | 'SHORT' | 'NEUTRAL' = 'NEUTRAL';
  const reasons: string[] = [];

  // Support/Resistance strength (based on EMAs)
  if (price > indicators.ema50 && price > indicators.ema200) {
    score += 25;
    reasons.push('Strong support structure (above major EMAs)');
  } else if (price < indicators.ema50 && price < indicators.ema200) {
    score -= 25;
    reasons.push('Strong resistance structure (below major EMAs)');
  }

  // RSI for strength measurement
  if (indicators.rsi > 55) {
    score += 15;
    reasons.push('RSI shows buying pressure');
  } else if (indicators.rsi < 45) {
    score -= 15;
    reasons.push('RSI shows selling pressure');
  }

  // Volume for force confirmation
  if (indicators.volume.ratio > 1.3) {
    score += 10;
    reasons.push('Volume confirms S/R force');
  }

  if (score > 30) direction = 'LONG';
  else if (score < -30) direction = 'SHORT';
  else direction = 'NEUTRAL';

  return {
    type: direction,
    confidence: Math.min(Math.abs(score) + 30, 100),
    reasoning: reasons,
    score
  };
}
