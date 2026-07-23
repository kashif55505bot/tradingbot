'use client';

import { useState } from 'react';
import CoinInput from '@/components/CoinInput';
import TradingChart from '@/components/TradingChart';
import FlashSignalCard from '@/components/FlashSignalCard';
import MainSignalCard from '@/components/MainSignalCard';
import ConfidenceMeter from '@/components/ConfidenceMeter';
import AnalysisBreakdown from '@/components/AnalysisBreakdown';
import VerdictCard from '@/components/VerdictCard';
import LoadingState from '@/components/LoadingState';
import { AnalysisResult } from '@/types/signal';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [selectedCoin, setSelectedCoin] = useState('BTCUSDT');

  const handleAnalyze = async (coin: string) => {
    setLoading(true);
    setResult(null);
    setSelectedCoin(coin);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ coin }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed');
      }

      setResult(data);
    } catch (error) {
      console.error('Analysis error:', error);
      alert('Failed to analyze. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-transparent bg-clip-text">
            CashiPro AI
          </h1>
          <p className="text-gray-400 mt-2 text-lg">
            Advanced Futures Analysis with AI-Powered Signals
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <CoinInput onAnalyze={handleAnalyze} loading={loading} />
            
            {loading && <LoadingState />}
            
            {!loading && result && (
              <>
                <VerdictCard verdict={result.verdict} />
                <ConfidenceMeter 
                  flashConfidence={result.flashSignal.confidence}
                  mainConfidence={result.mainSignal.confidence}
                />
              </>
            )}
          </div>

          <div className="lg:col-span-2 space-y-6">
            <TradingChart coin={selectedCoin} />
            
            {!loading && result && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FlashSignalCard signal={result.flashSignal} />
                  <MainSignalCard signal={result.mainSignal} />
                </div>
                <AnalysisBreakdown 
                  flashSignal={result.flashSignal}
                  mainSignal={result.mainSignal}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
