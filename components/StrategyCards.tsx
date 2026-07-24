interface StrategyResult {
  type: 'LONG' | 'SHORT' | 'NEUTRAL';
  confidence: number;
  reasoning: string[];
  score: number;
}

interface StrategyCardsProps {
  signals: Record<string, StrategyResult>;
}

export default function StrategyCards({ signals }: StrategyCardsProps) {
  const getColor = (type: string) => {
    if (type === 'LONG') return 'border-green-500 bg-green-500/10';
    if (type === 'SHORT') return 'border-red-500 bg-red-500/10';
    return 'border-yellow-500 bg-yellow-500/10';
  };

  const getSignalText = (type: string) => {
    if (type === 'LONG') return '🟢 LONG';
    if (type === 'SHORT') return '🔴 SHORT';
    return '⚪ NEUTRAL';
  };

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-white">📈 Strategy Signals</h3>
      {Object.entries(signals).map(([name, signal]) => (
        <div
          key={name}
          className={`border rounded-lg p-4 ${getColor(signal.type)}`}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-white font-medium">{name}</p>
              <p className={`text-sm font-bold ${
                signal.type === 'LONG' ? 'text-green-400' :
                signal.type === 'SHORT' ? 'text-red-400' :
                'text-yellow-400'
              }`}>
                {getSignalText(signal.type)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-white font-bold">{signal.confidence}%</p>
              <p className="text-gray-400 text-sm">Score: {signal.score}</p>
            </div>
          </div>
          {signal.reasoning.length > 0 && (
            <ul className="mt-2 space-y-1">
              {signal.reasoning.map((reason, i) => (
                <li key={i} className="text-gray-300 text-sm">• {reason}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
