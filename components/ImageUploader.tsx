import React, { useRef, useState } from 'react';
import { PhotoIcon, UploadIcon } from './Icons';
import { UploadedImage } from '../types';

interface ImageUploaderProps {
  onImageSelect: (image: UploadedImage) => void;
  selectedImage: UploadedImage | null;
  disabled: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect, selectedImage, disabled }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    processFile(file);
  };

  const processFile = (file: File | undefined) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        // Extract base64 part
        const base64 = result.split(',')[1];
        onImageSelect({
          file,
          previewUrl: result,
          base64,
          mimeType: file.type
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    const file = e.dataTransfer.files?.[0];
    processFile(file);
  };

  const triggerSelect = () => {
    if (!disabled && inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-lg font-bold text-slate-700 mb-3 flex items-center gap-2">
        <span className="bg-brand-100 text-brand-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
        Upload Photo
      </h2>
      
      <div 
        onClick={triggerSelect}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative flex-1 min-h-[300px] border-3 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 overflow-hidden group
          ${isDragging ? 'border-accent-500 bg-accent-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-brand-400'}
          ${selectedImage ? 'border-brand-500' : ''}
        `}
      >
        <input 
          type="file" 
          ref={inputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          className="hidden" 
          disabled={disabled}
        />

        {selectedImage ? (
          <div className="relative w-full h-full">
             <img 
               src={selectedImage.previewUrl} 
               alt="Selected" 
               className="w-full h-full object-contain p-4"
             />
             <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <div className="bg-white/90 text-slate-700 px-4 py-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all font-medium text-sm">
                  Click to change
                </div>
             </div>
          </div>
        ) : (
          <div className="text-center p-8">
            <div className={`
              w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center transition-all duration-300
              ${isDragging ? 'bg-accent-100 text-accent-600 scale-110' : 'bg-brand-100 text-brand-600 group-hover:scale-110'}
            `}>
              <PhotoIcon className="w-10 h-10" />
            </div>
            <p className="text-slate-600 font-semibold text-lg">
              {isDragging ? 'Drop it here!' : 'Click or Drag Photo'}
            </p>
            <p className="text-slate-400 text-sm mt-2 max-w-[200px] mx-auto">
              For best results, upload a clear, well-lit full body or portrait shot.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
