
import { GoogleGenAI, Type } from "@google/genai";
import type { Transaction, ReconciliationResult, InsightResult } from '../types';

if (!process.env.API_KEY) {
    // A fallback for development. In a real environment, the key would be set.
    // In the context of this tool, it's assumed to be provided.
    console.warn("API_KEY environment variable not set. Using a placeholder. The app may not function correctly.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const transactionSchema = {
    type: Type.OBJECT,
    properties: {
        id: { type: Type.STRING },
        date: { type: Type.STRING },
        name: { type: Type.STRING },
        amount: { type: Type.NUMBER },
        description: { type: Type.STRING },
        paymentMethod: { type: Type.STRING, nullable: true },
        gstFlag: { type: Type.BOOLEAN, nullable: true },
        over5kFlag: { type: Type.BOOLEAN, nullable: true },
    },
    required: ['id', 'date', 'name', 'amount', 'description'],
};

const matchPairSchema = {
    type: Type.OBJECT,
    properties: {
        sourceA: transactionSchema,
        sourceB: transactionSchema,
    },
    required: ['sourceA', 'sourceB'],
};

const partialMatchSchema = {
    type: Type.OBJECT,
    properties: {
        sourceA: transactionSchema,
        sourceB: transactionSchema,
        reason: { type: Type.STRING },
        confidenceScore: { type: Type.NUMBER },
    },
    required: ['sourceA', 'sourceB', 'reason', 'confidenceScore'],
};

const reconciliationSchema = {
    type: Type.OBJECT,
    properties: {
        perfectMatches: {
            type: Type.ARRAY,
            items: matchPairSchema,
        },
        partialMatches: {
            type: Type.ARRAY,
            items: partialMatchSchema,
        },
        unmatchedA: {
            type: Type.ARRAY,
            items: transactionSchema,
        },
        unmatchedB: {
            type: Type.ARRAY,
            items: transactionSchema,
        },
    },
    required: ['perfectMatches', 'partialMatches', 'unmatchedA', 'unmatchedB'],
};

export const runReconciliation = async (sourceA: Transaction[], sourceB: Transaction[]): Promise<ReconciliationResult> => {
    const prompt = `
    You are an expert AI financial reconciliation engine for non-profit organizations in Singapore.
    Your task is to match transactions from two different data sources: Source A (e.g., a payment gateway) and Source B (e.g., internal accounting records).

    Apply the following matching rules with high precision:
    1.  **Fuzzy Name Matching**: Match names that are similar but not identical (e.g., "John Tan" vs. "Tan, John" vs. "J. Tan").
    2.  **Amount Tolerance**: Match amounts that are within a small tolerance of +/- S$0.50 to account for payment processing fees.
    3.  **Date Proximity**: Consider transactions within a 3-day window of each other as potential matches.
    4.  **Unique IDs**: If descriptions contain matching transaction IDs or reference numbers, it's a strong signal for a match.

    Categorize the results into three groups:
    - **perfectMatches**: High-confidence matches where name, amount (within tolerance), and date are very close.
    - **partialMatches**: Medium-confidence matches where some criteria match but others have discrepancies (e.g., name is similar but amount is slightly off, or vice-versa). Provide a brief 'reason' and a 'confidenceScore' (from 0.0 to 1.0) for each partial match.
    - **unmatchedA / unmatchedB**: Transactions from each source that could not be matched with any transaction in the other source.

    Here are the two datasets:

    **Source A:**
    ${JSON.stringify(sourceA, null, 2)}

    **Source B:**
    ${JSON.stringify(sourceB, null, 2)}

    Now, perform the reconciliation and return the result in the specified JSON format.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: reconciliationSchema,
            },
        });

        const jsonString = response.text.trim();
        return JSON.parse(jsonString) as ReconciliationResult;
    } catch (error) {
        console.error("Error calling Gemini API for reconciliation:", error);
        throw new Error("Failed to get a valid reconciliation result from the AI.");
    }
};


const insightsSchema = {
    type: Type.OBJECT,
    properties: {
        commonPatterns: { type: Type.ARRAY, items: { type: Type.STRING } },
        timeSavingsEstimate: { type: Type.STRING },
        riskAssessment: { type: Type.STRING },
        successMetrics: {
            type: Type.OBJECT,
            properties: {
                timeReduction: { type: Type.STRING },
                errorRateReduction: { type: Type.STRING },
                closureAcceleration: { type: Type.STRING },
            },
            required: ['timeReduction', 'errorRateReduction', 'closureAcceleration']
        }
    },
    required: ['commonPatterns', 'timeSavingsEstimate', 'riskAssessment', 'successMetrics']
};

export const generateInsights = async (result: ReconciliationResult): Promise<InsightResult> => {
    const prompt = `
    You are a senior financial analyst providing insights on a reconciliation report for a Singapore-based social service agency.
    Based on the following reconciliation data, generate a concise report.

    **Reconciliation Data Summary:**
    - Perfect Matches: ${result.perfectMatches.length}
    - Partial Matches (for review): ${result.partialMatches.length}
    - Unmatched from Source A: ${result.unmatchedA.length}
    - Unmatched from Source B: ${result.unmatchedB.length}

    **Discrepancy Details (Partial & Unmatched):**
    - Partial Matches: ${JSON.stringify(result.partialMatches.slice(0, 5), null, 2)}
    - Unmatched A: ${JSON.stringify(result.unmatchedA.slice(0, 5), null, 2)}
    - Unmatched B: ${JSON.stringify(result.unmatchedB.slice(0, 5), null, 2)}

    Your tasks:
    1.  **Identify Common Discrepancy Patterns**: Analyze the partial and unmatched data to find recurring issues. Examples: "Payment gateway fees causing $0.30-$0.50 differences", "Timing differences of 1-2 days are common". List 2-3 main patterns.
    2.  **Estimate Time Savings**: Assume a manual process takes 20 hours. Project the time saved using this AI tool. Be optimistic but realistic.
    3.  **Assess Risk**: Briefly describe the compliance or financial risk posed by the unreconciled items.
    4.  **Quantify Success Metrics**: Project improvements based on this reconciliation. Provide specific, compelling numbers for:
        - Time Reduction (e.g., "From 20+ hours to <2 hours monthly")
        - Error Rate Reduction (e.g., "From ~5% manual error rate to <0.1%")
        - Month-End Closure Acceleration (e.g., "From 5 days to 1 day")

    Return the report as a JSON object adhering to the provided schema.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: insightsSchema,
            },
        });
        const jsonString = response.text.trim();
        return JSON.parse(jsonString) as InsightResult;
    } catch (error) {
        console.error("Error calling Gemini API for insights:", error);
        throw new Error("Failed to get a valid insights result from the AI.");
    }
};
