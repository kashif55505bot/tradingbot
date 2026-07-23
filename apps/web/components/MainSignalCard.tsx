import { Signal } from "@/types/signal";

interface MainSignalCardProps {
  signal: Signal;
}

export default function MainSignalCard({ signal }: MainSignalCardProps) {
  const isLong = signal.type === "LONG";
  const isNeutral = signal.type === "NEUTRAL";

  return (
    <div className="card p-6 rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-blue-400">📊 MAIN SIGNAL</h3>
        <span className="text-xs px-3 py-1 bg-gray-800 rounded-full">
          4–12 Hours
        </span>
      </div>

      <div className="flex items-center gap-4 mb-5">
        <div
          className={`text-5xl font-bold ${
            isLong ? "text-green-500" : isNeutral ? "text-gray-400" : "text-red-500"
          }`}
        >
          {signal.type}
        </div>

        <div>
          <div className="text-sm text-gray-400">Confidence</div>
          <div className="text-3xl font-bold text-white">{signal.confidence}%</div>
        </div>
      </div>

      <div className="space-y-2">
        {signal.reasoning.map((reason, i) => (
          <div key={i} className="text-sm text-gray-300 flex gap-2">
            <span className="text-blue-500">•</span>
            {reason}
          </div>
        ))}
      </div>
    </div>
  );
}
