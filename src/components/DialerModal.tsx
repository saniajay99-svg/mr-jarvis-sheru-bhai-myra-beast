import React, { useState } from 'react';
import {
  X,
  Phone,
  PhoneCall,
  Delete,
  User,
  Heart,
  ShieldAlert,
  BookOpen,
  ShieldCheck,
  Hand,
} from 'lucide-react';
import { soundEffects, speechManager } from '../utils/audio';

interface DialerModalProps {
  isOpen: boolean;
  onClose: () => void;
  ownerCallout?: string;
}

export const DialerModal: React.FC<DialerModalProps> = ({
  isOpen,
  onClose,
  ownerCallout = 'Master Ajay',
}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [callerNote, setCallerNote] = useState('');
  const [screenedSummary, setScreenedSummary] = useState<string | null>(null);
  const [takenOver, setTakenOver] = useState(false);

  if (!isOpen) return null;

  const handleDigit = (digit: string) => {
    soundEffects.playBeep();
    if (phoneNumber.length < 15) {
      setPhoneNumber((prev) => prev + digit);
    }
  };

  const handleDelete = () => {
    soundEffects.playBeep();
    setPhoneNumber((prev) => prev.slice(0, -1));
  };

  const handleCall = (numberToCall: string, name?: string) => {
    if (!numberToCall) return;
    soundEffects.playSuccessChime();
    const targetPhrase = name && /shiv\s*kumar/i.test(name) ? 'Hello Shiv Kumar' : name || numberToCall;
    speechManager.speak(`${ownerCallout}, ${targetPhrase} को कॉल लगा रहा हूँ।`);
    window.location.href = `tel:${numberToCall}`;
  };

  const handleScreenCallOrMessage = () => {
    const raw = callerNote.trim();
    if (!raw) return;
    soundEffects.playBeep();
    setTakenOver(false);

    const cleaned = raw.replace(/\s+/g, ' ').slice(0, 140);
    const summary = `अलर्ट ${ownerCallout}: मुख्य बात — "${cleaned}"। आप चाहें तो "खुद उठाएं" दबाकर तुरंत कंट्रोल ले सकते हैं।`;
    setScreenedSummary(summary);
    speechManager.speak(summary);
  };

  const handleTakeOver = () => {
    soundEffects.playJarvisWake();
    speechManager.stop();
    setTakenOver(true);
    setScreenedSummary(`असिस्टेंट की आवाज़ रोक दी गई है। कंट्रोल अब सीधे आपके हाथ में है, ${ownerCallout}!`);
  };

  const speedDials = [
    { name: 'Shiv Kumar', icon: User, number: '+919876543211', color: 'bg-amber-500/15 text-amber-300 border-amber-500/40' },
    { name: 'Ladu', icon: Heart, number: '+919876543210', color: 'bg-rose-500/15 text-rose-300 border-rose-500/40' },
    { name: 'Family Home', icon: BookOpen, number: '+919876543212', color: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40' },
    { name: 'Emergency', icon: ShieldAlert, number: '112', color: 'bg-red-500/15 text-red-300 border-red-500/40' },
  ];

  const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0b101d] border border-slate-700 rounded-2xl w-full max-w-sm overflow-hidden flex flex-col max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-[#0f1628]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/20 text-[#ffd700]">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-chakra font-bold text-base text-slate-100">
                Smart Call Screener &amp; Dialer
              </h3>
              <p className="text-[11px] text-slate-400">
                कॉल सार निकालें या सीधे खुद उठाएं
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              soundEffects.playBeep();
              onClose();
            }}
            aria-label="Close Dialer"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Smart Call Screener Card */}
          <div className="p-3 rounded-xl bg-[#07090e] border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-chakra font-bold text-[#ffd700] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                Smart Call Screener
              </span>
              <button
                type="button"
                onClick={handleTakeOver}
                className={`min-h-[36px] px-3 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors ${
                  takenOver
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-[#ffd700] hover:bg-amber-300 text-[#07090e]'
                }`}
              >
                <Hand className="w-3.5 h-3.5" />
                <span>{takenOver ? 'कंट्रोल आपके पास' : 'खुद उठाएं (Take Over)'}</span>
              </button>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={callerNote}
                onChange={(e) => setCallerNote(e.target.value)}
                placeholder="कॉलर या मैसेज की बात यहाँ लिखें..."
                className="flex-1 min-h-[44px] px-3 rounded-xl bg-[#0e1424] border border-slate-700 focus:border-[#ffd700] text-xs text-slate-100 placeholder-slate-500 outline-none font-hindi"
              />
              <button
                type="button"
                onClick={handleScreenCallOrMessage}
                disabled={!callerNote.trim()}
                className="min-h-[44px] px-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-bold text-xs cursor-pointer shrink-0"
              >
                सार निकालें
              </button>
            </div>

            {screenedSummary && (
              <p className="text-xs text-amber-200 leading-relaxed font-hindi">
                {screenedSummary}
              </p>
            )}
          </div>

          {/* Quick Speed Dial Row */}
          <div>
            <span className="text-[11px] font-medium text-slate-400 block mb-2">
              Speed Dial
            </span>
            <div className="grid grid-cols-2 gap-2">
              {speedDials.map((sd, i) => {
                const Icon = sd.icon;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleCall(sd.number, sd.name)}
                    className={`min-h-[44px] flex items-center gap-2 p-2.5 rounded-xl border ${sd.color} transition-all text-xs font-semibold cursor-pointer`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{sd.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Number Display */}
          <div className="relative">
            <div className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-3 text-center text-xl font-mono font-bold tracking-widest text-amber-300 min-h-[50px] flex items-center justify-center">
              {phoneNumber || <span className="text-slate-600 font-normal text-sm">Enter phone number...</span>}
            </div>
            {phoneNumber && (
              <button
                type="button"
                onClick={handleDelete}
                className="absolute right-2 top-1/2 -translate-y-1/2 min-h-[40px] min-w-[40px] flex items-center justify-center text-slate-400 hover:text-rose-400 cursor-pointer"
                title="Backspace"
              >
                <Delete className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Keypad Grid */}
          <div className="grid grid-cols-3 gap-2">
            {digits.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => handleDigit(d)}
                className="min-h-[46px] rounded-xl bg-slate-900/70 border border-slate-800 hover:border-amber-400/50 hover:bg-slate-800 text-slate-100 font-chakra font-bold text-lg active:scale-95 transition-all cursor-pointer"
              >
                {d}
              </button>
            ))}
          </div>

          {/* Call Trigger Button */}
          <button
            type="button"
            disabled={!phoneNumber}
            onClick={() => handleCall(phoneNumber)}
            className={`w-full min-h-[48px] py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
              phoneNumber
                ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 active:scale-95 cursor-pointer'
                : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
            }`}
          >
            <PhoneCall className="w-4 h-4" />
            Call Now
          </button>
        </div>
      </div>
    </div>
  );
};
