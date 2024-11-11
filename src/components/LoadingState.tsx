import React from 'react';
import { Loader2 } from 'lucide-react';

export function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      <p className="mt-4 text-gray-600">Fetching stock data...</p>
    </div>
  );
}