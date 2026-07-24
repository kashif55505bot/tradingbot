interface IndicatorData {
  ema20: number;
  ema50: number;
  ema200: number;
  rsi: number;
  macd: { histogram: number };
  volume: { ratio: number };
}

export function chartPatterns(price: number, indicators: IndicatorData) {
  let score = 0;
  let direction: 'LONG' | 'SHORT' | 'NEUTRAL' = 'NEUTRAL';
  const reasons: string[] = [];

  // Pattern detection based on price vs EMAs
  if (price > indicators.ema20 && indicators.ema20 > indicators.ema50) {
    score += 20;
    reasons.push('Bullish pattern (golden cross setup)');
  } else if (price < indicators.ema20 && indicators.ema20 < indicators.ema50) {
    score -= 20;
    reasons.push('Bearish pattern (death cross setup)');
  }

  // RSI for pattern confirmation
  if (indicators.rsi > 50 && indicators.rsi < 70) {
    score += 15;
    reasons.push('RSI in bullish pattern zone');
  } else if (indicators.rsi < 50 && indicators.rsi > 30) {
    score -= 15;
    reasons.push('RSI in bearish pattern zone');
  }

  // MACD for pattern strength
  if (indicators.macd.histogram > 0 && indicators.rsi > 50) {
    score += 10;
    reasons.push('MACD confirms bullish pattern');
  } else if (indicators.macd.histogram < 0 && indicators.rsi < 50) {
    score -= 10;
    reasons.push('MACD confirms bearish pattern');
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
