import React from 'react';
import { Mic, MicOff, Volume2, Sparkles, Radio } from 'lucide-react';
import { soundEffects } from '../utils/audio';

interface VoiceAssistantHUDProps {
  isListening: boolean;
  isSpeaking: boolean;
  isProcessing: boolean;
  onToggleMic: () => void;
  onStopSpeech: () => void;
}

export const VoiceAssistantHUD: React.FC<VoiceAssistantHUDProps> = ({
  isListening,
  isSpeaking,
  isProcessing,
  onToggleMic,
  onStopSpeech,
}) => {
  return (
    <div className="relative py-2 px-3 sm:px-4 rounded-2xl bg-gradient-to-r from-[#0b101e]/90 via-[#0e1629]/90 to-[#0b101e]/90 border border-amber-500/30 shadow-xl shadow-black/50 backdrop-blur-md">
      <div className="flex items-center justify-between gap-3">
        {/* Assistant Status & Visualizer */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => {
              soundEffects.playJarvisWake();
            }}
            className={`relative w-11 h-11 rounded-xl overflow-hidden cursor-pointer transition-all border-2 ${
              isListening
                ? 'border-red-500 shadow-lg shadow-red-500/30 scale-105'
                : isSpeaking
                ? 'border-cyan-400 shadow-lg shadow-cyan-400/30 scale-105 animate-beast-glow'
                : isProcessing
                ? 'border-amber-400 shadow-lg shadow-amber-400/30 animate-pulse'
                : 'border-amber-400/60 shadow-md shadow-amber-500/10'
            }`}
          >
            <img
              src="./person-ai-assistant.png"
              alt="Person AI Assistant (Sharu Bhai) Voice Engine"
              className="w-full h-full object-cover"
            />
            {isListening ? (
              <div className="absolute inset-0 bg-red-900/60 flex items-center justify-center">
                <Radio className="w-5 h-5 text-white animate-pulse" />
              </div>
            ) : isSpeaking ? (
              <div className="absolute inset-0 bg-cyan-950/40 flex items-center justify-center">
                <Volume2 className="w-5 h-5 text-cyan-300 animate-bounce" />
              </div>
            ) : null}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-chakra font-bold text-slate-200">
                {isListening
                  ? 'Listening to Master Ajay Boss (Rishikesh)...'
                  : isSpeaking
                  ? '🎙️ Jarvis & Myra Voice Engine Speaking'
                  : isProcessing
                  ? 'Computing Dynamic Solution (vivo V17)...'
                  : 'Jarvis & Myra Standing By for Master Ajay Boss'}
              </span>
            </div>

            {/* Sound waveform simulation */}
            <div className="flex items-center gap-1 h-3 mt-1">
              {[0.2, 0.4, 0.6, 0.8, 0.5, 0.3, 0.7, 0.9, 0.4].map((delay, idx) => (
                <span
                  key={idx}
                  className={`w-1 rounded-full transition-all duration-300 ${
                    isListening
                      ? 'bg-red-500 waveform-bar'
                      : isSpeaking
                      ? 'bg-cyan-400 waveform-bar'
                      : isProcessing
                      ? 'bg-amber-400 waveform-bar'
                      : 'bg-slate-700 h-1'
                  }`}
                  style={{
                    animationDelay: `${delay}s`,
                    height: isListening || isSpeaking || isProcessing ? undefined : '2px',
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {isSpeaking && (
            <button
              onClick={() => {
                soundEffects.playBeep();
                onStopSpeech();
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-xs font-semibold text-slate-200 transition-all"
            >
              Stop Voice
            </button>
          )}

          <button
            onClick={() => {
              soundEffects.playBeep();
              onToggleMic();
            }}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all active:scale-95 shadow-md ${
              isListening
                ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/30 animate-pulse'
                : 'bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 shadow-amber-500/20'
            }`}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            <span>{isListening ? 'Stop' : 'Voice Input'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
