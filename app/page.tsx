'use client';

import { useState } from 'react';
import CoinInput from '@/components/CoinInput';
import Dashboard from '@/components/Dashboard';
import StrategyCards from '@/components/StrategyCards';
import LoadingState from '@/components/LoadingState';

export default function Home() {
  const [coin, setCoin] = useState('BTCUSDT');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const analyze = async () => {
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coin })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setResult(data);
    } catch (error: any) {
      console.error(error);
      alert(error.message || 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-4 md:p-8 bg-gray-900">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            🚀 CashiPro AI
          </h1>
          <p className="text-gray-400 mt-2">6 Advanced Strategies • Real-Time Analysis</p>
        </header>

        <div className="space-y-6">
          <CoinInput onAnalyze={analyze} loading={loading} />

          {loading && <LoadingState />}

          {!loading && result && (
            <>
              <Dashboard
                coin={result.coin}
                price={result.price}
                verdict={result.verdict}
                confidence={result.confidence}
                entry={result.entry}
                stopLoss={result.stopLoss}
                targets={result.targets}
                timeFrame={result.timeFrame}
              />
              <StrategyCards signals={result.signals} />
            </>
          )}
        </div>
      </div>
    </main>
  );
}
