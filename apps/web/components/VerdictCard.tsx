interface VerdictCardProps {
  verdict: string;
}

export default function VerdictCard({ verdict }: VerdictCardProps) {
  const getVerdictColor = (verdict: string) => {
    if (verdict.includes('STRONG BULLISH')) return 'from-green-500 to-green-600';
    if (verdict.includes('STRONG BEARISH')) return 'from-red-500 to-red-600';
    if (verdict.includes('BULLISH')) return 'from-green-400 to-green-500';
    if (verdict.includes('BEARISH')) return 'from-red-400 to-red-500';
    if (verdict.includes('MIXED')) return 'from-yellow-500 to-orange-500';
    return 'from-gray-500 to-gray-600';
  };

  const getEmoji = (verdict: string) => {
    if (verdict.includes('BULLISH')) return '🚀';
    if (verdict.includes('BEARISH')) return '📉';
    if (verdict.includes('MIXED')) return '⚖️';
    return '⏸️';
  };

  return (
    <div className={`bg-gradient-to-r ${getVerdictColor(verdict)} rounded-xl p-6 shadow-lg`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/80 text-sm font-medium">Final Verdict</p>
          <h2 className="text-2xl font-bold text-white mt-1">{verdict}</h2>
        </div>
        <div className="text-5xl">{getEmoji(verdict)}</div>
      </div>
    </div>
  );
}
