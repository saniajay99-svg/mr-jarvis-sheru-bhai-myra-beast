import React, { useState, useEffect } from 'react';
import { X, Clock, Calendar, Volume2, Sparkles, Shield, Flame } from 'lucide-react';
import { soundEffects, speechManager } from '../utils/audio';

interface BeastClockModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BeastClockModal: React.FC<BeastClockModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  // Format IST time
  const istTimeString = currentTime.toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour12: true,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const istDateString = currentTime.toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Announce time with Jarvis Beast Voice
  const announceTime = () => {
    soundEffects.playJarvisWake();
    const announceMsg = `Aijay Boss! Is samay exact time hai ${istTimeString}. Date hai ${istDateString}. Aapka Jarvis Beast live active hai, chill kijiye aur masti kijiye!`;
    speechManager.speak(announceMsg);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#080d19] border-2 border-cyan-500/40 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl shadow-cyan-500/10 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-cyan-950/40 via-slate-900 to-amber-950/30">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-chakra font-bold text-base text-cyan-200">
                Beast Live Chronometer
              </h3>
              <p className="text-[11px] text-slate-400">
                Real-Time IST & Freedom Tracker for Aijay Boss
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
        <div className="p-6 space-y-6 text-center">
          {/* Big Neon Digital Clock */}
          <div className="p-5 rounded-2xl bg-black/70 border-2 border-cyan-500/50 shadow-lg shadow-cyan-500/20 relative overflow-hidden group">
            <div className="absolute top-2 right-3 text-[10px] font-mono text-cyan-400/70 uppercase tracking-widest flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              IST Live
            </div>
            <div className="text-4xl sm:text-5xl font-chakra font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-amber-200 to-yellow-400 font-mono py-2">
              {istTimeString}
            </div>
            <div className="text-xs sm:text-sm text-slate-300 flex items-center justify-center gap-1.5 font-medium mt-1">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>{istDateString}</span>
            </div>
          </div>

          {/* Post-Exam Beast Freedom Mode Status */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-amber-950/30 border border-amber-500/30 text-left space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-400" />
                Post-Exam Freedom Mode
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/40">
                100% UNLOCKED
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-hindi">
              Aijay Boss, exams are done and victory is yours! Jarvis Beast is in full chill mode—ask doubts, listen to jokes, and enjoy zero exam pressure!
            </p>
          </div>

          {/* Announce Button */}
          <button
            onClick={announceTime}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 via-cyan-500 to-amber-500 hover:from-cyan-500 hover:to-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 active:scale-95 transition-all cursor-pointer"
          >
            <Volume2 className="w-4 h-4" />
            Speak Time to Aijay Boss (Jarvis Voice)
          </button>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/60 text-center text-[11px] text-slate-500">
          Sync status: Real-time atomic clock sync • Dedicated to Aijay Boss
        </div>
      </div>
    </div>
  );
};
