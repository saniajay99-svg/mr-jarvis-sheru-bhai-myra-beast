import React, { useRef } from 'react';
import { 
  Camera, 
  Image as ImageIcon,
  Video, 
  FileText, 
  Share2, 
  Phone, 
  Youtube, 
  Clock, 
  Sparkles, 
  X,
  Check,
  Flame,
  BatteryCharging,
  Eye,
  Scan,
  Smartphone,
  Film,
  ShoppingBag,
  Sliders,
  Terminal,
  Hammer,
  Globe,
  MapPin,
  Radar,
  AudioLines,
  Layers
} from 'lucide-react';
import { EngineType, GroundingMode, MediaAttachment, PrecisionType } from '../types';
import { soundEffects } from '../utils/audio';

interface ActionTileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onAttachMedia: (attachment: MediaAttachment) => void;
  onOpenLiveVision: () => void;
  onOpenDialer: () => void;
  onOpenMrBeast: () => void;
  onOpenClock: () => void;
  onShareWhatsApp: () => void;
  onToggleTorch?: () => void;
  onCheckBattery?: () => void;
  isTorchOn?: boolean;
  currentEngine: EngineType;
  onSelectEngine: (engine: EngineType) => void;
  onOpenFeaturesMatrix?: () => void;
  onOpenApkModal?: () => void;
  onOpenPhotoToVideo?: () => void;
  onOpenMeesho?: () => void;
  onOpenPromptStudio?: () => void;
  onOpenAppBuilder?: () => void;
  currentPrecision?: PrecisionType;
  onSelectPrecision?: (prec: PrecisionType) => void;
  groundingMode?: GroundingMode;
  onChangeGroundingMode?: (mode: GroundingMode) => void;
  isStandingMode?: boolean;
  onToggleStandingMode?: () => void;
  onOpenVoiceSettings?: () => void;
  onOpenHomeOverlay?: () => void;
  onTriggerListenAdd?: () => void;
  onTriggerDaPlus?: () => void;
}

export const ActionTileMenu: React.FC<ActionTileMenuProps> = ({
  isOpen,
  onClose,
  onAttachMedia,
  onOpenLiveVision,
  onOpenDialer,
  onOpenMrBeast,
  onOpenClock,
  onShareWhatsApp,
  onToggleTorch,
  onCheckBattery,
  isTorchOn,
  currentEngine,
  onSelectEngine,
  onOpenFeaturesMatrix,
  onOpenApkModal,
  onOpenPhotoToVideo,
  onOpenMeesho,
  onOpenPromptStudio,
  onOpenAppBuilder,
  currentPrecision = 'balanced',
  onSelectPrecision,
  groundingMode = 'auto',
  onChangeGroundingMode,
  isStandingMode = false,
  onToggleStandingMode,
  onOpenVoiceSettings,
  onOpenHomeOverlay,
  onTriggerListenAdd,
  onTriggerDaPlus,
}) => {
  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video' | 'pdf') => {
    const file = e.target.files?.[0];
    if (!file) return;

    soundEffects.playBeep();
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      onAttachMedia({
        base64,
        mimeType: file.type || (type === 'pdf' ? 'application/pdf' : type === 'video' ? 'video/mp4' : 'image/jpeg'),
        name: file.name,
        type,
        sizeFormatted: `${sizeMB} MB`,
      });
      soundEffects.playSuccessChime();
      onClose();
    };
    reader.readAsDataURL(file);
    e.target.value = ''; // Reset input
  };

  const actionTiles = [
    {
      id: 'app-builder',
      title: 'AI App Builder',
      subtitle: 'Generate Live Mobile Web Apps',
      icon: Hammer,
      color: 'from-[#ffd700] via-amber-400 to-yellow-300 text-[#07090e] shadow-lg shadow-amber-500/25',
      badge: 'WWW CORE ⚡',
      onClick: () => {
        soundEffects.playJarvisWake();
        onClose();
        onOpenAppBuilder?.();
      },
    },
    {
      id: 'prompt-studio',
      title: 'AI Prompt Studio',
      subtitle: 'Write, Save & Run Custom Prompts',
      icon: Terminal,
      color: 'from-amber-400 via-yellow-400 to-emerald-400 text-slate-950 shadow-lg shadow-amber-500/25',
      badge: 'STUDIO 💬',
      onClick: () => {
        soundEffects.playJarvisWake();
        onClose();
        onOpenPromptStudio?.();
      },
    },
    {
      id: 'photo-to-video',
      title: 'Free 3D Video',
      subtitle: '2 Photos + Prompt + Song',
      icon: Film,
      color: 'from-amber-400 via-rose-500 to-cyan-400 text-slate-950 shadow-lg shadow-rose-500/25',
      badge: '3D PROMPT',
      onClick: () => {
        soundEffects.playJarvisWake();
        onClose();
        onOpenPhotoToVideo?.();
      },
    },
    ...(onTriggerListenAdd
      ? [
          {
            id: 'listen-add',
            title: 'Listen Add',
            subtitle: 'Play Sound / Song Cue',
            icon: AudioLines,
            color: 'from-emerald-400 to-cyan-400 text-slate-950',
            badge: 'LISTEN ADD',
            onClick: () => {
              soundEffects.playBeep();
              onClose();
              onTriggerListenAdd();
            },
          },
        ]
      : []),
    ...(onTriggerDaPlus
      ? [
          {
            id: 'da-plus',
            title: 'D A plus',
            subtitle: 'D A plus Quick Action',
            icon: Sparkles,
            color: 'from-[#ffd700] to-amber-500 text-slate-950',
            badge: 'D A PLUS',
            onClick: () => {
              soundEffects.playJarvisWake();
              onClose();
              onTriggerDaPlus();
            },
          },
        ]
      : []),
    {
      id: 'meesho-marketplace',
      title: 'Meesho Royal Grid',
      subtitle: '12 VIP Deals & Hardware Hub',
      icon: ShoppingBag,
      color: 'from-amber-400 via-yellow-400 to-cyan-400 text-slate-950 shadow-lg shadow-amber-500/25',
      badge: 'MEESHO VIP',
      onClick: () => {
        soundEffects.playJarvisWake();
        onClose();
        onOpenMeesho?.();
      },
    },
    {
      id: 'live-vision',
      title: 'Live Camera',
      subtitle: 'Camera View & Live Help',
      icon: Eye,
      color: 'from-amber-400 via-yellow-400 to-cyan-400 text-slate-950 shadow-lg shadow-amber-500/25',
      badge: 'CAMERA',
      onClick: () => {
        soundEffects.playJarvisWake();
        onClose();
        onOpenLiveVision();
      },
    },
    ...(onOpenVoiceSettings
      ? [
          {
            id: 'voice-studio',
            title: 'Voice Studio',
            subtitle: 'Sheru Bhai, Myra & Mic Check',
            icon: AudioLines,
            color: 'from-[#ffd700] to-amber-500 text-slate-950',
            badge: 'VOICE',
            onClick: () => {
              soundEffects.playJarvisWake();
              onClose();
              onOpenVoiceSettings();
            },
          },
        ]
      : []),
    ...(onOpenHomeOverlay
      ? [
          {
            id: 'home-overlay',
            title: 'Floating Bubble',
            subtitle: 'Home Overlay Mode',
            icon: Layers,
            color: 'from-cyan-500 to-amber-400 text-slate-950',
            badge: 'HOME BUBBLE',
            onClick: () => {
              soundEffects.playJarvisWake();
              onClose();
              onOpenHomeOverlay();
            },
          },
        ]
      : []),
    {
      id: 'photo',
      title: 'Photo / Album Gallery',
      subtitle: 'Upload Homework & Diagrams',
      icon: ImageIcon,
      color: 'from-amber-500 to-yellow-400 text-slate-950',
      badge: 'Gallery AI',
      onClick: () => {
        soundEffects.playBeep();
        photoInputRef.current?.click();
      },
    },
    {
      id: 'video',
      title: 'Video Upload',
      subtitle: 'Clips & Media Analysis',
      icon: Video,
      color: 'from-cyan-500 to-blue-500 text-white',
      badge: 'Gemini Video',
      onClick: () => {
        soundEffects.playBeep();
        videoInputRef.current?.click();
      },
    },
    {
      id: 'document',
      title: 'Document / PDF',
      subtitle: 'Notes, PDF & Syllabus',
      icon: FileText,
      color: 'from-emerald-500 to-teal-400 text-slate-950',
      badge: 'Academic Doc',
      onClick: () => {
        soundEffects.playBeep();
        docInputRef.current?.click();
      },
    },
    {
      id: 'whatsapp',
      title: 'WhatsApp Share',
      subtitle: 'Share Solution to Chat',
      icon: Share2,
      color: 'from-green-500 to-emerald-600 text-white',
      badge: '1-Tap Share',
      onClick: () => {
        soundEffects.playBeep();
        onClose();
        onShareWhatsApp();
      },
    },
    {
      id: 'dialer',
      title: 'Smart Call Screener',
      subtitle: 'Call Alert & Take Over',
      icon: Phone,
      color: 'from-blue-600 to-indigo-500 text-white',
      badge: 'CALL SCREEN',
      onClick: () => {
        soundEffects.playBeep();
        onClose();
        onOpenDialer();
      },
    },
    {
      id: 'mrbeast',
      title: 'YouTube MrBeast',
      subtitle: '500M Auto-Subscribe',
      icon: Youtube,
      color: 'from-red-600 to-rose-500 text-white',
      badge: '500M Portal',
      onClick: () => {
        soundEffects.playBeep();
        onClose();
        onOpenMrBeast();
      },
    },
    {
      id: 'clock',
      title: 'Real-Time Clock',
      subtitle: 'IST Atomic & Freedom',
      icon: Clock,
      color: 'from-amber-400 to-orange-500 text-slate-950',
      badge: 'Live IST',
      onClick: () => {
        soundEffects.playBeep();
        onClose();
        onOpenClock();
      },
    },
    {
      id: 'flashlight',
      title: isTorchOn ? 'Torch ON' : 'Phone Flashlight',
      subtitle: isTorchOn ? 'Tap to turn OFF' : 'Toggle Real Phone Torch',
      icon: Flame,
      color: isTorchOn ? 'from-amber-400 to-yellow-300 text-slate-950 animate-pulse' : 'from-yellow-500 to-amber-600 text-slate-950',
      badge: isTorchOn ? 'ACTIVE ⚡' : 'Hardware Torch',
      onClick: () => {
        soundEffects.playJarvisWake();
        onClose();
        onToggleTorch?.();
      },
    },
    {
      id: 'battery',
      title: 'Battery Diagnostic',
      subtitle: 'Real-Time Phone Battery',
      icon: BatteryCharging,
      color: 'from-cyan-400 to-teal-500 text-slate-950',
      badge: 'Diagnostics',
      onClick: () => {
        soundEffects.playBeep();
        onClose();
        onCheckBattery?.();
      },
    },
    {
      id: 'features-matrix',
      title: '19 Features Matrix',
      subtitle: '100% Active Beast Capabilities',
      icon: Sparkles,
      color: 'from-amber-400 via-yellow-300 to-cyan-400 text-slate-950 shadow-md shadow-amber-500/20',
      badge: '100% ACTIVE ⚡',
      onClick: () => {
        soundEffects.playJarvisWake();
        onClose();
        onOpenFeaturesMatrix?.();
      },
    },
    {
      id: 'apk-export',
      title: 'Android APK Bundle',
      subtitle: 'Single-File Production Source',
      icon: Smartphone,
      color: 'from-emerald-400 via-teal-400 to-cyan-400 text-slate-950 shadow-md shadow-emerald-500/20',
      badge: 'APK READY 📱',
      onClick: () => {
        soundEffects.playJarvisWake();
        onClose();
        onOpenApkModal?.();
      },
    },
  ];

  const engines: { id: EngineType; label: string; desc: string; tag: string }[] = [
    { id: 'auto', label: 'Gemini Auto', desc: 'तेज़ व साफ़ प्राथमिकता', tag: 'Top' },
    { id: 'gemini', label: 'Gemini', desc: 'सीधा व तेज़ जवाब', tag: 'Fast' },
    { id: 'chatgpt', label: 'ChatGPT', desc: 'सरल बातचीत अंदाज़', tag: 'Chat' },
    { id: 'grok', label: 'Grok', desc: 'बेबाक व दमदार अंदाज़', tag: 'Bold' },
    { id: 'claude', label: 'Claude', desc: 'साफ़ व व्यवस्थित तर्क', tag: 'Logic' },
  ];

  return (
    <>
      {/* Hidden File Inputs */}
      <input
        ref={photoInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => handleFile(e, 'image')}
      />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={(e) => handleFile(e, 'video')}
      />
      <input
        ref={docInputRef}
        type="file"
        accept="application/pdf,.doc,.docx,.txt"
        className="hidden"
        onChange={(e) => handleFile(e, 'pdf')}
      />

      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Sheet / Popup Menu */}
      <div className="fixed bottom-0 left-0 right-0 z-50 max-w-lg mx-auto bg-[#0b101e] border-t-2 sm:border-2 sm:rounded-2xl border-amber-500/40 rounded-t-3xl shadow-2xl shadow-black p-4 pb-8 sm:pb-6 space-y-4 animate-in slide-in-from-bottom duration-300">
        
        {/* Header bar */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-chakra font-bold text-sm text-slate-100 tracking-wide">
                Aijay Boss Action Hub
              </h3>
              <p className="text-[10px] text-slate-400">
                Gemini & WhatsApp Style Quick Menu
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundEffects.playBeep();
              onClose();
            }}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 7 Core Action Grid Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[55vh] overflow-y-auto pr-1">
          {actionTiles.map((tile) => {
            const Icon = tile.icon;
            return (
              <button
                key={tile.id}
                onClick={tile.onClick}
                className="group relative flex flex-col items-start p-3 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-400/60 hover:bg-slate-800/80 transition-all text-left shadow-md active:scale-95"
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <div className={`p-2.5 rounded-xl bg-gradient-to-tr ${tile.color} shadow-md group-hover:scale-110 transition-transform`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                    {tile.badge}
                  </span>
                </div>

                <span className="font-chakra font-bold text-xs text-slate-100 group-hover:text-amber-200 transition-colors">
                  {tile.title}
                </span>
                <span className="text-[10px] text-slate-400 line-clamp-1">
                  {tile.subtitle}
                </span>
              </button>
            );
          })}
        </div>

        {/* Infinity Flash Multi-Engine Selector Row */}
        <div className="pt-2 border-t border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 font-chakra">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Infinity ♾️ Flash Multi-Engine (Ad-Free & Unlimited)
            </span>
            <span className="text-[10px] text-cyan-400 font-semibold bg-cyan-950/60 border border-cyan-500/30 px-1.5 py-0.5 rounded-full">
              Zero Limit ⚡
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
            {engines.map((eng) => {
              const isSelected = currentEngine === eng.id;
              return (
                <button
                  key={eng.id}
                  onClick={() => {
                    soundEffects.playBeep();
                    onSelectEngine(eng.id);
                  }}
                  className={`p-2 rounded-xl text-left border transition-all text-xs ${
                    isSelected
                      ? 'bg-amber-500/20 border-amber-400 text-amber-200 font-bold shadow-sm shadow-amber-500/20'
                      : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="truncate">{eng.label}</span>
                    {isSelected && <Check className="w-3 h-3 text-amber-400 shrink-0" />}
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="text-[9px] block text-slate-400 font-normal truncate">
                      {eng.desc}
                    </span>
                    <span className="text-[8px] px-1 py-0.2 rounded bg-amber-400/20 text-amber-300 font-mono shrink-0">
                      {eng.tag}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Feature 7: Smart Precision & Answer-Length Control */}
        <div className="pt-2 border-t border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5 font-chakra">
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              Smart Precision & Length Control
            </span>
            <span className="text-[9px] text-amber-300 font-mono bg-amber-500/15 border border-amber-500/30 px-1.5 py-0.2 rounded">
              Feature 7
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            {[
              { id: 'concise', label: 'Concise', sub: '1-2 Lines' },
              { id: 'balanced', label: 'Balanced', sub: 'Step-by-Step' },
              { id: 'rigorous', label: 'Rigorous', sub: 'Academic Proofs' },
            ].map((p) => {
              const isSelected = currentPrecision === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    soundEffects.playBeep();
                    onSelectPrecision?.(p.id as PrecisionType);
                  }}
                  className={`min-h-[44px] p-2 rounded-xl text-center border transition-all text-xs cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 font-bold shadow-sm shadow-cyan-500/20'
                      : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <div className="font-bold">{p.label}</div>
                  <span className="text-[9px] block text-slate-400 font-normal">
                    {p.sub}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Web Search / Maps Grounding & Standing Mode */}
        {(onChangeGroundingMode || onToggleStandingMode) && (
          <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
            {onChangeGroundingMode && (
              <div className="inline-flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800">
                {(['auto', 'search', 'maps'] as GroundingMode[]).map((gm) => (
                  <button
                    key={gm}
                    type="button"
                    onClick={() => {
                      soundEffects.playBeep();
                      onChangeGroundingMode(gm);
                    }}
                    className={`min-h-[36px] px-2.5 py-1 rounded-lg text-[11px] font-chakra font-bold flex items-center gap-1 transition-all cursor-pointer ${
                      groundingMode === gm
                        ? gm === 'maps'
                          ? 'bg-rose-500 text-white'
                          : gm === 'search'
                          ? 'bg-cyan-400 text-slate-950'
                          : 'bg-[#ffd700] text-[#07090e]'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {gm === 'search' && <Globe className="w-3 h-3" />}
                    {gm === 'maps' && <MapPin className="w-3 h-3" />}
                    <span className="capitalize">{gm}</span>
                  </button>
                ))}
              </div>
            )}

            {onToggleStandingMode && (
              <button
                type="button"
                onClick={() => {
                  soundEffects.playJarvisWake();
                  onToggleStandingMode();
                  onClose();
                }}
                className={`min-h-[38px] px-3 py-1 rounded-xl border text-xs font-chakra font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isStandingMode
                    ? 'bg-[#ffd700] text-[#07090e] border-[#ffd700]'
                    : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-200'
                }`}
              >
                <Radar className="w-3.5 h-3.5" />
                <span>{isStandingMode ? 'Standing Mode ON' : 'Standing Mode'}</span>
              </button>
            )}
          </div>
        )}

      </div>
    </>
  );
};
