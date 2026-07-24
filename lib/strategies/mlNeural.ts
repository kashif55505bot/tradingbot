interface IndicatorData {
  ema20: number;
  ema50: number;
  ema200: number;
  rsi: number;
  macd: { histogram: number };
  volume: { ratio: number };
}

export function mlNeural(price: number, indicators: IndicatorData) {
  let score = 0;
  let state: 'LONG' | 'WATCH' | 'CASH' = 'CASH';
  const reasons: string[] = [];

  // Neural network simplified: combine multiple indicators
  const features = {
    trend: price > indicators.ema200 ? 1 : -1,
    momentum: indicators.rsi > 50 ? 1 : -1,
    volume: indicators.volume.ratio > 1.2 ? 1 : -1,
    macd: indicators.macd.histogram > 0 ? 1 : -1
  };

  // Weighted neural score
  score += features.trend * 30;
  score += features.momentum * 25;
  score += features.volume * 20;
  score += features.macd * 15;

  // Neural network state
  if (score > 40) {
    state = 'LONG';
    reasons.push('Neural network: STRONG BUY signal');
  } else if (score > 20) {
    state = 'WATCH';
    reasons.push('Neural network: WATCH (wait for confirmation)');
  } else {
    state = 'CASH';
    reasons.push('Neural network: CASH (stay defensive)');
  }

  return {
    type: state === 'LONG' ? 'LONG' : state === 'WATCH' ? 'NEUTRAL' : 'NEUTRAL',
    confidence: Math.min(Math.abs(score) + 20, 100),
    reasoning: reasons,
    score,
    state
  };
}
