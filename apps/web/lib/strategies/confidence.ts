import { Signal } from '@/types/signal';

export function calculateConfidence(signal: Signal): number {
  let confidence = signal.confidence;
  
  // Adjust based on reasoning quality
  if (signal.reasoning.length >= 5) {
    confidence += 5;
  }
  
  // Adjust based on signal type
  if (signal.type === 'NEUTRAL') {
    confidence = Math.min(confidence, 50);
  }
  
  return Math.min(Math.round(confidence), 100);
}
