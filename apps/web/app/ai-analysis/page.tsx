"use client";

import { useState } from "react";
import TradingChart from "@/components/TradingChart";
import FlashSignalCard from "@/components/FlashSignalCard";
import MainSignalCard from "@/components/MainSignalCard";

export default function AIAnalysisPage() {
  const [coin, setCoin] = useState("BTC");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coin }),
      });

      const data = await res.json();
      setResult(data);
    } catch (err) {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">CashiPro AI Futures Analyst</h1>
        <p className="text-gray-400 mb-8">Real-time MEXC Futures Signals with AI Logic</p>

        {/* Input */}
        <div className="card p-6 rounded-2xl mb-8 max-w-md">
          <div className="flex gap-3">
            <input
              type="text"
              value={coin}
              onChange={(e) => setCoin(e.target.value.toUpperCase())}
              placeholder="BTC, SOL, ETH..."
              className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-lg focus:outline-none focus:border-yellow-500"
            />
            <button
              onClick={analyze}
              disabled={loading}
              className="bg-yellow-500 hover:bg-yellow-400 disabled:bg-gray-600 text-black font-bold px-8 rounded-xl text-lg transition"
            >
              {loading ? "Analyzing..." : "ANALYZE"}
            </button>
          </div>
        </div>

        {result && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart */}
            <div className="lg:col-span-2">
              <TradingChart symbol={result.coin} />
            </div>

            {/* Signals */}
            <FlashSignalCard signal={result.flashSignal} />
            <MainSignalCard signal={result.mainSignal} />

            {/* Final Verdict */}
            <div className="lg:col-span-2 card p-8 rounded-2xl text-center">
              <h2 className="text-2xl mb-2">FINAL VERDICT</h2>
              <div className="text-6xl font-bold mb-4 text-yellow-400">
                {result.finalVerdict}
              </div>
              <p className="text-xl text-gray-400">
                Overall Confidence: <span className="text-white font-bold">{result.overallConfidence}%</span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
