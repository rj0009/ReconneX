
export interface Transaction {
  id: string;
  date: string;
  name: string;
  amount: number;
  description: string;
  paymentMethod?: string;
  gstFlag?: boolean;
  over5kFlag?: boolean;
}

export interface MatchPair {
  sourceA: Transaction;
  sourceB: Transaction;
}

export interface PartialMatch extends MatchPair {
  reason: string;
  confidenceScore: number;
}

export interface ReconciliationResult {
  perfectMatches: MatchPair[];
  partialMatches: PartialMatch[];
  unmatchedA: Transaction[];
  unmatchedB: Transaction[];
}

export interface InsightResult {
  commonPatterns: string[];
  timeSavingsEstimate: string;
  riskAssessment: string;
  successMetrics: {
    timeReduction: string;
    errorRateReduction: string;
    closureAcceleration: string;
  };
}

export enum AppState {
  WELCOME,
  UPLOAD,
  LOADING,
  DASHBOARD,
}
