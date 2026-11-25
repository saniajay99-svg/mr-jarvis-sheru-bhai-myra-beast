import React, { useState } from 'react';
import {
  Download,
  CheckCircle2,
  Copy,
  Smartphone,
  Terminal,
  Sparkles,
  FileCode2,
  Archive,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
} from 'lucide-react';
import { soundEffects } from '../utils/audio';

interface BuildOutputCardProps {
  onOpenDetailedModal: () => void;
}

export const BuildOutputCard: React.FC<BuildOutputCardProps> = ({ onOpenDetailedModal }) => {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleDownloadProjectZip = () => {
    soundEffects.playSuccessChime();
    setShowToast(true);
    const link = document.createElement('a');
    link.href = '/api/apk/source-zip';
    link.download = 'mr-jarvis-beast-android-apk-project.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => setShowToast(false), 3800);
  };

  const handleDownloadStandalone = () => {
    soundEffects.playSuccessChime();
    const link = document.createElement('a');
    link.href = './mr-jarvis-beast-standalone.html';
    link.download = 'mr-jarvis-beast-standalone.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyBuildCmd = () => {
    soundEffects.playBeep();
    navigator.clipboard.writeText('./scripts/build-apk-and-aab.sh');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      aria-label="Download Android Project / Build APK & Play Console AAB"
      className="rounded-2xl bg-gradient-to-r from-[#071322] via-[#09101f] to-[#0d071a] border-2 border-emerald-500/50 p-3.5 sm:p-4 shadow-2xl relative overflow-hidden"
    >
      {/* Background cyber accent glow */}
      <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-bl from-emerald-500/15 via-amber-500/10 to-transparent rounded-full blur-2xl pointer-events-none" />

      {/* Floating vivo V17 Toast */}
      {showToast && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 bg-emerald-950/95 border border-emerald-400 text-emerald-200 px-3 py-1.5 rounded-full shadow-2xl text-[11px] font-chakra font-bold flex items-center gap-1.5 animate-in slide-in-from-top duration-200">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Exporting Android Project ZIP + APK &amp; Play Console AAB scripts...</span>
        </div>
      )}

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 relative z-10">
        {/* Left: Package & Section Info */}
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/25 font-bold">
            <Smartphone className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-chakra font-black text-xs sm:text-sm text-emerald-300 uppercase tracking-wider">
                Download Android Project / Build APK &amp; .AAB
              </h2>
              <span className="font-mono font-bold text-[11px] text-slate-100 bg-slate-900/90 px-2 py-0.5 rounded border border-slate-700 select-all">
                com.aijayboss.mrjarvisbeast
              </span>
              <span className="text-[10px] font-bold text-amber-300 bg-amber-500/15 px-2 py-0.5 rounded-full border border-amber-500/40">
                Play Console .AAB Ready
              </span>
            </div>

            <p className="text-[11px] text-slate-300 mt-1 flex items-center gap-2 flex-wrap">
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Relative ./assets/ &amp; Sheru Bhai Voice Clips Synced
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-cyan-300 font-medium">assembleDebug (.apk) + bundleRelease (.aab)</span>
            </p>
          </div>
        </div>

        {/* Right: Primary Export & Guide Controls */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <button
            type="button"
            onClick={handleDownloadProjectZip}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 text-slate-950 font-chakra font-black text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/25 active:scale-95 transition-all cursor-pointer"
            title="Download full ready-to-compile Android Project ZIP with APK + Play Console AAB scripts"
          >
            <Archive className="w-4 h-4 text-slate-950" />
            <span>DOWNLOAD PROJECT .ZIP</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadStandalone}
            className="px-2.5 py-2 rounded-xl bg-slate-900/90 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 text-xs font-chakra font-bold flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
            title="Download standalone HTML file"
          >
            <Download className="w-3.5 h-3.5" />
            <span>HTML</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundEffects.playBeep();
              onOpenDetailedModal();
            }}
            className="px-2.5 py-2 rounded-xl bg-slate-900/90 border border-amber-500/40 hover:border-amber-400 text-amber-300 text-xs flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
            title="Open Full Android APK & AAB Studio"
          >
            <FileCode2 className="w-4 h-4 text-amber-400" />
            <span className="text-[11px] font-chakra font-bold">APK &amp; AAB Studio</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundEffects.playBeep();
              setIsExpanded((prev) => !prev);
            }}
            className="px-2.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-emerald-400/50 text-slate-200 text-[11px] font-chakra font-bold flex items-center gap-1 cursor-pointer"
            aria-expanded={isExpanded}
          >
            <span>{isExpanded ? 'Hide Steps' : 'APK & .AAB Steps'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Compact Always-Visible 3-Step Summary Strip */}
      <div className="mt-3 pt-2.5 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-3 gap-2 text-[11px] relative z-10">
        <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800">
          <span className="font-chakra font-bold text-emerald-300 block">1. Download Project ZIP</span>
          <p className="text-slate-400 mt-0.5">
            Includes <code className="text-slate-200">android/</code>, <code className="text-slate-200">dist/</code>, Sheru Bhai audio clips, &amp; <code className="text-cyan-300">build-apk-and-aab.sh</code>.
          </p>
        </div>
        <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800">
          <span className="font-chakra font-bold text-amber-300 block">2. Compile .APK &amp; .AAB</span>
          <p className="text-slate-400 mt-0.5">
            Run script or GitHub Actions to output <code className="text-amber-200">.apk</code> (phone test) &amp; <code className="text-emerald-300">.aab</code> (Play Console) into <code className="text-cyan-300">src/releases/</code>.
          </p>
        </div>
        <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800">
          <span className="font-chakra font-bold text-cyan-300 block">3. Phone Install / Play Console</span>
          <p className="text-slate-400 mt-0.5">
            Install <code className="text-slate-200">.apk</code> on Android (allow unknown apps) &amp; upload signed <code className="text-slate-200">.aab</code> to Google Play Console.
          </p>
        </div>
      </div>

      {/* Expanded Full Commands & Notes */}
      {isExpanded && (
        <div className="mt-2.5 p-3 rounded-xl bg-slate-950/90 border border-emerald-500/30 space-y-2.5 text-[11px] relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-chakra font-bold text-cyan-300 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5" />
              Compile BOTH .APK &amp; Play Console .AAB into src/releases/
            </span>
            <button
              type="button"
              onClick={handleCopyBuildCmd}
              className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 flex items-center gap-1 cursor-pointer"
            >
              {copied ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied!' : 'Copy Build Script'}</span>
            </button>
          </div>
          <pre className="bg-black/70 p-2.5 rounded-lg border border-slate-800 font-mono text-cyan-300 overflow-x-auto leading-relaxed">
{`# Run on PC/Mac with JDK 21 & Android SDK (outputs BOTH .apk & .aab into src/releases/):
./scripts/build-apk-and-aab.sh   # Windows: scripts\\build-apk-and-aab.bat

# Or manually in android/:
cd android && ./gradlew assembleDebug bundleRelease
# -> android/app/build/outputs/apk/debug/app-debug.apk (Phone Test)
# -> android/app/build/outputs/bundle/release/app-release.aab (Google Play Console)`}
          </pre>
          <div className="flex items-start gap-2 text-slate-300 bg-amber-950/25 border border-amber-500/30 rounded-lg p-2">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Note on Cloud Container:</strong> This web sandbox has no Java JDK 21 or Android SDK installed, so binary <code className="text-amber-300">.apk</code> / <code className="text-emerald-300">.aab</code> files cannot be compiled directly inside <code className="text-slate-200">src/</code> here (and we do not generate fake placeholder binaries). Push to GitHub to auto-build both <code className="text-amber-300">MrJarvisBeast-v1.0-debug.apk</code> &amp; <code className="text-emerald-300">MrJarvisBeast-v1.0-release.aab</code> via GitHub Actions, or run the included script locally.
            </p>
          </div>
        </div>
      )}
    </section>
  );
};
