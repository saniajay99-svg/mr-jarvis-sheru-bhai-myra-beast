import React, { useEffect, useRef, useState } from 'react';
import {
  Volume2,
  Square,
  AlertTriangle,
  X,
  AudioLines,
  Camera,
  Smartphone,
  ArrowUpRight,
} from 'lucide-react';
import { AiModelPreset, GroundingMode } from '../types';
import { soundEffects } from '../utils/audio';

// Strictly relative path so exported ZIP & Android APK resolve cleanly
export const CUSTOM_SOUND_FILE_PATH = 'AUD-20261120-WA0000.mp3';

interface PoeBotCardProps {
  activeModelPreset: AiModelPreset;
  groundingMode: GroundingMode;
  isStandingMode: boolean;
  isThemeAudioPlaying: boolean;
  hasMessages: boolean;
  ownerCallout?: string;
  onQuickPrompt: (prompt: string) => void;
  onOpenVoiceSettings: () => void;
  onOpenLiveVision: () => void;
  onOpenApkModal: () => void;
}

const STARTER_PROMPTS = [
  'बच्चा की तरह बिल्कुल आसान भाषा में कुछ नया सिखाओ',
  'फ्री 3D वीडियो बनाने के लिए अच्छा प्रॉम्प्ट दो',
  'आज की ज़रूरी जानकारी और मौसम बताओ',
];

export const PoeBotCard: React.FC<PoeBotCardProps> = ({
  activeModelPreset,
  groundingMode,
  isStandingMode,
  isThemeAudioPlaying,
  hasMessages,
  ownerCallout = 'Master Ajay',
  onQuickPrompt,
  onOpenVoiceSettings,
  onOpenLiveVision,
  onOpenApkModal,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [soundStatus, setSoundStatus] = useState<'idle' | 'loading' | 'playing' | 'missing'>('idle');
  const [soundNotice, setSoundNotice] = useState<string | null>(null);
  const [avatarFailed, setAvatarFailed] = useState(false);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }
    };
  }, []);

  const stopCustomAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setSoundStatus('idle');
  };

  const handleToggleCustomSound = async () => {
    if (soundStatus === 'playing') {
      stopCustomAudio();
      return;
    }

    setSoundNotice(null);
    setSoundStatus('loading');

    try {
      // On HTTP/HTTPS, SPA servers may return index.html (200 text/html) for missing files.
      if (typeof window !== 'undefined' && window.location.protocol.startsWith('http')) {
        try {
          const headRes = await fetch(CUSTOM_SOUND_FILE_PATH, { method: 'HEAD' });
          const cType = (headRes.headers.get('content-type') || '').toLowerCase();
          if (!headRes.ok || cType.includes('text/html')) {
            setSoundStatus('missing');
            setSoundNotice(
              `Audio file "${CUSTOM_SOUND_FILE_PATH}" was not found. Add ${CUSTOM_SOUND_FILE_PATH} to the public/ folder to play it.`
            );
            return;
          }
        } catch {
          // Proceed to Audio element check if HEAD is blocked
        }
      }

      if (!audioRef.current) {
        audioRef.current = new Audio(CUSTOM_SOUND_FILE_PATH);
      } else {
        audioRef.current.src = CUSTOM_SOUND_FILE_PATH;
      }

      const audio = audioRef.current;
      audio.onended = () => setSoundStatus('idle');
      audio.onerror = () => {
        setSoundStatus('missing');
        setSoundNotice(
          `Audio file "${CUSTOM_SOUND_FILE_PATH}" could not be played because the file is missing or unreadable.`
        );
      };

      await audio.play();
      setSoundStatus('playing');
    } catch {
      setSoundStatus('missing');
      setSoundNotice(
        `Audio file "${CUSTOM_SOUND_FILE_PATH}" is missing or blocked. Place ${CUSTOM_SOUND_FILE_PATH} in public/ and tap Sound Button again.`
      );
    }
  };

  const groundingLabel =
    groundingMode === 'maps'
      ? 'Maps Grounded'
      : groundingMode === 'search'
      ? 'Web Search'
      : 'Auto Mode';

  return (
    <section
      aria-label="Bot overview and controls"
      className="w-full max-w-3xl mx-auto rounded-2xl bg-[#0d121f] border border-slate-800 p-4 sm:p-5 space-y-4"
    >
      {/* Bot Avatar + Title + Unboxed Metadata Line */}
      <div className="flex items-start gap-3.5">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden border border-[#ffd700]/60 bg-slate-900 shrink-0 flex items-center justify-center">
          {avatarFailed ? (
            <span className="font-chakra font-black text-base text-[#ffd700]">JB</span>
          ) : (
            <img
              src="./person-ai-assistant.png"
              alt="Mr Jarvis Sheru Bhai Myra Beast"
              referrerPolicy="no-referrer"
              onError={() => setAvatarFailed(true)}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-1">
          <h2 className="font-chakra font-bold text-base sm:text-lg text-slate-100 leading-snug">
            Mr Jarvis Sheru Bhai Myra Beast Voice Assistant
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Active: <span className="text-[#ffd700] font-medium">{activeModelPreset.label}</span>
            {' · '}
            <span>{groundingLabel}</span>
            {isStandingMode ? (
              <>
                {' · '}
                <span className="text-amber-300 font-semibold">Standing Mode</span>
              </>
            ) : null}
          </p>
          <p className="text-xs text-slate-400">
            <span className="text-[#ffd700] font-medium">{ownerCallout}</span> के लिए छोटा, साफ़ और दमदार वॉइस व चैट असिस्टेंट।
          </p>
        </div>
      </div>

      {/* Prominent Dedicated Sound Button (AUD-20261120-WA0000.mp3) + Clean Utility Row */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={handleToggleCustomSound}
          title={`Play or stop ${CUSTOM_SOUND_FILE_PATH}`}
          className={`min-h-[44px] px-4 py-2 rounded-xl font-chakra font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer flex-1 sm:flex-initial ${
            soundStatus === 'playing'
              ? 'bg-emerald-400 text-slate-950 border border-emerald-300'
              : soundStatus === 'missing'
              ? 'bg-rose-950/80 hover:bg-rose-900/80 text-rose-200 border border-rose-500/60'
              : 'bg-[#ffd700] hover:bg-amber-300 text-[#07090e] border border-[#ffd700]'
          }`}
        >
          {soundStatus === 'playing' ? (
            <>
              <Square className="w-4 h-4 fill-current shrink-0" />
              <span className="whitespace-nowrap">Stop Sound (Playing)</span>
            </>
          ) : soundStatus === 'loading' ? (
            <>
              <Volume2 className="w-4 h-4 shrink-0" />
              <span className="whitespace-nowrap">Loading Sound...</span>
            </>
          ) : soundStatus === 'missing' ? (
            <>
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span className="whitespace-nowrap">Sound Missing · Retry</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4 shrink-0" />
              <span className="whitespace-nowrap">Sound Button</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            soundEffects.playBeep();
            onOpenVoiceSettings();
          }}
          className="min-h-[44px] px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
        >
          <AudioLines className="w-4 h-4 text-[#ffd700] shrink-0" />
          <span>{isThemeAudioPlaying ? 'Voice ON' : 'Voice Studio'}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            soundEffects.playJarvisWake();
            onOpenLiveVision();
          }}
          className="min-h-[44px] px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
        >
          <Camera className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>Live Camera</span>
        </button>

        <button
          type="button"
          onClick={() => {
            soundEffects.playJarvisWake();
            onOpenApkModal();
          }}
          className="min-h-[44px] px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-emerald-300 text-xs font-medium flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
        >
          <Smartphone className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>APK / AAB</span>
        </button>
      </div>

      {/* Explicit Missing File Notice for AUD-20261120-WA0000.mp3 */}
      {soundNotice && (
        <div
          role="alert"
          className="px-3 py-2.5 rounded-xl bg-rose-950/75 border border-rose-500/50 text-rose-100 text-xs flex items-center justify-between gap-2"
        >
          <div className="flex items-center gap-2 min-w-0">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span className="leading-snug">{soundNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setSoundNotice(null)}
            aria-label="Dismiss audio message"
            className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg hover:bg-rose-900/60 text-rose-300 shrink-0 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Clean Starter Prompts when Chat is Empty */}
      {!hasMessages && (
        <div className="pt-2 border-t border-slate-800/80 space-y-2">
          <p className="text-[11px] text-slate-500 font-medium">Try asking</p>
          <div className="flex flex-col sm:flex-row flex-wrap gap-2">
            {STARTER_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => {
                  soundEffects.playBeep();
                  onQuickPrompt(prompt);
                }}
                className="min-h-[44px] px-3 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-[#ffd700]/50 text-xs text-slate-200 flex items-center justify-between gap-2 text-left transition-colors cursor-pointer"
              >
                <span className="truncate">{prompt}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
