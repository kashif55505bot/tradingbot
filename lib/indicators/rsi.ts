export function calculateRSI(closes: number[], period: number = 14): number[] {
  const rsi: number[] = [];
  let gain = 0, loss = 0;
  
  for (let i = 1; i <= period; i++) {
    const diff = closes[i] - closes[i-1];
    if (diff >= 0) gain += diff;
    else loss += Math.abs(diff);
  }
  
  let avgGain = gain / period;
  let avgLoss = loss / period;
  
  let rs = avgGain / avgLoss;
  rsi.push(100 - (100 / (1 + rs)));
  
  for (let i = period + 1; i < closes.length; i++) {
    const diff = closes[i] - closes[i-1];
    if (diff >= 0) {
      avgGain = (avgGain * (period - 1) + diff) / period;
      avgLoss = (avgLoss * (period - 1)) / period;
    } else {
      avgGain = (avgGain * (period - 1)) / period;
      avgLoss = (avgLoss * (period - 1) + Math.abs(diff)) / period;
    }
    rs = avgGain / avgLoss;
    rsi.push(100 - (100 / (1 + rs)));
  }
  
  return rsi;
}
