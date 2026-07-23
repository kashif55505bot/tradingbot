'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import TradingChart from '@/components/TradingChart';
import FlashSignalCard from '@/components/FlashSignalCard';
import MainSignalCard from '@/components/MainSignalCard';
import ConfidenceMeter from '@/components/ConfidenceMeter';
import AnalysisBreakdown from '@/components/AnalysisBreakdown';
import VerdictCard from '@/components/VerdictCard';
import LoadingState from '@/components/LoadingState';
import { AnalysisResult } from '@/types/signal';

export default function AIAnalysisPage() {
  const searchParams = useSearchParams();
  const coin = searchParams?.get('coin') || 'BTCUSDT';
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      setLoading(true);
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
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [coin]);

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-transparent bg-clip-text">AI Analysis</h1>
          <p className="text-gray-400">Analyzing: {coin}</p>
        </div>

        {loading ? (
          <LoadingState />
        ) : result ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <VerdictCard verdict={result.verdict} />
                <div className="mt-4">
                  <ConfidenceMeter 
                    flashConfidence={result.flashSignal.confidence}
                    mainConfidence={result.mainSignal.confidence}
                  />
                </div>
              </div>
              <div className="lg:col-span-2">
                <TradingChart coin={coin} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FlashSignalCard signal={result.flashSignal} />
              <MainSignalCard signal={result.mainSignal} />
            </div>
            
            <AnalysisBreakdown 
              flashSignal={result.flashSignal}
              mainSignal={result.mainSignal}
            />
          </>
        ) : (
          <div className="text-center text-gray-400 py-12">
            No analysis results available
          </div>
        )}
      </div>
    </div>
  );
}
