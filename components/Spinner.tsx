
import React, { useState, useEffect } from 'react';

interface SpinnerProps {
  message?: string;
}

const loadingMessages = [
    "AI is analyzing transactions...",
    "Identifying fuzzy matches...",
    "Clustering similar records...",
    "Checking for amount discrepancies...",
    "Validating date proximities...",
    "Almost there..."
];

export const Spinner: React.FC<SpinnerProps> = ({ message }) => {
    const [currentMessage, setCurrentMessage] = useState(message || loadingMessages[0]);

    useEffect(() => {
        if (!message) {
            let index = 0;
            const interval = setInterval(() => {
                index = (index + 1) % loadingMessages.length;
                setCurrentMessage(loadingMessages[index]);
            }, 2500);
            return () => clearInterval(interval);
        } else {
            setCurrentMessage(message);
        }
    }, [message]);


  return (
    <div className="flex flex-col justify-center items-center h-full min-h-[50vh]">
      <svg className="animate-spin -ml-1 mr-3 h-12 w-12 text-brand-red" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p className="mt-4 text-lg font-semibold text-gray-700">{currentMessage}</p>
    </div>
  );
};
