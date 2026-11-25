import React, { useState, useEffect } from 'react';
import {
  X,
  Smartphone,
  Download,
  CheckCircle,
  ExternalLink,
  Code2,
  ShieldCheck,
  Sparkles,
  Terminal,
  Globe,
  Copy,
  Check,
  Archive,
  RefreshCw,
  FolderArchive,
  ShieldAlert,
  PackageCheck,
} from 'lucide-react';
import { soundEffects } from '../utils/audio';

interface AndroidApkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ApkStatus {
  packageId: string;
  appName: string;
  distReady: boolean;
  distBytes: number;
  distFiles: number;
  androidSynced: boolean;
  androidAssetBytes: number;
  sheruAssetsSynced?: boolean;
  aabWorkflowReady?: boolean;
  nativeSdkAvailable: boolean;
  githubWorkflow: string;
}

export const AndroidApkModal: React.FC<AndroidApkModalProps> = ({ isOpen, onClose }) => {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [apkStatus, setApkStatus] = useState<ApkStatus | null>(null);
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildFeedback, setBuildFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    fetch('/api/apk/status')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) setApkStatus(data);
      })
      .catch(() => {});
  }, [isOpen]);

  if (!isOpen) return null;

  const studioDomain = 'jarvis-beast-ai-assistant.ai.studio';
  const studioUrl = `https://${studioDomain}`;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(studioUrl);
    soundEffects.playSuccessChime();
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2200);
  };

  const handleCopyGradleCmd = () => {
    navigator.clipboard.writeText('./scripts/build-apk-and-aab.sh');
    soundEffects.playBeep();
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  const handlePrepareBundle = async () => {
    soundEffects.playJarvisWake();
    setIsBuilding(true);
    setBuildFeedback('Building production web bundle (relative ./ paths) & syncing /android assets...');
    try {
      const res = await fetch('/api/apk/prepare', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Build failed');
      soundEffects.playSuccessChime();
      const mb = ((data.distBytes || 0) / (1024 * 1024)).toFixed(2);
      setBuildFeedback(`Ready! ${data.distFiles} files (${mb} MB) built & synced into /android with Sheru Bhai clips.`);
      const statusRes = await fetch('/api/apk/status');
      if (statusRes.ok) setApkStatus(await statusRes.json());
    } catch (err: any) {
      setBuildFeedback(`Build error: ${err?.message || 'Could not prepare APK bundle'}`);
    } finally {
      setIsBuilding(false);
    }
  };

  const handleDownloadProjectZip = () => {
    soundEffects.playSuccessChime();
    const link = document.createElement('a');
    link.href = '/api/apk/source-zip';
    link.download = 'mr-jarvis-beast-android-apk-project.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownload = () => {
    soundEffects.playSuccessChime();
    const link = document.createElement('a');
    link.href = './mr-jarvis-beast-standalone.html';
    link.download = 'mr-jarvis-beast-android-app.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const distMb = apkStatus ? (apkStatus.distBytes / (1024 * 1024)).toFixed(2) : '—';

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 animate-in fade-in duration-200">
      <div className="bg-[#0b101f] border-2 border-amber-500/40 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-4 sm:p-6 space-y-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 flex items-center justify-center shadow-lg font-bold">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="font-chakra font-black text-base text-slate-100">
                  Android .APK &amp; Play Console .AAB Studio
                </h3>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {apkStatus?.androidSynced ? 'ASSETS SYNCED' : 'READY'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Package ID: com.aijayboss.mrjarvisbeast {apkStatus ? `• ${distMb} MB Bundle` : ''}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              soundEffects.playBeep();
              onClose();
            }}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cloud Container Transparency Notice */}
        <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/40 flex items-start gap-2.5 text-[11px] text-amber-100">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            This cloud web container has no <strong>Java JDK 21</strong> or <strong>Android SDK</strong> installed, so installable <code className="text-amber-300">.apk</code> and signed Play Console <code className="text-emerald-300">.aab</code> binaries cannot be compiled directly inside <code className="text-slate-200">src/</code> here. Download the ready-to-compile ZIP below to generate both files cleanly via GitHub Actions or locally into <code className="text-cyan-300">src/releases/</code>.
          </p>
        </div>

        {/* Step 1: Download & Bundle Verification */}
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-amber-950/40 border border-emerald-500/40 space-y-2.5 shadow-lg">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="font-chakra font-black text-xs text-emerald-300 flex items-center gap-1.5 uppercase tracking-wide">
              <FolderArchive className="w-4 h-4 text-emerald-400" />
              Step 1: Export Complete Project ZIP (APK + AAB Ready)
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-950 text-amber-300 font-mono border border-amber-500/30">
              {apkStatus ? `${apkStatus.distFiles} dist files` : 'Capacitor Android'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handlePrepareBundle}
              disabled={isBuilding}
              className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 text-slate-950 font-chakra font-black text-xs flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all cursor-pointer disabled:opacity-60"
            >
              <RefreshCw className={`w-4 h-4 ${isBuilding ? 'animate-spin' : ''}`} />
              <span>{isBuilding ? 'BUILDING & SYNCING...' : 'REBUILD & SYNC /ANDROID'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadProjectZip}
              className="p-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 text-slate-950 font-chakra font-black text-xs flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all cursor-pointer"
            >
              <Archive className="w-4 h-4" />
              <span>DOWNLOAD PROJECT .ZIP</span>
            </button>
          </div>

          {buildFeedback && (
            <p className="text-[11px] font-mono text-amber-200 bg-slate-950/80 px-2.5 py-1.5 rounded-lg border border-amber-500/30">
              {buildFeedback}
            </p>
          )}

          <div className="flex items-center gap-2 text-[11px] text-emerald-200 bg-slate-950/75 px-2.5 py-1.5 rounded-lg border border-emerald-500/30">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>
              {apkStatus?.sheruAssetsSynced
                ? 'Verified: Sheru Bhai voice/video clips, Gradle signing hook, build scripts, and GitHub CI/CD included.'
                : 'Bundle uses relative ./ asset paths so CSS, JS, images, and Sheru Bhai audio clips load cleanly offline.'}
            </span>
          </div>
        </div>

        {/* Standalone HTML & Domain Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={handleDownload}
            className="p-3 rounded-xl bg-slate-900 border border-amber-500/40 hover:bg-slate-800 text-amber-300 font-chakra font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>STANDALONE HTML APP</span>
          </button>

          <a
            href="./mr-jarvis-beast-standalone.html"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => soundEffects.playJarvisWake()}
            className="p-3 rounded-xl bg-slate-900 border border-cyan-500/50 hover:bg-slate-800 text-cyan-300 font-chakra font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
          >
            <ExternalLink className="w-4 h-4" />
            <span>LAUNCH STANDALONE APP</span>
          </a>
        </div>

        {/* Step 2: How to Build BOTH .APK and .AAB */}
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-cyan-950/60 to-slate-900 border border-cyan-500/40 space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <span className="font-chakra font-black text-xs text-cyan-300 flex items-center gap-1.5 uppercase">
              <Code2 className="w-4 h-4 text-cyan-400" />
              Step 2: Build .APK (Testing) &amp; .AAB (Play Console)
            </span>
            <button
              type="button"
              onClick={handleCopyGradleCmd}
              className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-700 text-[10px] font-chakra font-semibold flex items-center gap-1 cursor-pointer"
            >
              {copiedCmd ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedCmd ? 'Copied' : 'Copy Script'}</span>
            </button>
          </div>

          <div className="bg-slate-950/90 p-2.5 rounded-lg border border-slate-800 text-[11px] font-mono space-y-1">
            <span className="text-slate-400 text-[10px] block font-sans font-semibold">
              Option A — 1-Command Script (requires JDK 21 + Android SDK, outputs into src/releases/):
            </span>
            <div className="text-cyan-300 select-all font-bold">
              ./scripts/build-apk-and-aab.sh<br />
              # -&gt; src/releases/mr-jarvis-beast-debug.apk<br />
              # -&gt; src/releases/mr-jarvis-beast-release.aab
            </div>
            <span className="text-slate-400 text-[10px] block pt-1 font-sans">
              Or in Android Studio: <strong>Build &gt; Build APK(s)</strong> for testing, and <strong>Build &gt; Generate Signed Bundle / APK &gt; Android App Bundle (.aab)</strong> for Google Play Console.
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-gradient-to-r from-purple-950/60 to-indigo-950/60 border border-purple-500/40 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-chakra font-black text-xs text-purple-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                Option B — Zero-Setup GitHub Actions (.github/workflows/build-apk.yml)
              </span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Push the ZIP to GitHub to automatically compile both <code className="text-amber-300 font-mono">MrJarvisBeast-v1.0-debug.apk</code> and <code className="text-emerald-300 font-mono">MrJarvisBeast-v1.0-release.aab</code> in <strong>Actions &gt; Artifacts</strong> and <strong>Releases</strong>.
            </p>
          </div>
        </div>

        {/* Step 3: Mobile Install & Google Play Console Upload */}
        <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/40 space-y-2">
          <h4 className="font-chakra font-black text-xs text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
            <PackageCheck className="w-4 h-4 text-emerald-400" />
            Step 3: Phone Test (.APK) &amp; Google Play Console (.AAB)
          </h4>
          <ul className="space-y-1.5 text-[11px] text-slate-300 leading-relaxed">
            <li>
              <strong>Phone Testing (.apk):</strong> Copy <code className="text-amber-300 font-mono">mr-jarvis-beast-debug.apk</code> to your Android phone, tap it in <strong>Files / Chrome Downloads</strong>, and allow <strong>Install unknown apps</strong> when prompted.
            </li>
            <li>
              <strong>Google Play Console (.aab):</strong> Upload <code className="text-emerald-300 font-mono">mr-jarvis-beast-release.aab</code> (signed with your upload keystore via <code className="text-cyan-300">ANDROID_KEYSTORE_PATH</code> or Android Studio) under <strong>Play Console &gt; Production / Testing &gt; App bundles</strong>.
            </li>
          </ul>
        </div>

        {/* Official Live AI Studio Domain Card + Chrome PWA */}
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-chakra font-bold text-xs text-cyan-300 flex items-center gap-1.5 uppercase tracking-wide">
              <Globe className="w-4 h-4 text-cyan-400" />
              Official Domain &amp; Instant Chrome WebAPK
            </span>
            <button
              type="button"
              onClick={handleCopyUrl}
              className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-[11px] font-chakra font-semibold flex items-center gap-1 cursor-pointer"
            >
              {copiedUrl ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedUrl ? 'Copied' : 'Copy URL'}</span>
            </button>
          </div>
          <div className="bg-slate-950/90 px-2.5 py-1.5 rounded-lg border border-slate-800 font-mono text-xs text-amber-300 truncate select-all">
            {studioUrl}
          </div>
          <p className="text-[11px] text-slate-400">
            <Terminal className="w-3 h-3 inline mr-1 text-emerald-400" />
            Or open the app URL in Android Chrome &amp; tap <strong>Add to Home screen / Install App</strong> for instant fullscreen WebAPK launch.
          </p>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1 text-amber-300">
            <ShieldCheck className="w-3.5 h-3.5" /> Exclusively for Master Ajay Boss
          </span>
          <button
            type="button"
            onClick={() => {
              soundEffects.playBeep();
              onClose();
            }}
            className="px-3 py-1 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
