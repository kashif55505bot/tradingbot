interface ConfidenceMeterProps {
  confidence: number;
}

export default function ConfidenceMeter({ confidence }: ConfidenceMeterProps) {
  const getColor = () => {
    if (confidence >= 90) return "text-green-500";
    if (confidence >= 80) return "text-emerald-500";
    if (confidence >= 70) return "text-yellow-500";
    return "text-red-500";
  };

  const getLabel = () => {
    if (confidence >= 90) return "VERY HIGH";
    if (confidence >= 80) return "HIGH";
    if (confidence >= 70) return "MEDIUM";
    return "LOW";
  };

  return (
    <div className="card p-6 rounded-2xl text-center">
      <div className="text-sm text-gray-400 mb-2">CONFIDENCE SCORE</div>
      
      <div className={`text-7xl font-bold mb-1 ${getColor()}`}>
        {confidence}%
      </div>

      <div className={`text-lg font-semibold ${getColor()}`}>
        {getLabel()} CONFIDENCE
      </div>

      <div className="mt-4 h-2.5 bg-gray-800 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-700 ${confidence >= 80 ? 'bg-green-500' : confidence >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`}
          style={{ width: `${confidence}%` }}
        />
      </div>
    </div>
  );
}
