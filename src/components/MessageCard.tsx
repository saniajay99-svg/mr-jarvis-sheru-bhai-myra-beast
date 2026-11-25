import React from 'react';
import { 
  Volume2, 
  VolumeX, 
  Sparkles, 
  CheckCircle2, 
  Lightbulb, 
  Zap, 
  ArrowRight, 
  Share2, 
  FileText, 
  Video, 
  ArrowDown, 
  Crown,
  HelpCircle,
  PhoneCall,
  Flame,
  BatteryCharging,
  Timer,
  MapPin,
  Youtube,
  Copy,
  Smartphone,
  Check,
  Globe,
  ExternalLink
} from 'lucide-react';
import { QAItem, PhoneAction } from '../types';
import { soundEffects } from '../utils/audio';

interface MessageCardProps {
  item: QAItem;
  ownerCallout?: string;
  isSpeakingThis: boolean;
  onPlaySpeech: (text: string, itemId: string) => void;
  onStopSpeech: () => void;
  onFollowUpClick: (prompt: string) => void;
  onShareWhatsApp: (text?: string) => void;
  onExecutePhoneAction?: (action: PhoneAction, itemId: string) => void;
}

export const MessageCard: React.FC<MessageCardProps> = ({
  item,
  ownerCallout = 'Master Ajay',
  isSpeakingThis,
  onPlaySpeech,
  onStopSpeech,
  onFollowUpClick,
  onShareWhatsApp,
  onExecutePhoneAction,
}) => {
  const resp = item.response;
  const media = item.questionMedia;
  const phoneAction = resp?.phoneAction;
  const isStanding = Boolean(item.standingMode || resp?.standingMode);

  const handleShare = () => {
    soundEffects.playBeep();
    if (resp) {
      const shareText = `*Mr Jarvis Sheru Bhai Myra Beast Voice Assistant — ${ownerCallout}* 👑\n\n❓ *सवाल:* ${item.questionText}\n\n✅ *जवाब:* ${resp.finalAnswer}\n\n📌 *विवरण:* ${resp.title}\n💡 _सुझाव: ${resp.beastTip}_`;
      onShareWhatsApp(shareText);
    } else {
      onShareWhatsApp(`*${ownerCallout}:* ${item.questionText}`);
    }
  };

  const renderPhoneActionIcon = (type: string) => {
    switch (type) {
      case 'call': return <PhoneCall className="w-5 h-5 text-emerald-400" />;
      case 'whatsapp': return <Share2 className="w-5 h-5 text-green-400" />;
      case 'flashlight': return <Flame className="w-5 h-5 text-amber-400" />;
      case 'battery': return <BatteryCharging className="w-5 h-5 text-cyan-400" />;
      case 'timer': return <Timer className="w-5 h-5 text-yellow-400" />;
      case 'maps': return <MapPin className="w-5 h-5 text-rose-400" />;
      case 'youtube': return <Youtube className="w-5 h-5 text-red-500" />;
      case 'copy': return <Copy className="w-5 h-5 text-blue-400" />;
      case 'vibrate': return <Smartphone className="w-5 h-5 text-purple-400" />;
      default: return <Zap className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <div
      className={`w-full max-w-4xl mx-auto mb-6 rounded-2xl bg-[#090d18] overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300 ${
        isStanding
          ? 'border-2 border-[#ffd700]/80 shadow-[0_0_32px_rgba(255,215,0,0.2)]'
          : 'border border-amber-500/30 shadow-2xl shadow-black/80'
      }`}
    >
      
      {/* ======================================================== */}
      {/* 1. QUESTION ON TOP (Strict Question-Answer Layout)     */}
      {/* ======================================================== */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-950/40 via-[#0d1424] to-slate-900 border-b border-amber-500/20">
        {/* Question Header */}
        <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden border-2 border-amber-400 p-0.5 bg-gradient-to-tr from-amber-500 to-yellow-300 shadow-md shadow-amber-500/20">
                <img
                  src="./ajay-crown.png"
                  alt="Master Ajay Boss"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <span className="absolute -top-1 -right-1 p-0.5 rounded-full bg-amber-500 text-slate-950 shadow">
                <Crown className="w-2.5 h-2.5 fill-slate-950" />
              </span>
            </div>

            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-chakra font-bold text-xs text-amber-300 uppercase tracking-wider flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                  {ownerCallout}
                </span>
                {item.modelModeLabel && (
                  <span className="text-[11px] text-slate-400">
                    · {item.modelModeLabel}
                  </span>
                )}
              </div>
              <span className="text-[10px] text-slate-500">
                {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                {item.engineUsed ? ` · ${item.engineUsed.toUpperCase()}` : ''}
              </span>
            </div>
          </div>
        </div>

        {/* Media Preview if attached (Image, Video, Document) */}
        {media && (
          <div className="mb-3">
            {media.type === 'image' && (
              <div className="rounded-xl overflow-hidden border border-amber-400/40 max-h-64 bg-black/60 flex items-center justify-center">
                <img
                  src={media.base64}
                  alt={media.name || "Attached Homework"}
                  className="max-h-64 w-auto object-contain"
                />
              </div>
            )}
            {media.type === 'video' && (
              <div className="rounded-xl overflow-hidden border border-cyan-400/40 max-h-64 bg-black">
                <video
                  src={media.base64}
                  controls
                  className="w-full h-auto max-h-64"
                />
              </div>
            )}
            {media.type === 'pdf' && (
              <div className="p-3 rounded-xl bg-slate-900/90 border border-emerald-400/40 flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="truncate">
                  <span className="text-xs font-bold text-slate-100 block truncate">{media.name}</span>
                  <span className="text-[10px] text-emerald-300 uppercase">Document / PDF Attached</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Question Text with clear line breaks & readable spacing */}
        <div className="text-sm sm:text-base font-medium text-slate-100 whitespace-pre-wrap leading-relaxed font-hindi">
          {item.questionText}
        </div>
      </div>

      {/* Subtle Answer Divider */}
      <div className="py-2 px-4 bg-[#070a14] border-y border-slate-800/80 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-[11px] font-chakra font-bold uppercase tracking-wider text-amber-400">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>
            {isStanding
              ? 'Standing Mode Deep-Scan'
              : (resp?.modelModeLabel || item.modelModeLabel || 'Assistant Response')}
          </span>
        </div>
        <ArrowDown className="w-3.5 h-3.5 text-slate-500" />
      </div>

      {/* ======================================================== */}
      {/* 2. ANSWER AT THE BOTTOM (Strict Question-Answer Layout) */}
      {/* ======================================================== */}
      <div className="p-4 sm:p-5 space-y-4 bg-[#0a0f1d]/90">
        
        {/* Thinking State */}
        {item.status === 'thinking' && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-900/80 border border-amber-500/30 animate-pulse">
            <div className="w-9 h-9 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-400 shrink-0">
              <Sparkles className="w-5 h-5 animate-spin" />
            </div>
            <div>
              <p className="text-sm font-semibold text-amber-200 font-hindi">
                {ownerCallout}, जवाब तैयार हो रहा है...
              </p>
              <p className="text-xs text-slate-400 font-hindi">
                Mr Jarvis Sheru Bhai Myra Beast Voice Assistant सुन और समझ रहा है
              </p>
            </div>
          </div>
        )}

        {/* Calm Service Load Notice (No technical errors shown) */}
        {item.status === 'error' && (
          <div className="p-4 rounded-xl bg-amber-950/35 border border-amber-500/40 text-amber-100 space-y-1.5">
            <p className="text-sm font-medium font-hindi leading-relaxed">
              {item.error || `${ownerCallout}, अभी सेवा पर थोड़ा लोड है — कृपया कुछ सेकंड बाद फिर बोलें या भेजें।`}
            </p>
          </div>
        )}

        {/* Answer Content */}
        {item.status === 'answered' && resp && (
          <>
            {/* Answer Header Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-full overflow-hidden border border-cyan-400/70 shrink-0 bg-slate-900">
                  <img
                    src="./person-ai-assistant.png"
                    alt="Person AI Assistant Sheru Bhai"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="font-chakra font-bold text-sm sm:text-base text-amber-200 truncate">
                    {resp.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 truncate">
                    <span className="text-[#ffd700] font-medium">
                      {resp.modelModeLabel || item.modelModeLabel || 'Sheru Bhai Voice Mode'}
                    </span>
                    {resp.modelName ? ` · ${resp.modelName}` : ''}
                    {resp.subjectCategory ? ` · ${resp.subjectCategory}` : ''}
                  </p>
                </div>
              </div>

              <button
                onClick={handleShare}
                title="Share Solution to WhatsApp"
                className="min-h-[36px] px-2.5 rounded-lg bg-emerald-950/70 hover:bg-emerald-900 text-emerald-300 border border-emerald-600/50 text-xs flex items-center gap-1 transition-all active:scale-95 shrink-0 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold">WhatsApp</span>
              </button>
            </div>

            {/* MANDATORY Voice Narration Box (Spoken YouTube-Style Voice) */}
            <div className={`p-3.5 rounded-xl border transition-all ${
              isSpeakingThis
                ? 'bg-gradient-to-r from-amber-950/50 via-cyan-950/50 to-slate-900 border-amber-400 shadow-lg shadow-amber-500/20'
                : 'bg-slate-900/90 border-amber-500/30 hover:border-amber-400/50'
            }`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-chakra font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                      🎙️ YouTube-Style Voice Narration (Auto-Spoken)
                    </span>
                    {isSpeakingThis && (
                      <div className="flex items-center gap-0.5 h-3">
                        <span className="w-1 bg-amber-400 rounded-full waveform-bar" style={{ animationDelay: '0.1s' }} />
                        <span className="w-1 bg-cyan-400 rounded-full waveform-bar" style={{ animationDelay: '0.3s' }} />
                        <span className="w-1 bg-amber-400 rounded-full waveform-bar" style={{ animationDelay: '0.2s' }} />
                        <span className="w-1 bg-cyan-400 rounded-full waveform-bar" style={{ animationDelay: '0.4s' }} />
                      </div>
                    )}
                  </div>
                  <p className="text-sm sm:text-base text-amber-100 font-medium italic leading-relaxed font-hindi">
                    "{resp.speechText}"
                  </p>
                </div>

                <button
                  onClick={() => {
                    soundEffects.playBeep();
                    if (isSpeakingThis) {
                      onStopSpeech();
                    } else {
                      const voiceScript = `${resp.speechText}. Final Answer: ${resp.finalAnswer}`;
                      onPlaySpeech(voiceScript, item.id);
                    }
                  }}
                  title={isSpeakingThis ? "Pause Voice" : "Re-listen Answer in Jarvis Voice"}
                  className={`p-2.5 rounded-xl border shrink-0 transition-all active:scale-95 ${
                    isSpeakingThis
                      ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-md shadow-amber-500/30'
                      : 'bg-slate-800 text-slate-200 border-slate-700 hover:text-amber-300 hover:border-amber-400'
                  }`}
                >
                  {isSpeakingThis ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* ======================================================== */}
            {/* JARVIS PHONE CONTROL TILE (Dynamic Phone Action)        */}
            {/* ======================================================== */}
            {phoneAction && phoneAction.actionType !== 'none' && (
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-cyan-950/50 via-slate-900 to-amber-950/40 border-2 border-cyan-500/50 shadow-lg shadow-cyan-500/10 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-cyan-500/20 border border-cyan-400/40">
                      {renderPhoneActionIcon(phoneAction.actionType)}
                    </div>
                    <div>
                      <span className="text-[10px] font-chakra font-black tracking-wider uppercase text-cyan-300 block">
                        JARVIS Phone Control Protocol
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-white">
                        {phoneAction.label}
                      </span>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                    item.actionExecuted 
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/50 animate-pulse'
                  }`}>
                    {item.actionExecuted ? 'EXECUTED' : 'READY'}
                  </span>
                </div>

                {phoneAction.target && (
                  <div className="px-3 py-1.5 rounded-lg bg-black/60 border border-slate-800 text-xs font-mono text-cyan-200 truncate">
                    Target: {phoneAction.target}
                  </div>
                )}

                <button
                  onClick={() => {
                    soundEffects.playJarvisWake();
                    onExecutePhoneAction?.(phoneAction, item.id);
                  }}
                  className={`w-full py-2.5 rounded-xl text-xs font-chakra font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95 ${
                    item.actionExecuted
                      ? 'bg-slate-800 text-emerald-300 border border-emerald-500/40 hover:bg-slate-700'
                      : 'bg-gradient-to-r from-cyan-500 via-teal-400 to-amber-400 text-slate-950 shadow-md shadow-cyan-500/20'
                  }`}
                >
                  {item.actionExecuted ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Re-Execute Phone Action for {ownerCallout}</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      <span>Execute Phone Action on Real Device</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Step-by-Step Derivations & Calculations */}
            {resp.steps && resp.steps.length > 0 && (
              <div className="space-y-2 pt-1">
                <h4 className="text-xs font-chakra font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-[#ffd700]" />
                  {isStanding
                    ? '⚡ Complete Deep-Scan Breakdown (कच्चा चिट्ठा):'
                    : 'Step-by-Step Explanation:'}
                </h4>

                <div className="space-y-2">
                  {resp.steps.map((st) => (
                    <div
                      key={st.stepNumber}
                      className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 text-[11px] font-bold flex items-center justify-center shrink-0">
                          {st.stepNumber}
                        </span>
                        <span className="text-xs sm:text-sm font-semibold text-slate-200 font-hindi">
                          {st.title}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-300 pl-7 leading-relaxed font-hindi">
                        {st.detail}
                      </p>

                      {st.formulaOrCode && (
                        <div className="ml-7 mt-1.5 px-3 py-1.5 rounded-lg bg-black/60 border border-slate-800 font-mono text-xs text-amber-300 overflow-x-auto">
                          {st.formulaOrCode}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 🏆 Highlighted Final Answer (Prominent Box) */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-amber-950/30 border-2 border-amber-400/80 space-y-1.5 shadow-lg shadow-amber-500/10">
              <div className="flex items-center gap-2 text-xs font-chakra font-bold uppercase tracking-wider text-amber-400">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                {ownerCallout} — मुख्य जवाब
              </div>
              <div className="text-sm sm:text-base font-bold text-amber-100 font-hindi leading-snug">
                {resp.finalAnswer}
              </div>
            </div>

            {/* Grounded Google Maps / Google Search Links */}
            {resp.groundingLinks && resp.groundingLinks.length > 0 && (
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-cyan-500/40 space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-chakra font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
                    {resp.groundingType === 'maps' ? (
                      <>
                        <MapPin className="w-4 h-4 text-rose-400" />
                        Google Maps Places &amp; Directions ({resp.groundingLinks.length})
                      </>
                    ) : (
                      <>
                        <Globe className="w-4 h-4 text-cyan-400" />
                        Google Search Sources ({resp.groundingLinks.length})
                      </>
                    )}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {resp.groundingLinks.map((link, idx) => (
                    <a
                      key={`${link.uri}-${idx}`}
                      href={link.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-amber-400/60 transition-all flex flex-col gap-1 group"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-amber-200 group-hover:text-amber-300 truncate flex items-center gap-1.5">
                          {link.sourceType === 'maps' ? (
                            <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                          ) : (
                            <Globe className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          )}
                          <span className="truncate">{link.title}</span>
                        </span>
                        <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-amber-300 shrink-0" />
                      </div>
                      {link.snippets && link.snippets.length > 0 && (
                        <p className="text-[11px] text-slate-400 line-clamp-2 leading-snug">
                          “{link.snippets[0]}”
                        </p>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* 💡 Beast Power Tip / Mnemonic */}
            {resp.beastTip && (
              <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-800/50 flex items-start gap-2.5 text-xs text-cyan-200">
                <Lightbulb className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <span className="font-bold text-cyan-300">Mr Jarvis Beast Power Tip: </span>
                  {resp.beastTip}
                </div>
              </div>
            )}

            {/* Suggested Follow-Up Prompts */}
            {resp.suggestedPrompts && resp.suggestedPrompts.length > 0 && (
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <span className="text-[11px] font-semibold text-slate-400">
                  {ownerCallout}, आगे क्या पूछें या चलाएं?
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {resp.suggestedPrompts.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        soundEffects.playBeep();
                        onFollowUpClick(p);
                      }}
                      className="group px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-amber-500/20 border border-slate-800 hover:border-amber-400/50 text-[11px] text-slate-300 hover:text-amber-200 transition-all flex items-center gap-1 active:scale-95"
                    >
                      <span>{p}</span>
                      <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-amber-400 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

    </div>
  );
};
