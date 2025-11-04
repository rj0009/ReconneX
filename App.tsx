
import React, { useState, useCallback } from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { UploadStep } from './components/UploadStep';
import { Dashboard } from './components/Dashboard';
import { Spinner } from './components/Spinner';
import { runReconciliation, generateInsights } from './services/geminiService';
import type { Transaction, ReconciliationResult, InsightResult } from './types';
import { AppState } from './types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.WELCOME);
  const [sourceA, setSourceA] = useState<{ name: string; data: Transaction[]; total: number } | null>(null);
  const [sourceB, setSourceB] = useState<{ name: string; data: Transaction[]; total: number } | null>(null);
  const [reconciliationResult, setReconciliationResult] = useState<ReconciliationResult | null>(null);
  const [insights, setInsights] = useState<InsightResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  
  const handleStart = () => setAppState(AppState.UPLOAD);

  const handleReset = () => {
    setAppState(AppState.UPLOAD);
    setSourceA(null);
    setSourceB(null);
    setReconciliationResult(null);
    setInsights(null);
    setError(null);
  };

  const handleReconcile = useCallback(async (
    srcA: { name: string; data: Transaction[]; total: number },
    srcB: { name: string; data: Transaction[]; total: number }
  ) => {
    setSourceA(srcA);
    setSourceB(srcB);
    setAppState(AppState.LOADING);
    setError(null);
    
    try {
      setLoadingMessage("AI is analyzing transactions...");
      const result = await runReconciliation(srcA.data, srcB.data);
      setReconciliationResult(result);
      setAppState(AppState.DASHBOARD);
    } catch (e) {
      console.error(e);
      setError("An error occurred during reconciliation. Please check your data or API key and try again.");
      setAppState(AppState.UPLOAD);
    } finally {
      setLoadingMessage('');
    }
  }, []);

  const handleGenerateInsights = useCallback(async () => {
    if (!reconciliationResult) return;
    setLoadingMessage("AI is generating insights...");
    try {
      const insightData = await generateInsights(reconciliationResult);
      setInsights(insightData);
    } catch(e) {
      console.error(e);
      alert("Failed to generate insights. Please try again.");
    } finally {
      setLoadingMessage('');
    }
  }, [reconciliationResult]);

  const updateReconciliationResult = (newResult: ReconciliationResult) => {
    setReconciliationResult(newResult);
  };

  const renderContent = () => {
    switch (appState) {
      case AppState.WELCOME:
        return <WelcomeScreen onStart={handleStart} />;
      case AppState.UPLOAD:
        return (
          <UploadStep 
            onReconcile={handleReconcile} 
            initialSourceA={sourceA} 
            initialSourceB={sourceB} 
            error={error} 
          />
        );
      case AppState.LOADING:
        return <Spinner message={loadingMessage} />;
      case AppState.DASHBOARD:
        if (reconciliationResult && sourceA && sourceB) {
          return (
            <Dashboard
              result={reconciliationResult}
              setResult={updateReconciliationResult}
              sourceAName={sourceA.name}
              sourceBName={sourceB.name}
              onGenerateInsights={handleGenerateInsights}
              insights={insights}
              loadingInsights={loadingMessage.includes('insights')}
            />
          );
        }
        return <p>Something went wrong. Please start over.</p>;
      default:
        return <WelcomeScreen onStart={handleStart} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header onReset={handleReset} showReset={appState === AppState.DASHBOARD} />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
};

export default App;
