
import React, { useState } from 'react';
import { ArchitectureModal } from './ArchitectureModal';

export const Footer: React.FC = () => {
    const [isArchitectureModalOpen, setArchitectureModalOpen] = useState(false);
    return (
        <footer className="bg-gray-100 border-t">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-gray-500 text-sm">
                <p>&copy; {new Date().getFullYear()} ReconneX. A prototype for the SG Social Family Development Hackathon.</p>
                <button 
                    onClick={() => setArchitectureModalOpen(true)}
                    className="text-brand-dark hover:text-brand-red font-medium transition mt-1"
                >
                    View Technical Architecture
                </button>
            </div>
            {isArchitectureModalOpen && (
                <ArchitectureModal
                    isOpen={isArchitectureModalOpen}
                    onClose={() => setArchitectureModalOpen(false)}
                />
            )}
        </footer>
    );
};
