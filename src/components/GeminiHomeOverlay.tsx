import React from 'react';
import {
  X,
  Mic,
  MicOff,
  Camera,
  Hammer,
  Flame,
  Phone,
  Sparkles,
  Volume2,
  ArrowUpRight,
  Radar,
} from 'lucide-react';
import { soundEffects } from '../utils/audio';
import { formatOwnerGreeting, resolveOwnerAddress } from '../types';

interface GeminiHomeOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  verifiedHumanId: string;
  isListening: boolean;
  isSpeaking: boolean;
  isTorchOn: boolean;
  onToggleMic: () => void;
  onStopSpeech: () => void;
  onQuickPrompt: (prompt: string) => void;
  onOpenLiveVision: () => void;
  onOpenAppBuilder: () => void;
  onOpenPromptStudio: () => void;
  onToggleTorch: () => void;
  onOpenDialer: () => void;
  isStandingMode?: boolean;
  onToggleStandingMode?: () => void;
}

const OVERLAY_SUGGESTIONS = [
  'आज का मौसम और ज़रूरी अपडेट बताओ',
  'फ्री 3D वीडियो बनाने के लिए अच्छा प्रॉम्प्ट दो',
  '3x² - 12x + 9 = 0 को छोटे स्टेप्स में हल करो',
];

export const GeminiHomeOverlay: React.FC<GeminiHomeOverlayProps> = ({
  isOpen,
  onClose,
  verifiedHumanId,
  isListening,
  isSpeaking,
  isTorchOn,
  onToggleMic,
  onStopSpeech,
  onQuickPrompt,
  onOpenLiveVision,
  onOpenAppBuilder,
  onToggleTorch,
  onOpenDialer,
  isStandingMode = false,
  onToggleStandingMode,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Floating Bubble and Home Overlay"
      className="fixed inset-0 z-50 flex flex-col justify-end sm:justify-center sm:items-center p-0 sm:p-4"
    >
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
        onClick={() => {
          soundEffects.playBeep();
          onClose();
        }}
      />

      <div className="relative z-10 w-full max-w-lg mx-auto bg-[#0b0f19]/95 border-t sm:border border-[#ffd700]/45 rounded-t-3xl sm:rounded-3xl overflow-hidden animate-in slide-in-from-bottom duration-200">
        <div className="sm:hidden pt-2.5 flex justify-center">
          <div className="w-10 h-1 rounded-full bg-slate-700" />
        </div>

        <div className="p-4 sm:p-6 space-y-4">
          {/* Header Row */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-[#ffd700]/70 bg-slate-900 shrink-0">
                <img
                  src="./person-ai-assistant.png"
                  alt="Sheru Bhai Assistant"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-medium text-[#ffd700] truncate">
                  Floating Bubble &amp; Home Mode
                </p>
                <h2 className="font-chakra font-bold text-base text-slate-100 truncate">
                  {formatOwnerGreeting(resolveOwnerAddress(verifiedHumanId))} बोलिए क्या मदद करूँ?
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                soundEffects.playBeep();
                onClose();
              }}
              aria-label="Close Home Overlay"
              className="min-h-[44px] min-w-[44px] rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            होम मोड यहाँ तैयार है। फ़ोन की दूसरी ऐप्स के ऊपर अपने-आप फ्लोटिंग बबल दिखाने के लिए फ़ोन के सिस्टम ओवरले/ऐप सपोर्ट की ज़रूरत होती है।
          </p>

          {/* Voice Strip */}
          <div className="p-3.5 rounded-2xl bg-[#07090e] border border-slate-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={() => {
                  soundEffects.playJarvisWake();
                  if (isSpeaking) {
                    onStopSpeech();
                  } else {
                    onToggleMic();
                  }
                }}
                aria-label={isListening ? 'Stop voice listening' : isSpeaking ? 'Stop assistant voice' : 'Start voice command'}
                className={`min-h-[48px] min-w-[48px] rounded-full flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                  isListening
                    ? 'bg-rose-600 text-white'
                    : isSpeaking
                    ? 'bg-cyan-400 text-[#07090e]'
                    : 'bg-[#ffd700] text-[#07090e] hover:bg-amber-300'
                }`}
              >
                {isListening ? (
                  <MicOff className="w-5 h-5" />
                ) : isSpeaking ? (
                  <Volume2 className="w-5 h-5" />
                ) : (
                  <Mic className="w-5 h-5" />
                )}
              </button>

              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-chakra font-bold text-slate-100 truncate">
                  {isListening
                    ? 'सुन रहा हूँ...'
                    : isSpeaking
                    ? 'बोल रहा हूँ...'
                    : 'बोलकर पूछने के लिए माइक दबाएं'}
                </p>
                <p className="text-[11px] text-slate-400 truncate">
                  छोटा, साफ़ और तेज़ हिंदी / हिंग्लिश जवाब
                </p>
              </div>
            </div>

            {isSpeaking && (
              <button
                type="button"
                onClick={() => {
                  soundEffects.playBeep();
                  onStopSpeech();
                }}
                className="min-h-[40px] px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-xs font-semibold text-slate-200 cursor-pointer shrink-0"
              >
                Stop
              </button>
            )}
          </div>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => {
                soundEffects.playJarvisWake();
                onClose();
                onOpenLiveVision();
              }}
              className="min-h-[52px] p-3 rounded-2xl bg-[#111726] hover:bg-[#172034] border border-slate-800 hover:border-[#ffd700]/50 flex items-center gap-2.5 text-left transition-all cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-[#ffd700]/15 text-[#ffd700] flex items-center justify-center shrink-0">
                <Camera className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-chakra font-bold text-slate-100 truncate">Live Camera</div>
                <div className="text-[10px] text-slate-400 truncate">कैमरा खोलें व देखें</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                soundEffects.playJarvisWake();
                onClose();
                onOpenAppBuilder();
              }}
              className="min-h-[52px] p-3 rounded-2xl bg-[#111726] hover:bg-[#172034] border border-slate-800 hover:border-[#ffd700]/50 flex items-center gap-2.5 text-left transition-all cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-cyan-500/15 text-cyan-300 flex items-center justify-center shrink-0">
                <Hammer className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-chakra font-bold text-slate-100 truncate">App Builder</div>
                <div className="text-[10px] text-slate-400 truncate">मिनी वेब ऐप बनाएं</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                soundEffects.playJarvisWake();
                onToggleStandingMode?.();
                onClose();
              }}
              className={`min-h-[52px] p-3 rounded-2xl border flex items-center gap-2.5 text-left transition-all cursor-pointer ${
                isStandingMode
                  ? 'bg-[#ffd700]/20 border-[#ffd700]'
                  : 'bg-[#111726] hover:bg-[#172034] border-slate-800 hover:border-[#ffd700]/50'
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-[#ffd700]/15 text-[#ffd700] flex items-center justify-center shrink-0">
                <Radar className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-chakra font-bold text-[#ffd700] truncate">
                  {isStandingMode ? 'Standing ON' : 'Standing Mode'}
                </div>
                <div className="text-[10px] text-slate-400 truncate">पूरा कच्चा चिट्ठा</div>
              </div>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  soundEffects.playJarvisWake();
                  onToggleTorch();
                }}
                title="Toggle Flashlight"
                className={`min-h-[52px] p-2 rounded-2xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                  isTorchOn
                    ? 'bg-[#ffd700] text-[#07090e] border-[#ffd700] font-bold'
                    : 'bg-[#111726] hover:bg-[#172034] border-slate-800 text-slate-200'
                }`}
              >
                <Flame className="w-4 h-4" />
                <span className="text-[10px] font-semibold">Torch</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundEffects.playBeep();
                  onClose();
                  onOpenDialer();
                }}
                title="Call & Smart Screener"
                className="min-h-[52px] p-2 rounded-2xl bg-[#111726] hover:bg-[#172034] border border-slate-800 hover:border-[#ffd700]/50 text-slate-200 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer"
              >
                <Phone className="w-4 h-4 text-[#ffd700]" />
                <span className="text-[10px] font-semibold">Call</span>
              </button>
            </div>
          </div>

          {/* Quick Suggestions */}
          <div className="space-y-1.5">
            <p className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#ffd700]" />
              <span>त्वरित कमांड</span>
            </p>
            <div className="space-y-1.5">
              {OVERLAY_SUGGESTIONS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => {
                    soundEffects.playJarvisWake();
                    onClose();
                    onQuickPrompt(prompt);
                  }}
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-[#07090e] hover:bg-[#141a29] border border-slate-800 hover:border-[#ffd700]/50 text-left text-xs text-slate-200 flex items-center justify-between gap-2 transition-colors cursor-pointer"
                >
                  <span className="truncate font-hindi">{prompt}</span>
                  <ArrowUpRight className="w-4 h-4 text-[#ffd700] shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
