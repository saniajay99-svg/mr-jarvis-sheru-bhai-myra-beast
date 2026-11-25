import React, { useState } from 'react';
import {
  ArrowLeft,
  ChevronDown,
  Menu,
  Trash2,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { AI_MODEL_PRESETS, AiModelPreset, AiModelPresetId } from '../types';
import { soundEffects } from '../utils/audio';

interface HeaderProps {
  selectedModelId: AiModelPresetId;
  onSelectModel: (preset: AiModelPreset) => void;
  onBack: () => void;
  hasActiveSubView?: boolean;
  isMuted: boolean;
  onToggleMute: () => void;
  onClearChat: () => void;
  messageCount: number;
  onOpenGemsMenu: () => void;
  onActivateSheruVoice?: () => void;
  isListening: boolean;
  isSpeaking: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  selectedModelId,
  onSelectModel,
  onBack,
  hasActiveSubView = false,
  isMuted,
  onToggleMute,
  onClearChat,
  messageCount,
  onOpenGemsMenu,
  onActivateSheruVoice,
  isListening,
  isSpeaking,
}) => {
  const [avatarFailed, setAvatarFailed] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-[#07090e]/95 backdrop-blur-md border-b border-slate-800/90 shrink-0">
      <div className="max-w-4xl mx-auto px-2 sm:px-4 h-14 flex items-center justify-between gap-2">
        {/* Left: Back Arrow + Active Bot Icon + Title + Quick Model Switcher */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0 flex-1">
          <button
            type="button"
            onClick={() => {
              soundEffects.playBeep();
              onBack();
            }}
            aria-label={hasActiveSubView ? 'Back to chat' : 'Open bot menu'}
            title={hasActiveSubView ? 'Back to Chat' : 'Back / Bot Menu'}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-slate-300 hover:text-[#ffd700] hover:bg-slate-900 transition-colors cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={() => {
              onActivateSheruVoice?.();
            }}
            title="Tap to speak with Sheru Bhai Voice"
            className={`relative w-9 h-9 rounded-full overflow-hidden border shrink-0 bg-slate-900 flex items-center justify-center cursor-pointer ${
              isListening
                ? 'border-rose-400'
                : isSpeaking
                ? 'border-[#ffd700]'
                : 'border-[#ffd700]/60'
            }`}
          >
            {avatarFailed ? (
              <span className="font-chakra font-black text-xs text-[#ffd700]">JB</span>
            ) : (
              <img
                src="./person-ai-assistant.png"
                alt="Mr Jarvis Sheru Bhai Myra Beast"
                referrerPolicy="no-referrer"
                onError={() => setAvatarFailed(true)}
                className="w-full h-full object-cover"
              />
            )}
          </button>

          <div className="min-w-0 flex-1">
            <h1 className="font-chakra font-bold text-xs sm:text-sm text-slate-100 truncate leading-tight">
              Mr Jarvis Sheru Bhai Myra Beast Voice Assistant
            </h1>

            <div className="relative inline-flex items-center max-w-full mt-0.5">
              <select
                aria-label="Switch AI model"
                value={selectedModelId}
                onChange={(e) => {
                  const chosen = AI_MODEL_PRESETS.find((m) => m.id === e.target.value);
                  if (chosen) {
                    soundEffects.playBeep();
                    onSelectModel(chosen);
                  }
                }}
                className="bg-transparent pr-5 text-[11px] sm:text-xs font-medium text-[#ffd700] hover:text-amber-200 appearance-none cursor-pointer focus:outline-none truncate max-w-[200px] sm:max-w-[260px]"
              >
                {AI_MODEL_PRESETS.map((preset) => (
                  <option
                    key={preset.id}
                    value={preset.id}
                    className="bg-[#0b101f] text-slate-100"
                  >
                    {preset.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-amber-300 pointer-events-none -ml-4 shrink-0" />
            </div>
          </div>
        </div>

        {/* Right: Clean Action Icons (Clear Chat, Mute/Unmute, Menu) */}
        <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
          <button
            type="button"
            onClick={() => {
              soundEffects.playBeep();
              onClearChat();
            }}
            disabled={messageCount === 0}
            aria-label="Clear chat history"
            title={messageCount > 0 ? `Clear chat (${messageCount})` : 'Chat is empty'}
            className={`min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl transition-colors ${
              messageCount > 0
                ? 'text-slate-300 hover:text-rose-300 hover:bg-slate-900 cursor-pointer'
                : 'text-slate-600 cursor-not-allowed'
            }`}
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => {
              soundEffects.playBeep();
              onToggleMute();
            }}
            aria-label={isMuted ? 'Unmute voice narration' : 'Mute voice narration'}
            title={isMuted ? 'Unmute Voice' : 'Mute Voice'}
            className={`min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl transition-colors cursor-pointer ${
              isMuted
                ? 'text-rose-400 hover:bg-slate-900'
                : 'text-cyan-300 hover:bg-slate-900'
            }`}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={() => {
              soundEffects.playBeep();
              onOpenGemsMenu();
            }}
            aria-label="Open Assistant Drawer"
            title="Modes, Gems & Settings"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-slate-300 hover:text-[#ffd700] hover:bg-slate-900 transition-colors cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
