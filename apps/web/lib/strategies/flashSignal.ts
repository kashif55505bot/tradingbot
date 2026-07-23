import { Signal, IndicatorData, Timeframe } from '@/types/signal';

export function generateFlashSignal(
  price: number,
  indicators: IndicatorData,
  timeframe: Timeframe
): Signal {
  const reasoning: string[] = [];
  let longCount = 0;
  let shortCount = 0;
  
  // EMA Analysis
  if (price > indicators.ema20) {
    longCount++;
    reasoning.push('Price above EMA20 (bullish)');
  } else {
    shortCount++;
    reasoning.push('Price below EMA20 (bearish)');
  }
  
  if (price > indicators.ema50) {
    longCount++;
    reasoning.push('Price above EMA50 (bullish)');
  } else {
    shortCount++;
    reasoning.push('Price below EMA50 (bearish)');
  }
  
  // EMA Crossover
  if (indicators.ema20 > indicators.ema50) {
    longCount++;
    reasoning.push('EMA20 above EMA50 (bullish crossover)');
  } else {
    shortCount++;
    reasoning.push('EMA20 below EMA50 (bearish crossover)');
  }
  
  // RSI Analysis
  if (indicators.rsi > 50) {
    longCount++;
    reasoning.push(`RSI at ${indicators.rsi.toFixed(2)} (above 50)`);
  } else {
    shortCount++;
    reasoning.push(`RSI at ${indicators.rsi.toFixed(2)} (below 50)`);
  }
  
  if (indicators.rsi > 70) {
    reasoning.push('⚠️ RSI overbought');
  } else if (indicators.rsi < 30) {
    reasoning.push('⚠️ RSI oversold');
  }
  
  // MACD Analysis
  if (indicators.macd.histogram > 0) {
    longCount++;
    reasoning.push('MACD histogram positive (bullish)');
  } else {
    shortCount++;
    reasoning.push('MACD histogram negative (bearish)');
  }
  
  // Volume Analysis
  if (indicators.volume.ratio > 1.2) {
    reasoning.push(`Volume ${indicators.volume.ratio.toFixed(2)}x above average (strong movement)`);
    if (price > indicators.ema20) {
      longCount++;
      reasoning.push('High volume with price above EMA (bullish confirmation)');
    } else {
      shortCount++;
      reasoning.push('High volume with price below EMA (bearish confirmation)');
    }
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
  
  // Calculate confidence
  const totalSignals = longCount + shortCount;
  const confidence = type === 'LONG' 
    ? (longCount / totalSignals) * 100 
    : type === 'SHORT'
    ? (shortCount / totalSignals) * 100
    : 50;
  
  return {
    type,
    confidence: Math.min(Math.round(confidence), 100),
    timeframe,
    prediction: type === 'LONG' ? '1-10 Minutes' : type === 'SHORT' ? '1-10 Minutes' : 'Neutral',
    reasoning,
    indicators
  };
}
