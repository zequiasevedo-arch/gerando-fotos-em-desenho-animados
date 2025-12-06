export interface UploadedImage {
  file: File;
  previewUrl: string;
  base64: string; // Pure base64 without prefix
  mimeType: string;
}

export interface GenerationState {
  status: 'idle' | 'uploading' | 'generating' | 'success' | 'error';
  error?: string;
}
