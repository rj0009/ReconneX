
import React from 'react';
import { CloudIcon, DatabaseIcon, CpuIcon } from './icons/Icons';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ArchitectureItem: React.FC<{ title: string; description: string; icon: React.ReactNode }> = ({ title, description, icon }) => (
    <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 text-brand-dark bg-gray-200 p-2 rounded-full">{icon}</div>
        <div>
            <h4 className="font-semibold text-brand-dark">{title}</h4>
            <p className="text-sm text-gray-600">{description}</p>
        </div>
    </div>
);


export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <header className="p-5 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold text-brand-dark">Production Technical Architecture</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">&times;</button>
        </header>

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
            <p className="text-gray-700">This prototype demonstrates the core functionality. A production-ready version of ReconneX would be built on a scalable and secure cloud architecture using Google Cloud services.</p>
            
            <div className="space-y-6 mt-4">
                <ArchitectureItem 
                    title="Frontend"
                    description="A responsive web application built with React and hosted on Firebase Hosting for global distribution and scalability."
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
                />
                 <ArchitectureItem 
                    title="AI & Business Logic"
                    description="Google Cloud Functions serve as the serverless backend, invoking the Vertex AI Gemini API for the core matching and insights generation. This ensures a pay-as-you-go model that scales automatically."
                    icon={<CpuIcon className="w-6 h-6"/>}
                />
                 <ArchitectureItem 
                    title="Data Processing & Storage"
                    description="Uploaded files are securely stored in Google Cloud Storage. Data is then loaded into BigQuery for large-scale analysis, historical reporting, and preparing datasets for potential custom model training in the future."
                    icon={<DatabaseIcon className="w-6 h-6"/>}
                />
                 <ArchitectureItem 
                    title="Security & Identity"
                    description="Firebase Authentication manages user access, ensuring that only authorized finance personnel can access sensitive data. All data is encrypted in transit and at rest."
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>}
                />
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
