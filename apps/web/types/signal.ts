export type SignalType = "LONG" | "SHORT" | "NEUTRAL";

export interface Signal {
  type: SignalType;
  confidence: number;        // 0-100
  expectedTime: string;
  reasoning: string[];
}

export interface AnalysisResult {
  coin: string;
  flashSignal: Signal;
  mainSignal: Signal;
  finalVerdict: string;
  overallConfidence: number;
  timestamp: string;
}
