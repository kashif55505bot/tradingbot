import { Signal } from '@/types/signal';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface AnalysisBreakdownProps {
  flashSignal: Signal;
  mainSignal: Signal;
}

export default function AnalysisBreakdown({ flashSignal, mainSignal }: AnalysisBreakdownProps) {
  const [expanded, setExpanded] = useState(false);

  const SignalReasoning = ({ signal, title }: { signal: Signal; title: string }) => (
    <div className="mb-4 last:mb-0">
      <h4 className="text-sm font-semibold text-white mb-2">{title}</h4>
      <ul className="space-y-1">
        {signal.reasoning.map((reason, index) => (
          <li key={index} className="text-sm text-gray-300 flex items-start">
            <span className="text-blue-400 mr-2">•</span>
            {reason}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-700/30 transition-colors"
      >
        <h3 className="text-lg font-semibold text-white">Analysis Breakdown</h3>
        {expanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>
      
      {expanded && (
        <div className="px-6 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <SignalReasoning signal={flashSignal} title="Flash Signal Analysis" />
              <div className="bg-gray-700/30 rounded-lg p-3">
                <h4 className="text-sm font-semibold text-gray-400 mb-1">Flash Signal Details</h4>
                <p className="text-sm text-gray-300">
                  Timeframe: 1-10 minutes • {flashSignal.type} signal with {flashSignal.confidence}% confidence
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <SignalReasoning signal={mainSignal} title="Main Signal Analysis" />
              <div className="bg-gray-700/30 rounded-lg p-3">
                <h4 className="text-sm font-semibold text-gray-400 mb-1">Main Signal Details</h4>
                <p className="text-sm text-gray-300">
                  Timeframe: 4-12 hours • {mainSignal.type} signal with {mainSignal.confidence}% confidence
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-700">
            <h4 className="text-sm font-semibold text-gray-400 mb-2">Indicator Summary</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-700/30 rounded-lg p-3">
                <p className="text-xs text-gray-500">RSI</p>
                <p className="text-sm font-semibold text-white">
                  {flashSignal.indicators.rsi.toFixed(2)}
                </p>
              </div>
              <div className="bg-gray-700/30 rounded-lg p-3">
                <p className="text-xs text-gray-500">EMA20</p>
                <p className="text-sm font-semibold text-white">
                  {flashSignal.indicators.ema20.toFixed(2)}
                </p>
              </div>
              <div className="bg-gray-700/30 rounded-lg p-3">
                <p className="text-xs text-gray-500">Volume Ratio</p>
                <p className="text-sm font-semibold text-white">
                  {flashSignal.indicators.volume.ratio.toFixed(2)}x
                </p>
              </div>
              <div className="bg-gray-700/30 rounded-lg p-3">
                <p className="text-xs text-gray-500">MACD Histogram</p>
                <p className="text-sm font-semibold text-white">
                  {flashSignal.indicators.macd.histogram.toFixed(4)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
