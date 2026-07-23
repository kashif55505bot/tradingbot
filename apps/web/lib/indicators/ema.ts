export function calculateEMA(data: number[], period: number): number[] {
  const ema: number[] = [];
  const multiplier = 2 / (period + 1);
  
  // First EMA = SMA
  let sum = 0;
  for (let i = 0; i < period; i++) {
    sum += data[i];
  }
  let emaValue = sum / period;
  ema.push(emaValue);
  
  // Calculate EMA for remaining data
  for (let i = period; i < data.length; i++) {
    emaValue = (data[i] - emaValue) * multiplier + emaValue;
    ema.push(emaValue);
  }
  
  return ema;
}
