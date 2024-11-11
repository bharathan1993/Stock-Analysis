import axios from 'axios';

const API_KEY = 'KXYNVZ74AU94XQQR';
const BASE_URL = 'https://www.alphavantage.co/query';

export interface StockData {
  date: string;
  price: number;
}

export interface StockInfo {
  symbol: string;
  data: StockData[];
  metadata: {
    lastUpdated: string;
    timezone: string;
  };
}

export interface StockSuggestion {
  symbol: string;
  name: string;
  type: string;
  region: string;
  marketOpen: string;
  marketClose: string;
  timezone: string;
  currency: string;
}

export const searchStocks = async (query: string): Promise<StockSuggestion[]> => {
  if (!query) return [];
  
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        function: 'SYMBOL_SEARCH',
        keywords: query,
        apikey: API_KEY
      }
    });

    if (response.data['Note']) {
      throw new Error('API call frequency limit reached. Please try again in a minute.');
    }

    const matches = response.data.bestMatches || [];
    return matches
      .filter((match: any) => match['4. region'] === 'India')
      .map((match: any) => ({
        symbol: match['1. symbol'],
        name: match['2. name'],
        type: match['3. type'],
        region: match['4. region'],
        marketOpen: match['5. marketOpen'],
        marketClose: match['6. marketClose'],
        timezone: match['7. timezone'],
        currency: match['8. currency']
      }));
  } catch (error) {
    console.error('Stock search error:', error);
    return [];
  }
};

export const fetchStockData = async (symbol: string): Promise<StockInfo> => {
  try {
    // Format symbol for Alpha Vantage (remove .NS if present)
    const formattedSymbol = symbol.replace('.NS', '') + '.BSE';

    const response = await axios.get(BASE_URL, {
      params: {
        function: 'TIME_SERIES_DAILY',
        symbol: formattedSymbol,
        apikey: API_KEY,
        outputsize: 'compact'
      }
    });

    if (response.data['Error Message']) {
      throw new Error(`API Error: ${response.data['Error Message']}`);
    }

    if (response.data['Note']) {
      throw new Error('API call frequency limit reached. Please try again in a minute.');
    }

    const timeSeries = response.data['Time Series (Daily)'];
    if (!timeSeries) {
      throw new Error('No data available for this symbol');
    }

    const metadata = response.data['Meta Data'];
    if (!metadata) {
      throw new Error('Invalid API response format');
    }

    const data = Object.entries(timeSeries)
      .slice(0, 30)
      .map(([date, values]: [string, any]) => ({
        date: new Date(date).toLocaleDateString('en-IN'),
        price: parseFloat(values['4. close'])
      }))
      .reverse();

    return {
      symbol,
      data,
      metadata: {
        lastUpdated: metadata['3. Last Refreshed'],
        timezone: metadata['5. Time Zone']
      }
    };
  } catch (error: any) {
    console.error('Stock API Error:', error);
    
    if (error.response?.status === 429) {
      throw new Error('API rate limit exceeded. Please try again later.');
    }
    
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.['Error Message'] ||
        error.response?.data?.['Note'] ||
        'Failed to fetch stock data. Please check the symbol and try again.'
      );
    }
    
    throw error;
  }
};