'use client';

import { useState } from 'react';

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
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <h2 className="text-xl font-semibold text-white mb-4">📊 Analyze Coin</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={coin}
          onChange={(e) => setCoin(e.target.value.toUpperCase())}
          placeholder="Enter coin (e.g., BTCUSDT)"
          className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 border border-gray-600 focus:border-blue-500 focus:outline-none"
          disabled={loading}
        />

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
          className="w-full bg-blue-600 text-white font-medium py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? '⏳ Analyzing...' : '🚀 Analyze'}
        </button>
      </form>
    </div>
  );
}
