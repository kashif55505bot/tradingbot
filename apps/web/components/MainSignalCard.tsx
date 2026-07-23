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
