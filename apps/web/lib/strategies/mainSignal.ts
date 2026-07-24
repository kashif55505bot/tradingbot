import { Signal, IndicatorData, Timeframe } from '@/types/signal';

export function generateMainSignal(
  price: number,
  indicators: IndicatorData,
  timeframe: Timeframe
): Signal {
  const reasoning: string[] = [];
  let longCount = 0;
  let shortCount = 0;
  
  // Long-term EMA Analysis
  if (price > indicators.ema200) {
    longCount++;
    reasoning.push('Price above EMA200 (strong bullish trend)');
  } else {
    shortCount++;
    reasoning.push('Price below EMA200 (strong bearish trend)');
  }
  
  // EMA Golden/Death Cross
  if (indicators.ema50 > indicators.ema200) {
    longCount++;
    reasoning.push('EMA50 above EMA200 (golden cross - bullish)');
  } else {
    shortCount++;
    reasoning.push('EMA50 below EMA200 (death cross - bearish)');
  }
  
  // RSI Divergence
  if (indicators.rsi > 60) {
    longCount++;
    reasoning.push(`RSI at ${indicators.rsi.toFixed(2)} (strong bullish momentum)`);
  } else if (indicators.rsi < 40) {
    shortCount++;
    reasoning.push(`RSI at ${indicators.rsi.toFixed(2)} (strong bearish momentum)`);
  }
  
  // MACD Trend - direct values use karo
  if (indicators.macd.histogram > 0) {
    longCount++;
    reasoning.push('MACD histogram positive (bullish)');
  } else {
    shortCount++;
    reasoning.push('MACD histogram negative (bearish)');
  }
  
  // Volume Trend
  const avgVolume = indicators.volume.average;
  const currentVolume = indicators.volume.current;
  if (currentVolume > avgVolume * 1.5 && price > indicators.ema50) {
    longCount++;
    reasoning.push('High volume with bullish trend (strong conviction)');
  } else if (currentVolume > avgVolume * 1.5 && price < indicators.ema50) {
    shortCount++;
    reasoning.push('High volume with bearish trend (strong conviction)');
  }
  
  // Determine signal type
  let type: 'LONG' | 'SHORT' | 'NEUTRAL';
  if (longCount > shortCount + 1) {
    type = 'LONG';
  } else if (shortCount > longCount + 1) {
    type = 'SHORT';
  } else {
    type = 'NEUTRAL';
  }
  
  // Calculate confidence with stricter criteria for main signal
  const totalSignals = longCount + shortCount;
  let confidence = type === 'LONG' 
    ? (longCount / totalSignals) * 100 
    : type === 'SHORT'
    ? (shortCount / totalSignals) * 100
    : 50;
  
  // Adjust confidence based on trend strength
  if (type === 'LONG' && price > indicators.ema200) {
    confidence += 5;
  } else if (type === 'SHORT' && price < indicators.ema200) {
    confidence += 5;
  }
  
  return {
    type,
    confidence: Math.min(Math.round(confidence), 100),
    timeframe,
    prediction: type === 'LONG' ? '4-12 Hours' : type === 'SHORT' ? '4-12 Hours' : 'Neutral',
    reasoning,
    indicators
  };
}
