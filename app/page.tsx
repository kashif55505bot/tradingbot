'use client';

import { useState } from 'react';

export default function Home() {
  const [coin, setCoin] = useState('BTCUSDT');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const analyze = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coin })
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8 bg-gray-900">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">🚀 CashiPro AI</h1>
        
        <div className="flex gap-4 mb-8">
          <input
            type="text"
            value={coin}
            onChange={(e) => setCoin(e.target.value.toUpperCase())}
            className="flex-1 px-4 py-2 rounded bg-gray-800 text-white border border-gray-700"
            placeholder="Enter coin (e.g., BTCUSDT)"
          />
          <button
            onClick={analyze}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>

        {result && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">{result.coin}</h2>
            <p className="text-gray-400">Price: ${result.price}</p>
            <p className="text-gray-400">Verdict: <span className="text-green-400 font-bold">{result.verdict}</span></p>
            <p className="text-gray-400">Confidence: {result.confidence}%</p>
            
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-white mb-2">Strategies:</h3>
              {result.signals && Object.entries(result.signals).map(([name, signal]: [string, any]) => (
                <div key={name} className="bg-gray-700 rounded p-3 mb-2">
                  <p className="text-white">{name}: <span className={signal.type === 'LONG' ? 'text-green-400' : signal.type === 'SHORT' ? 'text-red-400' : 'text-yellow-400'}>
                    {signal.type}
                  </span> ({signal.confidence}%)</p>
                  {signal.reasoning && signal.reasoning.map((r: string, i: number) => (
                    <p key={i} className="text-gray-400 text-sm ml-4">• {r}</p>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
