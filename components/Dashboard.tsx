interface DashboardProps {
  coin: string;
  price: number;
  verdict: string;
  confidence: number;
  entry?: number;
  stopLoss?: number;
  targets?: number[];
  timeFrame?: string;
}

export default function Dashboard({ 
  coin, 
  price, 
  verdict, 
  confidence,
  entry,
  stopLoss,
  targets,
  timeFrame
}: DashboardProps) {
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

  const getActionColor = (v: string) => {
    if (v.includes('BULLISH')) return 'bg-green-600 hover:bg-green-700';
    if (v.includes('BEARISH')) return 'bg-red-600 hover:bg-red-700';
    return 'bg-gray-600';
  };

  const getActionText = (v: string) => {
    if (v.includes('STRONG BULLISH')) return '🔥 STRONG BUY';
    if (v.includes('BULLISH')) return '✅ BUY';
    if (v.includes('STRONG BEARISH')) return '🔥 STRONG SELL';
    if (v.includes('BEARISH')) return '✅ SELL';
    return '⏳ WAIT';
  };

  const isBullish = verdict.includes('BULLISH');
  const isBearish = verdict.includes('BEARISH');
  const isStrong = verdict.includes('STRONG');

  // Calculate ATR-based levels if not provided
  const atr = price * 0.02; // 2% ATR
  const calculatedEntry = entry || price;
  const calculatedSL = stopLoss || (isBullish ? price - (atr * 1.5) : price + (atr * 1.5));
  const calculatedTargets = targets || (isBullish 
    ? [price + (atr * 2), price + (atr * 3), price + (atr * 4)]
    : [price - (atr * 2), price - (atr * 3), price - (atr * 4)]
  );
  const calculatedTime = timeFrame || (isStrong ? '12-24 hours' : '4-12 hours');

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      {/* Coin & Price */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-2xl font-bold text-white">{coin}</h2>
          <p className="text-gray-400">Price: <span className="text-white font-bold">${price.toFixed(2)}</span></p>
        </div>
        <div className="text-right">
          <p className="text-gray-400 text-sm">Confidence</p>
          <p className={`text-3xl font-bold ${getConfidenceColor(confidence)}`}>
            {confidence}%
          </p>
        </div>
      </div>

      {/* Action Button */}
      <div className="mb-4">
        <div className={`text-center py-3 rounded-lg text-white font-bold text-xl ${getActionColor(verdict)}`}>
          {getActionText(verdict)}
        </div>
        {isStrong && (
          <p className="text-center text-green-400 text-sm mt-1">⭐ Strong Signal - High Probability</p>
        )}
        {confidence < 60 && (
          <p className="text-center text-yellow-400 text-sm mt-1">⚠️ Low Confidence - Trade with Caution</p>
        )}
      </div>

      {/* Trading Levels */}
      {(isBullish || isBearish) && confidence >= 60 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <div className="bg-gray-700 rounded-lg p-3 text-center">
            <p className="text-gray-400 text-xs">ENTRY</p>
            <p className="text-white font-bold">${calculatedEntry.toFixed(2)}</p>
          </div>
          <div className="bg-gray-700 rounded-lg p-3 text-center">
            <p className="text-gray-400 text-xs">STOP LOSS</p>
            <p className="text-red-400 font-bold">${calculatedSL.toFixed(2)}</p>
            <p className="text-red-400 text-xs">
              {isBullish ? '🔻' : '🔺'} {((Math.abs(calculatedSL - calculatedEntry) / calculatedEntry) * 100).toFixed(2)}%
            </p>
          </div>
          <div className="bg-gray-700 rounded-lg p-3 text-center">
            <p className="text-gray-400 text-xs">TARGET 1</p>
            <p className="text-green-400 font-bold">${calculatedTargets[0].toFixed(2)}</p>
            <p className="text-green-400 text-xs">
              {isBullish ? '🔼' : '🔽'} {((Math.abs(calculatedTargets[0] - calculatedEntry) / calculatedEntry) * 100).toFixed(2)}%
            </p>
          </div>
          <div className="bg-gray-700 rounded-lg p-3 text-center">
            <p className="text-gray-400 text-xs">TIME FRAME</p>
            <p className="text-white font-bold">{calculatedTime}</p>
          </div>
        </div>
      )}

      {/* Targets 2 & 3 */}
      {(isBullish || isBearish) && confidence >= 60 && (
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gray-700/50 rounded-lg p-2 text-center">
            <p className="text-gray-400 text-xs">TARGET 2</p>
            <p className="text-blue-400 font-bold">${calculatedTargets[1]?.toFixed(2) || '--'}</p>
            <p className="text-blue-400 text-xs">
              {isBullish ? '🔼' : '🔽'} {calculatedTargets[1] ? ((Math.abs(calculatedTargets[1] - calculatedEntry) / calculatedEntry) * 100).toFixed(2) : '--'}%
            </p>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-2 text-center">
            <p className="text-gray-400 text-xs">TARGET 3</p>
            <p className="text-purple-400 font-bold">${calculatedTargets[2]?.toFixed(2) || '--'}</p>
            <p className="text-purple-400 text-xs">
              {isBullish ? '🔼' : '🔽'} {calculatedTargets[2] ? ((Math.abs(calculatedTargets[2] - calculatedEntry) / calculatedEntry) * 100).toFixed(2) : '--'}%
            </p>
          </div>
        </div>
      )}

      {/* Risk/Reward */}
      {(isBullish || isBearish) && confidence >= 60 && (
        <div className="bg-gray-700/30 rounded-lg p-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Risk:</span>
            <span className="text-red-400">${(Math.abs(calculatedSL - calculatedEntry)).toFixed(2)}</span>
            <span className="text-gray-400">Reward:</span>
            <span className="text-green-400">${(Math.abs(calculatedTargets[2] - calculatedEntry)).toFixed(2)}</span>
            <span className="text-gray-400">R:R:</span>
            <span className="text-white font-bold">
              1:{(Math.abs(calculatedTargets[2] - calculatedEntry) / Math.abs(calculatedSL - calculatedEntry)).toFixed(1)}
            </span>
          </div>
        </div>
      )}

      {/* Verdict */}
      <div className="mt-4 pt-4 border-t border-gray-700">
        <p className="text-gray-400 text-sm">Final Verdict</p>
        <p className={`text-2xl font-bold ${getVerdictColor(verdict)}`}>
          {verdict}
        </p>
      </div>
    </div>
  );
}
