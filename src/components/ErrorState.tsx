import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-red-50 rounded-xl">
      <AlertCircle className="w-8 h-8 text-red-500" />
      <p className="mt-4 text-red-600">{message}</p>
      <button
        onClick={onRetry}
        className="mt-4 flex items-center gap-2 px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
      >
        <RefreshCw className="w-4 h-4" />
        Try Again
      </button>
    </div>
  );
}