import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  X,
  Volume2,
  Play,
  Pause,
  Music,
  Mic2,
  Sliders,
  Crown,
  Sparkles,
  CheckCircle2,
  Repeat,
  AudioLines,
  Mic,
  Square,
  Activity,
  RotateCcw,
  AlertCircle,
  Film,
} from 'lucide-react';
import {
  ASSISTANT_THEME_AUDIO_SRC,
  SHERU_BHAI_VIDEO_SRC,
  assistantThemeAudio,
  getSpeechRecognition,
  loadVoiceConfig,
  SignatureAudioState,
  soundEffects,
  speechManager,
  ThemeAudioSourceId,
  VoiceAudioConfig,
  VoicePresetId,
} from '../utils/audio';

interface VoiceSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isMuted: boolean;
  onSetMuted: (muted: boolean) => void;
  onSpeakSample?: (text: string) => void;
  onPresetApplied?: (presetId: VoicePresetId) => void;
}

const VOICE_PRESETS: Array<{
  id: VoicePresetId;
  label: string;
  subtitle: string;
  lang: string;
  rate: number;
  pitch: number;
  badge: string;
}> = [
  {
    id: 'sheru-bold',
    label: '🦁 Sheru Bhai (Person AI)',
    subtitle: 'Bold loyal Person AI Assistant voice',
    lang: 'hi-IN',
    rate: 1.03,
    pitch: 0.86,
    badge: 'PERSON AI',
  },
  {
    id: 'jarvis-royal',
    label: '👑 Jarvis Royal',
    subtitle: 'Deep authoritative Boss tone',
    lang: 'hi-IN',
    rate: 1.02,
    pitch: 0.94,
    badge: 'BOSS',
  },
  {
    id: 'myra-sweet',
    label: '✨ Myra Sweet',
    subtitle: 'Warm, crisp & melodic Hindi/EN',
    lang: 'hi-IN',
    rate: 1.06,
    pitch: 1.15,
    badge: 'MYRA',
  },
  {
    id: 'custom',
    label: '🎛️ Custom Studio',
    subtitle: 'Your manual pitch & speed curve',
    lang: 'hi-IN',
    rate: 1.04,
    pitch: 1.0,
    badge: 'PRO',
  },
];

function formatSeconds(sec: number): string {
  const safe = Math.max(0, Math.floor(sec || 0));
  const mins = Math.floor(safe / 60);
  const rem = safe % 60;
  return `${mins}:${rem.toString().padStart(2, '0')}`;
}

export const VoiceSettingsModal: React.FC<VoiceSettingsModalProps> = ({
  isOpen,
  onClose,
  isMuted,
  onSetMuted,
  onSpeakSample,
  onPresetApplied,
}) => {
  const [config, setConfig] = useState<VoiceAudioConfig>(() => loadVoiceConfig());
  const [audioState, setAudioState] = useState<SignatureAudioState>(() => assistantThemeAudio.getState());
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  // 5-Second Sheru-Bold Voice Diagnostic Panel state
  const [diagPhase, setDiagPhase] = useState<'idle' | 'recording' | 'processing' | 'ready' | 'playing_sheru' | 'playing_raw'>('idle');
  const [diagElapsedMs, setDiagElapsedMs] = useState(0);
  const [diagInputLevel, setDiagInputLevel] = useState(0);
  const [diagPeakLevel, setDiagPeakLevel] = useState(0);
  const [diagDurationSec, setDiagDurationSec] = useState(0);
  const [diagTranscript, setDiagTranscript] = useState('');
  const [diagError, setDiagError] = useState<string | null>(null);
  const [hasRecordedClip, setHasRecordedClip] = useState(false);
  const [isSheruVideoPlaying, setIsSheruVideoPlaying] = useState(false);

  const sheruVideoRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const recordedBufferRef = useRef<AudioBuffer | null>(null);
  const recordedUrlRef = useRef<string | null>(null);
  const activeSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const rawAudioRef = useRef<HTMLAudioElement | null>(null);
  const diagTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const diagAutoStopRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const diagRafRef = useRef<number | null>(null);
  const diagSpeechRecRef = useRef<any>(null);
  const diagChunksRef = useRef<Blob[]>([]);
  const diagStartTimeRef = useRef<number>(0);
  const peakLevelRef = useRef<number>(0);

  const stopDiagnosticPlayback = useCallback(() => {
    if (activeSourceRef.current) {
      try {
        activeSourceRef.current.stop();
        activeSourceRef.current.disconnect();
      } catch {}
      activeSourceRef.current = null;
    }
    if (rawAudioRef.current) {
      try {
        rawAudioRef.current.pause();
        rawAudioRef.current.currentTime = 0;
      } catch {}
    }
    assistantThemeAudio.setDucked(false);
    setDiagPhase((prev) => (prev === 'playing_sheru' || prev === 'playing_raw' ? 'ready' : prev));
  }, []);

  const cleanupRecordingHandles = useCallback(() => {
    if (diagTimerRef.current) {
      clearInterval(diagTimerRef.current);
      diagTimerRef.current = null;
    }
    if (diagAutoStopRef.current) {
      clearTimeout(diagAutoStopRef.current);
      diagAutoStopRef.current = null;
    }
    if (diagRafRef.current !== null) {
      cancelAnimationFrame(diagRafRef.current);
      diagRafRef.current = null;
    }
    if (diagSpeechRecRef.current) {
      try {
        diagSpeechRecRef.current.stop();
      } catch {}
      diagSpeechRecRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch {}
      });
      mediaStreamRef.current = null;
    }
    setDiagInputLevel(0);
  }, []);

  useEffect(() => {
    const unsub = assistantThemeAudio.subscribe(setAudioState);
    return unsub;
  }, []);

  useEffect(() => {
    if (!isOpen) {
      cleanupRecordingHandles();
      stopDiagnosticPlayback();
      if (sheruVideoRef.current) {
        try {
          sheruVideoRef.current.pause();
        } catch {}
      }
      setIsSheruVideoPlaying(false);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        try {
          mediaRecorderRef.current.stop();
        } catch {}
      }
      if (recordedUrlRef.current) {
        URL.revokeObjectURL(recordedUrlRef.current);
        recordedUrlRef.current = null;
      }
      recordedBufferRef.current = null;
      setHasRecordedClip(false);
      setDiagPhase('idle');
      return;
    }
    setConfig(loadVoiceConfig());

    const refreshVoices = () => {
      const rawVoices = speechManager.getVoices();
      const seen = new Set<string>();
      const uniqueVoices = rawVoices.filter((v) => {
        const sig = `${v.voiceURI}::${v.name}::${v.lang}`;
        if (seen.has(sig)) return false;
        seen.add(sig);
        return true;
      });
      setVoices(uniqueVoices);
    };
    refreshVoices();

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.addEventListener?.('voiceschanged', refreshVoices);
      return () => {
        window.speechSynthesis.removeEventListener?.('voiceschanged', refreshVoices);
      };
    }
  }, [isOpen, cleanupRecordingHandles, stopDiagnosticPlayback]);

  if (!isOpen) return null;

  const updateConfig = (patch: Partial<VoiceAudioConfig>) => {
    const next = { ...config, ...patch };
    setConfig(next);
    speechManager.applyConfig(next);
  };

  const handleSelectPreset = (preset: (typeof VOICE_PRESETS)[number]) => {
    soundEffects.playBeep();
    if (preset.id === 'custom') {
      updateConfig({ voicePreset: 'custom' });
      onPresetApplied?.('custom');
      return;
    }
    updateConfig({
      voicePreset: preset.id,
      preferredLang: preset.lang,
      speechRate: preset.rate,
      speechPitch: preset.pitch,
      selectedVoiceURI: '',
    });
    onPresetApplied?.(preset.id);
  };

  const handleToggleTrack = async () => {
    soundEffects.playBeep();
    if (isMuted) {
      onSetMuted(false);
    }
    if (!config.themeEnabled) {
      updateConfig({ themeEnabled: true });
    }
    await assistantThemeAudio.toggle();
  };

  const handleTestVoiceAndTrack = async () => {
    soundEffects.playJarvisWake();
    speechManager.unlockAudio();
    if (isMuted) {
      onSetMuted(false);
    }
    if (config.themeEnabled && !audioState.isPlaying) {
      await assistantThemeAudio.play();
    }
    const sample =
      config.voicePreset === 'sheru-bold'
        ? 'Pranam Master Ajay Boss! Main Sheru Bhai, aapka Person AI Assistant bol raha hoon! Meri awaaz aur signature audio ab set ho chuki hai!'
        : config.preferredLang.startsWith('hi')
        ? 'Pranam Master Ajay Boss! Aapki AI Assistant Voice aur signature audio track YourAppearance ab set ho chuki hai!'
        : 'Welcome Master Ajay Boss! Your AI Assistant Voice and signature background audio track are now active!';

    if (onSpeakSample) {
      onSpeakSample(sample);
    } else {
      speechManager.speak(sample);
    }
  };

  // Play recorded clip through Sheru-Bold DSP voice chain (baritone warmth + presence + compression)
  const playSheruBoldClip = async (overridePitch?: number, overrideRate?: number) => {
    stopDiagnosticPlayback();
    speechManager.stop();
    if (isMuted) {
      onSetMuted(false);
    }
    assistantThemeAudio.setDucked(true);

    const latestCfg = loadVoiceConfig();
    const targetPitch = overridePitch ?? (latestCfg.voicePreset === 'custom' ? latestCfg.speechPitch : 0.86);
    const targetRate = overrideRate ?? (latestCfg.voicePreset === 'custom' ? latestCfg.speechRate : 1.03);

    const buffer = recordedBufferRef.current;
    if (buffer) {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
          audioCtxRef.current = new AudioCtx();
        }
        const ctx = audioCtxRef.current;
        if (ctx.state === 'suspended') {
          await ctx.resume();
        }

        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.playbackRate.value = Math.max(0.8, Math.min(1.3, targetRate));
        // Shift cents downward for Sheru-Bold baritone resonance (0.86 -> ~ -120 cents)
        source.detune.value = Math.max(-450, Math.min(450, (targetPitch - 1.0) * 850));

        // Low-end warmth EQ (180Hz +4.5 dB)
        const lowWarmth = ctx.createBiquadFilter();
        lowWarmth.type = 'lowshelf';
        lowWarmth.frequency.value = 180;
        lowWarmth.gain.value = 4.5;

        // Vocal clarity presence peak (2.8kHz +3.5 dB)
        const clarityPresence = ctx.createBiquadFilter();
        clarityPresence.type = 'peaking';
        clarityPresence.frequency.value = 2800;
        clarityPresence.Q.value = 1.1;
        clarityPresence.gain.value = 3.5;

        // Broadcast dynamics compressor
        const compressor = ctx.createDynamicsCompressor();
        compressor.threshold.value = -20;
        compressor.knee.value = 18;
        compressor.ratio.value = 4;
        compressor.attack.value = 0.004;
        compressor.release.value = 0.18;

        const outGain = ctx.createGain();
        outGain.gain.value = 1.15;

        source.connect(lowWarmth);
        lowWarmth.connect(clarityPresence);
        clarityPresence.connect(compressor);
        compressor.connect(outGain);
        outGain.connect(ctx.destination);

        activeSourceRef.current = source;
        setDiagPhase('playing_sheru');

        source.onended = () => {
          if (activeSourceRef.current === source) {
            activeSourceRef.current = null;
          }
          assistantThemeAudio.setDucked(false);
          setDiagPhase('ready');
        };

        source.start(0);
        return;
      } catch (err) {
        console.warn('Sheru-Bold Web Audio playback fallback:', err);
      }
    }

    // Fallback HTMLAudio playback if decodeAudioData is unavailable
    if (recordedUrlRef.current) {
      const el = new Audio(recordedUrlRef.current);
      el.playbackRate = Math.max(0.8, Math.min(1.25, targetPitch));
      rawAudioRef.current = el;
      setDiagPhase('playing_sheru');
      el.onended = () => {
        assistantThemeAudio.setDucked(false);
        setDiagPhase('ready');
      };
      el.play().catch(() => {
        assistantThemeAudio.setDucked(false);
        setDiagPhase('ready');
      });
    } else {
      assistantThemeAudio.setDucked(false);
      setDiagPhase('ready');
    }
  };

  const playRawRecordedClip = () => {
    if (!recordedUrlRef.current) return;
    stopDiagnosticPlayback();
    speechManager.stop();
    if (isMuted) {
      onSetMuted(false);
    }
    assistantThemeAudio.setDucked(true);
    const el = new Audio(recordedUrlRef.current);
    rawAudioRef.current = el;
    setDiagPhase('playing_raw');
    el.onended = () => {
      assistantThemeAudio.setDucked(false);
      setDiagPhase('ready');
    };
    el.onerror = () => {
      assistantThemeAudio.setDucked(false);
      setDiagPhase('ready');
    };
    el.play().catch(() => {
      assistantThemeAudio.setDucked(false);
      setDiagPhase('ready');
    });
  };

  const stop5SecDiagnosticRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      try {
        mediaRecorderRef.current.stop();
      } catch {}
    }
    cleanupRecordingHandles();
  };

  const start5SecDiagnosticRecording = async () => {
    setDiagError(null);
    stopDiagnosticPlayback();
    if (sheruVideoRef.current) {
      try {
        sheruVideoRef.current.pause();
      } catch {}
      setIsSheruVideoPlaying(false);
    }
    speechManager.stop();
    soundEffects.playJarvisWake();

    // Ensure Sheru-Bold preset is actively set for diagnostic verification
    const sheruConfig: Partial<VoiceAudioConfig> = {
      voicePreset: 'sheru-bold',
      preferredLang: 'hi-IN',
      speechRate: config.voicePreset === 'sheru-bold' ? config.speechRate : 1.03,
      speechPitch: config.voicePreset === 'sheru-bold' ? config.speechPitch : 0.86,
      selectedVoiceURI: '',
    };
    updateConfig(sheruConfig);
    onPresetApplied?.('sheru-bold');

    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      setDiagError('Microphone recording is not supported in this browser.');
      return;
    }

    try {
      assistantThemeAudio.setDucked(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      mediaStreamRef.current = stream;

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      // Live input clarity meter via AnalyserNode
      const micSource = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      micSource.connect(analyser);
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      peakLevelRef.current = 0;

      const tickMeter = () => {
        analyser.getByteTimeDomainData(dataArray);
        let maxAmp = 0;
        for (let i = 0; i < dataArray.length; i++) {
          const amp = Math.abs(dataArray[i] - 128) / 128;
          if (amp > maxAmp) maxAmp = amp;
        }
        const pct = Math.min(100, Math.round(maxAmp * 180));
        if (pct > peakLevelRef.current) peakLevelRef.current = pct;
        setDiagInputLevel(pct);
        diagRafRef.current = requestAnimationFrame(tickMeter);
      };
      diagRafRef.current = requestAnimationFrame(tickMeter);

      // Optional live speech transcript capture during 5s window
      setDiagTranscript('');
      const stt = getSpeechRecognition();
      if (stt) {
        stt.lang = 'hi-IN';
        stt.continuous = true;
        stt.interimResults = true;
        stt.onresult = (ev: any) => {
          let txt = '';
          for (let i = 0; i < ev.results.length; i++) {
            txt += ev.results[i][0].transcript + ' ';
          }
          setDiagTranscript(txt.trim());
        };
        stt.onerror = () => {};
        try {
          stt.start();
          diagSpeechRecRef.current = stt;
        } catch {}
      }

      const preferredMime = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg'].find((m) =>
        MediaRecorder.isTypeSupported?.(m)
      );
      const recorder = preferredMime ? new MediaRecorder(stream, { mimeType: preferredMime }) : new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      diagChunksRef.current = [];

      recorder.ondataavailable = (ev) => {
        if (ev.data && ev.data.size > 0) {
          diagChunksRef.current.push(ev.data);
        }
      };

      recorder.onstop = async () => {
        cleanupRecordingHandles();
        setDiagPhase('processing');
        const elapsedSec = Math.max(0.5, Math.min(5, (Date.now() - diagStartTimeRef.current) / 1000));
        setDiagDurationSec(Number(elapsedSec.toFixed(1)));
        setDiagPeakLevel(peakLevelRef.current);

        try {
          const blob = new Blob(diagChunksRef.current, { type: recorder.mimeType || 'audio/webm' });
          if (recordedUrlRef.current) {
            URL.revokeObjectURL(recordedUrlRef.current);
          }
          recordedUrlRef.current = URL.createObjectURL(blob);

          const arrayBuf = await blob.arrayBuffer();
          const decodeCtx = audioCtxRef.current || new (window.AudioContext || (window as any).webkitAudioContext)();
          audioCtxRef.current = decodeCtx;
          recordedBufferRef.current = await decodeCtx.decodeAudioData(arrayBuf.slice(0));
          setHasRecordedClip(true);
          soundEffects.playSuccessChime();
          await playSheruBoldClip(sheruConfig.speechPitch, sheruConfig.speechRate);
        } catch (err) {
          console.warn('Audio decode notice:', err);
          if (recordedUrlRef.current) {
            setHasRecordedClip(true);
            await playSheruBoldClip(sheruConfig.speechPitch, sheruConfig.speechRate);
          } else {
            assistantThemeAudio.setDucked(false);
            setDiagPhase('idle');
            setDiagError('Could not process recorded clip. Please try recording again.');
          }
        }
      };

      diagStartTimeRef.current = Date.now();
      setDiagElapsedMs(0);
      setDiagPhase('recording');
      recorder.start(120);

      diagTimerRef.current = setInterval(() => {
        const elapsed = Date.now() - diagStartTimeRef.current;
        setDiagElapsedMs(Math.min(5000, elapsed));
      }, 60);

      diagAutoStopRef.current = setTimeout(() => {
        stop5SecDiagnosticRecording();
      }, 5000);
    } catch (err: any) {
      cleanupRecordingHandles();
      assistantThemeAudio.setDucked(false);
      setDiagPhase('idle');
      setDiagError(
        err?.name === 'NotAllowedError'
          ? 'Microphone permission denied. Please allow mic access in browser settings to run the 5s diagnostic.'
          : 'Unable to access microphone on this device.'
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-xl max-h-[92dvh] overflow-y-auto rounded-3xl bg-[#07090e] border-2 border-[#ffd700]/60 shadow-[0_0_50px_rgba(255,215,0,0.2)] text-slate-100">
        {/* Header */}
        <div className="sticky top-0 z-10 px-4 sm:px-6 py-4 bg-[#0b0f1b]/95 backdrop-blur-md border-b border-[#ffd700]/30 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#ffd700] to-amber-300 text-[#07090e] flex items-center justify-center shadow-lg shrink-0">
              <AudioLines className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-chakra font-black text-sm sm:text-base text-[#ffd700] tracking-wider truncate">
                  AI ASSISTANT VOICE STUDIO
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/50">
                  AUDIO SET
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-hindi truncate">
                Signature Audio Track + Jarvis &amp; Myra Voice Engine
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              soundEffects.playBeep();
              onClose();
            }}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white cursor-pointer"
            title="Close Voice Studio"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-5">
          {/* Section 0: Sheru Bhai (Person AI Assistant) Video & Voice Identity */}
          <section className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-[#13172b] via-[#0a0e1b] to-amber-950/30 border border-[#ffd700]/60 shadow-[0_0_24px_rgba(255,215,0,0.12)] flex flex-col sm:flex-row items-center gap-3.5">
            <div className="relative w-24 h-28 sm:w-28 sm:h-32 rounded-2xl overflow-hidden border-2 border-[#ffd700] bg-black shrink-0 shadow-lg">
              <video
                ref={sheruVideoRef}
                src={SHERU_BHAI_VIDEO_SRC}
                poster="./person-ai-assistant.png"
                playsInline
                loop
                muted={!isSheruVideoPlaying}
                autoPlay
                className="w-full h-full object-cover"
              />
              <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/75 border border-[#ffd700]/60 text-[8px] font-chakra font-black text-[#ffd700]">
                🦁 SHERU BHAI
              </span>
            </div>

            <div className="flex-1 min-w-0 space-y-2 text-center sm:text-left">
              <div>
                <h3 className="text-xs sm:text-sm font-chakra font-black text-[#ffd700] tracking-wide">
                  PERSON AI ASSISTANT • SHERU BHAI VOICE
                </h3>
                <p className="text-[11px] text-slate-300 font-hindi leading-snug">
                  &lsquo;Sheru-Bold&rsquo; वॉइस सेट है — नीचे बटन से Sheru Bhai क्लिप सुनें या Theme Track चुनें
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <button
                  type="button"
                  onClick={() => {
                    soundEffects.playBeep();
                    const vid = sheruVideoRef.current;
                    if (!vid) return;
                    if (isSheruVideoPlaying) {
                      vid.muted = true;
                      setIsSheruVideoPlaying(false);
                      assistantThemeAudio.setDucked(false);
                    } else {
                      if (isMuted) onSetMuted(false);
                      speechManager.stop();
                      assistantThemeAudio.setDucked(true);
                      vid.muted = false;
                      vid.currentTime = 0;
                      vid.play().catch(() => {});
                      setIsSheruVideoPlaying(true);
                    }
                  }}
                  className={`min-h-[38px] px-3 py-1.5 rounded-xl text-xs font-chakra font-black flex items-center gap-1.5 border transition-all cursor-pointer ${
                    isSheruVideoPlaying
                      ? 'bg-[#ffd700] text-[#07090e] border-[#ffd700]'
                      : 'bg-[#ffd700]/15 hover:bg-[#ffd700]/25 border-[#ffd700]/60 text-[#ffd700]'
                  }`}
                >
                  <Film className="w-3.5 h-3.5" />
                  <span>{isSheruVideoPlaying ? 'Mute Sheru Video' : 'Play Sheru Video & Sound'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    soundEffects.playJarvisWake();
                    if (isMuted) onSetMuted(false);
                    const nextSource: ThemeAudioSourceId =
                      config.themeSource === 'sheru-video' ? 'acoustic-flac' : 'sheru-video';
                    updateConfig({ themeSource: nextSource, themeEnabled: true });
                    assistantThemeAudio.play();
                  }}
                  className={`min-h-[38px] px-3 py-1.5 rounded-xl text-[11px] font-chakra font-bold border transition-all cursor-pointer ${
                    config.themeSource === 'sheru-video'
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                      : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-200'
                  }`}
                >
                  <span>
                    {config.themeSource === 'sheru-video'
                      ? '✓ Sheru Track Set'
                      : 'Set Sheru MP4 as Theme'}
                  </span>
                </button>
              </div>
            </div>
          </section>

          {/* Section 1: Uploaded AI Assistant Signature Track */}
          <section className="p-4 rounded-2xl bg-gradient-to-br from-[#0e1425] via-[#090d18] to-amber-950/20 border border-[#ffd700]/50 space-y-3">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2 min-w-0">
                <Music className="w-4 h-4 text-[#ffd700] shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-chakra font-bold text-amber-200 truncate">
                    Signature Assistant Audio Set
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 truncate">
                    {config.themeSource === 'sheru-video' ? SHERU_BHAI_VIDEO_SRC : ASSISTANT_THEME_AUDIO_SRC}
                  </div>
                </div>
              </div>

              <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.themeEnabled}
                  onChange={(e) => {
                    soundEffects.playBeep();
                    updateConfig({ themeEnabled: e.target.checked });
                  }}
                  className="w-4 h-4 accent-[#ffd700] rounded cursor-pointer"
                />
                <span>Active</span>
              </label>
            </div>

            {/* Playback & Scrubber */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleToggleTrack}
                className={`min-h-[44px] min-w-[44px] px-3.5 rounded-xl font-chakra font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                  audioState.isPlaying
                    ? 'bg-[#ffd700] text-[#07090e] shadow-[0_0_18px_rgba(255,215,0,0.4)]'
                    : 'bg-amber-500/20 hover:bg-amber-500/30 border border-[#ffd700]/60 text-[#ffd700]'
                }`}
              >
                {audioState.isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{audioState.isPlaying ? 'Pause' : 'Play'}</span>
              </button>

              <div className="flex-1 space-y-1">
                <input
                  type="range"
                  min={0}
                  max={audioState.duration || 110}
                  step={0.5}
                  value={audioState.currentTime}
                  onChange={(e) => assistantThemeAudio.seek(parseFloat(e.target.value))}
                  aria-label="Seek AI assistant signature audio"
                  className="w-full accent-[#ffd700] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>{formatSeconds(audioState.currentTime)}</span>
                  <span className="text-[#ffd700]">
                    {audioState.isPlaying
                      ? audioState.isDucked
                        ? 'Ducked for AI Speech'
                        : 'Playing Theme'
                      : 'Ready'}
                  </span>
                  <span>{formatSeconds(audioState.duration)}</span>
                </div>
              </div>
            </div>

            {/* Volume + Toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] text-slate-300">
                  <span className="flex items-center gap-1">
                    <Volume2 className="w-3.5 h-3.5 text-[#ffd700]" />
                    Theme Volume
                  </span>
                  <span className="font-mono text-[#ffd700]">{Math.round(config.themeVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min={0.05}
                  max={1}
                  step={0.05}
                  value={config.themeVolume}
                  onChange={(e) => updateConfig({ themeVolume: parseFloat(e.target.value) })}
                  className="w-full accent-[#ffd700] cursor-pointer"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                <button
                  type="button"
                  onClick={() => {
                    soundEffects.playBeep();
                    updateConfig({ themeLoop: !config.themeLoop });
                  }}
                  className={`min-h-[34px] px-2.5 py-1 rounded-lg text-[11px] font-medium border flex items-center gap-1 cursor-pointer ${
                    config.themeLoop
                      ? 'bg-[#ffd700]/20 border-[#ffd700] text-[#ffd700]'
                      : 'bg-slate-900 border-slate-700 text-slate-400'
                  }`}
                >
                  <Repeat className="w-3 h-3" />
                  <span>Loop {config.themeLoop ? 'ON' : 'OFF'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    soundEffects.playBeep();
                    updateConfig({ duckDuringSpeech: !config.duckDuringSpeech });
                  }}
                  className={`min-h-[34px] px-2.5 py-1 rounded-lg text-[11px] font-medium border flex items-center gap-1 cursor-pointer ${
                    config.duckDuringSpeech
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                      : 'bg-slate-900 border-slate-700 text-slate-400'
                  }`}
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Auto-Duck {config.duckDuringSpeech ? 'ON' : 'OFF'}</span>
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 text-[11px] text-slate-300 pt-1 cursor-pointer">
              <input
                type="checkbox"
                checked={config.autoPlayOnUnlock}
                onChange={(e) => {
                  soundEffects.playBeep();
                  updateConfig({ autoPlayOnUnlock: e.target.checked });
                }}
                className="w-4 h-4 accent-[#ffd700] rounded cursor-pointer"
              />
              <span>Auto-play signature audio on Human ID unlock</span>
            </label>
          </section>

          {/* Section 2: Speaking Voice Engine Presets */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-chakra font-bold text-[#ffd700] uppercase tracking-wider flex items-center gap-1.5">
                <Mic2 className="w-4 h-4" />
                AI Speaking Voice Profile
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {config.preferredLang} • {config.speechRate.toFixed(2)}x
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {VOICE_PRESETS.map((preset) => {
                const active = config.voicePreset === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      active
                        ? 'bg-[#ffd700]/15 border-[#ffd700] shadow-[0_0_16px_rgba(255,215,0,0.18)]'
                        : 'bg-[#0c111e] border-slate-800 hover:border-[#ffd700]/45'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-chakra font-bold text-slate-100">
                        {preset.label}
                      </span>
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded font-black ${
                          active ? 'bg-[#ffd700] text-[#07090e]' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {preset.badge}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">{preset.subtitle}</p>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Section 2.5: 5-Second Sheru-Bold Voice Diagnostic Panel */}
          <section className="p-4 rounded-2xl bg-gradient-to-br from-[#121629] via-[#090d18] to-amber-950/25 border-2 border-[#ffd700]/60 shadow-[0_0_24px_rgba(255,215,0,0.12)] space-y-3">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#ffd700]/15 border border-[#ffd700]/50 flex items-center justify-center text-[#ffd700] shrink-0">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-chakra font-black text-[#ffd700] tracking-wide">
                    5-SEC SHERU-BOLD VOICE DIAGNOSTIC
                  </h3>
                  <p className="text-[10px] text-slate-400 font-hindi">
                    5 सेकंड रिकॉर्ड करें और तुरंत &apos;Sheru-Bold&apos; टोन व क्लैरिटी सुनकर चेक करें
                  </p>
                </div>
              </div>

              <span
                className={`px-2 py-0.5 rounded-full text-[9px] font-chakra font-black uppercase border ${
                  diagPhase === 'recording'
                    ? 'bg-red-600/25 border-red-500 text-red-300 animate-pulse'
                    : diagPhase === 'playing_sheru'
                    ? 'bg-[#ffd700]/25 border-[#ffd700] text-[#ffd700]'
                    : diagPhase === 'playing_raw'
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                    : 'bg-emerald-500/15 border-emerald-400/40 text-emerald-300'
                }`}
              >
                {diagPhase === 'recording'
                  ? `REC ${(diagElapsedMs / 1000).toFixed(1)}s / 5.0s`
                  : diagPhase === 'processing'
                  ? 'PROCESSING...'
                  : diagPhase === 'playing_sheru'
                  ? 'SHERU-BOLD PLAYING'
                  : diagPhase === 'playing_raw'
                  ? 'RAW MIC PLAYING'
                  : hasRecordedClip
                  ? 'CLIP READY'
                  : 'READY TO TEST'}
              </span>
            </div>

            {/* Record / Stop Trigger + 5s Progress & Live Mic Clarity Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              {diagPhase === 'recording' ? (
                <button
                  type="button"
                  onClick={stop5SecDiagnosticRecording}
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-chakra font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 cursor-pointer shrink-0"
                >
                  <Square className="w-4 h-4 fill-white" />
                  <span>Stop &amp; Play ({(5 - diagElapsedMs / 1000).toFixed(1)}s)</span>
                </button>
              ) : (
                <button
                  type="button"
                  disabled={diagPhase === 'processing'}
                  onClick={start5SecDiagnosticRecording}
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-gradient-to-r from-[#ffd700] to-amber-400 hover:brightness-105 disabled:opacity-60 text-[#07090e] font-chakra font-black text-xs flex items-center justify-center gap-2 shadow-[0_0_18px_rgba(255,215,0,0.28)] cursor-pointer shrink-0"
                >
                  <Mic className="w-4 h-4" />
                  <span>{hasRecordedClip ? 'Re-Record 5s Clip' : 'Record 5s Voice Test'}</span>
                </button>
              )}

              {/* Countdown Progress & Live Input Level */}
              <div className="flex-1 space-y-1.5 bg-[#07090e] p-2.5 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>
                    {diagPhase === 'recording'
                      ? `Mic Clarity Signal: ${diagInputLevel}%`
                      : hasRecordedClip
                      ? `Captured ${diagDurationSec}s • Peak ${diagPeakLevel}%`
                      : 'Preset: Sheru-Bold (Pitch 0.86 • Rate 1.03x)'}
                  </span>
                  <span className="text-[#ffd700]">5.0s Max</span>
                </div>
                <progress
                  max={100}
                  value={
                    diagPhase === 'recording'
                      ? Math.min(100, (diagElapsedMs / 5000) * 100)
                      : diagPhase === 'playing_sheru' || diagPhase === 'playing_raw'
                      ? 100
                      : hasRecordedClip
                      ? Math.max(18, diagPeakLevel)
                      : 0
                  }
                  aria-label="5-second diagnostic recording and signal level"
                  className="w-full h-2 rounded-full overflow-hidden accent-[#ffd700] bg-slate-900 [&::-webkit-progress-bar]:bg-slate-900 [&::-webkit-progress-value]:bg-[#ffd700] [&::-moz-progress-bar]:bg-[#ffd700]"
                />
              </div>
            </div>

            {diagError && (
              <div
                role="alert"
                className="p-2.5 rounded-xl bg-red-950/60 border border-red-500/50 text-red-200 text-[11px] flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{diagError}</span>
              </div>
            )}

            {/* Playback & A/B Comparison Controls Once Clip Exists */}
            {hasRecordedClip && (
              <div className="space-y-2 pt-1">
                {diagTranscript && (
                  <div className="px-3 py-1.5 rounded-lg bg-[#07090e] border border-cyan-500/35 text-[11px] text-cyan-200 font-hindi">
                    <span className="text-cyan-400 font-bold">Captured Speech:</span> &ldquo;{diagTranscript}&rdquo;
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => playSheruBoldClip()}
                    className={`min-h-[38px] px-3 py-1.5 rounded-xl text-[11px] font-chakra font-black flex items-center gap-1.5 border transition-all cursor-pointer ${
                      diagPhase === 'playing_sheru'
                        ? 'bg-[#ffd700] text-[#07090e] border-[#ffd700]'
                        : 'bg-[#ffd700]/15 hover:bg-[#ffd700]/25 border-[#ffd700]/60 text-[#ffd700]'
                    }`}
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Play Sheru-Bold Tone</span>
                  </button>

                  <button
                    type="button"
                    onClick={playRawRecordedClip}
                    className={`min-h-[38px] px-3 py-1.5 rounded-xl text-[11px] font-chakra font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
                      diagPhase === 'playing_raw'
                        ? 'bg-cyan-400 text-[#07090e] border-cyan-300'
                        : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-200'
                    }`}
                  >
                    <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Compare Original Raw</span>
                  </button>

                  {diagTranscript && (
                    <button
                      type="button"
                      onClick={() => {
                        soundEffects.playBeep();
                        stopDiagnosticPlayback();
                        if (isMuted) onSetMuted(false);
                        speechManager.speak(diagTranscript, {
                          rate: config.speechRate,
                          pitch: config.speechPitch,
                        });
                      }}
                      className="min-h-[38px] px-3 py-1.5 rounded-xl text-[11px] font-chakra font-bold bg-purple-950/60 hover:bg-purple-900/70 border border-purple-400/50 text-purple-200 flex items-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-purple-300" />
                      <span>Echo via Sheru TTS</span>
                    </button>
                  )}

                  {(diagPhase === 'playing_sheru' || diagPhase === 'playing_raw') && (
                    <button
                      type="button"
                      onClick={stopDiagnosticPlayback}
                      className="min-h-[38px] px-3 py-1.5 rounded-xl text-[11px] font-chakra font-bold bg-red-950/60 hover:bg-red-900/60 border border-red-500/50 text-red-200 flex items-center gap-1 cursor-pointer"
                    >
                      <Square className="w-3 h-3 fill-current" />
                      <span>Stop</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </section>

          {/* Section 3: Fine-Tune Language, Device Voice, Pitch & Speed */}
          <section className="p-4 rounded-2xl bg-[#0b101d] border border-slate-800 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-chakra font-bold text-cyan-300">
              <Sliders className="w-3.5 h-3.5" />
              <span>Voice Tuning Controls</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label htmlFor="voiceLangSelect" className="text-[11px] text-slate-400 block">
                  Voice Language
                </label>
                <select
                  id="voiceLangSelect"
                  value={config.preferredLang}
                  onChange={(e) =>
                    updateConfig({ preferredLang: e.target.value, voicePreset: 'custom', selectedVoiceURI: '' })
                  }
                  className="w-full min-h-[40px] px-3 rounded-xl bg-[#07090e] border border-[#ffd700]/35 text-xs text-white outline-none focus:border-[#ffd700]"
                >
                  <option value="hi-IN">Hindi / Hinglish (hi-IN)</option>
                  <option value="en-IN">Indian English (en-IN)</option>
                  <option value="en-US">Global English (en-US)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label htmlFor="systemVoiceSelect" className="text-[11px] text-slate-400 block">
                  Device TTS Voice ({voices.length} available)
                </label>
                <select
                  id="systemVoiceSelect"
                  value={config.selectedVoiceURI}
                  onChange={(e) =>
                    updateConfig({ selectedVoiceURI: e.target.value, voicePreset: 'custom' })
                  }
                  className="w-full min-h-[40px] px-3 rounded-xl bg-[#07090e] border border-[#ffd700]/35 text-xs text-white outline-none focus:border-[#ffd700]"
                >
                  <option value="">Auto Smart Match ({config.preferredLang})</option>
                  {voices.map((v, idx) => (
                    <option key={`${v.voiceURI}::${v.name}::${v.lang}::${idx}`} value={v.voiceURI}>
                      {v.name} ({v.lang})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-300">
                  <span>Voice Speed</span>
                  <span className="font-mono text-[#ffd700]">{config.speechRate.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min={0.75}
                  max={1.4}
                  step={0.05}
                  value={config.speechRate}
                  onChange={(e) =>
                    updateConfig({ speechRate: parseFloat(e.target.value), voicePreset: 'custom' })
                  }
                  className="w-full accent-[#ffd700] cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-300">
                  <span>Voice Pitch</span>
                  <span className="font-mono text-cyan-300">{config.speechPitch.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min={0.7}
                  max={1.4}
                  step={0.04}
                  value={config.speechPitch}
                  onChange={(e) =>
                    updateConfig({ speechPitch: parseFloat(e.target.value), voicePreset: 'custom' })
                  }
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>
            </div>
          </section>

          {/* Footer Test & Save Actions */}
          <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
            <button
              type="button"
              onClick={handleTestVoiceAndTrack}
              className="flex-1 min-h-[46px] px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#ffd700] via-amber-400 to-yellow-300 hover:brightness-105 text-[#07090e] font-chakra font-black text-xs sm:text-sm tracking-wide flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(255,215,0,0.3)] cursor-pointer"
            >
              <Crown className="w-4 h-4" />
              <span>Test AI Voice &amp; Track</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundEffects.playSuccessChime();
                onClose();
              }}
              className="min-h-[46px] px-5 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/60 text-emerald-300 font-chakra font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Done (Saved)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
