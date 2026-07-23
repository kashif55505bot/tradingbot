"use client";

import React, { useEffect, useRef } from "react";
import { createChart } from "lightweight-charts";

interface TradingChartProps {
  symbol: string;
}

export default function TradingChart({ symbol }: TradingChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 420,
      layout: {
        background: { color: "#0F1217" },
        textColor: "#d1d5db",
      },
      grid: {
        vertLines: { color: "#1F2937" },
        horzLines: { color: "#1F2937" },
      },
      timeScale: { timeVisible: true, secondsVisible: false },
    });

    const candleSeries = chart.addCandlestickSeries({
      upColor: "#22c55e",
      downColor: "#ef4444",
      wickUpColor: "#22c55e",
      wickDownColor: "#ef4444",
    });

    chartRef.current = chart;

    // Cleanup
    return () => {
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [symbol]);

  return (
    <div className="card rounded-2xl overflow-hidden">
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        <h3 className="font-semibold text-lg">{symbol} Chart</h3>
        <span className="text-xs text-gray-500">MEXC Futures • 15m</span>
      </div>
      <div ref={chartContainerRef} className="w-full" />
    </div>
  );
}
