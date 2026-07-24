interface IndicatorData {
  ema20: number;
  ema50: number;
  ema200: number;
  rsi: number;
  macd: { histogram: number };
  volume: { ratio: number };
}

export function chochSetup(price: number, indicators: IndicatorData) {
  let score = 0;
  let direction: 'LONG' | 'SHORT' | 'NEUTRAL' = 'NEUTRAL';
  const reasons: string[] = [];

  // HTF Bias (EMA200 trend)
  if (price > indicators.ema200) {
    score += 20;
    reasons.push('HTF Bias: Bullish (above EMA200)');
  } else {
    score -= 20;
    reasons.push('HTF Bias: Bearish (below EMA200)');
  }

  // CHoCH detection (price vs EMA50)
  if (price > indicators.ema50 && indicators.ema20 > indicators.ema50) {
    score += 25;
    reasons.push('CHoCH: Bullish structure break');
  } else if (price < indicators.ema50 && indicators.ema20 < indicators.ema50) {
    score -= 25;
    reasons.push('CHoCH: Bearish structure break');
  }

  // RSI confirmation
  if (indicators.rsi > 60) {
    score += 15;
    reasons.push('RSI confirms bullish momentum');
  } else if (indicators.rsi < 40) {
    score -= 15;
    reasons.push('RSI confirms bearish momentum');
  }

  // Volume confirmation
  if (indicators.volume.ratio > 1.5) {
    score += 10;
    reasons.push('High volume confirms breakout');
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
