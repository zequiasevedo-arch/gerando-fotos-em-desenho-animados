import React, { useEffect, useState } from 'react';
import { SparklesIcon } from './Icons';

interface LoadingOverlayProps {
  isVisible: boolean;
}

const loadingMessages = [
  "Analyzing facial features...",
  "Applying 3D mesh...",
  "Adjusting lighting & textures...",
  "Adding Pixar magic...",
  "Rendering final character..."
];

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isVisible }) => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (!isVisible) return;
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center rounded-2xl animate-fade-in">
      <div className="relative">
        <div className="absolute inset-0 bg-accent-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
        <SparklesIcon className="w-16 h-16 text-accent-500 animate-spin-slow mb-4 relative z-10" />
      </div>
      <h3 className="text-xl font-bold text-slate-700 mt-4 animate-pulse">
        {loadingMessages[messageIndex]}
      </h3>
      <div className="mt-4 w-48 h-2 bg-slate-200 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-brand-500 to-accent-500 animate-progress-indeterminate"></div>
      </div>
      <style>{`
        @keyframes progress-indeterminate {
          0% { width: 0%; margin-left: 0%; }
          50% { width: 70%; margin-left: 30%; }
          100% { width: 0%; margin-left: 100%; }
        }
        .animate-progress-indeterminate {
          animation: progress-indeterminate 1.5s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
