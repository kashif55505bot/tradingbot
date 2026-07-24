'use client';

import { useState, useEffect, useRef } from 'react';

interface CoinInputProps {
  onAnalyze: (coin: string) => void;
  loading: boolean;
}

export default function CoinInput({ onAnalyze, loading }: CoinInputProps) {
  const [coin, setCoin] = useState('BTCUSDT');
  const [searchTerm, setSearchTerm] = useState('BTC');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [allCoins, setAllCoins] = useState<string[]>([]);
  const [loadingCoins, setLoadingCoins] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch all coins on mount
  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const response = await fetch('/api/coins');
        const data = await response.json();
        if (data.coins) {
          setAllCoins(data.coins);
          // Set initial suggestions
          const initial = data.coins.filter((c: string) => 
            c.includes('BTC') || c.includes('ETH') || c.includes('SOL')
          ).slice(0, 10);
          setSuggestions(initial);
        }
      } catch (error) {
        console.error('Error fetching coins:', error);
        // Fallback coins
        const fallback = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'XRPUSDT', 'DOGEUSDT'];
        setAllCoins(fallback);
        setSuggestions(fallback);
      } finally {
        setLoadingCoins(false);
      }
    };
    fetchCoins();
  }, []);

  const handleInputChange = (value: string) => {
    const upperValue = value.toUpperCase();
    setSearchTerm(value);
    setCoin(upperValue);
    
    if (upperValue.length > 0) {
      const filtered = allCoins
        .filter(c => 
          c.includes(upperValue) || 
          c.replace('USDT', '').includes(upperValue)
        )
        .slice(0, 15);
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setSuggestions(allCoins.slice(0, 15));
      setShowSuggestions(true);
    }
  };

  const handleSelectCoin = (selected: string) => {
    setCoin(selected);
    setSearchTerm(selected.replace('USDT', ''));
    setShowSuggestions(false);
    onAnalyze(selected);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!coin.trim()) return;
    
    let finalCoin = coin.toUpperCase();
    if (!finalCoin.endsWith('USDT')) {
      finalCoin = `${finalCoin}USDT`;
    }
    
    // Check if coin exists (case insensitive)
    const exists = allCoins.some(c => c === finalCoin);
    if (exists) {
      setCoin(finalCoin);
      setSearchTerm(finalCoin.replace('USDT', ''));
      onAnalyze(finalCoin);
      setShowSuggestions(false);
    } else {
      alert(`❌ Coin ${finalCoin} not found.\n\nTry these popular coins:\nBTCUSDT, ETHUSDT, SOLUSDT, XRPUSDT, DOGEUSDT, ADAUSDT\n\nOr search for any USDT pair on MEXC.`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (suggestions.length > 0) {
        handleSelectCoin(suggestions[0]);
      } else {
        handleSubmit(e);
      }
    }
    if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <h2 className="text-xl font-semibold text-white mb-4">📊 Analyze Coin</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (searchTerm.length > 0) {
                const filtered = allCoins
                  .filter(c => 
                    c.includes(searchTerm.toUpperCase()) || 
                    c.replace('USDT', '').includes(searchTerm.toUpperCase())
                  )
                  .slice(0, 15);
                setSuggestions(filtered);
                setShowSuggestions(filtered.length > 0);
              } else {
                setSuggestions(allCoins.slice(0, 15));
                setShowSuggestions(true);
              }
            }}
            onBlur={() => {
              setTimeout(() => setShowSuggestions(false), 200);
            }}
            placeholder="🔍 Search any coin (BTC, SOL, XRP, DOGE...)"
            className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 border border-gray-600 focus:border-blue-500 focus:outline-none text-lg"
            disabled={loading || loadingCoins}
          />
          
          {loadingCoins && (
            <div className="absolute right-3 top-3">
              <div className="w-5 h-5 border-2 border-gray-500 border-t-blue-500 rounded-full animate-spin" />
            </div>
          )}
          
          {showSuggestions && suggestions.length > 0 && !loading && !loadingCoins && (
            <div className="absolute z-10 w-full mt-1 bg-gray-700 rounded-lg border border-gray-600 max-h-60 overflow-auto shadow-xl">
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleSelectCoin(s)}
                  className="w-full text-left px-4 py-2 text-white hover:bg-blue-600 transition-colors flex justify-between items-center"
                >
                  <span className="font-medium">{s}</span>
                  <span className="text-gray-400 text-xs">USDT</span>
                </button>
              ))}
              {suggestions.length === 0 && searchTerm.length > 0 && (
                <div className="px-4 py-3 text-gray-400 text-sm">
                  No coins found. Try searching: BTC, ETH, SOL, XRP, DOGE
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <p className="text-gray-400 text-xs w-full mb-1">Popular:</p>
          {['BTC', 'ETH', 'SOL', 'XRP', 'DOGE', 'ADA'].map((symbol) => (
            <button
              key={symbol}
              type="button"
              onClick={() => handleSelectCoin(`${symbol}USDT`)}
              disabled={loading || loadingCoins}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                coin === `${symbol}USDT`
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
          disabled={loading || loadingCoins || !coin.trim()}
          className="w-full bg-blue-600 text-white font-medium py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 text-lg"
        >
          {loading ? '⏳ Analyzing...' : '🚀 Analyze'}
        </button>
      </form>

      {!loadingCoins && (
        <div className="mt-3 text-center">
          <p className="text-gray-500 text-xs">
            {allCoins.length} coins available on MEXC
          </p>
        </div>
      )}
    </div>
  );
}
