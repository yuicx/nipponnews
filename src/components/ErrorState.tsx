import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  onRetry: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ onRetry }) => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex flex-col items-center justify-center">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-red-700 mb-2">
          ニュースの読み込みに失敗しました
        </h2>
        <p className="text-red-600 mb-4 text-center">
          インターネット接続を確認して、もう一度お試しください。
        </p>
        <button
          onClick={onRetry}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors duration-300"
        >
          <RefreshCw size={16} />
          再試行
        </button>
      </div>
    </div>
  );
};

export default ErrorState;
