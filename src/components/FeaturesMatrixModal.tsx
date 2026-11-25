import React from 'react';
import { 
  X, 
  Crown, 
  CheckCircle2, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  Cpu, 
  Radio, 
  Camera, 
  Volume2, 
  Share2, 
  Phone, 
  Youtube, 
  Clock, 
  FileText, 
  Video, 
  Image as ImageIcon,
  Infinity as InfinityIcon,
  Smartphone,
  Sliders
} from 'lucide-react';
import { soundEffects } from '../utils/audio';

interface FeaturesMatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeaturesMatrixModal: React.FC<FeaturesMatrixModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const features = [
    {
      num: 1,
      title: 'Royal Crown 500M Branding Header',
      detail: "Custom master royal insignia with golden 500M Subscribers crown theme dedicated exclusively to Aijay Boss.",
      icon: Crown,
      tag: 'Brand',
      color: 'from-amber-500 to-yellow-400 text-slate-950',
    },
    {
      num: 2,
      title: 'Strict Question-Top / Answer-Bottom Layout',
      detail: "Clean visual separation with Question on TOP and Answer at the BOTTOM separated by downward AI connector.",
      icon: Zap,
      tag: 'Layout',
      color: 'from-cyan-500 to-blue-500 text-white',
    },
    {
      num: 3,
      title: 'Interactive Action Tile Popup Menu (`+` button)',
      detail: "Instant popup grid providing 1-tap shortcuts to all visual, media, communication, and engine controls.",
      icon: Sparkles,
      tag: 'UI Hub',
      color: 'from-purple-500 to-pink-500 text-white',
    },
    {
      num: 4,
      title: 'MANDATORY Auto-TTS High-Quality Voice Narration',
      detail: "Automatic spoken narration of answers in sweet, clear, high-energy YouTube host voice as soon as generated.",
      icon: Volume2,
      tag: 'Voice',
      color: 'from-emerald-500 to-teal-400 text-slate-950',
    },
    {
      num: 5,
      title: 'Frame-by-Frame Live Camera Scan',
      detail: "High-resolution real-time live viewfinder capture with cybernetic target reticle and instant frame inspection.",
      icon: Camera,
      tag: 'Vision',
      color: 'from-amber-400 to-orange-500 text-slate-950',
    },
    {
      num: 6,
      title: 'Direct Audio-to-Audio Processing',
      detail: "Real-time speech-to-text recognition with natural voice parsing and seamless audio feedback loop.",
      icon: Radio,
      tag: 'Audio',
      color: 'from-cyan-400 to-indigo-500 text-white',
    },
    {
      num: 7,
      title: 'Smart Precision & Answer-Length Control',
      detail: "Configurable reasoning modes: Concise Summary, Step-by-Step Rigorous Proofs, and Detailed Explanations.",
      icon: Sliders,
      tag: 'Reasoning',
      color: 'from-indigo-500 to-blue-600 text-white',
    },
    {
      num: 8,
      title: 'Infinity ♾️ Flash Multi-Engine Live Switcher',
      detail: "Ad-free & unlimited access across Gemini Infinity ♾️ Flash, ChatGPT Infinity ♾️ Flash, and Claude Infinity ♾️ Flash.",
      icon: InfinityIcon,
      tag: 'Core AI',
      color: 'from-rose-500 to-amber-500 text-white',
    },
    {
      num: 9,
      title: 'Native Mobile Phone UI Execution',
      detail: "Runs directly on Aijay Boss's real phone screen with native virtual keyboard support and zero simulated frames.",
      icon: Smartphone,
      tag: 'Native',
      color: 'from-blue-600 to-cyan-500 text-white',
    },
    {
      num: 10,
      title: 'Instant WhatsApp Direct Share Shortcut',
      detail: "1-Tap formatted solution export to WhatsApp with clean question, answer, and Beast tips prefilled.",
      icon: Share2,
      tag: 'Share',
      color: 'from-green-500 to-emerald-600 text-white',
    },
    {
      num: 11,
      title: 'One-Touch Direct Phone Call Dialer',
      detail: "Integrated hardware speed-dialer and helpline launcher executing immediate `tel:` phone calls.",
      icon: Phone,
      tag: 'Telephony',
      color: 'from-blue-500 to-indigo-600 text-white',
    },
    {
      num: 12,
      title: 'Auto MrBeast YouTube Redirection',
      detail: "Exclusive 500M milestone celebration portal with direct 1-click confirmation to YouTube @MrBeast.",
      icon: Youtube,
      tag: 'YouTube',
      color: 'from-red-600 to-rose-500 text-white',
    },
    {
      num: 13,
      title: 'Integrated Real-Time Clock & Time Engine',
      detail: "Live Indian Standard Time (IST) atomic clock with full-screen freedom timer and exam countdowns.",
      icon: Clock,
      tag: 'Clock',
      color: 'from-yellow-400 to-amber-500 text-slate-950',
    },
    {
      num: 14,
      title: 'Instant PDF & Document Analyzer',
      detail: "Direct document picker parsing syllabus, class notes, and academic homework PDFs for step-by-step solving.",
      icon: FileText,
      tag: 'Documents',
      color: 'from-emerald-500 to-teal-400 text-slate-950',
    },
    {
      num: 15,
      title: 'Video Media Preview & Reasoning',
      detail: "High-capacity video upload pipeline with inline playback and multimodal AI motion analysis.",
      icon: Video,
      tag: 'Video AI',
      color: 'from-cyan-500 to-blue-500 text-white',
    },
    {
      num: 16,
      title: 'Smart Photo Gallery Integration',
      detail: "Dedicated photo album picker allowing direct import from phone photo gallery into AI vision solver.",
      icon: ImageIcon,
      tag: 'Gallery',
      color: 'from-amber-500 to-yellow-400 text-slate-950',
    },
    {
      num: 17,
      title: 'Zero Memory Fallback (Dynamic Real-Time Computing)',
      detail: "Completely eliminates hardcoded canned responses; every prompt is actively evaluated by live AI engines.",
      icon: Cpu,
      tag: 'Dynamic',
      color: 'from-violet-500 to-purple-600 text-white',
    },
    {
      num: 18,
      title: 'Ultra-Low Latency Response',
      detail: "Sub-second inference powered by the Gemini 3.1 Flash-Lite high-throughput cascade pipeline.",
      icon: Zap,
      tag: 'Speed',
      color: 'from-cyan-400 to-teal-400 text-slate-950',
    },
    {
      num: 19,
      title: 'Exclusively Dedicated to Master Ajay Boss (Rishikesh)',
      detail: "Built exclusively for Master Ajay Boss in Rishikesh with personalized honorifics, custom tone, and private secretary duty.",
      icon: ShieldCheck,
      tag: 'Master',
      color: 'from-amber-400 via-yellow-400 to-cyan-400 text-slate-950',
    },
    {
      num: 20,
      title: 'Myra Voice Engine & Dual-Engine Intelligence',
      detail: "Dual-Engine collaboration between Jarvis Neural Core and Myra Voice Engine with natural sweet speech synthesis and vivo V17 optimization.",
      icon: Sparkles,
      tag: 'Jarvis & Myra',
      color: 'from-purple-500 via-fuchsia-400 to-amber-300 text-slate-950',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0b101f] border-2 border-amber-400/50 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl shadow-amber-500/20 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-amber-950/60 via-slate-900 to-cyan-950/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-amber-400 p-0.5 bg-gradient-to-tr from-amber-500 to-yellow-300 shadow-md">
              <img
                src="./assets/aistudio/file_0000000006c08208b358c43353e457af_69c155c6.webp"
                alt="500M Crown Logo & Person AI Assistant"
                className="w-full h-full object-cover object-[center_18%] rounded-lg"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-chakra font-black text-base text-amber-200 tracking-wide">
                  THE 20 WORLD-CLASS FEATURES MATRIX
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 uppercase">
                  20/20 ACTIVE
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-hindi">
                Dedicated Exclusively to Master Ajay Boss (Rishikesh) • Real-Time Operational Status
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundEffects.playBeep();
              onClose();
            }}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Features Matrix Grid */}
        <div className="p-4 overflow-y-auto space-y-2.5 flex-1 pr-2">
          <div className="p-3 rounded-xl bg-gradient-to-r from-amber-950/30 via-slate-900 to-cyan-950/30 border border-amber-500/20 flex items-center justify-between text-xs">
            <span className="font-chakra font-bold text-amber-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Infinity ♾️ Flash Multi-Engine Core (Ad-Free & Unlimited)
            </span>
            <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              All 19 Systems Online
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {features.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.num}
                  className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-amber-400/50 transition-all flex items-start gap-2.5 shadow-sm"
                >
                  <div className={`p-2 rounded-lg bg-gradient-to-tr ${feat.color} shrink-0 shadow-sm mt-0.5`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="font-chakra font-bold text-xs text-slate-200 truncate">
                        {feat.num}. {feat.title}
                      </span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    </div>
                    <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">
                      {feat.detail}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-[#070a14] flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1 text-amber-300 font-chakra font-semibold">
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            Mr Jarvis Beast • Private Secretary to Aijay Boss
          </span>
          <button
            onClick={() => {
              soundEffects.playSuccessChime();
              onClose();
            }}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-chakra font-bold text-xs uppercase tracking-wider hover:from-amber-400 hover:to-yellow-300 active:scale-95 transition-all cursor-pointer"
          >
            Got It, Jarvis!
          </button>
        </div>
      </div>
    </div>
  );
};
