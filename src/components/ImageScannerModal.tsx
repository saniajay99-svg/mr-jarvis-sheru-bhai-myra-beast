import React, { useState, useRef } from 'react';
import { X, Upload, Camera, Sparkles, Image as ImageIcon } from 'lucide-react';
import { soundEffects } from '../utils/audio';

interface ImageScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitImage: (imageData: string, promptText: string) => void;
}

export const ImageScannerModal: React.FC<ImageScannerModalProps> = ({
  isOpen,
  onClose,
  onSubmitImage,
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedPrompt, setSelectedPrompt] = useState('Solve this equation step-by-step with intermediate calculation');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        soundEffects.playSuccessChime();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        soundEffects.playSuccessChime();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!imagePreview) return;
    soundEffects.playJarvisWake();
    onSubmitImage(imagePreview, selectedPrompt);
    setImagePreview(null);
    onClose();
  };

  const presetPrompts = [
    'Solve this equation step-by-step with intermediate calculation',
    'Explain this Hindi/English grammar problem and identify mistakes',
    'Examine this homework diagram and explain all key concepts',
    'Verify if my handwritten solution is 100% correct',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0b101d] border-2 border-amber-500/40 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl shadow-amber-500/10 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-amber-950/40 to-slate-900">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-chakra font-bold text-base text-amber-200">
                Vision & Homework Scanner
              </h3>
              <p className="text-[11px] text-slate-400">
                For Aijay Boss • Real-time Multimodal AI Analysis
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              soundEffects.playBeep();
              onClose();
            }}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {/* Upload or Drop Area */}
          {!imagePreview ? (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-amber-500/30 hover:border-amber-400/70 rounded-2xl p-8 text-center cursor-pointer bg-slate-900/40 hover:bg-amber-500/5 transition-all space-y-3 group"
            >
              <div className="w-14 h-14 mx-auto rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                <Upload className="w-7 h-7" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-200">
                  Tap to upload or take a photo of homework
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Supports JPG, PNG, WebP • Math equations, Hindi, English
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          ) : (
            <div className="space-y-3">
              <div className="relative rounded-xl overflow-hidden border border-amber-400/50 bg-black max-h-64 flex items-center justify-center">
                <img
                  src={imagePreview}
                  alt="Scanned Homework"
                  className="max-h-64 w-auto object-contain"
                />
                <button
                  onClick={() => setImagePreview(null)}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/80 hover:bg-red-900 text-white border border-red-500/50"
                  title="Remove Image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Quick Preset Prompts */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              What should Mr Jarvis Beast do for Aijay Boss?
            </label>
            <div className="space-y-1.5">
              {presetPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    soundEffects.playBeep();
                    setSelectedPrompt(p);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl text-xs transition-all border ${
                    selectedPrompt === p
                      ? 'bg-amber-500/20 border-amber-400 text-amber-200 font-semibold'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between gap-3">
          <button
            onClick={() => {
              soundEffects.playBeep();
              onClose();
            }}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
          >
            Cancel
          </button>

          <button
            disabled={!imagePreview}
            onClick={handleSubmit}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold tracking-wide uppercase flex items-center gap-2 transition-all ${
              imagePreview
                ? 'bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 shadow-lg shadow-amber-500/25 active:scale-95 cursor-pointer'
                : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Inspect & Solve for Aijay Boss
          </button>
        </div>
      </div>
    </div>
  );
};
