import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Unlock,
  AlertCircle,
  UserCheck,
} from 'lucide-react';
import { soundEffects, speechManager, assistantThemeAudio, loadVoiceConfig } from '../utils/audio';

interface HumanIdGateProps {
  onVerified: (humanId: string) => void;
}

export const HumanIdGate: React.FC<HumanIdGateProps> = ({ onVerified }) => {
  const [humanId, setHumanId] = useState('Ajay Sani');
  const [validationError, setValidationError] = useState<string>('');
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [avatarFailed, setAvatarFailed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = humanId.trim();

    if (trimmed.length < 2) {
      soundEffects.playBeep();
      setValidationError('कृपया सही नाम या ID दर्ज करें (जैसे Ajay Sani या Shiv Kumar)।');
      return;
    }

    // Unlock audio engine on user gesture so voice greeting plays smoothly
    speechManager.unlockAudio();
    soundEffects.playJarvisWake();
    const voiceCfg = loadVoiceConfig();
    if (voiceCfg.themeEnabled && voiceCfg.autoPlayOnUnlock) {
      assistantThemeAudio.play();
    }

    setValidationError('');
    setIsUnlocking(true);

    setTimeout(() => {
      soundEffects.playSuccessChime();
      onVerified(trimmed);
    }, 320);
  };

  return (
    <div
      className={`min-h-[100dvh] w-full bg-[#07090e] text-slate-100 flex flex-col items-center justify-center px-4 py-6 sm:p-8 transition-all duration-300 ${
        isUnlocking ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
      }`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,215,0,0.1),transparent_55%)]"
      />

      <main className="relative z-10 w-full max-w-md rounded-3xl bg-[#0b0f18] border border-[#ffd700]/40 p-6 sm:p-8 space-y-6">
        <header className="text-center space-y-3">
          <div className="mx-auto w-20 h-20 rounded-2xl overflow-hidden border border-[#ffd700]/60 bg-slate-900 flex items-center justify-center">
            {avatarFailed ? (
              <ShieldCheck className="w-9 h-9 text-[#ffd700]" />
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

          <div className="inline-flex items-center justify-center gap-1.5 text-xs font-medium text-[#ffd700]">
            {isUnlocking ? (
              <Unlock className="w-4 h-4 text-emerald-400" />
            ) : (
              <Lock className="w-4 h-4 text-[#ffd700]" />
            )}
            <span>Owner Verification</span>
          </div>

          <h1 className="font-chakra font-bold text-xl sm:text-2xl text-slate-100 text-balance">
            Mr Jarvis Sheru Bhai Myra Beast
          </h1>

          <p className="text-xs text-slate-400 leading-relaxed">
            Ajay Sani → &ldquo;Master Ajay&rdquo; · Shiv Kumar → &ldquo;Hello Shiv Kumar&rdquo;
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="humanIdInput"
              className="block text-xs font-semibold text-[#ffd700]"
            >
              Account Name / ID
            </label>
            <input
              id="humanIdInput"
              type="text"
              autoComplete="name"
              value={humanId}
              onChange={(e) => {
                setHumanId(e.target.value);
                if (validationError) setValidationError('');
              }}
              placeholder="Ajay Sani या Shiv Kumar"
              className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-[#07090e] border border-slate-700 focus:border-[#ffd700] text-sm sm:text-base text-slate-100 placeholder-slate-500 outline-none transition-colors"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] text-slate-400">Account:</span>
            {['Ajay Sani', 'Shiv Kumar', 'Master Ajay'].map((presetName) => (
              <button
                key={presetName}
                type="button"
                onClick={() => {
                  soundEffects.playBeep();
                  setHumanId(presetName);
                  setValidationError('');
                }}
                className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer inline-flex items-center gap-1.5 ${
                  humanId.trim() === presetName
                    ? 'bg-[#ffd700]/20 border-[#ffd700] text-[#ffd700]'
                    : 'bg-[#111726] border-slate-800 text-slate-300 hover:border-[#ffd700]/50'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5 text-[#ffd700]" />
                <span>{presetName}</span>
              </button>
            ))}
          </div>

          {validationError && (
            <div
              role="alert"
              className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/50 text-rose-200 text-xs flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isUnlocking}
            className="w-full min-h-[48px] py-3 px-6 rounded-xl bg-[#ffd700] hover:bg-amber-300 disabled:opacity-70 text-[#07090e] font-chakra font-bold text-sm tracking-wide active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShieldCheck className="w-5 h-5" />
            <span>{isUnlocking ? 'Unlocking...' : 'Verify & Open Assistant'}</span>
          </button>
        </form>
      </main>
    </div>
  );
};
