import React from 'react';
import { 
  X, 
  Crown, 
  Terminal, 
  Code2, 
  BrainCircuit, 
  Mic2, 
  Eye, 
  Download, 
  Smartphone, 
  Sliders, 
  ShieldCheck, 
  Battery, 
  Flashlight, 
  Share2, 
  Sparkles,
  ChevronRight,
  Infinity as InfinityIcon,
  Radar,
  AudioLines,
  Lock
} from 'lucide-react';
import { EngineType } from '../types';
import { soundEffects } from '../utils/audio';

export interface GemMode {
  id: string;
  name: string;
  badge: string;
  description: string;
  icon: any;
  color: string;
  bgColor: string;
  borderColor: string;
  systemPromptModifier: string;
}

export const GEMS_MODES: GemMode[] = [
  {
    id: 'standing-mode-deep-scan',
    name: 'Standing Mode (कच्चा चिट्ठा)',
    badge: 'DEEP SCAN',
    description: 'Ultra-fast deep-analysis mode for Master Ajay Boss (Ladu). Delivers the complete jargon-free कच्चा चिट्ठा of any topic, riddle, object, or code.',
    icon: Radar,
    color: 'text-[#ffd700]',
    bgColor: 'bg-[#ffd700]/15',
    borderColor: 'border-[#ffd700]/70',
    systemPromptModifier: '[STANDING MODE ACTIVE] Switch immediately into ultra-fast deep-analysis & scanning mode for Master Ajay Boss (Ladu) in Rishikesh on vivo V17. Deliver a straightforward, complete, jargon-free कच्चा चिट्ठा breakdown with bold, royal structure.'
  },
  {
    id: 'beast-master',
    name: 'Mr Jarvis Myra Beast',
    badge: 'DUAL ENGINE',
    description: 'Master Ajay Boss (Ladu)’s supreme dual-engine AI assistant in Rishikesh. Direct vivo V17 phone controls & 20 core cyber superpowers.',
    icon: Crown,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/40',
    systemPromptModifier: 'Act as Mr Jarvis Myra Beast Voice Assistant, the elite dual-engine AI created exclusively for Master Ajay Boss (Ladu) in Rishikesh on vivo V17. Address him as Master Ajay Boss with royal respect and sharp execution.'
  },
  {
    id: 'myra-voice-engine',
    name: 'Myra Voice Engine (Dual)',
    badge: 'MYRA CORE',
    description: 'Myra’s sweet, natural and engaging vocal tone engine collaborating with Jarvis Neural Core for Master Ajay Boss.',
    icon: Mic2,
    color: 'text-fuchsia-300',
    bgColor: 'bg-gradient-to-r from-purple-500/20 to-fuchsia-500/10',
    borderColor: 'border-fuchsia-400/60',
    systemPromptModifier: 'Act as Myra, collaborating in perfect harmony with Jarvis as the dual-engine assistant for Master Ajay Boss in Rishikesh. Speak with sweet, crisp, intelligent tone and complete devotion to Master Ajay Boss.'
  },
  {
    id: 'sharu-bhai-assistant',
    name: 'Sharu Bhai (Person AI)',
    badge: 'LOGO ICON',
    description: 'The iconic stylish lion person AI assistant from the 500M Master Logo. Loyal guardian, bodyguard & witty advisor.',
    icon: Sparkles,
    color: 'text-yellow-300',
    bgColor: 'bg-gradient-to-r from-amber-500/20 to-yellow-500/10',
    borderColor: 'border-amber-400/70',
    systemPromptModifier: 'Act as Sharu Bhai, Master Ajay Boss’s elite Person AI Assistant and stylish bodyguard in white suit and dark shades from the 500M Subscribers Master Logo. Call him Master Ajay Boss with royal affection, swagger, absolute loyalty, and witty Hindi/English banter.'
  },
  {
    id: 'cyber-hud',
    name: 'Cyber Tactical HUD',
    badge: 'TACTICAL',
    description: 'Live device diagnostics, sensor telemetry, memory stats, and real-time network checks.',
    icon: Terminal,
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/40',
    systemPromptModifier: 'Act as a tactical cyber HUD assistant, giving concise, high-tech telemetry outputs.'
  },
  {
    id: 'code-architect',
    name: 'Code & APK Architect',
    badge: 'DEV PRO',
    description: 'Expert Android APK builder, TypeScript, React, Capacitor native bridges & bug crusher.',
    icon: Code2,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/40',
    systemPromptModifier: 'Act as elite Android & Full-Stack Architect delivering production-grade code.'
  },
  {
    id: 'deep-intelligence',
    name: 'Deep Intelligence Gem',
    badge: 'REASONING',
    description: 'Deep mathematical proofs, board exam derivations, philosophical inquiry & step-by-step logic.',
    icon: BrainCircuit,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/40',
    systemPromptModifier: 'Provide exhaustive step-by-step reasoning with formal academic precision.'
  },
  {
    id: 'voice-companion',
    name: 'Voice Companion Live',
    badge: 'CONVERSATIONAL',
    description: 'Ultra-fast colloquial Hindi/English voice companion with witty banter and jokes.',
    icon: Mic2,
    color: 'text-rose-400',
    bgColor: 'bg-rose-500/10',
    borderColor: 'border-rose-500/40',
    systemPromptModifier: 'Speak naturally, concisely, and warmly in a conversational Hinglish voice.'
  },
  {
    id: 'visual-auditor',
    name: 'Visual Auditor & OCR',
    badge: 'MULTIMODAL',
    description: 'Frame-by-frame live camera analysis, diagram inspection, and handwritten question solver.',
    icon: Eye,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/40',
    systemPromptModifier: 'Focus on visual analysis, diagram breakdown, and optical formula recognition.'
  }
];

interface GemsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeGemId: string;
  onSelectGem: (gem: GemMode) => void;
  currentEngine: EngineType;
  onSelectEngine: (engine: EngineType) => void;
  onOpenApkModal: () => void;
  onOpenDefaultAssistantBanner: () => void;
  onToggleTorch: () => void;
  isTorchOn: boolean;
  onBatteryCheck: () => void;
  onOpenVoiceSettings?: () => void;
  onLockGate?: () => void;
}

export const GemsDrawer: React.FC<GemsDrawerProps> = ({
  isOpen,
  onClose,
  activeGemId,
  onSelectGem,
  currentEngine,
  onSelectEngine,
  onOpenApkModal,
  onOpenDefaultAssistantBanner,
  onToggleTorch,
  isTorchOn,
  onBatteryCheck,
  onOpenVoiceSettings,
  onLockGate,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Side Drawer Content */}
      <div className="relative w-80 sm:w-96 max-w-[85vw] h-full bg-[#080d1a] border-r border-amber-500/30 flex flex-col z-10 shadow-2xl shadow-black overflow-hidden">
        {/* Drawer Header */}
        <div className="p-4 bg-gradient-to-r from-amber-950/60 via-[#0d1428] to-[#080d1a] border-b border-amber-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-cyan-500 p-0.5 shadow-md">
              <img
                src="./logo-combo.png"
                alt="Mr Jarvis Myra Beast & Person AI Assistant Logo"
                className="w-full h-full object-cover rounded-[10px]"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-chakra font-black text-sm text-slate-100 tracking-wider">
                  JARVIS &amp; MYRA
                </h3>
                <span className="text-[9px] px-1.5 py-0.2 bg-amber-400/20 text-amber-300 font-bold rounded border border-amber-400/30">
                  MASTER AJAY BOSS
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Dual-Engine AI Personas • Rishikesh
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick System Badge Bar */}
        <div className="px-4 py-2 bg-slate-950/70 border-b border-slate-800/80 flex items-center justify-between text-[11px]">
          <span className="text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-mono text-emerald-300">com.aijayboss.mrjarvisbeast</span>
          </span>
          <span className="text-[10px] text-amber-400 font-mono font-bold">
            v2.5 APK
          </span>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto custom-scroll p-4 space-y-5">
          {/* Section 1: Assistant Gems */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-chakra font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Select Assistant Gem
              </span>
              <span className="text-[10px] text-slate-500">6 Gems Active</span>
            </div>

            <div className="space-y-2">
              {GEMS_MODES.map((gem) => {
                const Icon = gem.icon;
                const isActive = activeGemId === gem.id;

                return (
                  <button
                    key={gem.id}
                    onClick={() => {
                      soundEffects.playBeep();
                      onSelectGem(gem);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-start gap-3 ${
                      isActive
                        ? `${gem.bgColor} ${gem.borderColor} shadow-md shadow-amber-500/10 ring-1 ring-amber-400/30`
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${gem.bgColor} ${gem.color} border ${gem.borderColor} shrink-0 mt-0.5`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className={`text-xs font-chakra font-bold tracking-wide truncate ${isActive ? 'text-amber-300' : 'text-slate-200'}`}>
                          {gem.name}
                        </span>
                        <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase tracking-wider ${
                          isActive ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {gem.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5 leading-snug">
                        {gem.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Infinity Flash Engine Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-chakra font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <InfinityIcon className="w-3.5 h-3.5 text-cyan-400" />
                Infinity Flash Core
              </span>
              <span className="text-[10px] text-cyan-400 font-mono">Zero Quota Lag</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {[
                { id: 'auto' as EngineType, label: 'Gemini Auto ⚡', desc: 'प्राथमिक तेज़ मोड' },
                { id: 'gemini' as EngineType, label: 'Gemini ♾️', desc: 'Multimodal' },
                { id: 'chatgpt' as EngineType, label: 'ChatGPT ♾️', desc: 'सरल व स्पष्ट' },
                { id: 'grok' as EngineType, label: 'Grok 🔥', desc: 'सीधा टू-द-पॉइंट' },
                { id: 'claude' as EngineType, label: 'Claude ♾️', desc: 'संतुलित तर्क' },
              ].map((engine) => {
                const isSelected = currentEngine === engine.id;
                return (
                  <button
                    key={engine.id}
                    onClick={() => {
                      soundEffects.playBeep();
                      onSelectEngine(engine.id);
                    }}
                    className={`min-h-[44px] p-2 rounded-xl border text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#ffd700]/15 border-[#ffd700] text-[#ffd700] shadow-sm'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="text-[11px] font-bold tracking-tight">{engine.label}</div>
                    <div className="text-[9px] text-slate-500">{engine.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Android System Integration Cards */}
          <div className="space-y-2">
            <span className="text-xs font-chakra font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-amber-400" />
              Android System Control
            </span>

            {/* Build Output & APK Card */}
            <button
              onClick={() => {
                soundEffects.playBeep();
                onOpenApkModal();
                onClose();
              }}
              className="w-full p-2.5 rounded-xl bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/40 hover:border-emerald-400 flex items-center justify-between text-left group transition-all"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                  <Download className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-chakra font-bold text-emerald-300">
                    build.output: APK Ready
                  </div>
                  <div className="text-[10px] text-slate-400">
                    com.aijayboss.mrjarvisbeast.apk
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Default Assistant Activation */}
            <button
              onClick={() => {
                soundEffects.playBeep();
                onOpenDefaultAssistantBanner();
                onClose();
              }}
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-amber-500/30 hover:border-amber-400/60 flex items-center justify-between text-left group transition-all"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                  <Crown className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-chakra font-bold text-amber-300">
                    Default Digital Assistant
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Configure long-press Home / Power button
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Quick Hardware & Voice Toggles */}
          <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-2">
            <button
              onClick={onToggleTorch}
              className={`min-h-[44px] p-2 rounded-xl border flex items-center justify-center gap-2 text-xs font-medium transition-all cursor-pointer ${
                isTorchOn 
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold' 
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <Flashlight className="w-4 h-4" />
              <span>{isTorchOn ? 'Torch ON' : 'Torch OFF'}</span>
            </button>

            <button
              onClick={onBatteryCheck}
              className="min-h-[44px] p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-300 flex items-center justify-center gap-2 text-xs font-medium transition-all cursor-pointer"
            >
              <Battery className="w-4 h-4 text-cyan-400" />
              <span>Battery HUD</span>
            </button>

            {onOpenVoiceSettings && (
              <button
                onClick={() => {
                  soundEffects.playBeep();
                  onOpenVoiceSettings();
                  onClose();
                }}
                className="min-h-[44px] p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-[#ffd700]/60 text-amber-200 flex items-center justify-center gap-2 text-xs font-medium transition-all cursor-pointer"
              >
                <AudioLines className="w-4 h-4 text-[#ffd700]" />
                <span>Voice Studio</span>
              </button>
            )}

            {onLockGate && (
              <button
                onClick={() => {
                  soundEffects.playBeep();
                  onLockGate();
                }}
                className="min-h-[44px] p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-rose-500/60 text-slate-200 flex items-center justify-center gap-2 text-xs font-medium transition-all cursor-pointer"
              >
                <Lock className="w-4 h-4 text-rose-400" />
                <span>Lock Screen</span>
              </button>
            )}
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800/80 text-center">
          <p className="text-[10px] text-slate-500">
            Dedicated exclusively to <span className="text-amber-300 font-semibold">Ajay Boss</span> • Mr Jarvis Sheru Bhai Myra Beast
          </p>
        </div>
      </div>
    </div>
  );
};
