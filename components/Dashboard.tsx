
import React, { useState, useMemo } from 'react';
import type { ReconciliationResult, PartialMatch, InsightResult } from '../types';
import { ResolutionWorkspace } from './ResolutionWorkspace';
import { InsightsReport } from './InsightsReport';
import { ArchitectureModal } from './ArchitectureModal';
import { CheckCircleIcon, ExclamationTriangleIcon, XCircleIcon, SparklesIcon, EyeIcon } from './icons/Icons';

interface DashboardProps {
  result: ReconciliationResult;
  setResult: (result: ReconciliationResult) => void;
  sourceAName: string;
  sourceBName: string;
  onGenerateInsights: () => void;
  insights: InsightResult | null;
  loadingInsights: boolean;
}

const StatCard: React.FC<{ title: string; value: string | number; color: string; icon: React.ReactNode }> = ({ title, value, color, icon }) => (
  <div className={`p-4 rounded-lg shadow-md border-l-4 ${color}`}>
    <div className="flex items-center">
      <div className="mr-4">{icon}</div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  </div>
);

export const Dashboard: React.FC<DashboardProps> = ({ result, setResult, sourceAName, sourceBName, onGenerateInsights, insights, loadingInsights }) => {
  const [activeTab, setActiveTab] = useState('review');
  const [isResolutionModalOpen, setResolutionModalOpen] = useState(false);
  const [isInsightsModalOpen, setInsightsModalOpen] = useState(false);

  const summary = useMemo(() => {
    const perfectlyMatchedAmount = result.perfectMatches.reduce((sum, m) => sum + m.sourceA.amount, 0);
    const partiallyMatchedAmount = result.partialMatches.reduce((sum, m) => sum + m.sourceA.amount, 0);
    const reconciledAmount = perfectlyMatchedAmount + partiallyMatchedAmount;
    const unmatchedAmountA = result.unmatchedA.reduce((sum, t) => sum + t.amount, 0);
    const unmatchedAmountB = result.unmatchedB.reduce((sum, t) => sum + t.amount, 0);
    // Average unreconciled amount for simplicity in dashboard
    const unreconciledAmount = (unmatchedAmountA + unmatchedAmountB) / 2;

    return {
      perfectMatches: result.perfectMatches.length,
      partialMatches: result.partialMatches.length,
      unmatched: result.unmatchedA.length + result.unmatchedB.length,
      reconciledAmount,
      unreconciledAmount,
    };
  }, [result]);
  
  const handleResolve = (match: PartialMatch) => {
    const updatedResult: ReconciliationResult = {
      ...result,
      perfectMatches: [...result.perfectMatches, { sourceA: match.sourceA, sourceB: match.sourceB }],
      partialMatches: result.partialMatches.filter(p => p.sourceA.id !== match.sourceA.id || p.sourceB.id !== match.sourceB.id),
    };
    setResult(updatedResult);
  };
  
  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
            <h2 className="text-3xl font-bold text-brand-dark">Reconciliation Dashboard</h2>
            <p className="text-gray-600 mt-1">Summary of your reconciliation process.</p>
        </div>
        <div className="mt-4 sm:mt-0">
             <button
                onClick={() => {
                    if (!insights) onGenerateInsights();
                    setInsightsModalOpen(true);
                }}
                disabled={loadingInsights}
                className="bg-brand-light hover:bg-orange-500 text-white font-bold py-2 px-4 rounded-lg flex items-center transition disabled:bg-gray-400"
            >
                {loadingInsights ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generating...
                    </>
                ) : (
                    <>
                        <SparklesIcon className="w-5 h-5 mr-2" />
                        AI Insights & Report
                    </>
                )}
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Perfect Matches" value={summary.perfectMatches} color="border-green-500 bg-green-50" icon={<CheckCircleIcon className="w-8 h-8 text-green-500"/>} />
        <StatCard title="Partial Matches (Review)" value={summary.partialMatches} color="border-yellow-500 bg-yellow-50" icon={<ExclamationTriangleIcon className="w-8 h-8 text-yellow-500"/>} />
        <StatCard title="Unmatched Records" value={summary.unmatched} color="border-red-500 bg-red-50" icon={<XCircleIcon className="w-8 h-8 text-red-500"/>} />
        <StatCard title="Reconciled Amount" value={`S$${summary.reconciledAmount.toLocaleString('en-SG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} color="border-blue-500 bg-blue-50" icon={<EyeIcon className="w-8 h-8 text-blue-500"/>} />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h3 className="text-xl font-bold text-brand-dark mb-2">Discrepancy Workspace</h3>
        <p className="text-gray-600 mb-4">Review partial matches and unmatched records to complete your reconciliation.</p>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
            <div className="flex items-center">
                <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600 mr-3"/>
                <div>
                    <p className="font-bold text-yellow-800">{summary.partialMatches} records require your review.</p>
                    <p className="text-sm text-yellow-700">AI has found potential matches with some discrepancies. Please verify them.</p>
                </div>
                <button
                    onClick={() => setResolutionModalOpen(true)}
                    className="ml-auto bg-brand-dark hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-lg"
                >
                    Review Now
                </button>
            </div>
        </div>
      </div>
      
      {isResolutionModalOpen && (
          <ResolutionWorkspace
              isOpen={isResolutionModalOpen}
              onClose={() => setResolutionModalOpen(false)}
              partialMatches={result.partialMatches}
              unmatchedA={result.unmatchedA}
              unmatchedB={result.unmatchedB}
              onResolve={handleResolve}
              sourceAName={sourceAName}
              sourceBName={sourceBName}
          />
      )}
      
      {isInsightsModalOpen && insights && (
        <InsightsReport
            isOpen={isInsightsModalOpen}
            onClose={() => setInsightsModalOpen(false)}
            insights={insights}
        />
      )}
    </div>
  );
};
