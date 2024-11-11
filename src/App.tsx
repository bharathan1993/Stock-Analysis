import React, { useState } from 'react';
import { SearchBar } from './components/SearchBar';
import { StockChart } from './components/StockChart';
import { InsightsCard } from './components/InsightsCard';
import { LoadingState } from './components/LoadingState';
import { ErrorState } from './components/ErrorState';
import { LineChart, Sparkles } from 'lucide-react';
import { fetchStockData, StockInfo } from './services/stockApi';
import { generateStockInsights, AIInsight } from './services/aiService';

export function App() {
  const [searchValue, setSearchValue] = useState('');
  const [stockData, setStockData] = useState<StockInfo | null>(null);
  const [insights, setInsights] = useState<AIInsight | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchValue.trim()) {
      setError('Please enter a stock symbol');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchStockData(searchValue.toUpperCase());
      const aiInsights = await generateStockInsights(data.symbol, data.data);
      
      setStockData(data);
      setInsights(aiInsights);
      setError(null);
    } catch (err: any) {
      console.error('Search error:', err);
      setError(err.message || 'Failed to fetch stock data. Please try again.');
      setStockData(null);
      setInsights(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <LineChart className="text-indigo-600" size={32} />
            <h1 className="text-4xl font-bold text-gray-800">StockSense India</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Analyze Indian stocks with advanced charts and AI-powered insights
          </p>
        </div>

        {/* Search Section */}
        <div className="flex justify-center mb-12">
          <SearchBar
            value={searchValue}
            onChange={setSearchValue}
            onSearch={handleSearch}
          />
        </div>

        {/* Content Section */}
        <div className="space-y-8">
          {loading && <LoadingState />}
          
          {error && <ErrorState message={error} onRetry={handleSearch} />}
          
          {stockData && !loading && !error && (
            <>
              {/* Stock Chart */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-800">{stockData.symbol}</h2>
                    <p className="text-sm text-gray-500">
                      Last updated: {new Date(stockData.metadata.lastUpdated).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-sm text-gray-500">Last 30 Days Performance</div>
                </div>
                <StockChart data={stockData.data} />
              </div>

              {/* AI Insights */}
              {insights && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <Sparkles className="text-indigo-500" size={24} />
                    <h2 className="text-2xl font-semibold text-gray-800">AI Analysis</h2>
                  </div>
                  <InsightsCard
                    stockSymbol={stockData.symbol}
                    insights={insights}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}