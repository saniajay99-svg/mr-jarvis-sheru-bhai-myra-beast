import React from 'react';
import { Calculator, BookOpen, Languages, Camera, Laugh, Compass, Smartphone, Radar } from 'lucide-react';
import { CategoryType } from '../types';
import { soundEffects } from '../utils/audio';

interface QuickCategoryBarProps {
  selectedCategory: CategoryType;
  onSelectCategory: (cat: CategoryType) => void;
  onQuickQuery: (prompt: string, category: CategoryType) => void;
  onTriggerCamera: () => void;
  isStandingMode?: boolean;
  onToggleStandingMode?: () => void;
}

export const QuickCategoryBar: React.FC<QuickCategoryBarProps> = ({
  selectedCategory,
  onSelectCategory,
  onQuickQuery,
  onTriggerCamera,
  isStandingMode = false,
  onToggleStandingMode,
}) => {
  const categories: { id: CategoryType; label: string; icon: any; color: string; samplePrompts: string[] }[] = [
    {
      id: 'standing',
      label: '⚡ Standing Mode (कच्चा चिट्ठा)',
      icon: Radar,
      color: 'text-[#ffd700] border-[#ffd700]/60',
      samplePrompts: [
        'Black Hole ka poora कच्चा चिट्ठा bina jargon ke batao',
        'Crack riddle: I speak without a mouth and hear without ears. What am I?',
        'How does a vivo V17 AMOLED screen pixel actually work?',
        'Break down Python recursion in super simple Hinglish',
      ],
    },
    {
      id: 'maths',
      label: '📐 Maths Equations',
      icon: Calculator,
      color: 'text-amber-400 border-amber-500/30',
      samplePrompts: [
        'Solve equation: 2x² - 8x + 6 = 0 step by step',
        'Explain Pythagoras Theorem with formula and proof',
        'Simplify fraction: (3/4 + 5/6) * (2/3)',
        'What is value of sin 30° + cos 60° - tan 45°?',
      ],
    },
    {
      id: 'english_grammar',
      label: '📖 English Grammar',
      icon: BookOpen,
      color: 'text-cyan-400 border-cyan-500/30',
      samplePrompts: [
        'Explain Active and Passive Voice rules with 5 clear examples',
        'How to convert Direct Speech into Indirect Speech? Step-by-step table',
        'Difference between Since and For with example sentences',
        'Correct this sentence: "He don\'t know nothing about exams"',
      ],
    },
    {
      id: 'hindi_grammar',
      label: '🕉️ हिंदी व्याकरण',
      icon: Languages,
      color: 'text-emerald-400 border-emerald-500/30',
      samplePrompts: [
        'संधि और संधि-विच्छेद समझाइए: विद्यालय, रमेश, सूर्योदय',
        'समास के भेद और उदाहरण (तत्पुरुष, द्वंद्व, द्विगु, बहुव्रीहि)',
        'कारक के आठ भेद और उनके विभक्ति चिह्न समझाइए',
        'मुहावरे का अर्थ और वाक्य प्रयोग: "अंगूठा दिखाना" और "ईद का चाँद होना"',
      ],
    },
    {
      id: 'vision',
      label: '📸 Scan Question Photo',
      icon: Camera,
      color: 'text-rose-400 border-rose-500/30',
      samplePrompts: [
        'Upload image or click to scan handwritten problem',
      ],
    },
    {
      id: 'phone_actions',
      label: '⚡ JARVIS Phone Control',
      icon: Smartphone,
      color: 'text-cyan-400 border-cyan-500/30',
      samplePrompts: [
        'Turn on phone flashlight for Aijay Boss',
        'Check phone battery diagnostic status',
        'Speed dial Dad right now',
        'Set a 5 minute study break timer',
        'Test phone vibration haptics',
      ],
    },
    {
      id: 'jokes',
      label: '😂 Beast Post-Exam Jokes',
      icon: Laugh,
      color: 'text-yellow-400 border-yellow-500/30',
      samplePrompts: [
        'Aijay Boss ko ek super funny post-exam Beast joke sunao Hindi me!',
        'Tell Aijay Boss a hilarious high-energy MrBeast challenge joke',
        'Ek mazedaar teacher-student exam hall joke batao',
      ],
    },
  ];

  const currentCategoryObj = categories.find(c => c.id === selectedCategory) || categories[0];

  return (
    <div className="space-y-2">
      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => {
          const isStandingTab = cat.id === 'standing';
          const isActive = selectedCategory === cat.id || (isStandingTab && isStandingMode);
          return (
            <button
              key={cat.id}
              onClick={() => {
                soundEffects.playBeep();
                if (cat.id === 'vision') {
                  onTriggerCamera();
                } else if (isStandingTab) {
                  onSelectCategory('standing');
                  if (!isStandingMode) {
                    onToggleStandingMode?.();
                  }
                } else {
                  onSelectCategory(cat.id);
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all whitespace-nowrap border cursor-pointer ${
                isStandingTab && isStandingMode
                  ? 'bg-[#ffd700] text-[#07090e] border-[#ffd700] font-extrabold shadow-[0_0_15px_rgba(255,215,0,0.45)]'
                  : isActive
                  ? 'bg-amber-500/20 text-amber-200 border-amber-400 shadow-sm shadow-amber-500/20'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Suggested Quick Prompt Chips for selected category */}
      {selectedCategory !== 'vision' && (
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none text-[11px]">
          <span className="text-slate-500 font-medium whitespace-nowrap flex items-center gap-1 pl-1">
            <Compass className="w-3 h-3 text-amber-400" />
            {selectedCategory === 'standing' ? 'Deep-Scan Kachcha Chittha:' : 'Quick Solve for Ladu Boss:'}
          </span>
          {currentCategoryObj.samplePrompts.map((promptText, i) => (
            <button
              key={i}
              onClick={() => {
                soundEffects.playBeep();
                onQuickQuery(promptText, selectedCategory);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-amber-400/50 text-slate-300 hover:text-amber-200 transition-all whitespace-nowrap flex items-center gap-1 cursor-pointer"
            >
              <span>{promptText.length > 42 ? promptText.slice(0, 42) + '...' : promptText}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
