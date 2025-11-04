
import React from 'react';
import type { InsightResult } from '../types';
import { ChartBarIcon, ClockIcon, AlertTriangleIcon, TrendingUpIcon } from './icons/Icons';

interface InsightsReportProps {
  isOpen: boolean;
  onClose: () => void;
  insights: InsightResult;
}

const InsightSection: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
    <div className="bg-gray-50 p-4 rounded-lg border">
        <div className="flex items-center mb-2">
            {icon}
            <h4 className="ml-2 font-bold text-brand-dark">{title}</h4>
        </div>
        {children}
    </div>
);

export const InsightsReport: React.FC<InsightsReportProps> = ({ isOpen, onClose, insights }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <header className="p-5 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold text-brand-dark">AI Insights & Reconciliation Report</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">&times;</button>
        </header>

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <p className="text-sm font-semibold text-green-800">Time Reduction</p>
                    <p className="text-xl font-bold text-green-900">{insights.timeReduction}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <p className="text-sm font-semibold text-green-800">Error Rate Reduction</p>
                    <p className="text-xl font-bold text-green-900">{insights.errorRateReduction}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <p className="text-sm font-semibold text-green-800">Faster Month-End</p>
                    <p className="text-xl font-bold text-green-900">{insights.closureAcceleration}</p>
                </div>
            </div>

            <InsightSection title="Common Discrepancy Patterns" icon={<ChartBarIcon className="w-6 h-6 text-brand-light"/>}>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                    {insights.commonPatterns.map((pattern, i) => <li key={i}>{pattern}</li>)}
                </ul>
            </InsightSection>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InsightSection title="Estimated Time Savings" icon={<ClockIcon className="w-6 h-6 text-brand-light"/>}>
                     <p className="text-gray-700">{insights.timeSavingsEstimate}</p>
                </InsightSection>

                <InsightSection title="Compliance Risk Assessment" icon={<AlertTriangleIcon className="w-6 h-6 text-brand-light"/>}>
                    <p className="text-gray-700">{insights.riskAssessment}</p>
                </InsightSection>
            </div>
            
            <div className="text-center pt-4">
                <h3 className="text-lg font-bold text-brand-dark">Projected Benefits</h3>
                <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
                    Based on your data, ReconneX is projected to save your team significant hours per month, reduce reconciliation errors by over 95%, and accelerate financial closing.
                </p>
            </div>
        </main>

        <footer className="p-4 border-t bg-gray-50 text-right">
          <button onClick={onClose} className="bg-brand-red text-white font-bold py-2 px-6 rounded-lg">
            Close
          </button>
        </footer>
      </div>
    </div>
  );
};