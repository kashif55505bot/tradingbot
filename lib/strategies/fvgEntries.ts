interface IndicatorData {
  ema20: number;
  ema50: number;
  ema200: number;
  rsi: number;
  macd: { histogram: number };
  volume: { ratio: number };
}

export function fvgEntries(price: number, indicators: IndicatorData) {
  let score = 0;
  let direction: 'LONG' | 'SHORT' | 'NEUTRAL' = 'NEUTRAL';
  const reasons: string[] = [];

  // Fair Value Gap detection (price vs EMAs)
  if (price > indicators.ema20 && indicators.ema20 > indicators.ema50) {
    score += 20;
    reasons.push('FVG: Bullish gap (price above EMAs)');
  } else if (price < indicators.ema20 && indicators.ema20 < indicators.ema50) {
    score -= 20;
    reasons.push('FVG: Bearish gap (price below EMAs)');
  }

  // RSI for gap strength
  if (indicators.rsi > 65) {
    score += 15;
    reasons.push('Strong bullish momentum for FVG');
  } else if (indicators.rsi < 35) {
    score -= 15;
    reasons.push('Strong bearish momentum for FVG');
  }

  // MACD confirmation
  if (indicators.macd.histogram > 0) {
    score += 10;
    reasons.push('MACD confirms bullish FVG');
  } else {
    score -= 10;
    reasons.push('MACD confirms bearish FVG');
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
