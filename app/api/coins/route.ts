import { NextResponse } from 'next/server';
import { MEXCClient } from '@/lib/mexc';

export async function GET() {
  try {
    const client = MEXCClient.getInstance();
    const coins = await client.getAllUSDTpairs();
    
    return NextResponse.json({
      coins: coins,
      count: coins.length,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Error fetching coins:', error);
    // Return fallback coins
    const fallback = [
      'BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'XRPUSDT', 
      'DOGEUSDT', 'ADAUSDT', 'DOTUSDT', 'LINKUSDT',
      'MATICUSDT', 'AVAXUSDT', 'UNIUSDT', 'ATOMUSDT'
    ];
    return NextResponse.json({
      coins: fallback,
      count: fallback.length,
      timestamp: new Date().toISOString(),
      error: 'Using fallback list'
    });
  }
}
