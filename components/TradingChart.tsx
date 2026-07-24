'use client';

import { useEffect, useRef } from 'react';

interface TradingChartProps {
  coin: string;
}

export default function TradingChart({ coin }: TradingChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      if (containerRef.current && (window as any).TradingView) {
        new (window as any).TradingView.widget({
          container: containerRef.current,
          width: '100%',
          height: 400,
          symbol: `MEXC:${coin}`,
          interval: '15',
          timezone: 'Etc/UTC',
          theme: 'dark',
          style: '1',
          locale: 'en',
          enable_publishing: false,
          allow_symbol_change: true,
          hide_top_toolbar: false,
          withdateranges: true,
          hide_side_toolbar: false,
          save_image: false,
          studies: [
            'RSI@tv-basicstudies',
            'MACD@tv-basicstudies',
            'MASimple@tv-basicstudies'
          ],
        });
      }
    };

    document.head.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [coin]);

  return (
    <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
      <div ref={containerRef} className="w-full" style={{ minHeight: '400px' }} />
    </div>
  );
}
