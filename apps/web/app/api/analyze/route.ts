import { NextRequest, NextResponse } from "next/server";
import { analyzeCoin } from "@/lib/analysis/engine";

export async function POST(request: NextRequest) {
  try {
    const { coin } = await request.json();

    if (!coin || typeof coin !== "string") {
      return NextResponse.json(
        { error: "Coin symbol is required (e.g., BTC, SOL, ETH)" },
        { status: 400 }
      );
    }

    const result = await analyzeCoin(coin.toUpperCase());

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Analysis Error:", error);
    return NextResponse.json(
      { error: "Failed to analyze coin", message: error.message },
      { status: 500 }
    );
  }
}
