interface ConfidenceMeterProps {
  flashConfidence: number;
  mainConfidence: number;
}

export default function ConfidenceMeter({ flashConfidence, mainConfidence }: ConfidenceMeterProps) {
  const getColor = (value: number) => {
    if (value >= 90) return 'from-green-400 to-green-600';
    if (value >= 80) return 'from-blue-400 to-blue-600';
    if (value >= 70) return 'from-yellow-400 to-yellow-600';
    return 'from-red-400 to-red-600';
  };

  const ConfidenceBar = ({ label, value }: { label: string; value: number }) => (
    <div className="mb-4">
      <div className="flex justify-between text-sm text-gray-400 mb-1">
        <span>{label}</span>
        <span className="font-semibold text-white">{value}%</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${getColor(value)} transition-all duration-500`}
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
    </div>
  );

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-4">Confidence Levels</h3>
      <ConfidenceBar label="Flash Signal" value={flashConfidence} />
      <ConfidenceBar label="Main Signal" value={mainConfidence} />
    </div>
  );
}
