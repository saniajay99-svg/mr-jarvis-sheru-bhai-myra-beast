import React, { useState } from 'react';
import { 
  Film, 
  Cpu, 
  Camera, 
  FileText, 
  Mic, 
  Share2, 
  PhoneCall, 
  Flame, 
  BatteryCharging, 
  Clock, 
  Youtube, 
  Smartphone, 
  Sparkles, 
  Crown, 
  Star, 
  Search, 
  CheckCircle2, 
  Zap, 
  ArrowRight, 
  ShieldCheck, 
  Tag, 
  SlidersHorizontal 
} from 'lucide-react';
import { soundEffects } from '../utils/audio';
import { EngineType } from '../types';

interface MeeshoMarketplaceHubProps {
  onOpenPhotoToVideo: () => void;
  onOpenLiveVision: () => void;
  onOpenDialer: () => void;
  onOpenMrBeast: () => void;
  onOpenClock: () => void;
  onShareWhatsApp: (text?: string) => void;
  onToggleTorch?: () => void;
  onCheckBattery?: () => void;
  onTriggerVoice?: () => void;
  onOpenFilePicker?: (type: 'pdf' | 'image' | 'video') => void;
  onOpenApkModal?: () => void;
  onSelectEngine?: (engine: EngineType) => void;
  currentEngine?: EngineType;
  isTorchOn?: boolean;
}

interface MarketplaceProduct {
  id: string;
  title: string;
  subtitle: string;
  category: 'video' | 'neural' | 'vision' | 'phone' | 'academic';
  badge: string;
  badgeColor: string;
  rating: number;
  reviewsCount: string;
  originalPrice: string;
  dealPrice: string;
  discount: string;
  icon: any;
  iconGradient: string;
  actionText: string;
  features: string[];
  onAction: () => void;
}

export const MeeshoMarketplaceHub: React.FC<MeeshoMarketplaceHubProps> = ({
  onOpenPhotoToVideo,
  onOpenLiveVision,
  onOpenDialer,
  onOpenMrBeast,
  onOpenClock,
  onShareWhatsApp,
  onToggleTorch,
  onCheckBattery,
  onTriggerVoice,
  onOpenFilePicker,
  onOpenApkModal,
  onSelectEngine,
  currentEngine = 'auto',
  isTorchOn = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'video' | 'neural' | 'vision' | 'phone' | 'academic'>('all');

  const products: MarketplaceProduct[] = [
    {
      id: 'photo-to-video',
      title: 'Photo-to-Video AI Engine',
      subtitle: 'Transform any photo into 4K cinematic animation with camera motion prompts.',
      category: 'video',
      badge: 'NEW LAUNCH 🎬',
      badgeColor: 'from-rose-500 to-amber-500 text-white',
      rating: 5.0,
      reviewsCount: '520M+',
      originalPrice: '₹4,999',
      dealPrice: '₹0 FREE',
      discount: '100% OFF',
      icon: Film,
      iconGradient: 'from-amber-400 via-rose-500 to-cyan-400',
      actionText: 'CREATE VIDEO 🎬',
      features: ['60fps Canvas Player', '3D Camera Orbit', 'Download WebM/MP4'],
      onAction: () => {
        soundEffects.playJarvisWake();
        onOpenPhotoToVideo();
      },
    },
    {
      id: 'gemini-neural',
      title: 'Gemini Neural Core (Infinity Flash)',
      subtitle: 'Ad-free multi-engine switcher: Gemini, ChatGPT & Claude Infinity Flash.',
      category: 'neural',
      badge: 'UNLIMITED ♾️',
      badgeColor: 'from-cyan-500 to-blue-600 text-white',
      rating: 5.0,
      reviewsCount: '490M+',
      originalPrice: '₹9,999',
      dealPrice: '₹0 FREE',
      discount: '100% OFF',
      icon: Cpu,
      iconGradient: 'from-cyan-400 to-indigo-500',
      actionText: 'SWITCH ENGINE 🧠',
      features: ['Gemini Infinity Flash', 'ChatGPT Logic', 'Claude Proofs'],
      onAction: () => {
        soundEffects.playBeep();
        onSelectEngine?.(currentEngine === 'gemini' ? 'chatgpt' : currentEngine === 'chatgpt' ? 'claude' : 'gemini');
      },
    },
    {
      id: 'live-vision-cam',
      title: '48MP Camera & Live Vision Stream',
      subtitle: 'Real-time visual reasoning for academic problems, handwriting, and live scenes.',
      category: 'vision',
      badge: 'WORLD NO. 1 👑',
      badgeColor: 'from-amber-400 to-yellow-500 text-slate-950 font-black',
      rating: 5.0,
      reviewsCount: '580M+',
      originalPrice: '₹2,999',
      dealPrice: '₹0 FREE',
      discount: '100% OFF',
      icon: Camera,
      iconGradient: 'from-amber-400 via-yellow-400 to-cyan-400',
      actionText: 'SCAN CAMERA 📷',
      features: ['Frame-by-Frame AI', 'Zero Delay Reasoning', 'Homework Solver'],
      onAction: () => {
        soundEffects.playJarvisWake();
        onOpenLiveVision();
      },
    },
    {
      id: 'pdf-analyzer',
      title: 'Smart PDF & Document Analyzer',
      subtitle: 'Extract text, solve question papers, and analyze notes from documents.',
      category: 'academic',
      badge: 'ACADEMIC PRO 📄',
      badgeColor: 'from-emerald-500 to-teal-600 text-white',
      rating: 4.9,
      reviewsCount: '340M+',
      originalPrice: '₹1,499',
      dealPrice: '₹0 FREE',
      discount: '100% OFF',
      icon: FileText,
      iconGradient: 'from-emerald-400 to-teal-500',
      actionText: 'ANALYZE PDF 📄',
      features: ['Instant Text Extraction', 'Exam Paper Breakdown', 'Multi-Page'],
      onAction: () => {
        soundEffects.playBeep();
        onOpenFilePicker?.('pdf');
      },
    },
    {
      id: 'voice-speech-tts',
      title: 'Direct Voice Control & Auto-TTS',
      subtitle: 'Hands-free voice recognition with mandatory loud, clear audio narration in Hindi/English.',
      category: 'phone',
      badge: 'MANDATORY TTS 🎙️',
      badgeColor: 'from-yellow-400 to-amber-500 text-slate-950 font-black',
      rating: 5.0,
      reviewsCount: '510M+',
      originalPrice: '₹3,499',
      dealPrice: '₹0 FREE',
      discount: '100% OFF',
      icon: Mic,
      iconGradient: 'from-amber-400 via-yellow-300 to-cyan-400',
      actionText: 'SPEAK VOICE 🎙️',
      features: ['Bilingual Speech-to-Text', 'Sweet YouTube Narration', 'Hands-Free'],
      onAction: () => {
        soundEffects.playJarvisWake();
        onTriggerVoice?.();
      },
    },
    {
      id: 'whatsapp-direct',
      title: 'WhatsApp Direct Express Share',
      subtitle: '1-tap instant solution and notes sharing directly into WhatsApp chats.',
      category: 'phone',
      badge: '1-TAP SHARE 💬',
      badgeColor: 'from-green-500 to-emerald-600 text-white',
      rating: 4.9,
      reviewsCount: '460M+',
      originalPrice: '₹999',
      dealPrice: '₹0 FREE',
      discount: '100% OFF',
      icon: Share2,
      iconGradient: 'from-green-400 to-emerald-600',
      actionText: 'SHARE NOW 💬',
      features: ['Instant Q&A Forwarding', 'Native WhatsApp Intent', 'Formatted Markdown'],
      onAction: () => {
        soundEffects.playBeep();
        onShareWhatsApp('Namaste Aijay Boss! Mr Jarvis Beast is active on my phone!');
      },
    },
    {
      id: 'phone-dialer',
      title: 'One-Touch Phone Dialer & Speed Call',
      subtitle: 'Direct call dialer integration with speed dial contacts for Master Aijay Boss.',
      category: 'phone',
      badge: 'SPEED DIAL 📞',
      badgeColor: 'from-blue-500 to-indigo-600 text-white',
      rating: 4.9,
      reviewsCount: '410M+',
      originalPrice: '₹799',
      dealPrice: '₹0 FREE',
      discount: '100% OFF',
      icon: PhoneCall,
      iconGradient: 'from-blue-500 to-indigo-600',
      actionText: 'OPEN DIALER 📞',
      features: ['Quick Keypad', 'Emergency Calling', 'Native Android Call'],
      onAction: () => {
        soundEffects.playBeep();
        onOpenDialer();
      },
    },
    {
      id: 'hardware-torch',
      title: 'vivo V17 Hardware Torch Controller',
      subtitle: isTorchOn ? 'Flashlight is currently ACTIVE. Tap to turn off.' : 'Toggle real phone flashlight hardware with zero latency.',
      category: 'phone',
      badge: isTorchOn ? 'ACTIVE ⚡' : 'HARDWARE 🔦',
      badgeColor: isTorchOn ? 'from-amber-400 to-yellow-300 text-slate-950 font-black' : 'from-amber-600 to-yellow-600 text-white',
      rating: 5.0,
      reviewsCount: '380M+',
      originalPrice: '₹499',
      dealPrice: '₹0 FREE',
      discount: '100% OFF',
      icon: Flame,
      iconGradient: 'from-yellow-400 to-amber-600',
      actionText: isTorchOn ? 'TORCH OFF 🔦' : 'TORCH ON 🔦',
      features: ['Hardware Camera Flash', 'Screen Brightness Beacon', 'Instant On/Off'],
      onAction: () => {
        soundEffects.playJarvisWake();
        onToggleTorch?.();
      },
    },
    {
      id: 'battery-diagnostic',
      title: 'Dual-Engine Fast Charge Diagnostic',
      subtitle: 'Real-time battery level, charging speed, and health diagnostics optimized for vivo V17.',
      category: 'phone',
      badge: 'vivo V17 🔋',
      badgeColor: 'from-cyan-500 to-teal-500 text-slate-950 font-black',
      rating: 4.9,
      reviewsCount: '310M+',
      originalPrice: '₹899',
      dealPrice: '₹0 FREE',
      discount: '100% OFF',
      icon: BatteryCharging,
      iconGradient: 'from-cyan-400 to-teal-500',
      actionText: 'TEST BATTERY 🔋',
      features: ['Live Percentage Check', 'Charging Voltage Monitor', 'Funtouch OS Specs'],
      onAction: () => {
        soundEffects.playBeep();
        onCheckBattery?.();
      },
    },
    {
      id: 'atomic-clock',
      title: 'Atomic IST Clock & Freedom Engine',
      subtitle: 'Real-time Indian Standard Time clock, exam countdown, and post-exam freedom celebration.',
      category: 'phone',
      badge: 'LIVE IST ⏰',
      badgeColor: 'from-amber-500 to-orange-500 text-slate-950 font-bold',
      rating: 5.0,
      reviewsCount: '470M+',
      originalPrice: '₹699',
      dealPrice: '₹0 FREE',
      discount: '100% OFF',
      icon: Clock,
      iconGradient: 'from-amber-400 to-orange-500',
      actionText: 'OPEN CLOCK ⏰',
      features: ['IST Millisecond Sync', 'Post-Exam Freedom Timer', 'Celebration Audio'],
      onAction: () => {
        soundEffects.playBeep();
        onOpenClock();
      },
    },
    {
      id: 'mrbeast-portal',
      title: 'YouTube MrBeast 500M Portal',
      subtitle: 'Auto-subscribe redirection and post-exam Beast celebration portal for Master Aijay Boss.',
      category: 'phone',
      badge: '500M CROWN 🏆',
      badgeColor: 'from-red-600 to-rose-600 text-white',
      rating: 5.0,
      reviewsCount: '500M+',
      originalPrice: '₹1,999',
      dealPrice: '₹0 FREE',
      discount: 'VIP EXCLUSIVE',
      icon: Youtube,
      iconGradient: 'from-red-500 to-rose-600',
      actionText: 'VISIT MRBEAST 🏆',
      features: ['500M Subscribers Trophy', 'Direct YouTube Link', 'Pure Beast Hype'],
      onAction: () => {
        soundEffects.playBeep();
        onOpenMrBeast();
      },
    },
    {
      id: 'apk-installer',
      title: 'Single-Click APK Installer',
      subtitle: 'build.output: com.aijayboss.mrjarvisbeast.apk with instant download & GitHub Release.',
      category: 'phone',
      badge: 'PRODUCTION 📱',
      badgeColor: 'from-emerald-400 to-cyan-400 text-slate-950 font-black',
      rating: 5.0,
      reviewsCount: '500M+',
      originalPrice: '₹14,999',
      dealPrice: '₹0 FREE',
      discount: '100% OFF',
      icon: Smartphone,
      iconGradient: 'from-emerald-400 via-teal-400 to-cyan-400',
      actionText: 'INSTALL APK 📱',
      features: ['com.aijayboss.mrjarvisbeast', 'GitHub Release Sync', 'vivo V17 Ready'],
      onAction: () => {
        soundEffects.playSuccessChime();
        onOpenApkModal?.();
      },
    },
  ];

  const filteredProducts = products.filter((prod) => {
    const matchesCategory = selectedFilter === 'all' || prod.category === selectedFilter;
    const matchesSearch = prod.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          prod.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          prod.badge.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full max-w-5xl mx-auto space-y-4 animate-in fade-in duration-300">
      
      {/* Royal Dark-Mode Meesho Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#11071f] via-[#090e1c] to-[#04101d] border-2 border-amber-500/40 p-4 sm:p-5 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-gradient-to-br from-amber-500/20 via-rose-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-chakra font-black text-sm sm:text-base tracking-wider bg-gradient-to-r from-amber-300 via-rose-300 to-cyan-300 bg-clip-text text-transparent">
                👑 AIJAY BOSS VIP MARKETPLACE
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40">
                MEESHO ROYAL GRID
              </span>
              <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-700/50">
                vivo V17 Edition
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              All 12 Elite Assistant Tools, AI Engines &amp; Hardware Features unlocked at <strong>₹0 (100% FREE for Master Ajay Boss)</strong> with 0-sec instant delivery.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="px-3 py-1.5 rounded-xl bg-slate-900/90 border border-amber-400/40 flex items-center gap-2 shadow-lg">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-amber-400 p-0.5 bg-gradient-to-tr from-amber-500 to-yellow-300">
                <img
                  src="./assets/aistudio/file_0000000006c08208b358c43353e457af_69c155c6.webp"
                  alt="Master Ajay Boss VIP & Person AI Assistant"
                  className="w-full h-full object-cover object-[center_18%] rounded-full"
                />
              </div>
              <div className="text-left">
                <span className="text-[9px] text-slate-400 block uppercase font-mono">VIP Account</span>
                <span className="text-xs font-bold text-amber-300 font-chakra">Master Ajay Boss</span>
              </div>
            </div>
          </div>
        </div>

        {/* Meesho Search & Filter Bar */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 12 VIP Beast tools, Photo-to-Video, scanners, phone controls..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950/90 border border-slate-700/80 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-xs text-slate-100 placeholder:text-slate-500 outline-none"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {[
              { id: 'all', label: '🔥 All Deals (12)' },
              { id: 'video', label: '🎬 Video AI' },
              { id: 'neural', label: '🧠 Neural' },
              { id: 'vision', label: '📷 Vision' },
              { id: 'phone', label: '⚡ Phone' },
              { id: 'academic', label: '📚 Academic' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => {
                  soundEffects.playBeep();
                  setSelectedFilter(f.id as any);
                }}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-chakra font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedFilter === f.id
                    ? 'bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Meesho-Style Product Cards 2-Column Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredProducts.map((product) => {
          const Icon = product.icon;
          return (
            <div
              key={product.id}
              className="rounded-2xl bg-gradient-to-b from-[#0b101f] to-[#070b16] border border-amber-500/30 hover:border-amber-400/70 shadow-xl overflow-hidden flex flex-col justify-between group transition-all duration-300 hover:translate-y-[-2px]"
            >
              {/* Product Top Visual & Badge Container */}
              <div className="p-3.5 bg-gradient-to-r from-slate-950/80 via-slate-900/60 to-slate-950/80 border-b border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${product.iconGradient} text-slate-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5 text-slate-950" />
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-wider font-mono font-bold text-slate-400 block">
                      {product.category.toUpperCase()} TOOL
                    </span>
                    <h4 className="font-chakra font-bold text-sm text-slate-100 group-hover:text-amber-300 transition-colors line-clamp-1">
                      {product.title}
                    </h4>
                  </div>
                </div>

                <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-r ${product.badgeColor} shadow-sm shrink-0`}>
                  {product.badge}
                </span>
              </div>

              {/* Product Body */}
              <div className="p-3.5 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {product.subtitle}
                  </p>

                  {/* Rating & Reviews */}
                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-800/60">
                    <div className="flex items-center gap-1 bg-emerald-950/60 border border-emerald-500/40 px-1.5 py-0.2 rounded text-[10px] font-bold text-emerald-300">
                      <span>{product.rating}</span>
                      <Star className="w-3 h-3 fill-emerald-300 text-emerald-300" />
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {product.reviewsCount} Boss Reviews
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="text-[10px] text-cyan-300 font-bold">Trusted</span>
                  </div>

                  {/* Feature chips */}
                  <div className="flex flex-wrap gap-1 mt-2.5">
                    {product.features.map((feat, idx) => (
                      <span
                        key={idx}
                        className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400"
                      >
                        ✓ {feat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Meesho Pricing & Instant Delivery Tag */}
                <div className="pt-2 border-t border-slate-800/80 space-y-2">
                  <div className="flex items-baseline justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="font-chakra font-black text-base sm:text-lg text-emerald-400">
                        {product.dealPrice}
                      </span>
                      <span className="text-xs text-slate-500 line-through">
                        {product.originalPrice}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {product.discount}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span className="flex items-center gap-1 text-cyan-400">
                      <Zap className="w-3 h-3" /> Instant 0-sec delivery to vivo V17
                    </span>
                    <span className="text-slate-500">Free VIP</span>
                  </div>

                  {/* Primary Meesho Action Button */}
                  <button
                    onClick={product.onAction}
                    className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-cyan-400 hover:from-amber-300 hover:to-cyan-300 text-slate-950 font-chakra font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
                  >
                    <span>{product.actionText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
