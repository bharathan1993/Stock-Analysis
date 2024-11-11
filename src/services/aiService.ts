export interface AIInsight {
  trend: 'up' | 'down' | 'neutral';
  analysis: string;
  metrics: string[];
  recommendations: string[];
}

export async function generateStockInsights(
  symbol: string,
  data: { date: string; price: number }[]
): Promise<AIInsight> {
  // Calculate basic metrics
  const prices = data.map(d => d.price);
  const latestPrice = prices[prices.length - 1];
  const oldestPrice = prices[0];
  const priceChange = ((latestPrice - oldestPrice) / oldestPrice) * 100;
  
  // Determine trend
  const trend = priceChange > 0 ? 'up' : priceChange < 0 ? 'down' : 'neutral';
  
  // Generate analysis based on price movement
  const analysis = `${symbol} has shown a ${Math.abs(priceChange).toFixed(2)}% ${
    trend === 'up' ? 'increase' : 'decrease'
  } over the analyzed period. The stock has been displaying ${
    Math.abs(priceChange) > 10 ? 'significant' : 'moderate'
  } volatility.`;
  
  // Generate metrics
  const metrics = [
    `Current Price: ₹${latestPrice.toFixed(2)}`,
    `Price Change: ${priceChange.toFixed(2)}%`,
    `30-Day High: ₹${Math.max(...prices).toFixed(2)}`,
    `30-Day Low: ₹${Math.min(...prices).toFixed(2)}`,
  ];
  
  // Generate recommendations
  const recommendations = [
    `Monitor ${symbol}'s price movement around ₹${latestPrice.toFixed(2)} level`,
    `Consider the overall market sentiment before making investment decisions`,
    `Watch for any upcoming corporate announcements or events`,
    `Diversify your portfolio to manage risk`,
  ];
  
  return {
    trend,
    analysis,
    metrics,
    recommendations,
  };
}