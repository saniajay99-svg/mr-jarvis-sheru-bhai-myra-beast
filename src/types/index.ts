export type EngineType = 'auto' | 'gemini' | 'chatgpt' | 'grok' | 'claude';
export type PrecisionType = 'concise' | 'balanced' | 'rigorous';
export type GroundingMode = 'auto' | 'search' | 'maps';

export type AiModelPresetId =
  | 'gemini-auto'
  | 'jarvis-beast-core'
  | 'myra-beast-assistant'
  | 'sheru-bhai-voice'
  | 'chatgpt-style'
  | 'grok-style'
  | 'claude-style'
  | 'flash-fast-mode';

export interface AiModelPreset {
  id: AiModelPresetId;
  label: string;
  shortLabel: string;
  badgeEmoji: string;
  engine: EngineType;
  precision: PrecisionType;
  gemId: string;
  backendModel: string;
  description: string;
}

export const AI_MODEL_PRESETS: AiModelPreset[] = [
  {
    id: 'gemini-auto',
    label: 'Gemini Auto',
    shortLabel: 'Gemini Auto',
    badgeEmoji: '⚡',
    engine: 'auto',
    precision: 'concise',
    gemId: 'beast-master',
    backendModel: 'gemini-4-hydrogen',
    description: 'तेज़, छोटा और साफ़ ऑटो जवाब — Ajay Boss के लिए प्राथमिकता मोड',
  },
  {
    id: 'sheru-bhai-voice',
    label: 'Sheru Bhai Voice Mode',
    shortLabel: 'Sheru Bhai',
    badgeEmoji: '🦁',
    engine: 'auto',
    precision: 'concise',
    gemId: 'sharu-bhai-assistant',
    backendModel: 'gemini-4-hydrogen',
    description: 'दमदार Sheru Bhai आवाज़ और सीधा जवाब',
  },
  {
    id: 'myra-beast-assistant',
    label: 'Myra Beast Assistant',
    shortLabel: 'Myra Beast',
    badgeEmoji: '✨',
    engine: 'chatgpt',
    precision: 'balanced',
    gemId: 'myra-voice-engine',
    backendModel: 'gemini-4-hydrogen',
    description: 'संतुलित और मधुर हिंदी/हिंग्लिश सहायक मोड',
  },
  {
    id: 'jarvis-beast-core',
    label: 'Jarvis Beast Core',
    shortLabel: 'Jarvis Core',
    badgeEmoji: '👑',
    engine: 'auto',
    precision: 'balanced',
    gemId: 'beast-master',
    backendModel: 'gemini-4-hydrogen',
    description: 'सभी काम, सर्च और प्लानिंग के लिए मुख्य इंजन',
  },
  {
    id: 'chatgpt-style',
    label: 'ChatGPT Style',
    shortLabel: 'ChatGPT',
    badgeEmoji: '💬',
    engine: 'chatgpt',
    precision: 'balanced',
    gemId: 'beast-master',
    backendModel: 'gemini-4-hydrogen',
    description: 'सरल बातचीत और आसान उदाहरण वाला अंदाज़',
  },
  {
    id: 'grok-style',
    label: 'Grok Style',
    shortLabel: 'Grok',
    badgeEmoji: '🔥',
    engine: 'grok',
    precision: 'concise',
    gemId: 'beast-master',
    backendModel: 'gemini-4-hydrogen',
    description: 'बेबाक, तेज़ और सीधा टू-द-पॉइंट जवाब',
  },
  {
    id: 'claude-style',
    label: 'Claude Style',
    shortLabel: 'Claude',
    badgeEmoji: '🧠',
    engine: 'claude',
    precision: 'balanced',
    gemId: 'deep-intelligence',
    backendModel: 'gemini-4-hydrogen',
    description: 'साफ़ तर्क और व्यवस्थित जवाब वाला अंदाज़',
  },
  {
    id: 'flash-fast-mode',
    label: 'Gemini Flash Fast',
    shortLabel: 'Gemini Flash',
    badgeEmoji: '🚀',
    engine: 'gemini',
    precision: 'concise',
    gemId: 'code-architect',
    backendModel: 'gemini-3.1-flash-lite',
    description: 'तुरंत छोटा जवाब देने वाला सुपर-फास्ट मोड',
  },
];

export interface GroundingLink {
  title: string;
  uri: string;
  sourceType: 'search' | 'maps';
  snippets?: string[];
}

export type CategoryType = 
  | 'all'
  | 'standing'
  | 'maths'
  | 'english_grammar'
  | 'hindi_grammar'
  | 'vision'
  | 'jokes'
  | 'utilities'
  | 'phone_actions';

export interface StepItem {
  stepNumber: number;
  title: string;
  detail: string;
  formulaOrCode?: string;
}

export interface PhoneAction {
  actionType: 'call' | 'whatsapp' | 'flashlight' | 'battery' | 'timer' | 'maps' | 'youtube' | 'copy' | 'vibrate' | 'clock' | 'camera' | 'google' | 'calculator' | 'open_app' | 'none';
  label: string;
  target?: string;
  autoExecute?: boolean;
}

export interface AssistantResponse {
  speechText: string;
  title: string;
  subjectCategory: string;
  steps: StepItem[];
  finalAnswer: string;
  beastTip: string;
  suggestedPrompts: string[];
  engineUsed?: string;
  modelName?: string;
  modelModeLabel?: string;
  groundingType?: 'search' | 'maps';
  groundingLinks?: GroundingLink[];
  standingMode?: boolean;
  timestamp?: string;
  phoneAction?: PhoneAction;
}

export interface MediaAttachment {
  base64: string;
  mimeType: string;
  name: string;
  type: 'image' | 'video' | 'pdf';
  sizeFormatted?: string;
}

export interface QAItem {
  id: string;
  questionText: string;
  questionMedia?: MediaAttachment;
  category?: CategoryType;
  engineUsed?: EngineType;
  modelModeLabel?: string;
  standingMode?: boolean;
  timestamp: string;
  status: 'thinking' | 'answered' | 'error';
  response?: AssistantResponse;
  error?: string;
  isAudioPlaying?: boolean;
  actionExecuted?: boolean;
}

// Backwards-compatibility
export type ChatMessage = QAItem;

export function resolveOwnerAddress(accountIdOrText: string): string {
  const normalized = accountIdOrText.trim().toLowerCase();
  if (normalized.includes('shiv kumar') || normalized.includes('shivkumar')) {
    return 'Hello Shiv Kumar';
  }
  if (
    normalized.includes('ajay sani') ||
    normalized.includes('ajaysani') ||
    normalized.includes('master ajay') ||
    normalized.includes('ajay boss')
  ) {
    return 'Master Ajay';
  }
  return accountIdOrText.trim() || 'Master Ajay';
}

export function formatOwnerGreeting(callout: string): string {
  const clean = callout.trim() || 'Master Ajay';
  return clean.toLowerCase().startsWith('hello ') ? `${clean}!` : `जी ${clean}!`;
}

