import React, { useState, useEffect } from 'react';
import {
  Terminal,
  Rocket,
  Save,
  Trash2,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Cpu,
  Volume2,
  Send
} from 'lucide-react';
import { soundEffects } from '../utils/audio';

export interface SavedPromptPreset {
  id: string;
  label: string;
  prompt: string;
  isDefault?: boolean;
}

const DEFAULT_PRESETS: SavedPromptPreset[] = [
  {
    id: 'preset-landing',
    label: '⚡ Web Landing Page',
    prompt: 'Build a modern dark-mode landing page',
    isDefault: true,
  },
  {
    id: 'preset-autofix',
    label: '🛠️ Auto-Fix Bugs',
    prompt: 'Fix all CSS and JavaScript bugs instantly',
    isDefault: true,
  },
  {
    id: 'preset-python',
    label: '🐍 Python Automation',
    prompt: 'Write a clean Python automation script for mobile without TrebEdit',
    isDefault: true,
  },
  {
    id: 'preset-android',
    label: '📱 Android Voice Service',
    prompt: 'Show Android Voice Interaction Service setup for com.aijayboss.mrjarvisbeast',
    isDefault: true,
  },
];

const STORAGE_KEY = 'mr_jarvis_beast_saved_prompts_v1';

interface MasterPromptStudioProps {
  onRunInMainChat: (promptText: string) => void;
  isProcessingMain: boolean;
  onClose?: () => void;
}

export const MasterPromptStudio: React.FC<MasterPromptStudioProps> = ({
  onRunInMainChat,
  isProcessingMain,
}) => {
  const [promptText, setPromptText] = useState('');
  const [presets, setPresets] = useState<SavedPromptPreset[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as SavedPromptPreset[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore storage read error
    }
    return DEFAULT_PRESETS;
  });

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [statusNotice, setStatusNotice] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const [outputState, setOutputState] = useState<{
    visible: boolean;
    prompt: string;
    phase: 'processing' | 'done';
  }>({
    visible: false,
    prompt: '',
    phase: 'processing',
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
    } catch {
      // ignore storage write error
    }
  }, [presets]);

  useEffect(() => {
    if (!statusNotice) return;
    const timer = setTimeout(() => setStatusNotice(null), 3200);
    return () => clearTimeout(timer);
  }, [statusNotice]);

  const handleRunPrompt = () => {
    const trimmed = promptText.trim();
    if (!trimmed) {
      soundEffects.playBeep();
      setStatusNotice({
        type: 'error',
        text: 'मास्टर अजय Boss, कृपया पहले प्रॉम्प्ट दर्ज करें!',
      });
      return;
    }

    soundEffects.playJarvisWake();
    setStatusNotice(null);
    setOutputState({
      visible: true,
      prompt: trimmed,
      phase: 'processing',
    });

    // Execute directly in Jarvis & Myra Live Neural Core + Q-Top / A-Bottom stream
    onRunInMainChat(trimmed);

    setTimeout(() => {
      setOutputState((prev) =>
        prev.prompt === trimmed ? { ...prev, phase: 'done' } : prev
      );
      soundEffects.playSuccessChime();
    }, 1000);
  };

  const handleSavePreset = () => {
    const trimmed = promptText.trim();
    if (!trimmed) {
      soundEffects.playBeep();
      setStatusNotice({
        type: 'error',
        text: 'सेव करने के लिए पहले प्रॉम्प्ट बॉक्स में कुछ लिखें!',
      });
      return;
    }

    soundEffects.playSuccessChime();
    const shortLabel =
      trimmed.length > 22 ? `⭐ ${trimmed.substring(0, 20)}...` : `⭐ ${trimmed}`;

    const newPreset: SavedPromptPreset = {
      id: `custom-${Date.now()}`,
      label: shortLabel,
      prompt: trimmed,
      isDefault: false,
    };

    setPresets((prev) => [newPreset, ...prev]);
    setStatusNotice({
      type: 'success',
      text: 'प्रॉम्प्ट प्रेसेट सफलतापूर्वक सेव हो गया!',
    });
  };

  const handleLoadPreset = (preset: SavedPromptPreset) => {
    soundEffects.playBeep();
    setPromptText(preset.prompt);
    setStatusNotice({
      type: 'success',
      text: `प्रेसेट लोड हो गया: ${preset.label}`,
    });
  };

  const handleDeletePreset = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    soundEffects.playBeep();
    setPresets((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <section
      id="aiPromptHub"
      className="rounded-2xl bg-[#11131a] border-2 border-amber-400/80 p-4 sm:p-5 text-white font-mono shadow-[0_0_22px_rgba(255,215,0,0.22)] transition-all"
    >
      {/* Header Row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-400/15 border border-amber-400/60 flex items-center justify-center text-amber-300 shadow-inner">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-chakra font-black text-amber-300 tracking-wide flex items-center gap-1.5">
              <span>💬 MASTER AI PROMPT STUDIO</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-400/20 text-emerald-300 border border-emerald-400/40 uppercase">
                JARVIS &amp; MYRA
              </span>
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-400 font-hindi">
              अपने कस्टम प्रॉम्प्ट लिखें, सेव करें और एक क्लिक पर AI से काम करवाएं:
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            soundEffects.playBeep();
            setIsCollapsed((prev) => !prev);
          }}
          className="p-1.5 rounded-lg bg-slate-900 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 transition-colors cursor-pointer"
          title={isCollapsed ? 'Expand Prompt Studio' : 'Minimize Prompt Studio'}
        >
          {isCollapsed ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronUp className="w-4 h-4" />
          )}
        </button>
      </div>

      {!isCollapsed && (
        <div className="mt-3.5 space-y-3">
          {/* Custom Prompt Textarea */}
          <textarea
            id="customPromptText"
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            placeholder="यहाँ अपना कस्टम प्रॉम्प्ट लिखें (जैसे: Create a professional landing page for mobile...)"
            rows={3}
            className="w-full p-3 bg-[#07090e] border border-amber-400/70 focus:border-amber-300 focus:ring-2 focus:ring-amber-400/25 text-amber-200 placeholder-slate-500 rounded-xl outline-none resize-none text-xs sm:text-sm font-hindi transition-all"
          />

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2.5">
            <button
              type="button"
              onClick={handleRunPrompt}
              disabled={isProcessingMain}
              className="flex-1 py-2.5 px-4 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-400 disabled:opacity-60 text-slate-950 font-chakra font-black text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all cursor-pointer"
            >
              <Rocket className="w-4 h-4" />
              <span>🚀 RUN PROMPT</span>
            </button>

            <button
              type="button"
              onClick={handleSavePreset}
              className="flex-1 py-2.5 px-4 bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 text-slate-950 font-chakra font-black text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>💾 SAVE PRESET</span>
            </button>
          </div>

          {/* Inline Notification Banner (replaces window.alert cleanly) */}
          {statusNotice && (
            <div
              className={`px-3 py-2 rounded-xl border text-xs font-hindi flex items-center gap-2 animate-in fade-in duration-200 ${
                statusNotice.type === 'error'
                  ? 'bg-red-950/60 border-red-500/50 text-red-200'
                  : 'bg-emerald-950/60 border-emerald-400/50 text-emerald-200'
              }`}
            >
              {statusNotice.type === 'error' ? (
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              )}
              <span>{statusNotice.text}</span>
            </div>
          )}

          {/* Saved Presets List */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-slate-400 uppercase tracking-wider font-chakra font-bold">
              <span>SAVED PRESETS ({presets.length}):</span>
              <span className="text-[10px] text-amber-400/80 font-mono">
                1-Tap Load • Auto-Saved
              </span>
            </div>

            <div id="presetList" className="flex flex-wrap gap-1.5">
              {presets.map((preset) => (
                <div
                  key={preset.id}
                  onClick={() => handleLoadPreset(preset)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleLoadPreset(preset);
                    }
                  }}
                  title={preset.prompt}
                  className="group inline-flex items-center gap-1.5 bg-[#1b1f2b] hover:bg-[#252a3a] border border-amber-400/60 hover:border-amber-300 text-amber-300 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer active:scale-95"
                >
                  <span>{preset.label}</span>
                  {!preset.isDefault && (
                    <button
                      type="button"
                      onClick={(e) => handleDeletePreset(preset.id, e)}
                      className="text-slate-500 hover:text-red-400 transition-colors p-0.5 rounded"
                      title="Delete Preset"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Prompt Output Console Box */}
          {outputState.visible && (
            <div
              id="promptOutput"
              className="p-3 rounded-xl bg-black/95 border border-emerald-400/40 text-xs text-emerald-300 space-y-1.5 shadow-inner animate-in fade-in duration-200"
            >
              <div className="flex items-center gap-2 text-amber-300 font-semibold">
                <Cpu className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                <span>
                  ⚙️ प्रोसेसिंग प्रॉम्प्ट: &ldquo;{outputState.prompt}&rdquo;
                </span>
              </div>
              <div className="flex items-center gap-2 text-cyan-300">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>🤖 Jarvis &amp; Myra Core एक्टिव हो रहा है...</span>
              </div>
              {outputState.phase === 'done' && (
                <div className="pt-1 border-t border-slate-800 flex items-center justify-between gap-2 text-emerald-300 font-bold">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    ✅ सफलता! प्रॉम्प्ट लाइव AI इंजन में निष्पादित (Execute) हो गया — नीचे Answer देखें।
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] text-amber-300 shrink-0">
                    <Volume2 className="w-3 h-3" /> Auto-Voice
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Quick One-Tap Execute Tip */}
          <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800/80">
            <span className="flex items-center gap-1">
              <Send className="w-3 h-3 text-amber-400" />
              vivo V17 Studio Mode • Question TOP / Answer BOTTOM Live Sync
            </span>
            <span className="text-amber-400/80 font-mono">com.aijayboss.mrjarvisbeast</span>
          </div>
        </div>
      )}
    </section>
  );
};
