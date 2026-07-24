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

    let symbol = coin.toUpperCase().trim();
    if (!symbol.endsWith('USDT')) {
      symbol = `${symbol}USDT`;
    }

    const client = MEXCClient.getInstance();
    
    let klines, price;
    try {
      [klines, price] = await Promise.all([
        client.getKlines(symbol, '1m', 100),
        client.getCurrentPrice(symbol)
      ]);
    } catch (fetchError: any) {
      return NextResponse.json(
        { error: fetchError.message || `Failed to fetch data for ${symbol}` },
        { status: 404 }
      );
    }

    if (!klines || klines.length < 10) {
      return NextResponse.json(
        { error: `Not enough data for ${symbol}` },
        { status: 404 }
      );
    }

    const closes = klines.map(k => k.close);
    const volumes = klines.map(k => k.volume || 0);

    const ema20 = calculateEMA(closes, 20);
    const ema50 = calculateEMA(closes, 50);
    const ema200 = calculateEMA(closes, 200);
    const rsi = calculateRSI(closes, 14);
    const macd = calculateMACD(closes);

    const avgVolume = volumes.reduce((a, b) => a + b, 0) / volumes.length || 1;
    const currentVolume = volumes[volumes.length - 1] || 1;

    const indicators = {
      ema20: ema20[ema20.length - 1] || price,
      ema50: ema50[ema50.length - 1] || price,
      ema200: ema200[ema200.length - 1] || price,
      rsi: rsi[rsi.length - 1] || 50,
      macd: {
        histogram: macd.histogram[macd.histogram.length - 1] || 0
      },
      volume: {
        ratio: currentVolume / avgVolume || 1
      }
    };

    const result = aggregateSignals(price, indicators);

    const isBullish = result.verdict.includes('BULLISH');
    const isBearish = result.verdict.includes('BEARISH');
    const isStrong = result.verdict.includes('STRONG');
    const atr = price * 0.02;

    let entry = price;
    let stopLoss = 0;
    let targets: number[] = [];
    let timeFrame = isStrong ? '12-24 hours' : '4-12 hours';

    if (isBullish) {
      entry = price;
      stopLoss = price - (atr * 1.5);
      targets = [
        price + (atr * 2),
        price + (atr * 3),
        price + (atr * 4)
      ];
    } else if (isBearish) {
      entry = price;
      stopLoss = price + (atr * 1.5);
      targets = [
        price - (atr * 2),
        price - (atr * 3),
        price - (atr * 4)
      ];
    }

    return NextResponse.json({
      coin: symbol,
      price,
      indicators,
      ...result,
      entry: entry,
      stopLoss: stopLoss,
      targets: targets,
      timeFrame: timeFrame,
      riskAmount: Math.abs(stopLoss - entry),
      rewardAmount: targets[2] ? Math.abs(targets[2] - entry) : 0,
      riskRewardRatio: targets[2] ? (Math.abs(targets[2] - entry) / Math.abs(stopLoss - entry)).toFixed(1) : '0'
    });

  } catch (error: any) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to analyze coin' },
      { status: 500 }
    );
  }
}
