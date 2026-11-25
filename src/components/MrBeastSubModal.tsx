import React, { useEffect, useState } from 'react';
import { X, Youtube, Trophy, Crown, Sparkles, ExternalLink, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEffects, speechManager } from '../utils/audio';

interface MrBeastSubModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MrBeastSubModal: React.FC<MrBeastSubModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [countdown, setCountdown] = useState(5);
  const [hasSubscribed, setHasSubscribed] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCountdown(5);
      return;
    }

    // Blast celebratory confetti for Aijay Boss
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#06b6d4', '#ef4444', '#fbbf24'],
      });
    } catch (e) {}

    soundEffects.playSuccessChime();
    speechManager.speak("Aijay Boss! Five hundred million subscribers milestone! MrBeast YouTube channel auto redirection is ready!");

    // Timer countdown
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRedirect = () => {
    soundEffects.playSuccessChime();
    setHasSubscribed(true);
    const subUrl = 'https://www.youtube.com/@MrBeast?sub_confirmation=1';
    window.open(subUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0c0f1c] border-2 border-red-500/40 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl shadow-red-500/20 flex flex-col text-center">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-red-950/60 via-slate-900 to-amber-950/40">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-red-600/30 text-red-400">
              <Youtube className="w-5 h-5 fill-red-500 text-red-500" />
            </div>
            <div className="text-left">
              <h3 className="font-chakra font-bold text-base text-red-200">
                MrBeast 500M Celebration
              </h3>
              <p className="text-[11px] text-slate-400">
                Aijay Boss Exclusive Auto-Subscribe Hub
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
        <div className="p-6 space-y-5">
          {/* 500M Trophy Badge */}
          <div className="relative mx-auto w-36 h-36 rounded-2xl overflow-hidden border-2 border-amber-400 shadow-xl shadow-amber-500/20 p-1 bg-gradient-to-tr from-amber-600 via-yellow-400 to-cyan-400">
            <img
              src="./assets/aistudio/file_0000000006c08208b358c43353e457af_69c155c6.webp"
              alt="MrBeast, Master Ajay Boss & Person AI Assistant 500M Celebration"
              className="w-full h-full object-cover rounded-xl"
            />
            <div className="absolute top-1 right-1 p-1 rounded-full bg-amber-500 text-slate-950 shadow-md">
              <Crown className="w-4 h-4 fill-slate-950" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              500,000,000 Subscribers Trophy
            </div>
            <h2 className="text-xl font-chakra font-black tracking-wide text-white">
              MRBEAST YOUTUBE PORTAL
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed font-hindi px-4">
              Aijay Boss, your Jarvis Beast is directly linked with MrBeast! Subscribe with 1-click confirmation below:
            </p>
          </div>

          {/* Countdown & Action */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="text-xs text-slate-400">
              {countdown > 0 ? (
                <span>Auto-Redirect ready in <span className="text-amber-400 font-mono font-bold text-sm">{countdown}</span> seconds</span>
              ) : (
                <span className="text-emerald-400 font-medium">Ready for instant launch!</span>
              )}
            </div>

            <button
              onClick={handleRedirect}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 via-red-500 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-chakra font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 active:scale-95 transition-all cursor-pointer"
            >
              <Youtube className="w-5 h-5 fill-white" />
              <span>{hasSubscribed ? 'Subscribed! Visit Channel Again' : 'Subscribe to MrBeast Now'}</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>

          {hasSubscribed && (
            <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-400 font-semibold animate-in fade-in">
              <CheckCircle className="w-4 h-4" />
              <span>Redirecting Aijay Boss to YouTube...</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/60 text-[11px] text-slate-500">
          Official Link: youtube.com/@MrBeast?sub_confirmation=1
        </div>
      </div>
    </div>
  );
};
