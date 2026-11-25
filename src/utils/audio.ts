// Audio utilities for Mr Jarvis Beast: Web Audio sound effects, Web Speech TTS, STT & Signature Assistant Audio

export const ASSISTANT_THEME_AUDIO_SRC = './assets/aistudio/YourAppearance_9e82ad56.mp3';
export const SHERU_BHAI_VIDEO_SRC = './assets/aistudio/_360p__22__287ba01a.mp4';
export const VOICE_CONFIG_STORAGE_KEY = 'mr_jarvis_voice_config_v2';

export type VoicePresetId = 'jarvis-royal' | 'myra-sweet' | 'sheru-bold' | 'custom';
export type ThemeAudioSourceId = 'acoustic-flac' | 'sheru-video';

export interface VoiceAudioConfig {
  themeEnabled: boolean;
  themeSource: ThemeAudioSourceId;
  themeVolume: number; // 0.0 to 1.0
  themeLoop: boolean;
  autoPlayOnUnlock: boolean;
  duckDuringSpeech: boolean;
  voicePreset: VoicePresetId;
  preferredLang: string;
  speechRate: number;
  speechPitch: number;
  selectedVoiceURI: string;
}

export const DEFAULT_VOICE_CONFIG: VoiceAudioConfig = {
  themeEnabled: true,
  themeSource: 'acoustic-flac',
  themeVolume: 0.35,
  themeLoop: true,
  autoPlayOnUnlock: true,
  duckDuringSpeech: true,
  voicePreset: 'sheru-bold',
  preferredLang: 'hi-IN',
  speechRate: 1.03,
  speechPitch: 0.86,
  selectedVoiceURI: '',
};

export function loadVoiceConfig(): VoiceAudioConfig {
  if (typeof window === 'undefined') return DEFAULT_VOICE_CONFIG;
  try {
    const raw = localStorage.getItem(VOICE_CONFIG_STORAGE_KEY);
    if (!raw) return DEFAULT_VOICE_CONFIG;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_VOICE_CONFIG,
      ...parsed,
      themeVolume:
        typeof parsed.themeVolume === 'number'
          ? Math.max(0, Math.min(1, parsed.themeVolume))
          : DEFAULT_VOICE_CONFIG.themeVolume,
      speechRate:
        typeof parsed.speechRate === 'number'
          ? Math.max(0.7, Math.min(1.5, parsed.speechRate))
          : DEFAULT_VOICE_CONFIG.speechRate,
      speechPitch:
        typeof parsed.speechPitch === 'number'
          ? Math.max(0.6, Math.min(1.5, parsed.speechPitch))
          : DEFAULT_VOICE_CONFIG.speechPitch,
    };
  } catch {
    return DEFAULT_VOICE_CONFIG;
  }
}

export function saveVoiceConfig(config: VoiceAudioConfig): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(VOICE_CONFIG_STORAGE_KEY, JSON.stringify(config));
  } catch {
    // ignore storage quota errors
  }
}

class SoundFX {
  private ctx: AudioContext | null = null;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Futuristic Jarvis Activation sound
  playJarvisWake() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'triangle';

      osc1.frequency.setValueAtTime(440, now);
      osc1.frequency.exponentialRampToValueAtTime(880, now + 0.18);
      osc1.frequency.exponentialRampToValueAtTime(1320, now + 0.35);

      osc2.frequency.setValueAtTime(220, now);
      osc2.frequency.exponentialRampToValueAtTime(660, now + 0.35);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.2, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.4);
      osc2.stop(now + 0.4);
    } catch {
      // AudioContext not allowed before user gesture
    }
  }

  // Success chime when solution is calculated
  playSuccessChime() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const freqs = [523.25, 659.25, 783.99, 1046.5];

      freqs.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);

        gain.gain.setValueAtTime(0.01, now + idx * 0.06);
        gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.06 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.35);
      });
    } catch {}
  }

  // Click/pop sound
  playBeep() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.08);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch {}
  }
}

export const soundEffects = new SoundFX();

export interface SignatureAudioState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  isDucked: boolean;
  isMuted: boolean;
}

// Persistent AI Assistant Signature Theme Audio Player (YourAppearance_9e82ad56.flac / Sheru Bhai _360p__22__287ba01a.mp4)
class SignatureAudioManager {
  private audio: HTMLAudioElement | null = null;
  private activeSourceUrl: string = ASSISTANT_THEME_AUDIO_SRC;
  private listeners = new Set<(state: SignatureAudioState) => void>();
  private isPlaying = false;
  private isDucked = false;
  private isMuted = false;

  private resolveSourceUrl(cfg: VoiceAudioConfig): string {
    return cfg.themeSource === 'sheru-video' ? SHERU_BHAI_VIDEO_SRC : ASSISTANT_THEME_AUDIO_SRC;
  }

  private ensureAudio(): HTMLAudioElement | null {
    if (typeof window === 'undefined') return null;
    const cfg = loadVoiceConfig();
    const desiredSrc = this.resolveSourceUrl(cfg);

    if (!this.audio) {
      this.activeSourceUrl = desiredSrc;
      const el = new Audio(desiredSrc);
      el.preload = 'auto';
      el.loop = cfg.themeLoop;
      el.volume = this.computeEffectiveVolume(cfg);

      el.addEventListener('play', () => {
        this.isPlaying = true;
        this.notify();
      });
      el.addEventListener('pause', () => {
        this.isPlaying = false;
        this.notify();
      });
      el.addEventListener('ended', () => {
        if (!el.loop) {
          this.isPlaying = false;
          this.notify();
        }
      });
      el.addEventListener('timeupdate', () => this.notify());
      el.addEventListener('loadedmetadata', () => this.notify());

      this.audio = el;
    } else if (this.activeSourceUrl !== desiredSrc) {
      const wasPlaying = this.isPlaying;
      this.audio.pause();
      this.activeSourceUrl = desiredSrc;
      this.audio.src = desiredSrc;
      this.audio.currentTime = 0;
      this.audio.load();
      if (wasPlaying && cfg.themeEnabled && !this.isMuted) {
        this.audio.play().catch(() => {});
      }
    }
    return this.audio;
  }

  private computeEffectiveVolume(cfg: VoiceAudioConfig): number {
    if (this.isMuted || !cfg.themeEnabled) return 0;
    const base = Math.max(0, Math.min(1, cfg.themeVolume));
    if (this.isDucked && cfg.duckDuringSpeech) {
      return Math.min(base, Math.max(0.05, base * 0.28));
    }
    return base;
  }

  private notify() {
    const state = this.getState();
    this.listeners.forEach((cb) => cb(state));
  }

  getState(): SignatureAudioState {
    return {
      isPlaying: this.isPlaying,
      currentTime: this.audio?.currentTime || 0,
      duration: this.audio && Number.isFinite(this.audio.duration) ? this.audio.duration : 110,
      isDucked: this.isDucked,
      isMuted: this.isMuted,
    };
  }

  subscribe(cb: (state: SignatureAudioState) => void): () => void {
    this.listeners.add(cb);
    cb(this.getState());
    return () => {
      this.listeners.delete(cb);
    };
  }

  syncWithConfig(cfg: VoiceAudioConfig) {
    const el = this.ensureAudio();
    if (!el) return;
    el.loop = cfg.themeLoop;
    el.volume = this.computeEffectiveVolume(cfg);
    if (!cfg.themeEnabled && this.isPlaying) {
      el.pause();
    }
    this.notify();
  }

  async play(): Promise<boolean> {
    const cfg = loadVoiceConfig();
    if (!cfg.themeEnabled || this.isMuted) return false;
    const el = this.ensureAudio();
    if (!el) return false;
    el.loop = cfg.themeLoop;
    el.volume = this.computeEffectiveVolume(cfg);
    try {
      await el.play();
      this.isPlaying = true;
      this.notify();
      return true;
    } catch {
      this.isPlaying = false;
      this.notify();
      return false;
    }
  }

  pause() {
    if (this.audio) {
      this.audio.pause();
    }
    this.isPlaying = false;
    this.notify();
  }

  async toggle(): Promise<boolean> {
    if (this.isPlaying) {
      this.pause();
      return false;
    }
    return this.play();
  }

  seek(timeSeconds: number) {
    const el = this.ensureAudio();
    if (!el) return;
    el.currentTime = Math.max(0, Math.min(el.duration || 110, timeSeconds));
    this.notify();
  }

  setDucked(ducked: boolean) {
    if (this.isDucked === ducked) return;
    this.isDucked = ducked;
    if (this.audio) {
      this.audio.volume = this.computeEffectiveVolume(loadVoiceConfig());
    }
    this.notify();
  }

  setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.audio) {
      if (muted && this.isPlaying) {
        this.audio.pause();
      } else {
        this.audio.volume = this.computeEffectiveVolume(loadVoiceConfig());
      }
    }
    this.notify();
  }
}

export const assistantThemeAudio = new SignatureAudioManager();

// Web Speech Synthesis (TTS) Helper
export class SpeechManager {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private currentAudioElement: HTMLAudioElement | null = null;
  public isSpeaking: boolean = false;
  public preferredLang: string = 'hi-IN';
  public speechRate: number = 1.04;
  public speechPitch: number = 0.98;
  public selectedVoiceURI: string = '';

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
    const saved = loadVoiceConfig();
    this.preferredLang = saved.preferredLang;
    this.speechRate = saved.speechRate;
    this.speechPitch = saved.speechPitch;
    this.selectedVoiceURI = saved.selectedVoiceURI;
  }

  applyConfig(config: Partial<VoiceAudioConfig>) {
    const merged = { ...loadVoiceConfig(), ...config };
    this.preferredLang = merged.preferredLang;
    this.speechRate = merged.speechRate;
    this.speechPitch = merged.speechPitch;
    this.selectedVoiceURI = merged.selectedVoiceURI;
    saveVoiceConfig(merged);
    assistantThemeAudio.syncWithConfig(merged);
  }

  getVoices(): SpeechSynthesisVoice[] {
    if (!this.synth) return [];
    return this.synth.getVoices();
  }

  stop() {
    if (this.currentAudioElement) {
      this.currentAudioElement.pause();
      this.currentAudioElement = null;
    }
    if (this.synth) {
      this.synth.cancel();
    }
    this.isSpeaking = false;
    assistantThemeAudio.setDucked(false);
  }

  unlockAudio() {
    try {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.resume();
        const silent = new SpeechSynthesisUtterance(' ');
        silent.volume = 0.01;
        window.speechSynthesis.speak(silent);
      }
    } catch {}
  }

  speak(
    text: string,
    options?: {
      onStart?: () => void;
      onEnd?: () => void;
      onError?: (err: any) => void;
      lang?: string;
      rate?: number;
      pitch?: number;
    }
  ) {
    this.stop();
    if (!this.synth) {
      options?.onError?.(new Error('SpeechSynthesis not supported'));
      return;
    }

    try {
      this.synth.resume();
    } catch {}

    const cleanSpeech = text
      .replace(/[*_#`~[\]()]/g, ' ')
      .replace(/\$/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanSpeech) return;

    const latestConfig = loadVoiceConfig();
    const targetLang = options?.lang || latestConfig.preferredLang || this.preferredLang;
    const targetRate = options?.rate ?? latestConfig.speechRate ?? this.speechRate;
    const targetPitch = options?.pitch ?? latestConfig.speechPitch ?? this.speechPitch;
    const targetVoiceURI = latestConfig.selectedVoiceURI || this.selectedVoiceURI;

    const utterance = new SpeechSynthesisUtterance(cleanSpeech);
    utterance.lang = targetLang;
    utterance.rate = targetRate;
    utterance.pitch = targetPitch;

    const voices = this.synth.getVoices();
    let selectedVoice: SpeechSynthesisVoice | undefined;

    if (targetVoiceURI) {
      selectedVoice = voices.find((v) => v.voiceURI === targetVoiceURI);
    }

    if (!selectedVoice) {
      const preset = latestConfig.voicePreset;
      const isMaleCandidate = (v: SpeechSynthesisVoice) =>
        /male|rishi|prabhat|madhur|hemant|ravi|deep|daniel|alex|google हिन्दी/i.test(v.name);
      const isFemaleCandidate = (v: SpeechSynthesisVoice) =>
        /female|swara|lekha|heera|kalpana|veena|samantha|victoria|google हिन्दी/i.test(v.name);

      if (targetLang.startsWith('hi')) {
        const hindiVoices = voices.filter(
          (v) => v.lang.includes('hi') || v.name.toLowerCase().includes('hindi')
        );
        const enInVoices = voices.filter(
          (v) => v.lang.includes('en-IN') || v.name.toLowerCase().includes('india')
        );
        const pool = hindiVoices.length > 0 ? hindiVoices : enInVoices;
        if (preset === 'sheru-bold') {
          selectedVoice = pool.find(isMaleCandidate) || pool[0] || enInVoices[0];
        } else if (preset === 'myra-sweet') {
          selectedVoice = pool.find(isFemaleCandidate) || pool[0] || enInVoices[0];
        } else {
          selectedVoice = pool[0] || enInVoices[0];
        }
      } else if (targetLang === 'en-IN') {
        const enInVoices = voices.filter(
          (v) => v.lang.includes('en-IN') || v.name.toLowerCase().includes('india')
        );
        if (preset === 'sheru-bold') {
          selectedVoice = enInVoices.find(isMaleCandidate) || enInVoices[0] || voices.find((v) => v.lang.startsWith('en'));
        } else {
          selectedVoice = enInVoices[0] || voices.find((v) => v.lang.startsWith('en'));
        }
      } else {
        selectedVoice =
          voices.find(
            (v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google'))
          ) || voices.find((v) => v.lang.startsWith('en'));
      }
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.onstart = () => {
      this.isSpeaking = true;
      assistantThemeAudio.setDucked(true);
      options?.onStart?.();
    };

    const handleFinish = () => {
      this.isSpeaking = false;
      assistantThemeAudio.setDucked(false);
      options?.onEnd?.();
    };

    utterance.onerror = (e) => {
      this.isSpeaking = false;
      assistantThemeAudio.setDucked(false);
      options?.onError?.(e);
    };

    this.currentUtterance = utterance;

    const charCount = cleanSpeech.length;
    const estimatedDurationMs = Math.max(3000, (charCount / 12) * 1000);
    const safetyTimer = setTimeout(() => {
      if (this.isSpeaking && this.currentUtterance === utterance) {
        handleFinish();
      }
    }, estimatedDurationMs + 4000);

    utterance.onend = () => {
      clearTimeout(safetyTimer);
      handleFinish();
    };

    this.synth.speak(utterance);
  }

  playAudioBase64(base64Wav: string, onStart?: () => void, onEnd?: () => void) {
    this.stop();
    const audio = new Audio(`data:audio/wav;base64,${base64Wav}`);
    this.currentAudioElement = audio;

    audio.onplay = () => {
      this.isSpeaking = true;
      assistantThemeAudio.setDucked(true);
      onStart?.();
    };

    audio.onended = () => {
      this.isSpeaking = false;
      assistantThemeAudio.setDucked(false);
      onEnd?.();
    };

    audio.onerror = () => {
      this.isSpeaking = false;
      assistantThemeAudio.setDucked(false);
      onEnd?.();
    };

    audio.play().catch(() => {
      this.isSpeaking = false;
      assistantThemeAudio.setDucked(false);
      onEnd?.();
    });
  }
}

export const speechManager = new SpeechManager();

// Speech Recognition (STT) Helper
export function getSpeechRecognition(): any {
  if (typeof window === 'undefined') return null;
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  if (!SpeechRecognition) return null;
  return new SpeechRecognition();
}
