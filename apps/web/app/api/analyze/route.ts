import { NextRequest, NextResponse } from "next/server";
import { AnalysisEngine } from "@/lib/analysis/engine";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { coin } = body;

    if (!coin) {
      return NextResponse.json(
        { error: 'Coin symbol is required' },
        { status: 400 }
      );
    }

    // Validate coin format (e.g., BTCUSDT, SOLUSDT)
    if (!coin.endsWith('USDT')) {
      return NextResponse.json(
        { error: 'Coin must end with USDT (e.g., BTCUSDT)' },
        { status: 400 }
      );
    }

    const engine = new AnalysisEngine();
    const result = await engine.analyze(coin.toUpperCase());

    return NextResponse.json(result);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze coin' },
      { status: 500 }
    );
  }
}
