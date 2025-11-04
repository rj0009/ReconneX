
import React from 'react';
import { TargetIcon, ZapIcon, ShieldCheckIcon } from './icons/Icons';

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="text-center flex flex-col items-center justify-center animate-fade-in-up">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-4xl mx-auto border border-gray-200">
        <h1 className="text-4xl sm:text-5xl font-bold text-brand-dark mb-4">
          Welcome to <span className="text-brand-red">ReconneX</span>
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          The AI-powered solution designed for Singapore's social service agencies to automate financial reconciliation, reduce errors, and ensure compliance.
        </p>
        <div className="grid md:grid-cols-3 gap-8 text-left mb-10">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 text-brand-red">
              <ZapIcon className="w-8 h-8"/>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-brand-dark">Automate Reconciliation</h3>
              <p className="text-gray-500 mt-1">
                Effortlessly match transactions from payment gateways, CRMs, and accounting software in minutes, not days.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 text-brand-red">
              <TargetIcon className="w-8 h-8"/>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-brand-dark">Increase Accuracy</h3>
              <p className="text-gray-500 mt-1">
                Our AI handles fuzzy names, fee variations, and timing differences that manual processes miss.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 text-brand-red">
              <ShieldCheckIcon className="w-8 h-8"/>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-brand-dark">Ensure Compliance</h3>
              <p className="text-gray-500 mt-1">
                Easily flag large donations and generate audit-ready reports, aligning with MSF and NCSS standards.
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={onStart}
          className="bg-brand-red hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg text-xl transition-transform transform hover:scale-105"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};
