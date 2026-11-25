import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  X,
  Camera,
  RefreshCw,
  Mic,
  MicOff,
  Sparkles,
  Flame,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { soundEffects, speechManager, getSpeechRecognition } from '../utils/audio';
import { EngineType, QAItem, AssistantResponse, MediaAttachment } from '../types';

interface LiveVisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onQuestionSolved: (qa: QAItem) => void;
  currentEngine: EngineType;
}

export const LiveVisionModal: React.FC<LiveVisionModalProps> = ({
  isOpen,
  onClose,
  onQuestionSolved,
  currentEngine,
}) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [isTorchOn, setIsTorchOn] = useState(false);
  const [hasTorch, setHasTorch] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [voiceQuery, setVoiceQuery] = useState('');
  const [liveReasoningResult, setLiveReasoningResult] = useState<AssistantResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const recognitionRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => {
        try {
          t.stop();
        } catch {
          // ignore
        }
      });
      streamRef.current = null;
    }
    setStream(null);
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
    setIsListening(false);
  }, []);

  const startCamera = useCallback(
    async (mode: 'environment' | 'user') => {
      try {
        stopCamera();
        setErrorMessage(null);

        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: mode,
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });

        streamRef.current = mediaStream;
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          await videoRef.current.play().catch(() => {});
        }

        const track = mediaStream.getVideoTracks()[0];
        const capabilities: any = track.getCapabilities?.() || {};
        setHasTorch(Boolean(capabilities.torch));
      } catch (err: any) {
        setErrorMessage(
          err?.name === 'NotAllowedError'
            ? 'कैमरा एक्सेस की अनुमति नहीं मिली। कैमरा व्यू तभी काम करेगा जब ऐप/ब्राउज़र में कैमरा चालू हो।'
            : 'कैमरा अभी चालू नहीं हो पाया। कैमरा व्यू तभी काम करेगा जब डिवाइस पर कैमरा सक्रिय हो।'
        );
      }
    },
    [stopCamera]
  );

  const captureFrame = (): string | null => {
    if (!videoRef.current || !canvasRef.current) return null;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.85);
  };

  const captureAndReason = async (userPrompt?: string) => {
    const base64Img = captureFrame();
    if (!base64Img) {
      setErrorMessage('कैमरा फ्रेम तैयार नहीं है। कृपया पहले कैमरा चालू होने दें।');
      return;
    }

    const queryToUse =
      userPrompt ||
      voiceQuery.trim() ||
      'कैमरे में जो दिख रहा है उसे छोटे और साफ़ शब्दों में Ajay Boss को बताओ।';
    setIsAnalyzing(true);
    setErrorMessage(null);
    soundEffects.playBeep();

    const currentId = `live-camera-${Date.now()}`;
    const mediaObj: MediaAttachment = {
      base64: base64Img,
      mimeType: 'image/jpeg',
      name: `Live Camera (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}).jpg`,
      type: 'image',
    };

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: queryToUse,
          engine: currentEngine,
          category: 'vision',
          precision: 'concise',
          mediaData: { base64: base64Img, mimeType: 'image/jpeg' },
        }),
      });

      const data: AssistantResponse = await res.json();
      setLiveReasoningResult(data);
      soundEffects.playSuccessChime();

      const qaItem: QAItem = {
        id: currentId,
        questionText: queryToUse,
        questionMedia: mediaObj,
        category: 'vision',
        engineUsed: currentEngine,
        timestamp: new Date().toISOString(),
        status: 'answered',
        response: data,
      };
      onQuestionSolved(qaItem);

      if (!isMuted && data.speechText) {
        speechManager.speak(`${data.speechText} ${data.finalAnswer}`, {
          onStart: () => setIsSpeaking(true),
          onEnd: () => setIsSpeaking(false),
          onError: () => setIsSpeaking(false),
        });
      }
    } catch {
      setErrorMessage('अभी कैमरे की तस्वीर का जवाब नहीं मिल पाया। कृपया दोबारा कोशिश करें।');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const startListening = useCallback(() => {
    const recognition = getSpeechRecognition();
    if (!recognition) return;

    speechManager.unlockAudio();
    recognition.lang = 'hi-IN';
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (e: any) => {
      let text = '';
      for (let i = 0; i < e.results.length; i++) {
        text += e.results[i][0].transcript;
      }
      setVoiceQuery(text);

      if (e.results[0].isFinal) {
        setIsListening(false);
        const finalQuestion = text.trim();
        if (finalQuestion) {
          captureAndReason(finalQuestion);
        }
      }
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      stopListening();
      speechManager.stop();
      setIsSpeaking(false);
      setLiveReasoningResult(null);
      setVoiceQuery('');
      setErrorMessage(null);
      return;
    }

    startCamera(facingMode);
    soundEffects.playJarvisWake();
    speechManager.unlockAudio();

    if (!isMuted) {
      speechManager.speak('जी Ajay Boss! Live Camera तैयार है। कैमरा चालू होने पर सामने की चीज़ पूछ सकते हैं।', {
        onStart: () => setIsSpeaking(true),
        onEnd: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      });
    }

    return () => {
      stopCamera();
      stopListening();
      speechManager.stop();
    };
  }, [isOpen, facingMode, startCamera, stopCamera, stopListening]);

  const toggleFacingMode = () => {
    soundEffects.playBeep();
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  const toggleTorch = async () => {
    if (!stream || !hasTorch) return;
    try {
      const track = stream.getVideoTracks()[0];
      const nextTorch = !isTorchOn;
      await (track as any).applyConstraints({
        advanced: [{ torch: nextTorch }],
      });
      setIsTorchOn(nextTorch);
      soundEffects.playBeep();
    } catch {
      // ignore torch constraint errors
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#07090e] text-white overflow-hidden animate-in fade-in duration-200">
      <canvas ref={canvasRef} className="hidden" />

      {/* Top Bar */}
      <div className="relative z-20 flex items-center justify-between gap-2 p-3 border-b border-slate-800 bg-[#07090e]/95">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-full overflow-hidden border border-[#ffd700]/60 bg-slate-900 shrink-0">
            <img
              src="./person-ai-assistant.png"
              alt="Live Camera Assistant"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <h2 className="font-chakra font-bold text-sm sm:text-base text-[#ffd700] truncate">
              Live Camera View
            </h2>
            <p className="text-[11px] text-slate-400 truncate">
              कैमरा एक्सेस चालू होने पर लाइव दृश्य से तुरंत मदद मिलेगी
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {hasTorch && (
            <button
              type="button"
              onClick={toggleTorch}
              aria-label="Toggle flashlight"
              className={`min-h-[44px] min-w-[44px] rounded-xl border flex items-center justify-center cursor-pointer ${
                isTorchOn
                  ? 'bg-[#ffd700] text-[#07090e] border-[#ffd700]'
                  : 'bg-slate-900 border-slate-700 text-slate-200'
              }`}
            >
              <Flame className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={toggleFacingMode}
            aria-label="Switch camera"
            title="Switch Camera"
            className="min-h-[44px] min-w-[44px] rounded-xl bg-slate-900 border border-slate-700 text-slate-200 flex items-center justify-center cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setIsMuted((m) => !m)}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
            className="min-h-[44px] min-w-[44px] rounded-xl bg-slate-900 border border-slate-700 text-slate-200 flex items-center justify-center cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-300" />}
          </button>

          <button
            type="button"
            onClick={() => {
              soundEffects.playBeep();
              onClose();
            }}
            aria-label="Close Live Camera"
            className="min-h-[44px] min-w-[44px] rounded-xl bg-slate-900 border border-slate-700 text-slate-200 flex items-center justify-center cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Camera Feed */}
      <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />

        {errorMessage && (
          <div className="absolute inset-x-4 top-4 max-w-md mx-auto p-3.5 rounded-xl bg-rose-950/90 border border-rose-500/60 text-rose-100 text-xs leading-relaxed">
            {errorMessage}
          </div>
        )}

        {liveReasoningResult && (
          <div className="absolute inset-x-3 bottom-4 max-w-xl mx-auto p-3.5 rounded-2xl bg-[#0b101d]/95 border border-[#ffd700]/50 space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-chakra font-bold text-[#ffd700] truncate">
                {liveReasoningResult.title}
              </span>
              {isSpeaking && (
                <button
                  type="button"
                  onClick={() => {
                    speechManager.stop();
                    setIsSpeaking(false);
                  }}
                  className="text-[11px] text-amber-300 underline cursor-pointer shrink-0"
                >
                  Stop Voice
                </button>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-100 font-hindi leading-relaxed">
              {liveReasoningResult.finalAnswer}
            </p>
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="p-3 bg-[#07090e] border-t border-slate-800 space-y-2.5">
        <div className="max-w-xl mx-auto flex items-center gap-2">
          <input
            type="text"
            value={voiceQuery}
            onChange={(e) => setVoiceQuery(e.target.value)}
            placeholder="कैमरे के बारे में पूछें (जैसे: यह क्या है?)"
            className="flex-1 min-h-[44px] px-3.5 rounded-xl bg-[#0e1424] border border-slate-700 focus:border-[#ffd700] text-sm text-slate-100 placeholder-slate-400 outline-none font-hindi"
          />

          <button
            type="button"
            onClick={isListening ? stopListening : startListening}
            aria-label="Speak query"
            className={`min-h-[44px] min-w-[44px] rounded-xl flex items-center justify-center cursor-pointer ${
              isListening
                ? 'bg-rose-600 text-white'
                : 'bg-slate-800 text-slate-200 hover:text-[#ffd700]'
            }`}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <button
            type="button"
            disabled={isAnalyzing}
            onClick={() => captureAndReason()}
            className="min-h-[44px] px-4 rounded-xl bg-[#ffd700] hover:bg-amber-300 disabled:opacity-60 text-[#07090e] font-chakra font-bold text-xs flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            {isAnalyzing ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Checking...</span>
              </>
            ) : (
              <>
                <Camera className="w-4 h-4" />
                <span>Check Frame</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
