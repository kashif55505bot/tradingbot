'use client';

import { useEffect, useRef } from 'react';

interface TradingChartProps {
  coin: string;
}

export default function TradingChart({ coin }: TradingChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clean up previous widget
    containerRef.current.innerHTML = '';

    // Create script element
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      if (containerRef.current && (window as any).TradingView) {
        // @ts-ignore
        new window.TradingView.widget({
          container: containerRef.current,
          width: '100%',
          height: 500,
          symbol: `MEXC:${coin}`,
          interval: '15',
          timezone: 'Etc/UTC',
          theme: 'dark',
          style: '1',
          locale: 'en',
          toolbar_bg: '#f1f3f6',
          enable_publishing: false,
          allow_symbol_change: true,
          hide_top_toolbar: false,
          withdateranges: true,
          hide_side_toolbar: false,
          save_image: false,
          container_id: 'tradingview_chart',
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
      // Cleanup
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [coin]);

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
      <div ref={containerRef} className="w-full" />
    </div>
  );
}
