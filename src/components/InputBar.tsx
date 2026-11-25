import React, { useRef } from 'react';
import {
  Send,
  Mic,
  MicOff,
  Plus,
  X,
  Sparkles,
  FileText,
  Video,
  Square,
} from 'lucide-react';
import { MediaAttachment } from '../types';
import { soundEffects } from '../utils/audio';

interface InputBarProps {
  inputQuery: string;
  onChangeQuery: (text: string) => void;
  onSubmit: () => void;
  isProcessing: boolean;
  isListening: boolean;
  isSpeaking?: boolean;
  onToggleMic: () => void;
  onStopSpeech?: () => void;
  attachedMedia: MediaAttachment | null;
  onRemoveMedia: () => void;
  onOpenActionMenu: () => void;
  isStandingMode?: boolean;
}

export const InputBar: React.FC<InputBarProps> = ({
  inputQuery,
  onChangeQuery,
  onSubmit,
  isProcessing,
  isListening,
  isSpeaking = false,
  onToggleMic,
  onStopSpeech,
  attachedMedia,
  onRemoveMedia,
  onOpenActionMenu,
  isStandingMode = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if ((inputQuery.trim() || attachedMedia) && !isProcessing) {
        onSubmit();
      }
    }
  };

  const canSend = Boolean((inputQuery.trim() || attachedMedia) && !isProcessing);

  return (
    <div className="space-y-2 w-full">
      {/* Attached Media Preview Chip */}
      {attachedMedia && (
        <div className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-[#ffd700]/50 w-full max-w-md">
          <div className="flex items-center gap-2 overflow-hidden">
            {attachedMedia.type === 'image' && (
              <div className="w-8 h-8 rounded-lg overflow-hidden border border-[#ffd700]/60 shrink-0 bg-black">
                <img src={attachedMedia.base64} alt="Attachment" className="w-full h-full object-cover" />
              </div>
            )}
            {attachedMedia.type === 'video' && (
              <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/60 flex items-center justify-center text-cyan-300 shrink-0">
                <Video className="w-4 h-4" />
              </div>
            )}
            {attachedMedia.type === 'pdf' && (
              <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-500/60 flex items-center justify-center text-emerald-300 shrink-0">
                <FileText className="w-4 h-4" />
              </div>
            )}

            <div className="truncate">
              <p className="text-xs font-medium text-slate-200 truncate">
                {attachedMedia.name}
              </p>
              <p className="text-[10px] text-slate-400">
                {attachedMedia.type.toUpperCase()} attached
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              soundEffects.playBeep();
              onRemoveMedia();
            }}
            aria-label="Remove attachment"
            className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-full hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors shrink-0 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Clean Poe-Style Single-Row Chat Bar */}
      <div
        className={`flex items-center gap-1.5 p-1 rounded-2xl bg-[#0e1424] border transition-colors ${
          isStandingMode
            ? 'border-[#ffd700]'
            : 'border-slate-700/90 focus-within:border-[#ffd700]/75'
        }`}
      >
        {/* '+' Quick Actions Button */}
        <button
          onClick={() => {
            soundEffects.playBeep();
            onOpenActionMenu();
          }}
          type="button"
          aria-label="Open quick actions"
          title="Quick Actions & Options (+)"
          className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-slate-900 hover:bg-slate-800 text-[#ffd700] transition-colors active:scale-95 shrink-0 cursor-pointer"
        >
          <Plus className="w-5 h-5" />
        </button>

        {/* Native HTML Text Input Field */}
        <input
          ref={inputRef}
          type="text"
          value={inputQuery}
          onChange={(e) => onChangeQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isProcessing}
          enterKeyHint="send"
          autoComplete="off"
          autoCorrect="off"
          placeholder={
            isStandingMode
              ? 'Standing Mode: Ask for a deep breakdown...'
              : 'Message Mr Jarvis Sheru Bhai...'
          }
          className="flex-1 min-h-[44px] bg-transparent px-2 text-sm sm:text-base text-slate-100 placeholder-slate-400 focus:outline-none font-hindi min-w-0"
        />

        {/* Stop Speech Button (only when speaking) */}
        {isSpeaking && onStopSpeech && (
          <button
            type="button"
            onClick={() => {
              soundEffects.playBeep();
              onStopSpeech();
            }}
            aria-label="Stop speaking"
            title="Stop Voice"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 shrink-0 cursor-pointer"
          >
            <Square className="w-4 h-4 fill-current" />
          </button>
        )}

        {/* Voice Microphone Button */}
        <button
          onClick={() => {
            soundEffects.playBeep();
            onToggleMic();
          }}
          type="button"
          aria-label={isListening ? 'Stop listening' : 'Speak'}
          title={isListening ? 'Stop Listening' : 'Voice Input'}
          className={`min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl transition-colors shrink-0 active:scale-95 cursor-pointer ${
            isListening
              ? 'bg-rose-600 text-white'
              : 'text-slate-300 hover:text-[#ffd700] hover:bg-slate-900'
          }`}
        >
          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        {/* Send Button */}
        <button
          onClick={() => {
            if (canSend) {
              soundEffects.playJarvisWake();
              onSubmit();
            }
          }}
          disabled={!canSend}
          type="button"
          aria-label="Send message"
          title="Send"
          className={`min-h-[44px] px-3.5 rounded-xl font-chakra font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shrink-0 active:scale-95 ${
            canSend
              ? 'bg-[#ffd700] hover:bg-amber-300 text-[#07090e] cursor-pointer'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          {isProcessing ? (
            <Sparkles className="w-4 h-4 animate-spin text-[#ffd700]" />
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Send</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
