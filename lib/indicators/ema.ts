export function calculateEMA(data: number[], period: number): number[] {
  const ema: number[] = [];
  const multiplier = 2 / (period + 1);
  
  let sum = 0;
  for (let i = 0; i < period; i++) {
    sum += data[i];
  }
  let emaValue = sum / period;
  ema.push(emaValue);
  
  for (let i = period; i < data.length; i++) {
    emaValue = (data[i] - emaValue) * multiplier + emaValue;
    ema.push(emaValue);
  }
  
  return ema;
}
