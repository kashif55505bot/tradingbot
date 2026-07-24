interface DashboardProps {
  coin: string;
  price: number;
  verdict: string;
  confidence: number;
}

export default function Dashboard({ coin, price, verdict, confidence }: DashboardProps) {
  const getVerdictColor = (v: string) => {
    if (v.includes('STRONG BULLISH')) return 'text-green-400';
    if (v.includes('STRONG BEARISH')) return 'text-red-400';
    if (v.includes('BULLISH')) return 'text-green-300';
    if (v.includes('BEARISH')) return 'text-red-300';
    return 'text-yellow-400';
  };

  const getConfidenceColor = (c: number) => {
    if (c >= 80) return 'text-green-400';
    if (c >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-white">{coin}</h2>
          <p className="text-gray-400">Price: <span className="text-white">${price.toFixed(2)}</span></p>
        </div>
        <div className="text-right">
          <p className="text-gray-400 text-sm">Confidence</p>
          <p className={`text-3xl font-bold ${getConfidenceColor(confidence)}`}>
            {confidence}%
          </p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-700">
        <p className="text-gray-400 text-sm">Final Verdict</p>
        <p className={`text-2xl font-bold ${getVerdictColor(verdict)}`}>
          {verdict}
        </p>
      </div>
    </div>
  );
}
