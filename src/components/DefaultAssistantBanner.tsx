import React, { useState } from 'react';
import { 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Settings, 
  CheckCircle2, 
  ShieldCheck, 
  Smartphone, 
  Crown,
  Volume2
} from 'lucide-react';
import { soundEffects } from '../utils/audio';

interface DefaultAssistantBannerProps {
  onDismiss?: () => void;
}

export const DefaultAssistantBanner: React.FC<DefaultAssistantBannerProps> = ({ onDismiss }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const steps = [
    {
      step: 1,
      title: "Open Phone Settings",
      desc: "Go to your Android Settings (e.g. on vivo V17, Samsung, Pixel or Xiaomi)."
    },
    {
      step: 2,
      title: "Select 'Apps & Notifications' > 'Default Apps'",
      desc: "Navigate to 'Default apps' or search for 'Digital assistant app' in Settings search bar."
    },
    {
      step: 3,
      title: "Tap 'Digital Assistant App'",
      desc: "Select 'Mr Jarvis Beast' (Package: com.aijayboss.mrjarvisbeast) as the Default Assist App."
    },
    {
      step: 4,
      title: "Long-Press Home or Power Button",
      desc: "Instantly summon Mr Jarvis Beast with full voice STT & camera vision overlay ready for Aijay Boss!"
    }
  ];

  return (
    <div className="rounded-2xl bg-gradient-to-r from-amber-950/30 via-[#0e172a] to-blue-950/30 border border-amber-500/30 p-3 sm:p-3.5 shadow-lg transition-all">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/40">
            <Crown className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <h4 className="font-chakra font-bold text-xs sm:text-sm text-amber-200">
                Default Digital Assistant Activation
              </h4>
              <span className="text-[9px] px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 font-bold rounded border border-emerald-500/30">
                INTENT-FILTER READY
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Set <span className="text-amber-300 font-medium">Mr Jarvis Beast</span> as your primary phone assistant on Android
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => {
              soundEffects.playBeep();
              setIsExpanded(!isExpanded);
            }}
            className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 hover:border-amber-400/50 text-slate-300 text-xs flex items-center gap-1 active:scale-95 transition-all"
          >
            <span className="text-[11px] font-medium">{isExpanded ? 'Hide Steps' : 'Setup Guide'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-slate-800 animate-in fade-in space-y-2.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {steps.map((s) => (
              <div key={s.step} className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 font-chakra font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {s.step}
                </span>
                <div>
                  <div className="text-xs font-semibold text-slate-200">{s.title}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5 leading-snug">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-2 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between text-[11px] text-slate-300">
            <span className="flex items-center gap-1.5 text-emerald-300">
              <ShieldCheck className="w-4 h-4" />
              Manifest action: <code className="font-mono text-[10px]">android.intent.action.ASSIST</code> configured!
            </span>
            <span className="text-slate-400 text-[10px]">vivo V17 / Android 10+ compatible</span>
          </div>
        </div>
      )}
    </div>
  );
};
