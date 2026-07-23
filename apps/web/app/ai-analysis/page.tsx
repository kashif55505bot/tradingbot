"use client";

import { useState } from "react";
import TradingChart from "@/components/TradingChart";
import FlashSignalCard from "@/components/FlashSignalCard";
import MainSignalCard from "@/components/MainSignalCard";
import ConfidenceMeter from "@/components/ConfidenceMeter";
import VerdictCard from "@/components/VerdictCard";

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
        body: JSON.stringify({ coin: coin.toUpperCase() }),
      });

      if (!res.ok) throw new Error("Analysis failed");
      const data = await res.json();
      setResult(data);
    } catch (err) {
      alert("Failed to analyze. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pb-12">
      <div className="max-w-7xl mx-auto px-6 pt-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold">AI Futures Analyst</h1>
            <p className="text-gray-400">MEXC • Real-time Signals</p>
          </div>
          <a href="/" className="text-yellow-400 hover:underline">← Home</a>
        </div>

        {/* Input */}
        <div className="max-w-md mx-auto mb-12">
          <div className="card p-2 flex gap-2 rounded-3xl">
            <input
              type="text"
              value={coin}
              onChange={(e) => setCoin(e.target.value.toUpperCase())}
              className="flex-1 bg-transparent px-6 py-4 text-2xl outline-none"
              placeholder="BTC"
            />
            <button
              onClick={analyze}
              disabled={loading || !coin}
              className="bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 text-black font-bold px-10 rounded-2xl text-lg"
            >
              {loading ? "ANALYZING..." : "ANALYZE"}
            </button>
          </div>
        </div>

        {result && (
          <>
            <TradingChart symbol={result.coin} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <FlashSignalCard signal={result.flashSignal} />
              <MainSignalCard signal={result.mainSignal} />
            </div>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <VerdictCard result={result} />
              </div>
              <ConfidenceMeter confidence={result.overallConfidence} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
