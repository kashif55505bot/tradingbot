import { NextRequest, NextResponse } from 'next/server';
import { MEXCClient } from '@/lib/mexc';
import { calculateEMA } from '@/lib/indicators/ema';
import { calculateRSI } from '@/lib/indicators/rsi';
import { calculateMACD } from '@/lib/indicators/macd';
import { aggregateSignals } from '@/lib/strategies/aggregator';

export async function POST(request: NextRequest) {
  try {
    const { coin } = await request.json();
    
    if (!coin) {
      return NextResponse.json(
        { error: 'Coin symbol is required' },
        { status: 400 }
      );
    }

    // Coin ko uppercase mein convert karein
    const symbol = coin.toUpperCase();
    
    // Check if it ends with USDT, if not add it
    const symbolWithUSDT = symbol.endsWith('USDT') ? symbol : `${symbol}USDT`;

    const client = MEXCClient.getInstance();
    
    // Fetch data
    const [klines, price] = await Promise.all([
      client.getKlines(symbolWithUSDT, '1m', 100),
      client.getCurrentPrice(symbolWithUSDT)
    ]);

    const closes = klines.map(k => k.close);
    const volumes = klines.map(k => k.volume);

    // Calculate indicators
    const ema20 = calculateEMA(closes, 20);
    const ema50 = calculateEMA(closes, 50);
    const ema200 = calculateEMA(closes, 200);
    const rsi = calculateRSI(closes, 14);
    const macd = calculateMACD(closes);

    const avgVolume = volumes.reduce((a, b) => a + b, 0) / volumes.length;
    const currentVolume = volumes[volumes.length - 1];

    const indicators = {
      ema20: ema20[ema20.length - 1],
      ema50: ema50[ema50.length - 1],
      ema200: ema200[ema200.length - 1],
      rsi: rsi[rsi.length - 1],
      macd: {
        histogram: macd.histogram[macd.histogram.length - 1]
      },
      volume: {
        ratio: currentVolume / avgVolume
      }
    };

    // Generate signals
    const result = aggregateSignals(price, indicators);

    return NextResponse.json({
      coin: symbolWithUSDT,
      price,
      indicators,
      ...result
    });

  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze coin. Make sure it exists on MEXC.' },
      { status: 500 }
    );
  }
}
