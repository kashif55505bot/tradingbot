'use client';

import { useState } from 'react';

interface CoinInputProps {
  onAnalyze: (coin: string) => void;
  loading: boolean;
}

// Popular coins list
const popularCoins = [
  'BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'XRPUSDT', 
  'DOGEUSDT', 'ADAUSDT', 'DOTUSDT', 'LINKUSDT',
  'MATICUSDT', 'AVAXUSDT', 'UNIUSDT', 'ATOMUSDT'
];

export default function CoinInput({ onAnalyze, loading }: CoinInputProps) {
  const [coin, setCoin] = useState('BTCUSDT');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // All MEXC coins (popular ones)
  const allCoins = [
    'BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'XRPUSDT', 
    'DOGEUSDT', 'ADAUSDT', 'DOTUSDT', 'LINKUSDT',
    'MATICUSDT', 'AVAXUSDT', 'UNIUSDT', 'ATOMUSDT',
    'LTCUSDT', 'BCHUSDT', 'NEARUSDT', 'APTUSDT',
    'ARBUSDT', 'OPUSDT', 'INJUSDT', 'SUIUSDT'
  ];

  const handleInputChange = (value: string) => {
    const upperValue = value.toUpperCase();
    setCoin(upperValue);
    
    // Filter suggestions
    if (upperValue.length > 0) {
      const filtered = allCoins.filter(c => 
        c.includes(upperValue) || 
        c.replace('USDT', '').includes(upperValue)
      );
      setSuggestions(filtered.slice(0, 8));
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectCoin = (selected: string) => {
    setCoin(selected);
    setShowSuggestions(false);
    onAnalyze(selected);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (coin.trim()) {
      // If coin doesn't end with USDT, add it
      const finalCoin = coin.endsWith('USDT') ? coin : `${coin}USDT`;
      setCoin(finalCoin);
      onAnalyze(finalCoin);
      setShowSuggestions(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <h2 className="text-xl font-semibold text-white mb-4">📊 Analyze Coin</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            type="text"
            value={coin}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="Search coin (e.g., BTC, SOL, XRP)"
            className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 border border-gray-600 focus:border-blue-500 focus:outline-none"
            disabled={loading}
          />
          
          {/* Suggestions dropdown */}
          {showSuggestions && suggestions.length > 0 && !loading && (
            <div className="absolute z-10 w-full mt-1 bg-gray-700 rounded-lg border border-gray-600 max-h-60 overflow-auto">
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleSelectCoin(s)}
                  className="w-full text-left px-4 py-2 text-white hover:bg-gray-600 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <p className="text-gray-400 text-xs w-full mb-1">Popular:</p>
          {popularCoins.slice(0, 6).map((symbol) => (
            <button
              key={symbol}
              type="button"
              onClick={() => handleSelectCoin(symbol)}
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
          className="w-full bg-blue-600 text-white font-medium py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? '⏳ Analyzing...' : '🚀 Analyze'}
        </button>
      </form>
    </div>
  );
}
