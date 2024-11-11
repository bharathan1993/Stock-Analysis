import React from 'react';
import { AIInsight } from '../services/aiService';
import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

interface InsightsCardProps {
  stockSymbol: string;
  insights: AIInsight;
}

export function InsightsCard({ stockSymbol, insights }: InsightsCardProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        {insights.trend === 'up' ? (
          <TrendingUp className="w-6 h-6 text-green-500" />
        ) : insights.trend === 'down' ? (
          <TrendingDown className="w-6 h-6 text-red-500" />
        ) : (
          <AlertTriangle className="w-6 h-6 text-yellow-500" />
        )}
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Market Analysis</h3>
          <p className="text-gray-600">{insights.analysis}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-700 mb-2">Key Metrics</h4>
          <ul className="space-y-2">
            {insights.metrics.map((metric, index) => (
              <li key={index} className="text-sm text-gray-600">
                • {metric}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-700 mb-2">Recommendations</h4>
          <ul className="space-y-2">
            {insights.recommendations.map((rec, index) => (
              <li key={index} className="text-sm text-gray-600">
                • {rec}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}