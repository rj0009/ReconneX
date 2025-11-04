
import React, { useState } from 'react';
import type { PartialMatch, Transaction } from '../types';
import { BadgeCheckIcon, FlagIcon, LightBulbIcon } from './icons/Icons';

interface ResolutionWorkspaceProps {
  isOpen: boolean;
  onClose: () => void;
  partialMatches: PartialMatch[];
  unmatchedA: Transaction[];
  unmatchedB: Transaction[];
  onResolve: (match: PartialMatch) => void;
  sourceAName: string;
  sourceBName: string;
}

const TransactionCard: React.FC<{ transaction: Transaction; sourceName: string; highlight?: string }> = ({ transaction, sourceName, highlight }) => {
    const isHighlighted = (field: keyof Transaction) => highlight === field;
    return (
        <div className="bg-gray-50 p-4 rounded-lg border flex-1">
            <p className="text-sm font-semibold text-gray-500 mb-2">{sourceName}</p>
            <div className="space-y-1 text-sm">
                <p><span className="font-semibold w-24 inline-block">ID:</span> {transaction.id}</p>
                <p className={isHighlighted('date') ? 'bg-yellow-200 rounded px-1' : ''}><span className="font-semibold w-24 inline-block">Date:</span> {transaction.date}</p>
                <p className={isHighlighted('name') ? 'bg-yellow-200 rounded px-1' : ''}><span className="font-semibold w-24 inline-block">Name:</span> {transaction.name}</p>
                <p className={isHighlighted('amount') ? 'bg-yellow-200 rounded px-1' : ''}><span className="font-semibold w-24 inline-block">Amount:</span> S${transaction.amount.toFixed(2)}</p>
                {transaction.gross_amount !== undefined && transaction.fee !== undefined && (
                    <p className="text-xs text-gray-500 pl-1"><span className="font-semibold w-24 inline-block"></span>(Gross: S${transaction.gross_amount.toFixed(2)}, Fee: S${transaction.fee.toFixed(2)})</p>
                )}
                <p><span className="font-semibold w-24 inline-block">Description:</span> {transaction.description}</p>
                {transaction.payout_id && <p><span className="font-semibold w-24 inline-block">Payout ID:</span> {transaction.payout_id}</p>}
                {transaction.campaign && <p><span className="font-semibold w-24 inline-block">Campaign:</span> {transaction.campaign}</p>}
                {transaction.paymentMethod && <p><span className="font-semibold w-24 inline-block">Method:</span> {transaction.paymentMethod}</p>}
            </div>
        </div>
    );
};


export const ResolutionWorkspace: React.FC<ResolutionWorkspaceProps> = ({ isOpen, onClose, partialMatches, unmatchedA, unmatchedB, onResolve, sourceAName, sourceBName }) => {
  const [activeTab, setActiveTab] = useState<'partial' | 'unmatched'>('partial');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col">
        <header className="p-5 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold text-brand-dark">Discrepancy Resolution Workspace</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl leading-none">&times;</button>
        </header>

        <div className="border-b">
            <nav className="flex space-x-4 px-5">
                <button 
                    onClick={() => setActiveTab('partial')}
                    className={`py-3 px-1 font-semibold ${activeTab === 'partial' ? 'border-b-2 border-brand-red text-brand-red' : 'text-gray-500'}`}
                >
                    Partial Matches ({partialMatches.length})
                </button>
                <button
                    onClick={() => setActiveTab('unmatched')}
                    className={`py-3 px-1 font-semibold ${activeTab === 'unmatched' ? 'border-b-2 border-brand-red text-brand-red' : 'text-gray-500'}`}
                >
                    Unmatched ({unmatchedA.length + unmatchedB.length})
                </button>
            </nav>
        </div>

        <main className="flex-1 overflow-y-auto p-5 bg-gray-50">
          {activeTab === 'partial' && (
            <div>
              {partialMatches.length > 0 ? (
                <div className="space-y-4">
                  {partialMatches.map((match, index) => {
                     const diffName = match.sourceA.name.toLowerCase() !== match.sourceB.name.toLowerCase();
                     const diffAmount = match.sourceA.amount !== match.sourceB.amount;
                     const diffDate = match.sourceA.date !== match.sourceB.date;
                     let highlightField: 'name' | 'amount' | 'date' | undefined = undefined;
                     if(diffAmount) highlightField = 'amount';
                     if(diffName) highlightField = 'name';
                     if(diffDate) highlightField = 'date';

                     return (
                        <div key={index} className="bg-white p-4 rounded-lg shadow border">
                            <div className="flex flex-col md:flex-row gap-4">
                                <TransactionCard transaction={match.sourceA} sourceName={sourceAName} highlight={highlightField} />
                                <TransactionCard transaction={match.sourceB} sourceName={sourceBName} highlight={highlightField} />
                            </div>
                            <div className="mt-4 bg-blue-50 border border-blue-200 p-3 rounded-lg flex flex-col md:flex-row items-center gap-4">
                                <div className="flex-shrink-0 text-blue-500"><LightBulbIcon className="w-6 h-6"/></div>
                                <div className="flex-grow text-center md:text-left">
                                    <p className="font-semibold text-blue-800">AI Suggestion (Confidence: {(match.confidenceScore * 100).toFixed(0)}%)</p>
                                    <p className="text-sm text-blue-700">{match.reason}</p>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <button onClick={() => onResolve(match)} className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-green-700 transition">
                                        <BadgeCheckIcon className="w-5 h-5"/> Confirm Match
                                    </button>
                                    <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-gray-300 transition">
                                        <FlagIcon className="w-5 h-5"/> Flag
                                    </button>
                                </div>
                            </div>
                        </div>
                    )})}
                </div>
              ) : <p className="text-center text-gray-500 py-10">No partial matches to review. Well done!</p>}
            </div>
          )}
          {activeTab === 'unmatched' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h4 className="font-bold text-lg text-brand-dark mb-2">Unmatched in {sourceAName} ({unmatchedA.length})</h4>
                    <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
                        {unmatchedA.map(t => <div key={t.id} className="bg-white p-3 rounded-md shadow-sm border text-sm"><strong>ID: {t.id}</strong>, {t.date}, {t.name}, S${t.amount.toFixed(2)}</div>)}
                    </div>
                </div>
                 <div>
                    <h4 className="font-bold text-lg text-brand-dark mb-2">Unmatched in {sourceBName} ({unmatchedB.length})</h4>
                    <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
                        {unmatchedB.map(t => <div key={t.id} className="bg-white p-3 rounded-md shadow-sm border text-sm"><strong>ID: {t.id}</strong>, {t.date}, {t.name}, S${t.amount.toFixed(2)}</div>)}
                    </div>
                </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
