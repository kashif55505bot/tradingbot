export function calculateRSI(closes: number[], period: number = 14): number[] {
  const rsi: number[] = [];
  let gain = 0;
  let loss = 0;
  
  // Calculate initial average gain and loss
  for (let i = 1; i <= period; i++) {
    const difference = closes[i] - closes[i-1];
    if (difference >= 0) {
      gain += difference;
    } else {
      loss += Math.abs(difference);
    }
  }
  
  let avgGain = gain / period;
  let avgLoss = loss / period;
  
  // First RSI
  let rs = avgGain / avgLoss;
  rsi.push(100 - (100 / (1 + rs)));
  
  // Calculate remaining RSI
  for (let i = period + 1; i < closes.length; i++) {
    const difference = closes[i] - closes[i-1];
    if (difference >= 0) {
      avgGain = (avgGain * (period - 1) + difference) / period;
      avgLoss = (avgLoss * (period - 1)) / period;
    } else {
      avgGain = (avgGain * (period - 1)) / period;
      avgLoss = (avgLoss * (period - 1) + Math.abs(difference)) / period;
    }
    
    rs = avgGain / avgLoss;
    rsi.push(100 - (100 / (1 + rs)));
  }
  
  return rsi;
}
