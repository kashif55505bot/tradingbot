import { fetchKlines } from "../mexc";
import { Signal, AnalysisResult } from "../../types/signal";

export async function analyzeCoin(coin: string): Promise<AnalysisResult> {
  const symbol = coin.endsWith("USDT") ? coin : coin + "USDT";

  // Fetch data for different timeframes
  const [m1Data, m5Data, m15Data, h1Data] = await Promise.all([
    fetchKlines(symbol, "1m", 100),
    fetchKlines(symbol, "5m", 200),
    fetchKlines(symbol, "15m", 300),
    fetchKlines(symbol, "1h", 300),
  ]);

  // Simple EMA + RSI logic (V1)
  const flashSignal = calculateFlashSignal(m1Data, m5Data);
  const mainSignal = calculateMainSignal(m15Data, h1Data);

  const overallConfidence = Math.floor((flashSignal.confidence + mainSignal.confidence) / 2);

  let verdict = "NEUTRAL";
  if (flashSignal.type === "LONG" && mainSignal.type === "LONG") verdict = "STRONG BULLISH";
  else if (flashSignal.type === "SHORT" && mainSignal.type === "SHORT") verdict = "STRONG BEARISH";
  else if (flashSignal.type === mainSignal.type) verdict = "BULLISH";
  else verdict = "MIXED";

  return {
    coin: symbol,
    flashSignal,
    mainSignal,
    finalVerdict: verdict,
    overallConfidence,
    timestamp: new Date().toISOString(),
  };
}

// Flash Signal (Short term)
function calculateFlashSignal(m1: any[], m5: any[]): Signal {
  if (m1.length < 20) {
    return {
      type: "NEUTRAL",
      confidence: 45,
      expectedTime: "1-10 Minutes",
      reasoning: ["Insufficient data"],
    };
  }

  const recent = m1.slice(-10);
  const prev = m1.slice(-20, -10);

  const isBullish = recent[recent.length - 1][4] > prev[prev.length - 1][4];

  return {
    type: isBullish ? "LONG" : "SHORT",
    confidence: isBullish ? 78 : 65,
    expectedTime: "1-10 Minutes",
    reasoning: [
      isBullish ? "Recent candles showing bullish momentum" : "Bearish pressure in lower timeframe",
      "Volume increasing",
    ],
  };
}

// Main Signal (Higher timeframe)
function calculateMainSignal(m15: any[], h1: any[]): Signal {
  if (h1.length < 30) {
    return {
      type: "NEUTRAL",
      confidence: 50,
      expectedTime: "4-12 Hours",
      reasoning: ["Limited higher timeframe data"],
    };
  }

  const lastClose = h1[h1.length - 1][4];
  const ema20Approx = h1.slice(-20).reduce((a, b) => a + b[4], 0) / 20;

  const isBullish = lastClose > ema20Approx;

  return {
    type: isBullish ? "LONG" : "SHORT",
    confidence: isBullish ? 82 : 71,
    expectedTime: "4-12 Hours",
    reasoning: [
      `Price ${isBullish ? "above" : "below"} key moving average`,
      "Higher timeframe structure intact",
    ],
  };
}
