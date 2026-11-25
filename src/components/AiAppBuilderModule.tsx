import React, { useState } from 'react';
import {
  Hammer,
  Play,
  Code2,
  Copy,
  Check,
  Download,
  Loader2,
  Smartphone,
  Monitor,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { soundEffects } from '../utils/audio';

interface GeneratedAppResult {
  appTitle: string;
  summary: string;
  speechText: string;
  htmlCode: string;
}

interface AiAppBuilderModuleProps {
  verifiedHumanId: string;
  onSpeakStatus?: (text: string) => void;
}

const STARTER_BLUEPRINTS = [
  {
    label: 'Mobile Calculator',
    idea: 'Build a sleek dark-gold scientific & percentage mobile calculator with instant history',
  },
  {
    label: 'Study Pomodoro Timer',
    idea: 'Build a 25-minute focus Pomodoro & break timer with session tracker and audio alert',
  },
  {
    label: 'Daily Habit & Task Vault',
    idea: 'Build an interactive daily task and habit checklist with progress bar and add/delete',
  },
  {
    label: 'Creator Portfolio Page',
    idea: 'Build a responsive mobile-first portfolio showcase with dark gold cyber cards and contact form',
  },
];

export const AiAppBuilderModule: React.FC<AiAppBuilderModuleProps> = ({
  verifiedHumanId,
  onSpeakStatus,
}) => {
  const [appIdea, setAppIdea] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('Cyber Dark & Gold (#07090e / #ffd700)');
  const [isBuilding, setIsBuilding] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [previewWidth, setPreviewWidth] = useState<'mobile' | 'full'>('mobile');
  const [copied, setCopied] = useState(false);

  const [generatedApp, setGeneratedApp] = useState<GeneratedAppResult>({
    appTitle: `${verifiedHumanId} Cyber Task Vault`,
    summary: 'Interactive mobile-first web micro-app built in Supreme Dark (#07090e) and Gold (#ffd700).',
    speechText: '',
    htmlCode: `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Mr Jarvis Myra Beast App</title>
  <style>
    * { box-sizing: border-box; font-family: system-ui, -apple-system, sans-serif; }
    body { margin: 0; min-height: 100vh; background: #07090e; color: #f8fafc; padding: 16px; display: flex; justify-content: center; }
    .card { width: 100%; max-width: 460px; background: #0d121d; border: 1.5px solid rgba(255,215,0,0.45); border-radius: 16px; padding: 16px; }
    h1 { margin: 0 0 6px; font-size: 1.15rem; color: #ffd700; }
    p { margin: 0 0 14px; font-size: 0.85rem; color: #94a3b8; }
    .row { display: flex; gap: 8px; }
    input { flex: 1; min-height: 44px; padding: 10px; border-radius: 10px; border: 1px solid rgba(255,215,0,0.4); background: #07090e; color: #fff; outline: none; }
    button { min-height: 44px; padding: 0 14px; border-radius: 10px; border: none; background: #ffd700; color: #07090e; font-weight: 800; cursor: pointer; }
    ul { list-style: none; padding: 0; margin: 14px 0 0; display: grid; gap: 8px; }
    li { padding: 10px 12px; background: #131a29; border: 1px solid rgba(255,215,0,0.2); border-radius: 10px; font-size: 0.88rem; display: flex; justify-content: space-between; align-items: center; }
    .done { text-decoration: line-through; opacity: 0.55; }
  </style>
</head>
<body>
  <div class="card">
    <h1>${verifiedHumanId} Cyber Vault</h1>
    <p>Live interactive micro-app preview ready to customize.</p>
    <div class="row">
      <input id="taskIn" type="text" placeholder="Add goal or command..." />
      <button onclick="addTask()">Add</button>
    </div>
    <ul id="list"></ul>
  </div>
  <script>
    const tasks = [
      { text: 'Human ID Verified: ${verifiedHumanId}', done: true },
      { text: 'Describe any app above & click Build Live App', done: false }
    ];
    function draw() {
      document.getElementById('list').innerHTML = tasks.map((t, i) =>
        '<li onclick="toggle(' + i + ')" class="' + (t.done ? 'done' : '') + '"><span>' + t.text.replace(/</g,'&lt;') + '</span><span>' + (t.done ? '✓' : '○') + '</span></li>'
      ).join('');
    }
    function addTask() {
      const inp = document.getElementById('taskIn');
      if (!inp.value.trim()) return;
      tasks.unshift({ text: inp.value.trim(), done: false });
      inp.value = '';
      draw();
    }
    function toggle(i) { tasks[i].done = !tasks[i].done; draw(); }
    document.getElementById('taskIn').addEventListener('keydown', e => { if (e.key === 'Enter') addTask(); });
    draw();
  </script>
</body>
</html>`,
  });

  const handleBuildApp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = appIdea.trim();
    if (!trimmed) {
      soundEffects.playBeep();
      setErrorMsg('Please describe the app you want Mr Jarvis Myra Beast to build.');
      return;
    }

    soundEffects.playJarvisWake();
    setErrorMsg('');
    setIsBuilding(true);

    try {
      const res = await fetch('/api/build-app', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appIdea: trimmed,
          style: selectedStyle,
          userName: verifiedHumanId,
        }),
      });

      if (!res.ok) {
        throw new Error('App Builder endpoint returned an error');
      }

      const data: GeneratedAppResult = await res.json();
      setGeneratedApp(data);
      setActiveTab('preview');
      soundEffects.playSuccessChime();
      if (data.speechText && onSpeakStatus) {
        onSpeakStatus(data.speechText);
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Unable to generate app right now. Please try again.');
    } finally {
      setIsBuilding(false);
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(generatedApp.htmlCode);
      soundEffects.playSuccessChime();
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setErrorMsg('Clipboard permission blocked in this browser.');
    }
  };

  const handleDownloadHtml = () => {
    soundEffects.playSuccessChime();
    const blob = new Blob([generatedApp.htmlCode], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const slug = generatedApp.appTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 32) || 'jarvis-app';
    link.download = `${slug}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <section
      aria-label="AI App Builder Module"
      className="rounded-2xl bg-[#0c101a] border border-[#ffd700]/45 p-4 sm:p-5 space-y-4 shadow-[0_0_28px_rgba(255,215,0,0.1)]"
    >
      {/* Module Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/90">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#ffd700]/15 border border-[#ffd700]/50 flex items-center justify-center text-[#ffd700] shrink-0">
            <Hammer className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-chakra font-bold text-base sm:text-lg text-[#ffd700]">
              AI App Builder
            </h2>
            <p className="text-xs text-slate-400">
              Generate live interactive HTML5 mobile apps for {verifiedHumanId}
            </p>
          </div>
        </div>

        {/* Starter Blueprints */}
        <div className="flex flex-wrap items-center gap-1.5">
          {STARTER_BLUEPRINTS.map((bp) => (
            <button
              key={bp.label}
              type="button"
              onClick={() => {
                soundEffects.playBeep();
                setAppIdea(bp.idea);
                setErrorMsg('');
              }}
              className="min-h-[36px] px-2.5 py-1 rounded-lg bg-[#131927] hover:bg-[#1a2235] border border-slate-800 hover:border-[#ffd700]/50 text-xs text-slate-200 transition-colors cursor-pointer whitespace-nowrap"
            >
              {bp.label}
            </button>
          ))}
        </div>
      </div>

      {/* App Specification Input Form */}
      <form onSubmit={handleBuildApp} className="space-y-3">
        <div className="space-y-1.5">
          <label htmlFor="appBuilderIdea" className="block text-xs font-medium text-slate-300">
            Describe the app you want to build
          </label>
          <textarea
            id="appBuilderIdea"
            value={appIdea}
            onChange={(e) => {
              setAppIdea(e.target.value);
              if (errorMsg) setErrorMsg('');
            }}
            rows={2}
            placeholder="e.g., Build a dark-gold mobile study timer with lap counter and motivational quote..."
            className="w-full p-3 rounded-xl bg-[#07090e] border border-[#ffd700]/45 focus:border-[#ffd700] focus:ring-2 focus:ring-[#ffd700]/20 text-sm text-slate-100 placeholder-slate-500 outline-none resize-none"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              'Cyber Dark & Gold (#07090e / #ffd700)',
              'Minimal Dark Utility',
              'Neon Cyan & Gold Dashboard',
            ].map((styleOption) => (
              <button
                key={styleOption}
                type="button"
                onClick={() => {
                  soundEffects.playBeep();
                  setSelectedStyle(styleOption);
                }}
                className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                  selectedStyle === styleOption
                    ? 'bg-[#ffd700]/20 border-[#ffd700] text-[#ffd700]'
                    : 'bg-[#101622] border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {styleOption.split(' (')[0]}
              </button>
            ))}
          </div>

          <button
            type="submit"
            disabled={isBuilding}
            className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#ffd700] hover:bg-amber-300 disabled:opacity-60 text-[#07090e] font-chakra font-black text-xs sm:text-sm inline-flex items-center justify-center gap-2 shadow-lg shadow-[#ffd700]/20 active:scale-[0.98] transition-all cursor-pointer shrink-0"
          >
            {isBuilding ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Building App...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Build Live App</span>
              </>
            )}
          </button>
        </div>

        {errorMsg && (
          <div role="alert" className="p-2.5 rounded-xl bg-red-950/60 border border-red-500/50 text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </form>

      {/* Output Workspace: Live Preview & Source Code */}
      <div className="space-y-3 pt-2 border-t border-slate-800/80">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-chakra font-bold text-[#ffd700]">
              {generatedApp.appTitle}
            </h3>
            <p className="text-xs text-slate-400">{generatedApp.summary}</p>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {/* View Tabs */}
            <div className="inline-flex p-1 rounded-xl bg-[#07090e] border border-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`min-h-[36px] px-3 py-1 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === 'preview'
                    ? 'bg-[#ffd700] text-[#07090e] font-bold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Play className="w-3.5 h-3.5" />
                <span>Live Preview</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('code')}
                className={`min-h-[36px] px-3 py-1 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === 'code'
                    ? 'bg-[#ffd700] text-[#07090e] font-bold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>HTML Code</span>
              </button>
            </div>

            {activeTab === 'preview' && (
              <div className="hidden sm:inline-flex p-1 rounded-xl bg-[#07090e] border border-slate-800">
                <button
                  type="button"
                  onClick={() => setPreviewWidth('mobile')}
                  title="Mobile Preview Width"
                  className={`min-h-[36px] px-2.5 rounded-lg text-xs flex items-center gap-1 cursor-pointer ${
                    previewWidth === 'mobile' ? 'bg-slate-800 text-[#ffd700]' : 'text-slate-400'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewWidth('full')}
                  title="Desktop Full Width"
                  className={`min-h-[36px] px-2.5 rounded-lg text-xs flex items-center gap-1 cursor-pointer ${
                    previewWidth === 'full' ? 'bg-slate-800 text-[#ffd700]' : 'text-slate-400'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={handleCopyCode}
              className="min-h-[40px] px-3 py-1.5 rounded-xl bg-[#131927] hover:bg-[#1c2438] border border-slate-700 text-xs text-slate-200 inline-flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#ffd700]" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadHtml}
              className="min-h-[40px] px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-400/50 text-xs text-emerald-300 font-medium inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export HTML</span>
            </button>
          </div>
        </div>

        {/* Render Active Tab */}
        {activeTab === 'preview' ? (
          <div className="w-full rounded-xl bg-[#07090e] border border-slate-800 p-2 sm:p-3 flex justify-center">
            <iframe
              title="AI App Builder Live Preview"
              srcDoc={generatedApp.htmlCode}
              sandbox="allow-scripts"
              className={`h-[340px] sm:h-[380px] rounded-lg border border-[#ffd700]/25 bg-[#07090e] transition-all ${
                previewWidth === 'mobile' ? 'w-full max-w-[400px]' : 'w-full'
              }`}
            />
          </div>
        ) : (
          <pre className="w-full max-h-[360px] overflow-auto p-3.5 rounded-xl bg-[#05070b] border border-slate-800 text-xs font-mono text-amber-200 leading-relaxed">
            <code>{generatedApp.htmlCode}</code>
          </pre>
        )}
      </div>
    </section>
  );
};
