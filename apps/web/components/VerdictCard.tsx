import { AnalysisResult } from "@/types/signal";

interface VerdictCardProps {
  result: AnalysisResult;
}

export default function VerdictCard({ result }: VerdictCardProps) {
  const getVerdictColor = () => {
    if (result.finalVerdict.includes("STRONG")) return "text-green-500";
    if (result.finalVerdict.includes("BULLISH")) return "text-emerald-500";
    if (result.finalVerdict.includes("BEARISH")) return "text-red-500";
    return "text-yellow-500";
  };

  return (
    <div className="card p-8 rounded-3xl text-center border border-yellow-500/20">
      <div className="uppercase tracking-widest text-xs text-gray-500 mb-3">
        AI FINAL VERDICT
      </div>

      <div className={`text-6xl font-bold mb-6 ${getVerdictColor()}`}>
        {result.finalVerdict}
      </div>

      <div className="inline-flex items-center gap-3 bg-gray-900 rounded-2xl px-6 py-3">
        <div className="text-sm text-gray-400">Overall Confidence</div>
        <div className="text-4xl font-bold text-white">
          {result.overallConfidence}%
        </div>
      </div>

      <div className="mt-6 text-sm text-gray-400">
        Updated just now • MEXC Futures Data
      </div>
    </div>
  );
}
