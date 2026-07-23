#!/bin/bash

# Navigate to web app
cd apps/web

# Create components directory if it doesn't exist
mkdir -p components

# Create all component files
cat > components/CoinInput.tsx << 'EOF'
'use client';

import { useState } from 'react';
import { Search, TrendingUp } from 'lucide-react';

interface CoinInputProps {
  onAnalyze: (coin: string) => void;
  loading: boolean;
}

const popularCoins = ['BTCUSDT', 'SOLUSDT', 'XRPUSDT', 'ETHUSDT', 'DOGEUSDT'];

export default function CoinInput({ onAnalyze, loading }: CoinInputProps) {
  const [coin, setCoin] = useState('BTCUSDT');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (coin.trim()) {
      onAnalyze(coin.trim().toUpperCase());
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-gray-700">
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
        <TrendingUp className="w-5 h-5 mr-2 text-blue-400" />
        Analyze Coin
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            type="text"
            value={coin}
            onChange={(e) => setCoin(e.target.value)}
            placeholder="Enter coin (e.g., BTCUSDT)"
            className="w-full bg-gray-700/50 text-white rounded-lg px-4 py-3 pl-10 
                     border border-gray-600 focus:border-blue-500 focus:outline-none 
                     transition-colors"
            disabled={loading}
          />
          <Search className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
        </div>

        <div className="flex flex-wrap gap-2">
          {popularCoins.map((symbol) => (
            <button
              key={symbol}
              type="button"
              onClick={() => {
                setCoin(symbol);
                onAnalyze(symbol);
              }}
              disabled={loading}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                coin === symbol
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {symbol}
            </button>
          ))}
        </div>

        <button
          type="submit"
          disabled={loading || !coin.trim()}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white 
                   font-medium py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 
                   transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                   shadow-lg shadow-blue-500/20"
        >
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>
      </form>
    </div>
  );
}
EOF

cat > components/TradingChart.tsx << 'EOF'
'use client';

import { useEffect, useRef } from 'react';

interface TradingChartProps {
  coin: string;
}

export default function TradingChart({ coin }: TradingChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      if (containerRef.current && (window as any).TradingView) {
        // @ts-ignore
        new window.TradingView.widget({
          container: containerRef.current,
          width: '100%',
          height: 500,
          symbol: `MEXC:${coin}`,
          interval: '15',
          timezone: 'Etc/UTC',
          theme: 'dark',
          style: '1',
          locale: 'en',
          toolbar_bg: '#f1f3f6',
          enable_publishing: false,
          allow_symbol_change: true,
          hide_top_toolbar: false,
          withdateranges: true,
          hide_side_toolbar: false,
          save_image: false,
          container_id: 'tradingview_chart',
          studies: [
            'RSI@tv-basicstudies',
            'MACD@tv-basicstudies',
            'MASimple@tv-basicstudies'
          ],
        });
      }
    };

    document.head.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [coin]);

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
      <div ref={containerRef} className="w-full" />
    </div>
  );
}
EOF

cat > components/FlashSignalCard.tsx << 'EOF'
import { Signal } from '@/types/signal';
import { ArrowUp, ArrowDown, Minus, Clock } from 'lucide-react';

interface SignalCardProps {
  signal: Signal;
  title: string;
  type: 'flash' | 'main';
}

function SignalCard({ signal, title }: SignalCardProps) {
  const getSignalColor = (type: string) => {
    switch (type) {
      case 'LONG': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'SHORT': return 'text-red-400 bg-red-500/20 border-red-500/30';
      default: return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
    }
  };

  const getSignalIcon = (type: string) => {
    switch (type) {
      case 'LONG': return <ArrowUp className="w-6 h-6" />;
      case 'SHORT': return <ArrowDown className="w-6 h-6" />;
      default: return <Minus className="w-6 h-6" />;
    }
  };

  const getConfidenceLevel = (confidence: number) => {
    if (confidence >= 90) return 'Very High';
    if (confidence >= 80) return 'High';
    if (confidence >= 70) return 'Medium';
    return 'Low';
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-400';
    if (confidence >= 80) return 'text-blue-400';
    if (confidence >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className={`bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border ${getSignalColor(signal.type)}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="text-sm text-gray-400 flex items-center mt-1">
            <Clock className="w-4 h-4 mr-1" />
            {signal.prediction}
          </p>
        </div>
        <div className={`p-3 rounded-full ${getSignalColor(signal.type)}`}>
          {getSignalIcon(signal.type)}
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm text-gray-400">Signal</p>
          <p className={`text-2xl font-bold ${getSignalColor(signal.type)}`}>
            {signal.type}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-400">Confidence</p>
          <p className={`text-2xl font-bold ${getConfidenceColor(signal.confidence)}`}>
            {signal.confidence}%
          </p>
          <p className="text-xs text-gray-500">
            {getConfidenceLevel(signal.confidence)}
          </p>
        </div>
      </div>

      {signal.confidence < 70 && (
        <div className="mt-3 p-2 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-red-400 text-sm text-center font-medium">
            ⚠️ Low Confidence - Don't use this signal
          </p>
        </div>
      )}
    </div>
  );
}

export default function FlashSignalCard({ signal }: { signal: Signal }) {
  return <SignalCard signal={signal} title="Flash Signal" type="flash" />;
}
EOF

cat > components/MainSignalCard.tsx << 'EOF'
import { Signal } from '@/types/signal';
import { ArrowUp, ArrowDown, Minus, Clock } from 'lucide-react';

interface SignalCardProps {
  signal: Signal;
  title: string;
  type: 'flash' | 'main';
}

function SignalCard({ signal, title }: SignalCardProps) {
  const getSignalColor = (type: string) => {
    switch (type) {
      case 'LONG': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'SHORT': return 'text-red-400 bg-red-500/20 border-red-500/30';
      default: return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
    }
  };

  const getSignalIcon = (type: string) => {
    switch (type) {
      case 'LONG': return <ArrowUp className="w-6 h-6" />;
      case 'SHORT': return <ArrowDown className="w-6 h-6" />;
      default: return <Minus className="w-6 h-6" />;
    }
  };

  const getConfidenceLevel = (confidence: number) => {
    if (confidence >= 90) return 'Very High';
    if (confidence >= 80) return 'High';
    if (confidence >= 70) return 'Medium';
    return 'Low';
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-400';
    if (confidence >= 80) return 'text-blue-400';
    if (confidence >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className={`bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border ${getSignalColor(signal.type)}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="text-sm text-gray-400 flex items-center mt-1">
            <Clock className="w-4 h-4 mr-1" />
            {signal.prediction}
          </p>
        </div>
        <div className={`p-3 rounded-full ${getSignalColor(signal.type)}`}>
          {getSignalIcon(signal.type)}
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm text-gray-400">Signal</p>
          <p className={`text-2xl font-bold ${getSignalColor(signal.type)}`}>
            {signal.type}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-400">Confidence</p>
          <p className={`text-2xl font-bold ${getConfidenceColor(signal.confidence)}`}>
            {signal.confidence}%
          </p>
          <p className="text-xs text-gray-500">
            {getConfidenceLevel(signal.confidence)}
          </p>
        </div>
      </div>

      {signal.confidence < 70 && (
        <div className="mt-3 p-2 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-red-400 text-sm text-center font-medium">
            ⚠️ Low Confidence - Don't use this signal
          </p>
        </div>
      )}
    </div>
  );
}

export default function MainSignalCard({ signal }: { signal: Signal }) {
  return <SignalCard signal={signal} title="Main Signal" type="main" />;
}
EOF

cat > components/ConfidenceMeter.tsx << 'EOF'
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
EOF

cat > components/AnalysisBreakdown.tsx << 'EOF'
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
EOF

cat > components/VerdictCard.tsx << 'EOF'
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
EOF

cat > components/LoadingState.tsx << 'EOF'
export default function LoadingState() {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse" />
          </div>
        </div>
        <p className="text-gray-400 font-medium">Analyzing market data...</p>
        <div className="flex space-x-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
        </div>
        <div className="text-xs text-gray-500 mt-2">
          Fetching data • Calculating indicators • Generating signals
        </div>
      </div>
    </div>
  );
}
EOF

echo "✅ All component files created successfully!"
