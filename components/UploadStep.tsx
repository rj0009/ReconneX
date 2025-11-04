
import React, { useState, useCallback, ChangeEvent } from 'react';
import type { Transaction } from '../types';
import { UploadIcon, CheckCircleIcon } from './icons/Icons';
import { generateSampleData } from '../utils/sampleData';

interface UploadStepProps {
  onReconcile: (
    sourceA: { name: string; data: Transaction[]; total: number },
    sourceB: { name: string; data: Transaction[]; total: number }
  ) => void;
  initialSourceA: { name: string; data: Transaction[]; total: number } | null;
  initialSourceB: { name:string; data: Transaction[]; total: number } | null;
  error: string | null;
}

type DataSourceType = 'stripe' | 'dms';

const FileUploadBox: React.FC<{
  title: string;
  onFileUpload: (file: File) => void;
  fileData: { name: string; count: number; total: number } | null;
  id: string;
}> = ({ title, onFileUpload, fileData, id }) => {
  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => e.preventDefault();
  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileUpload(e.dataTransfer.files[0]);
    }
  };
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileUpload(e.target.files[0]);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow border border-gray-200 w-full">
      <h3 className="text-lg font-semibold text-brand-dark mb-4">{title}</h3>
      {fileData ? (
        <div className="text-center bg-green-50 p-6 rounded-lg border-2 border-dashed border-green-200">
            <CheckCircleIcon className="w-12 h-12 text-green-500 mx-auto mb-2" />
            <p className="font-semibold text-gray-800">{fileData.name}</p>
            <p className="text-sm text-gray-600">{fileData.count} records</p>
            <p className="text-sm text-gray-600">Total: S${fileData.total.toLocaleString('en-SG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
      ) : (
        <label
          htmlFor={id}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <UploadIcon className="w-10 h-10 mb-3 text-gray-400" />
            <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
            <p className="text-xs text-gray-500">CSV file</p>
          </div>
          <input id={id} type="file" className="hidden" accept=".csv" onChange={handleFileChange} />
        </label>
      )}
    </div>
  );
};

export const UploadStep: React.FC<UploadStepProps> = ({ onReconcile, initialSourceA, initialSourceB, error }) => {
  const [sourceA, setSourceA] = useState<{ name: string; data: Transaction[]; total: number } | null>(initialSourceA);
  const [sourceB, setSourceB] = useState<{ name: string; data: Transaction[]; total: number } | null>(initialSourceB);

  const parseCSV = (csvText: string, sourceType: DataSourceType): Transaction[] => {
    const rows = csvText.trim().split('\n');
    const headerLine = rows.shift();
    if (!headerLine) return [];
    
    const headers = headerLine.split(',').map(h => h.trim().toLowerCase().replace(/[\s_]+/g, ''));
    
    return rows.map((row, index) => {
      const values = row.split(',');
      const entry: { [key: string]: string } = {};
      headers.forEach((header, i) => {
        entry[header] = values[i] ? values[i].trim() : '';
      });

      if (sourceType === 'stripe') {
        return {
          id: entry.id || `stripe-${index + 1}`,
          date: entry.createdutc || entry.payoutdate,
          name: entry.customername || 'Unknown',
          amount: parseFloat(entry.net) || 0,
          description: entry.description || '',
          gross_amount: parseFloat(entry.gross) || 0,
          fee: parseFloat(entry.fee) || 0,
          payout_id: entry.payoutid || 'N/A',
          paymentMethod: 'Stripe',
        };
      } else { // dms
        return {
          id: entry.donationid || `dms-${index + 1}`,
          date: entry.donationdate,
          name: entry.donorname,
          amount: parseFloat(entry.amount) || 0,
          description: `Campaign: ${entry.campaign || 'N/A'}`,
          campaign: entry.campaign || 'N/A',
          paymentMethod: entry.paymentmethod || 'Unknown',
        };
      }
    });
  };

  const processFile = (file: File, setter: React.Dispatch<React.SetStateAction<{ name: string; data: Transaction[]; total: number } | null>>, sourceType: DataSourceType) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const data = parseCSV(text, sourceType);
      const total = data.reduce((sum, t) => sum + t.amount, 0);
      setter({ name: file.name, data, total });
    };
    reader.readAsText(file);
  };

  const handleUseSampleData = useCallback(() => {
    const { stripeReport, dmsReport } = generateSampleData();
    
    const dataA = parseCSV(stripeReport, 'stripe');
    const totalA = dataA.reduce((sum, t) => sum + t.amount, 0);
    setSourceA({ name: 'StripeReport.csv', data: dataA, total: totalA });

    const dataB = parseCSV(dmsReport, 'dms');
    const totalB = dataB.reduce((sum, t) => sum + t.amount, 0);
    setSourceB({ name: 'DMSRecords.csv', data: dataB, total: totalB });
  }, []);
  
  const canReconcile = sourceA && sourceB;

  return (
    <div className="max-w-4xl mx-auto animate-fade-in-up">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-brand-dark">Upload Your Data Sources</h2>
        <p className="text-gray-600 mt-2">Upload the Stripe transaction report and the DMS donation records to begin.</p>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8 mb-6">
        <FileUploadBox title="Source 1: Stripe Transaction Report" onFileUpload={(file) => processFile(file, setSourceA, 'stripe')} fileData={sourceA ? { name: sourceA.name, count: sourceA.data.length, total: sourceA.total } : null} id="file-a" />
        <FileUploadBox title="Source 2: DMS Donation Records" onFileUpload={(file) => processFile(file, setSourceB, 'dms')} fileData={sourceB ? { name: sourceB.name, count: sourceB.data.length, total: sourceB.total } : null} id="file-b" />
      </div>

      <div className="text-center space-y-4">
         <button
            onClick={() => { if(canReconcile) onReconcile(sourceA, sourceB) }}
            disabled={!canReconcile}
            className="w-full md:w-auto bg-brand-red text-white font-bold py-3 px-12 rounded-lg text-lg transition-all disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-red-700"
          >
            Reconcile Now
          </button>
        <p className="text-gray-500">or</p>
        <button
          onClick={handleUseSampleData}
          className="w-full md:w-auto bg-gray-200 text-brand-dark font-semibold py-2 px-6 rounded-lg hover:bg-gray-300 transition"
        >
          Use Sample Data
        </button>
      </div>
    </div>
  );
};
