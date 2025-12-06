import React, { useState } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { UploadedImage, GenerationState } from './types';
import { generatePixarCharacter } from './services/geminiService';
import { LoadingOverlay } from './components/LoadingOverlay';
import { SparklesIcon, DownloadIcon } from './components/Icons';
import { APP_NAME, APP_SUBTITLE } from './constants';

const App: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<UploadedImage | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generationState, setGenerationState] = useState<GenerationState>({ status: 'idle' });

  const handleImageSelect = (image: UploadedImage) => {
    setSelectedImage(image);
    setGeneratedImage(null);
    setGenerationState({ status: 'idle' });
  };

  const handleGenerate = async () => {
    if (!selectedImage) return;

    setGenerationState({ status: 'generating' });
    try {
      const resultUrl = await generatePixarCharacter(selectedImage.base64, selectedImage.mimeType);
      setGeneratedImage(resultUrl);
      setGenerationState({ status: 'success' });
    } catch (error: any) {
      setGenerationState({ 
        status: 'error', 
        error: error.message || "Something went wrong during generation."
      });
    }
  };

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `pixarified-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const isLoading = generationState.status === 'generating';

  return (
    <div className="min-h-screen pb-12 px-4 md:px-6 max-w-7xl mx-auto">
      {/* Header */}
      <header className="pt-8 pb-10 text-center animate-float">
        <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-accent-500 to-brand-600 mb-2 drop-shadow-sm tracking-tight">
          {APP_NAME}
        </h1>
        <p className="text-lg md:text-xl text-slate-500 font-medium">{APP_SUBTITLE}</p>
      </header>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
        
        {/* Left Column: Input */}
        <div className="w-full h-full bg-white rounded-3xl shadow-xl p-6 md:p-8 flex flex-col relative z-10 border border-slate-100">
          <ImageUploader 
            onImageSelect={handleImageSelect} 
            selectedImage={selectedImage}
            disabled={isLoading} 
          />
          
          <div className="mt-6 text-center">
            <button
              onClick={handleGenerate}
              disabled={!selectedImage || isLoading}
              className={`
                group relative w-full py-4 px-6 rounded-xl font-bold text-lg text-white shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl
                ${!selectedImage || isLoading 
                  ? 'bg-slate-300 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-brand-500 via-accent-500 to-brand-600 hover:from-brand-400 hover:to-accent-400'}
              `}
            >
              <span className="flex items-center justify-center gap-2">
                <SparklesIcon className={`w-6 h-6 ${isLoading ? 'animate-spin' : 'group-hover:animate-pulse'}`} />
                {isLoading ? 'Creating Magic...' : 'Pixarify Me!'}
              </span>
            </button>
            {generationState.status === 'error' && (
              <p className="text-red-500 text-sm mt-3 bg-red-50 p-2 rounded-lg">
                {generationState.error}
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Output */}
        <div className="w-full h-full min-h-[500px] bg-white rounded-3xl shadow-xl p-6 md:p-8 flex flex-col relative overflow-hidden border border-slate-100">
           <h2 className="text-lg font-bold text-slate-700 mb-3 flex items-center gap-2 relative z-20">
             <span className="bg-accent-100 text-accent-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
             Your Character
           </h2>

           <div className="relative flex-1 rounded-2xl bg-slate-50 border-3 border-dashed border-slate-200 overflow-hidden flex items-center justify-center">
              <LoadingOverlay isVisible={isLoading} />
              
              {generatedImage ? (
                <img 
                  src={generatedImage} 
                  alt="Generated Pixar Style" 
                  className="w-full h-full object-contain animate-fade-in" 
                />
              ) : (
                <div className="text-center p-8 opacity-40">
                  <SparklesIcon className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                  <p className="text-slate-500 font-medium">Magic happens here</p>
                </div>
              )}
           </div>

           <div className="mt-6 flex justify-end">
             <button
               onClick={handleDownload}
               disabled={!generatedImage}
               className={`
                 flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300
                 ${generatedImage 
                   ? 'bg-slate-800 text-white hover:bg-slate-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5' 
                   : 'bg-slate-100 text-slate-300 cursor-not-allowed'}
               `}
             >
               <DownloadIcon className="w-5 h-5" />
               Download
             </button>
           </div>
        </div>

      </div>

      {/* Examples or Footer */}
      <div className="mt-16 text-center text-slate-400 text-sm">
        <p>Powered by Gemini 2.5 Flash Image • React • Tailwind</p>
        <p className="mt-2">Upload a photo to transform it into a 3D animated character instantly.</p>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;
