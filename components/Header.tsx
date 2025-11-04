import React from 'react';
import { RefreshCwIcon } from './icons/Icons';

interface HeaderProps {
    onReset: () => void;
    showReset: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onReset, showReset }) => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-40 border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-brand-dark">
              Reconne<span className="text-brand-red">X</span>
            </h1>
          </div>
          {showReset && (
             <button
                onClick={onReset}
                className="flex items-center space-x-2 text-sm font-medium text-gray-600 hover:text-brand-red transition"
             >
                <RefreshCwIcon className="w-4 h-4" />
                <span>Start Over</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};