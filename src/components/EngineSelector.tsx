import React from 'react';
import { Sparkles, Zap, Bot, Brain } from 'lucide-react';
import { EngineType } from '../types';
import { soundEffects } from '../utils/audio';

interface EngineSelectorProps {
  currentEngine: EngineType;
  onSelectEngine: (engine: EngineType) => void;
}

export const EngineSelector: React.FC<EngineSelectorProps> = ({
  currentEngine,
  onSelectEngine,
}) => {
  const engines: { id: EngineType; label: string; icon: any; color: string; desc: string }[] = [
    {
      id: 'auto',
      label: 'Auto Beast',
      icon: Sparkles,
      color: 'from-amber-400 to-yellow-500',
      desc: 'Smartest Hybrid • Best for Aijay Boss',
    },
    {
      id: 'gemini',
      label: 'Gemini 3.8 Flash',
      icon: Zap,
      color: 'from-cyan-400 to-blue-500',
      desc: 'Ultra Fast Multimodal & Maths',
    },
    {
      id: 'chatgpt',
      label: 'ChatGPT Secretary',
      icon: Bot,
      color: 'from-emerald-400 to-teal-500',
      desc: 'Witty, Conversational & Polite',
    },
    {
      id: 'claude',
      label: 'Claude Thinker',
      icon: Brain,
      color: 'from-purple-400 to-indigo-500',
      desc: 'Deep Academic Logic & Proofs',
    },
  ];

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
      <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold pl-1 hidden sm:inline whitespace-nowrap">
        Engine:
      </span>
      {engines.map((eng) => {
        const Icon = eng.icon;
        const isActive = currentEngine === eng.id;
        return (
          <button
            key={eng.id}
            onClick={() => {
              soundEffects.playBeep();
              onSelectEngine(eng.id);
            }}
            className={`group relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap border ${
              isActive
                ? 'bg-slate-800 text-white border-amber-400/80 shadow-md shadow-amber-500/10'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <div
              className={`p-1 rounded-lg ${
                isActive
                  ? `bg-gradient-to-tr ${eng.color} text-slate-950`
                  : 'bg-slate-800 text-slate-400 group-hover:text-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
            </div>
            <span>{eng.label}</span>
            {isActive && (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            )}
          </button>
        );
      })}
    </div>
  );
};
