import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center">
      <div className="text-center max-w-2xl px-6">
        <div className="inline-block mb-6 px-6 py-2 bg-yellow-500/10 border border-yellow-500 rounded-full text-yellow-400 text-sm">
          POWERED BY REAL-TIME MEXC FUTURES
        </div>

        <h1 className="text-6xl font-bold mb-6 leading-tight">
          CashiPro AI<br />
          <span className="text-yellow-400">Futures Analyst</span>
        </h1>

        <p className="text-xl text-gray-400 mb-10">
          Instant AI-driven signals for MEXC Futures. 
          Flash + Main timeframe analysis with confidence scoring.
        </p>

        <Link
          href="/ai-analysis"
          className="inline-block bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-xl px-12 py-5 rounded-2xl transition transform hover:scale-105"
        >
          Start Analysis →
        </Link>

        <p className="mt-8 text-sm text-gray-500">
          BTC • SOL • ETH • XRP • 100+ Coins Supported
        </p>
      </div>
    </div>
  );
}
