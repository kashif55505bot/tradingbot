interface IndicatorData {
  ema20: number;
  ema50: number;
  ema200: number;
  rsi: number;
  macd: { histogram: number };
  volume: { ratio: number };
}

export function reactiveTrail(price: number, indicators: IndicatorData) {
  let score = 0;
  let direction: 'LONG' | 'SHORT' | 'NEUTRAL' = 'NEUTRAL';
  const reasons: string[] = [];

  // Momentum check
  if (indicators.rsi > 55) {
    score += 25;
    reasons.push('RSI above 55 (bullish momentum)');
  } else if (indicators.rsi < 45) {
    score -= 25;
    reasons.push('RSI below 45 (bearish momentum)');
  }

  // Trend check
  if (price > indicators.ema20) {
    score += 20;
    reasons.push('Price above EMA20');
  } else {
    score -= 20;
    reasons.push('Price below EMA20');
  }

  // Volume confirmation
  if (indicators.volume.ratio > 1.2) {
    score += 15;
    reasons.push('Volume above average');
  }

  // MACD confirmation
  if (indicators.macd.histogram > 0) {
    score += 10;
    reasons.push('MACD histogram positive');
  } else {
    score -= 10;
    reasons.push('MACD histogram negative');
  }

  if (score > 30) direction = 'LONG';
  else if (score < -30) direction = 'SHORT';
  else direction = 'NEUTRAL';

  const confidence = Math.min(Math.abs(score) + 30, 100);

  return {
    type: direction,
    confidence,
    reasoning: reasons,
    score
  };
}
