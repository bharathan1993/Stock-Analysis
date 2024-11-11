import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { StockData } from '../services/stockApi';

interface StockChartProps {
  data: StockData[];
}

export function StockChart({ data }: StockChartProps) {
  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => value.split(',')[0]}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            domain={['auto', 'auto']}
            tickFormatter={(value) => `₹${value.toFixed(2)}`}
          />
          <Tooltip
            formatter={(value: number) => [`₹${value.toFixed(2)}`, 'Price']}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#4f46e5"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}