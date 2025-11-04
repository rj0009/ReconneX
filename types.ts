
export interface Transaction {
  id: string;
  date: string;
  name: string;
  amount: number;
  description: string;
  paymentMethod?: string;
  gstFlag?: boolean;
  over5kFlag?: boolean;

  // New source-specific fields
  payout_id?: string;
  gross_amount?: number;
  fee?: number;
  campaign?: string;
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
  timeReduction: string;
  errorRateReduction: string;
  closureAcceleration: string;
}

export enum AppState {
  WELCOME,
  UPLOAD,
  LOADING,
  DASHBOARD,
}