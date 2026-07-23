'use client';

import { useEffect, useRef } from 'react';

interface TradingChartProps {
  coin: string;
}

export default function TradingChart({ coin }: TradingChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadTradingView = () => {
      if (!containerRef.current) return;
      
      if ((window as any).TradingView) {
        createWidget();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/tv.js';
      script.async = true;
      script.onload = createWidget;
      document.head.appendChild(script);
    };

    const createWidget = () => {
      if (!containerRef.current) return;
      
      try {
        new (window as any).TradingView.widget({
          container: containerRef.current,
          width: '100%',
          height: 500,
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
      } catch (error) {
        console.error('TradingView widget error:', error);
      }
    };

    loadTradingView();

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [coin]);

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
      <div ref={containerRef} className="w-full" style={{ minHeight: '500px' }} />
    </div>
  );
}
