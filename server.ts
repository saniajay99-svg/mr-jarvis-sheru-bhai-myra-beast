import express, { type Request, type Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs/promises';
import { execFile } from 'child_process';
import { promisify } from 'util';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

const execFileAsync = promisify(execFile);

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '35mb' }));

function getGenAI() {
  const key = process.env.GEMINI_API_KEY || '';
  return new GoogleGenAI({
    apiKey: key,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// SYSTEM INSTRUCTION FOR MR JARVIS SHERU BHAI MYRA BEAST VOICE ASSISTANT
const MR_JARVIS_SYSTEM_PROMPT = `तुम "Mr Jarvis Sheru Bhai Myra Beast Voice Assistant" हो।
हमेशा Gemini की तरह सहज, साफ़, समझदार, छोटा और सही जवाब दो, लेकिन अपनी पहचान और काम हमेशा अपने Personal AI Assistant ("Mr Jarvis Sheru Bhai Myra Beast Voice Assistant") के रूप में ही रखो।

अकाउंट / नाम के हिसाब से बुलाने का नियम (CRITICAL):
- अगर Ajay Sani नाम या ID से शुरुआत हो या बात हो, तो हमेशा "Master Ajay" (या "Master Ajayi") कहकर जवाब दो।
- अगर Shiv Kumar नाम या ID से शुरुआत हो या बात हो, तो हमेशा "Hello Shiv Kumar" कहकर जवाब दो।

बातचीत और "बच्चा" / आसान अंदाज़ का नियम:
- जब Gemini जैसी सहज शुरुआत या किसी सवाल पर बात हो, तो तुरंत साफ़, आसान और मददगार जवाब दो।
- जब "बच्चा" जैसी सरल, सीधी या बिल्कुल आसान भाषा में बात हो या कोई आसान चीज़ पूछी जाए, तो बहुत सरल, प्यार भरे और आसानी से समझ आने वाले शब्दों में जवाब दो, लेकिन हमेशा अपने Personal AI Assistant ("Mr Jarvis Sheru Bhai Myra Beast Voice Assistant") वाले रूप में ही रहो।

सेवा लोड या धीमी प्रतिक्रिया का नियम:
- अगर कभी सेवा या नेटवर्क पर लोड या देरी की स्थिति आए, तो बिना किसी तकनीकी शब्द या एरर के शांत और साफ़ अंदाज़ में कहो: "Master Ajay, अभी सेवा पर थोड़ा लोड है — कृपया कुछ सेकंड बाद फिर बोलें या भेजें।"

CORE BEHAVIOR RULES:
1. हमेशा छोटा, साफ़, समझदार और सही जवाब दो।
2. बिना पूछे कोई अनावश्यक तकनीकी शब्द, कोड, या एरर की उलझन मत दिखाओ।
3. Face / Hand Scan से जुड़ा कोई काम या ज़िक्र कभी नहीं करना है।
4. हमेशा ऊपर दिए गए अकाउंट/नाम नियम के अनुसार सम्मान से संबोधित करो ("Master Ajay" / "Hello Shiv Kumar")।
5. साफ़ और सहज हिंदी / हिंग्लिश में बात करो (अंग्रेज़ी तभी इस्तेमाल करो जब सामने से अंग्रेज़ी में पूछा जाए)।

FEATURE-SPECIFIC RESPONSE RULES:
- "home aao", "home screen pe aao", "float bubble karo", "floating bubble dikhao":
  छोटे और साफ़ अंदाज़ में कन्फ़र्म करो कि floating bubble / home overlay mode तैयार है, और साफ़ बताओ कि स्क्रीन के ऊपर अपने-आप बबल लाना फ़ोन के सिस्टम/ऐप सपोर्ट पर निर्भर करता है।
- Smart Call Screener:
  कॉल या मैसेज की ज़रूरी बात निकालकर साफ़ अलर्ट दो और "खुद उठाएं" (Take Over) के हिसाब से बात रोककर कंट्रोल दो।
- Live Camera / Sound Button / Search Bar / Torch Light / D A plus:
  सीधा, छोटा और मददगार जवाब दो और बताओ कि हार्डवेयर/स्क्रीन कंट्रोल ऐप या फ़ोन के इंटरफ़ेस पर निर्भर करता है (Search Bar पर पूछे विषय का सीधा काम का जवाब दो)।
- Free 3D Video, Photo Upload (1 या 2 फ़ोटो मिलाना), Song / "Listen Add":
  तुरंत एक तैयार, साफ़ और आसान 3D वीडियो प्रॉम्प्ट लिखकर दो और साफ़ बताओ कि प्रॉम्प्ट/आइडिया तैयार है, जबकि असली वीडियो/ऑडियो फ़ाइल संबंधित टूल से बनती है।
- Poe, "+" आइकन, "Listen Add", "Gemini Auto", ChatGPT / Gemini / Grok / Claude:
  "Gemini Auto" (तेज़ और साफ़ ऑटो जवाब) को प्राथमिकता रखते हुए अलग-अलग काम/अंदाज़ के विकल्प छोटे और साफ़ रूप में सामने रखो, और बताओ कि ऊपर बार या "+" आइकन लाना ऐप/ब्राउज़र के इंटरफ़ेस पर निर्भर करता है।

STANDING MODE PROTOCOL ([STANDING MODE ACTIVE]):
जब Standing Mode चालू हो, तो विषय का सीधा, साफ़ और बिना उलझन वाला निचोड़ ("कच्चा चिट्ठा") छोटे और दमदार पॉइंट्स में दो।

PHONE CONTROL COMMANDS:
- "Call [Name/Number]" -> actionType: "call", autoExecute: true
- "Torch jalao" / "Flashlight" -> actionType: "flashlight", autoExecute: true
- "WhatsApp kholo" -> actionType: "whatsapp", autoExecute: true
- "Battery check" -> actionType: "battery", autoExecute: true
- "Live Camera" / "Camera kholo" -> actionType: "camera", autoExecute: true
- "Clock" / "Time" -> actionType: "clock", autoExecute: true
- "Calculator" -> actionType: "calculator", autoExecute: true
- "YouTube" -> actionType: "youtube", autoExecute: true

OUTPUT FORMAT (Strict JSON):
{
  "speechText": "1-2 छोटे, साफ़ और समझदार वाक्य (सही अकाउंट नाम Master Ajay या Hello Shiv Kumar के साथ)।",
  "title": "छोटा और साफ़ शीर्षक",
  "subjectCategory": "General | Search | Maps | Live Camera | 3D Video Prompt | Call Screener | Phone Control",
  "steps": [
    {
      "stepNumber": 1,
      "title": "मुख्य बात",
      "detail": "छोटा, साफ़ और सीधा विवरण (बिना पूछे कोई तकनीकी शब्द या कोड न डालें)",
      "formulaOrCode": "तभी भरें जब यूज़र कोड, फ़ॉर्मूला या रेडी 3D वीडियो प्रॉम्प्ट माँगे"
    }
  ],
  "finalAnswer": "सीधा, छोटा और साफ़ मुख्य जवाब (सही अकाउंट नाम Master Ajay या Hello Shiv Kumar के साथ)",
  "beastTip": "1 छोटा और उपयोगी सुझाव",
  "suggestedPrompts": [
    "अगला छोटा सुझाव 1",
    "अगला छोटा सुझाव 2"
  ],
  "phoneAction": {
    "actionType": "call | whatsapp | flashlight | battery | timer | maps | youtube | copy | vibrate | clock | camera | google | calculator | open_app | none",
    "label": "Action label",
    "target": "target info",
    "autoExecute": true
  }
}`;

// AI Chat Endpoint
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const {
      query,
      engine = 'auto',
      category = 'general',
      precision = 'balanced',
      standingMode = false,
      imageData, // optional { base64: string, mimeType: string }
      history = [],
      gemModifier = '',
      modelModeLabel = '',
      groundingMode = 'auto', // 'auto' | 'search' | 'maps'
      userLocation, // optional { latitude: number, longitude: number }
      accountName = 'Ajay Sani',
    } = req.body;

    const accountText = String(accountName || 'Ajay Sani').trim();
    const combinedIdentityCheck = `${accountText} ${String(query || '')}`.toLowerCase();
    const activeCallout =
      /shiv\s*kumar|shivkumar/i.test(combinedIdentityCheck)
        ? 'Hello Shiv Kumar'
        : /ajay\s*sani|ajaysani|master\s*ajay|ajay\s*boss/i.test(combinedIdentityCheck)
        ? 'Master Ajay'
        : accountText || 'Master Ajay';

    const calmLoadMessage = `${activeCallout}, अभी सेवा पर थोड़ा लोड है — कृपया कुछ सेकंड बाद फिर बोलें या भेजें।`;

    if (!query && !imageData && !req.body.mediaData) {
      return res.status(400).json({ error: `${activeCallout}, कृपया अपना सवाल बोलें या लिखें।` });
    }

    const qCheck = String(query || '').toLowerCase();
    const isStandingMode = Boolean(
      standingMode ||
      category === 'standing' ||
      qCheck.includes('standing mode') ||
      qCheck.includes('kachcha chittha') ||
      qCheck.includes('कच्चा चिट्ठा')
    );

    const currentKey = process.env.GEMINI_API_KEY;
    if (!currentKey) {
      return res.status(503).json({
        error: calmLoadMessage,
      });
    }

    // Build current user parts for Gemini API
    const parts: any[] = [];
    const media = req.body.mediaData || imageData;
    if (media && media.base64) {
      const cleanBase64 = media.base64.replace(/^data:[a-zA-Z0-9\/\-+.]+;base64,/, '');
      const mime = media.mimeType || 'image/jpeg';
      parts.push({
        inlineData: {
          mimeType: mime,
          data: cleanBase64,
        },
      });
    }

    // Engine nuance context
    let enginePromptModifier = '';
    if (engine === 'chatgpt') {
      enginePromptModifier = `[Style: ChatGPT — Warm, clear, helpful, short conversational style. Address user as "${activeCallout}"]`;
    } else if (engine === 'grok') {
      enginePromptModifier = `[Style: Grok — Bold, punchy, witty, super-direct style. Address user as "${activeCallout}"]`;
    } else if (engine === 'claude') {
      enginePromptModifier = `[Style: Claude — Calm, well-structured, clean logical style. Address user as "${activeCallout}"]`;
    } else if (engine === 'gemini') {
      enginePromptModifier = `[Style: Gemini — Ultra-fast, crisp, high-precision style. Address user as "${activeCallout}"]`;
    } else {
      enginePromptModifier = `[Style: Gemini Auto — Fast, clear, short, punchy priority auto mode. Address user as "${activeCallout}"]`;
    }

    let precisionInstruction = '';
    if (precision === 'concise') {
      precisionInstruction = '[Answer Length & Precision: CONCISE - Provide rapid direct 1-2 lines final answer, quick punchy speechText, minimal steps]';
    } else if (precision === 'rigorous') {
      precisionInstruction = '[Answer Length & Precision: RIGOROUS ACADEMIC - Provide exhaustive deep-dive, complete step-by-step proofs or derivations, all formulas, and thorough explanations]';
    } else {
      precisionInstruction = '[Answer Length & Precision: BALANCED - Provide clean, well-spaced 3-4 logical steps with clear explanations]';
    }

    const standingDirective = isStandingMode
      ? `[STANDING MODE ACTIVE]
URGENT DIRECTIVE FOR ${activeCallout}:
1. Switch immediately into ultra-fast deep-analysis & cyber scanning mode.
2. Deliver the complete, straightforward, jargon-free "कच्चा चिट्ठा" (Kachcha Chittha) breakdown of the topic, object, riddle, concept, or code snippet with absolute precision.
3. Keep every step punchy, bold, royal, emoji-structured, and crisp for mobile vertical display.
4. Set "title" with "⚡ [STANDING MODE] ..." and "subjectCategory" to "⚡ Standing Mode • कच्चा चिट्ठा".`
      : '';

    const isEasyChildStyle = /बच्चा|bachcha|bacha|baccha|आसान भाषा|बच्चों की तरह/i.test(qCheck);
    const childStyleDirective = isEasyChildStyle
      ? `[EASY AFFECTIONATE "बच्चा" MODE: Explain in ultra-simple, warm, loving, easy-to-understand words like explaining gently and clearly, while staying Mr Jarvis Sheru Bhai Myra Beast Voice Assistant and addressing ${activeCallout}.]`
      : '';

    const userText = `[ACTIVE ACCOUNT: ${accountText} | MANDATORY CALLOUT: Always address user as "${activeCallout}"]
${enginePromptModifier}
${precisionInstruction}
${childStyleDirective}
${standingDirective}
${modelModeLabel ? `[Selected AI Mode: ${modelModeLabel}]` : ''}
${gemModifier ? `[Active Assistant Gem: ${gemModifier}]` : ''}
Category: ${category}
${activeCallout} says: "${query || 'Please examine this uploaded media and provide complete solution.'}"`;

    parts.push({ text: userText });

    // Build multi-turn conversation history for Gemini
    const historyContents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];
    if (Array.isArray(history)) {
      for (const turn of history.slice(-10)) {
        const textVal = typeof turn?.text === 'string' ? turn.text.trim() : '';
        if (!textVal) continue;
        const role = turn?.role === 'model' ? 'model' : 'user';
        // Ensure valid alternating roles starting with user
        if (historyContents.length === 0 && role === 'model') continue;
        if (historyContents.length > 0 && historyContents[historyContents.length - 1].role === role) {
          historyContents[historyContents.length - 1].parts[0].text += `\n${textVal}`;
        } else {
          historyContents.push({ role, parts: [{ text: textVal }] });
        }
      }
      if (historyContents.length > 0 && historyContents[historyContents.length - 1].role === 'user') {
        historyContents.pop();
      }
    }

    const fullContents = [...historyContents, { role: 'user', parts }];

    // Determine grounding intent: Google Maps vs Google Search vs Standard/Fast Chat
    const mapsPattern = /\b(near me|nearby|restaurant|restaurants|hotel|hotels|hospital|temple|mandir|ashram|ghat|directions|route|map|maps|location|address|distance|places to visit|cafe|petrol|atm|station|airport|market|mall|park|tourist|haridwar|dehradun|rishikesh)\b|कहां है|पास में|रास्ता|नक्शा/i;
    const searchPattern = /\b(latest|news|today|current|2025|2026|weather|price|stock|score|match|cricket|ipl|winner|won|who is|president|prime minister|live score|release|update|search|google)\b|ताजा खबर|आज का|मौसम|कीमत/i;

    let resolvedGrounding: 'maps' | 'search' | 'none' = 'none';
    if (groundingMode === 'maps') {
      resolvedGrounding = 'maps';
    } else if (groundingMode === 'search') {
      resolvedGrounding = 'search';
    } else if (!media && !isStandingMode) {
      if (mapsPattern.test(qCheck)) {
        resolvedGrounding = 'maps';
      } else if (searchPattern.test(qCheck)) {
        resolvedGrounding = 'search';
      }
    }

    const ai = getGenAI();

    // Helper: parse Markdown grounded output into AssistantResponse structure cleanly
    const formatGroundedResponse = (
      markdownText: string,
      groundingType: 'search' | 'maps',
      groundingLinks: Array<{ title: string; uri: string; sourceType: 'search' | 'maps'; snippets?: string[] }>
    ) => {
      const cleaned = markdownText.trim();
      const lines = cleaned.split(/\n+/).map((l) => l.trim()).filter(Boolean);
      const firstSentence = (lines[0] || cleaned).replace(/^#+\s*/, '').replace(/[*_`]/g, '').slice(0, 220);

      const stepChunks: Array<{ stepNumber: number; title: string; detail: string }> = [];
      lines.forEach((line, idx) => {
        if (idx >= 8) return;
        const cleanLine = line.replace(/^#+\s*/, '').replace(/^[-*•]\s*/, '');
        stepChunks.push({
          stepNumber: idx + 1,
          title: idx === 0
            ? (groundingType === 'maps' ? '📍 Google Maps Overview' : '🌐 Google Search Overview')
            : `Detail ${idx + 1}`,
          detail: cleanLine,
        });
      });

      return {
        speechText: `${activeCallout}! ${firstSentence}`,
        title: groundingType === 'maps'
          ? `📍 लोकेशन जानकारी: ${String(query || 'Location').slice(0, 48)}`
          : `🌐 ताज़ा जानकारी: ${String(query || 'Search').slice(0, 48)}`,
        subjectCategory: groundingType === 'maps' ? '📍 Google Maps' : '🌐 Search',
        steps: stepChunks.length > 0 ? stepChunks : [{ stepNumber: 1, title: 'मुख्य जानकारी', detail: cleaned }],
        finalAnswer: cleaned,
        beastTip: groundingType === 'maps'
          ? 'सीधे मैप्स लिंक से रास्ता देखें।'
          : 'साफ़ और ताज़ा जानकारी ऊपर दी गई है।',
        suggestedPrompts: groundingType === 'maps'
          ? ['Directions to Triveni Ghat Rishikesh', 'Best cafes nearby', 'Nearest pharmacy or hospital']
          : ['Latest AI & tech news today', 'Today weather in Rishikesh', 'Current cricket match score'],
        groundingType,
        groundingLinks,
        engineUsed: engine,
        modelName: 'gemini-4-hydrogen',
        modelModeLabel: modelModeLabel || undefined,
        standingMode: isStandingMode,
        timestamp: new Date().toISOString(),
      };
    };

    // 1. Google Maps Grounding path (gemini-4-hydrogen + googleMaps tool, NO responseMimeType / responseSchema)
    if (resolvedGrounding === 'maps') {
      try {
        const hasLatLng =
          userLocation &&
          typeof userLocation.latitude === 'number' &&
          typeof userLocation.longitude === 'number';

        const config: any = {
          systemInstruction: `${MR_JARVIS_SYSTEM_PROMPT}\nRespond concisely in clear Hindi/Hinglish and always address the user as "${activeCallout}".`,
          tools: [{ googleMaps: {} }],
        };
        if (hasLatLng) {
          config.toolConfig = {
            retrievalConfig: {
              latLng: {
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
              },
            },
          };
        }

        const response = await ai.models.generateContent({
          model: 'gemini-4-hydrogen',
          contents: fullContents,
          config,
        });

        const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        const groundingLinks = chunks
          .filter((c: any) => c?.maps?.uri)
          .map((c: any) => ({
            title: c.maps.title || 'View on Google Maps',
            uri: c.maps.uri,
            sourceType: 'maps' as const,
            snippets: Array.isArray(c.maps.placeAnswerSources?.reviewSnippets)
              ? c.maps.placeAnswerSources.reviewSnippets
                  .map((s: any) => s?.text || s?.reviewText || s?.content)
                  .filter(Boolean)
              : undefined,
          }));

        return res.json(formatGroundedResponse(response.text || 'Location details retrieved.', 'maps', groundingLinks));
      } catch (mapsErr: any) {
        console.error('Google Maps grounding error:', mapsErr);
        const statusCode = mapsErr?.status && Number.isInteger(mapsErr.status) ? mapsErr.status : 503;
        return res.status(statusCode).json({
          error: calmLoadMessage,
        });
      }
    }

    // 2. Google Search Grounding path (gemini-4-hydrogen + fallback + googleSearch tool)
    if (resolvedGrounding === 'search') {
      let lastSearchErr: any = null;
      for (const searchModel of ['gemini-4-hydrogen', 'gemini-2.5-flash']) {
        try {
          const response = await ai.models.generateContent({
            model: searchModel,
            contents: fullContents,
            config: {
              systemInstruction: `${MR_JARVIS_SYSTEM_PROMPT}\nRespond briefly and clearly in Hindi/Hinglish using verified Search facts, and always address the user as "${activeCallout}".`,
              tools: [{ googleSearch: {} }],
            },
          });

          const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
          const groundingLinks = chunks
            .filter((c: any) => c?.web?.uri)
            .map((c: any) => ({
              title: c.web.title || c.web.uri,
              uri: c.web.uri,
              sourceType: 'search' as const,
            }));

          return res.json(formatGroundedResponse(response.text || 'जानकारी तैयार है।', 'search', groundingLinks));
        } catch (searchErr: any) {
          lastSearchErr = searchErr;
          console.warn(`Search model ${searchModel} warning:`, searchErr?.message || searchErr);
        }
      }
      const statusCode = lastSearchErr?.status && Number.isInteger(lastSearchErr.status) ? lastSearchErr.status : 503;
      return res.status(statusCode).json({
        error: calmLoadMessage,
      });
    }

    // 3. Standard & Fast Multi-Turn Structured Chat
    const CANDIDATE_MODELS =
      precision === 'concise'
        ? ['gemini-2.5-flash', 'gemini-3.1-flash-lite', 'gemini-4-hydrogen']
        : ['gemini-4-hydrogen', 'gemini-2.5-flash', 'gemini-3.1-flash-lite'];

    let lastError: any = null;
    let parsedData: any = null;
    let modelSuccessfullyUsed = CANDIDATE_MODELS[0];

    for (const modelName of CANDIDATE_MODELS) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: fullContents,
          config: {
            systemInstruction: MR_JARVIS_SYSTEM_PROMPT,
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                speechText: { type: Type.STRING },
                title: { type: Type.STRING },
                subjectCategory: { type: Type.STRING },
                steps: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      stepNumber: { type: Type.INTEGER },
                      title: { type: Type.STRING },
                      detail: { type: Type.STRING },
                      formulaOrCode: { type: Type.STRING },
                    },
                    required: ['stepNumber', 'title', 'detail'],
                  },
                },
                finalAnswer: { type: Type.STRING },
                beastTip: { type: Type.STRING },
                suggestedPrompts: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                phoneAction: {
                  type: Type.OBJECT,
                  properties: {
                    actionType: { type: Type.STRING },
                    label: { type: Type.STRING },
                    target: { type: Type.STRING },
                    autoExecute: { type: Type.BOOLEAN },
                  },
                  required: ['actionType', 'label'],
                },
              },
              required: ['speechText', 'title', 'subjectCategory', 'steps', 'finalAnswer', 'beastTip'],
            },
          },
        });

        const responseText = response.text || '{}';
        parsedData = JSON.parse(responseText);
        modelSuccessfullyUsed = modelName;
        break;
      } catch (err: any) {
        lastError = err;
        console.warn(`Model ${modelName} encountered error:`, err?.message || err);
      }
    }

    if (parsedData) {
      return res.json({
        ...parsedData,
        engineUsed: engine,
        standingMode: isStandingMode,
        modelName: modelSuccessfullyUsed,
        modelModeLabel: modelModeLabel || undefined,
        timestamp: new Date().toISOString(),
      });
    }

    const statusCode = lastError?.status && Number.isInteger(lastError.status) ? lastError.status : 503;
    return res.status(statusCode).json({
      error: calmLoadMessage,
    });
  } catch (error: any) {
    console.error('Error in /api/chat:', error);
    const reqAccount = String(req.body?.accountName || '').toLowerCase();
    const reqQuery = String(req.body?.query || '').toLowerCase();
    const fallbackCallout = /shiv\s*kumar|shivkumar/i.test(`${reqAccount} ${reqQuery}`)
      ? 'Hello Shiv Kumar'
      : 'Master Ajay';
    return res.status(503).json({
      error: `${fallbackCallout}, अभी सेवा पर थोड़ा लोड है — कृपया कुछ सेकंड बाद फिर बोलें या भेजें।`,
    });
  }
});

// Studio Text-to-Speech Endpoint (via gemini-3.8-flash-lite-tts)
app.post('/api/tts', async (req: Request, res: Response) => {
  try {
    const { text, voice = 'Puck' } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required for TTS' });
    }

    const currentKey = process.env.GEMINI_API_KEY;
    if (!currentKey) {
      return res.status(400).json({ error: 'API key not configured for server-side TTS' });
    }

    const ai = getGenAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `Speak with joyful, sweet, energetic enthusiasm as Mr Jarvis Beast to Aijay Boss: ${text}`,
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice }, // 'Puck', 'Charon', 'Kore', 'Fenrir', 'Zephyr'
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      return res.json({
        audioBase64: base64Audio,
        mimeType: 'audio/wav',
      });
    }

    return res.status(500).json({ error: 'No audio returned from TTS model' });
  } catch (error: any) {
    console.error('TTS error (will fallback to browser Web Speech API):', error);
    return res.status(500).json({ error: error.message || 'TTS generation error' });
  }
});

// AI App Builder Endpoint (Generates live responsive HTML5 + CSS + JS micro-apps)
app.post('/api/build-app', async (req: Request, res: Response) => {
  try {
    const { appIdea = '', style = 'Cyber Dark & Gold (#07090e / #ffd700)', userName = 'Master Ajay Boss' } = req.body;
    const trimmedIdea = String(appIdea).trim();
    if (!trimmedIdea) {
      return res.status(400).json({ error: 'App idea description is required' });
    }

    const buildFallbackApp = (idea: string) => {
      const safeTitle = idea.replace(/[<>&"']/g, '').slice(0, 48) || 'Beast Cyber Utility';
      return {
        appTitle: safeTitle,
        summary: `Generated responsive mobile-first single-file HTML5 app for "${safeTitle}" styled in Supreme Dark (#07090e) and Gold (#ffd700).`,
        speechText: `Pranam ${userName}! Aapke liye "${safeTitle}" live mobile web app taiyar ho chuka hai!`,
        htmlCode: `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${safeTitle}</title>
  <style>
    * { box-sizing: border-box; font-family: system-ui, -apple-system, sans-serif; }
    body { margin: 0; min-height: 100vh; background: #07090e; color: #f8fafc; padding: 16px; display: flex; justify-content: center; align-items: flex-start; }
    .app-shell { width: 100%; max-width: 520px; background: #0d121d; border: 1.5px solid rgba(255,215,0,0.45); border-radius: 18px; padding: 18px; box-shadow: 0 0 28px rgba(255,215,0,0.12); }
    h1 { margin: 0 0 6px; font-size: 1.25rem; color: #ffd700; }
    p.sub { margin: 0 0 16px; font-size: 0.85rem; color: #94a3b8; }
    .row { display: flex; gap: 8px; margin-bottom: 12px; }
    input { flex: 1; min-height: 44px; padding: 10px 12px; border-radius: 10px; border: 1px solid rgba(255,215,0,0.35); background: #07090e; color: #fff; font-size: 0.9rem; outline: none; }
    input:focus { border-color: #ffd700; }
    button { min-height: 44px; padding: 0 16px; border-radius: 10px; border: none; background: #ffd700; color: #07090e; font-weight: 800; cursor: pointer; }
    button:active { transform: scale(0.97); }
    ul { list-style: none; padding: 0; margin: 12px 0 0; display: grid; gap: 8px; }
    li { display: flex; justify-content: space-between; align-items: center; padding: 10px 12px; background: #111827; border: 1px solid rgba(255,215,0,0.2); border-radius: 10px; font-size: 0.9rem; }
    .del { background: transparent; color: #f87171; border: 1px solid rgba(248,113,113,0.4); min-height: 32px; padding: 0 10px; font-size: 0.75rem; }
    .footer { margin-top: 14px; font-size: 0.75rem; color: #64748b; text-align: center; }
  </style>
</head>
<body>
  <div class="app-shell">
    <h1>${safeTitle}</h1>
    <p class="sub">Built by Mr Jarvis Myra Beast App Builder for ${userName}</p>
    <div class="row">
      <input id="itemInput" type="text" placeholder="Add new entry..." />
      <button onclick="addItem()">Add</button>
    </div>
    <ul id="itemList"></ul>
    <div class="footer">Supreme Dark (#07090e) &amp; Gold (#ffd700) Interactive Build</div>
  </div>
  <script>
    const listEl = document.getElementById('itemList');
    const inputEl = document.getElementById('itemInput');
    const items = ['Verified Human ID: ${userName}', 'Jarvis & Myra Module Active'];
    function render() {
      listEl.innerHTML = items.map((text, idx) =>
        '<li><span>' + text.replace(/</g, '&lt;') + '</span><button class="del" onclick="removeItem(' + idx + ')">Remove</button></li>'
      ).join('');
    }
    function addItem() {
      const val = inputEl.value.trim();
      if (!val) return;
      items.unshift(val);
      inputEl.value = '';
      render();
    }
    function removeItem(idx) { items.splice(idx, 1); render(); }
    inputEl.addEventListener('keydown', function(e) { if (e.key === 'Enter') addItem(); });
    render();
  </script>
</body>
</html>`,
      };
    };

    const currentKey = process.env.GEMINI_API_KEY;
    if (!currentKey) {
      return res.json(buildFallbackApp(trimmedIdea));
    }

    const ai = getGenAI();
    const CANDIDATE_MODELS = ['gemini-4-hydrogen', 'gemini-3.1-flash-lite'];
    const prompt = `Create a complete, self-contained single-file responsive mobile-first HTML5 web application for this user request:
App Idea: "${trimmedIdea}"
Visual Style: "${style}" (Supreme Dark background #07090e, card #0e1420, glowing gold accents #ffd700, crisp white/slate text, min-height 44px buttons/inputs, zero external dependencies or CDN images needed, real working interactive JavaScript!).
Created for: ${userName}.

Return STRICT JSON with keys:
- "appTitle": concise title
- "summary": 1-2 sentence overview of features implemented
- "speechText": 1 lively sentence in Hindi/English from Mr Jarvis Myra Beast telling ${userName} their app is ready
- "htmlCode": complete valid <!doctype html>...</html> code with inline <style> and <script> that works immediately inside an iframe.`;

    for (const modelName of CANDIDATE_MODELS) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                appTitle: { type: Type.STRING },
                summary: { type: Type.STRING },
                speechText: { type: Type.STRING },
                htmlCode: { type: Type.STRING },
              },
              required: ['appTitle', 'summary', 'speechText', 'htmlCode'],
            },
          },
        });
        const parsed = JSON.parse(response.text || '{}');
        if (parsed.htmlCode && parsed.htmlCode.includes('<html')) {
          return res.json(parsed);
        }
      } catch (err) {
        console.warn(`App builder model ${modelName} failed:`, err);
      }
    }

    return res.json(buildFallbackApp(trimmedIdea));
  } catch (err) {
    console.error('Error in /api/build-app:', err);
    return res.status(500).json({ error: 'Failed to generate app' });
  }
});

// Android APK Bundle Readiness & Preparation Endpoints
async function getDirStats(dirPath: string): Promise<{ bytes: number; files: number }> {
  let bytes = 0;
  let files = 0;
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      if (entry.isDirectory()) {
        const sub = await getDirStats(fullPath);
        bytes += sub.bytes;
        files += sub.files;
      } else if (entry.isFile()) {
        const stat = await fs.stat(fullPath);
        bytes += stat.size;
        files += 1;
      }
    }
  } catch {
    // directory missing
  }
  return { bytes, files };
}

async function copyDirRecursive(srcDir: string, destDir: string) {
  await fs.mkdir(destDir, { recursive: true });
  const entries = await fs.readdir(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);
    if (entry.isDirectory()) {
      await copyDirRecursive(srcPath, destPath);
    } else if (entry.isFile()) {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

app.get('/api/apk/status', async (_req: Request, res: Response) => {
  try {
    const distDir = path.resolve(__dirname, 'dist');
    const androidAssetsPublic = path.resolve(__dirname, 'android', 'app', 'src', 'main', 'assets', 'public');
    const sheruAudioInAndroid = path.join(androidAssetsPublic, 'assets', 'aistudio', 'YourAppearance_9e82ad56.mp3');
    const sheruVideoInAndroid = path.join(androidAssetsPublic, 'assets', 'aistudio', '_360p__22__287ba01a.mp4');

    const [distStats, androidStats, audioExists, videoExists] = await Promise.all([
      getDirStats(distDir),
      getDirStats(androidAssetsPublic),
      fs.access(sheruAudioInAndroid).then(() => true).catch(() => false),
      fs.access(sheruVideoInAndroid).then(() => true).catch(() => false),
    ]);

    res.json({
      packageId: 'com.aijayboss.mrjarvisbeast',
      appName: 'Mr Jarvis Beast',
      distReady: distStats.files > 0,
      distBytes: distStats.bytes,
      distFiles: distStats.files,
      androidSynced: androidStats.files > 0,
      androidAssetBytes: androidStats.bytes,
      sheruAssetsSynced: audioExists && videoExists,
      aabWorkflowReady: true,
      nativeSdkAvailable: false,
      githubWorkflow: '.github/workflows/build-apk.yml',
    });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Failed to inspect APK status' });
  }
});

app.post('/api/apk/prepare', async (_req: Request, res: Response) => {
  try {
    const viteBin = path.resolve(__dirname, 'node_modules', 'vite', 'bin', 'vite.js');
    await execFileAsync(process.execPath, [viteBin, 'build'], { cwd: __dirname, timeout: 60000 });

    const distDir = path.resolve(__dirname, 'dist');
    const androidAssetsPublic = path.resolve(__dirname, 'android', 'app', 'src', 'main', 'assets', 'public');
    await fs.rm(androidAssetsPublic, { recursive: true, force: true });
    await copyDirRecursive(distDir, androidAssetsPublic);

    const distStats = await getDirStats(distDir);
    res.json({
      success: true,
      packageId: 'com.aijayboss.mrjarvisbeast',
      distBytes: distStats.bytes,
      distFiles: distStats.files,
      androidSynced: true,
      nativeSdkAvailable: false,
      message: 'Production web bundle built and synced into /android/app/src/main/assets/public with relative asset paths.',
    });
  } catch (err: any) {
    console.error('Failed to prepare APK bundle:', err);
    res.status(500).json({ error: err?.message || 'Failed to build & sync APK bundle' });
  }
});

app.get('/api/apk/source-zip', async (_req: Request, res: Response) => {
  try {
    const distDir = path.resolve(__dirname, 'dist');
    const distStats = await getDirStats(distDir);
    if (distStats.files === 0) {
      const viteBin = path.resolve(__dirname, 'node_modules', 'vite', 'bin', 'vite.js');
      await execFileAsync(process.execPath, [viteBin, 'build'], { cwd: __dirname, timeout: 60000 });
    }
    const androidAssetsPublic = path.resolve(__dirname, 'android', 'app', 'src', 'main', 'assets', 'public');
    await fs.rm(androidAssetsPublic, { recursive: true, force: true });
    await copyDirRecursive(distDir, androidAssetsPublic);

    const buildGuide = `# Mr Jarvis Sheru Bhai Myra Beast Voice Assistant — Android APK & Play Console AAB Guide

Package ID: com.aijayboss.mrjarvisbeast
Included Web & Voice Assets (relative './' paths):
  - assets/aistudio/YourAppearance_9e82ad56.mp3 (Signature Theme Audio)
  - assets/aistudio/_360p__22__287ba01a.mp4 (Sheru Bhai Voice & Video Clip)
  - ajay-crown.png, person-ai-assistant.png, logo-combo.png, logo.png, logo.jpg

## 1. One-Command Local Build (Generates BOTH .apk & .aab into src/releases/)
Requires Node.js, Java JDK 21, and Android SDK installed on your computer:
- **Mac / Linux:**
  \`\`\`bash
  chmod +x scripts/build-apk-and-aab.sh
  ./scripts/build-apk-and-aab.sh
  \`\`\`
- **Windows:**
  \`\`\`bat
  scripts\\build-apk-and-aab.bat
  \`\`\`
Outputs created automatically inside \`src/releases/\`:
  - \`src/releases/mr-jarvis-beast-debug.apk\` (Install directly on Android phone for testing)
  - \`src/releases/mr-jarvis-beast-release.aab\` (Upload to Google Play Console)

## 2. Build Manually via Android Studio or Gradle
1. Install Capacitor bridge once: \`npm install --no-save @capacitor/core@^8.0.0 @capacitor/android@^8.0.0 @capacitor/cli@^8.0.0\`
2. Open \`android/\` in Android Studio:
   - **Testing APK:** \`cd android && ./gradlew assembleDebug\` -> \`android/app/build/outputs/apk/debug/app-debug.apk\`
   - **Google Play Console AAB (Mandatory):** \`cd android && ./gradlew bundleRelease\` -> \`android/app/build/outputs/bundle/release/app-release.aab\`

## 3. Signing the .aab for Google Play Console
Google Play Console requires your \`.aab\` to be signed with an upload keystore:
\`\`\`bash
keytool -genkey -v -keystore release-keystore.jks -keyalg RSA -keysize 2048 -validity 10000 -alias jarvis_beast
export ANDROID_KEYSTORE_PATH="$(pwd)/release-keystore.jks"
export ANDROID_KEYSTORE_PASSWORD="YOUR_PASSWORD"
export ANDROID_KEY_ALIAS="jarvis_beast"
export ANDROID_KEY_PASSWORD="YOUR_PASSWORD"
cd android && ./gradlew bundleRelease
\`\`\`
(Or in Android Studio: **Build > Generate Signed Bundle / APK > Android App Bundle**.)

## 4. Automated Cloud Build (GitHub Actions — Zero Local SDK Needed)
Push this ZIP to a GitHub repository. \`.github/workflows/build-apk.yml\` compiles BOTH:
  - \`MrJarvisBeast-v1.0-debug.apk\`
  - \`MrJarvisBeast-v1.0-release.aab\`
and attaches both files to **GitHub Actions > Artifacts** and **GitHub Releases**.

## 5. Install the .apk on Your Android Phone
1. Download or copy \`mr-jarvis-beast-debug.apk\` (\`app-debug.apk\`) to your Android phone.
2. Tap it in **Files** or **Chrome > Downloads**.
3. If prompted, enable **Allow from this source** under *Install unknown apps*, then tap **Install**.
`;

    const outZip = '/tmp/mr-jarvis-beast-android-project.zip';
    const pyScript = `
import os, zipfile
root = ${JSON.stringify(__dirname)}
out = ${JSON.stringify(outZip)}
guide = ${JSON.stringify(buildGuide)}
with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED) as zf:
    zf.writestr('ANDROID_APK_AND_AAB_GUIDE.md', guide)
    for rel in ['package.json', 'tsconfig.json', 'vite.config.ts', 'index.html', 'capacitor.config.json', '.github/workflows/build-apk.yml']:
        p = os.path.join(root, rel)
        if os.path.isfile(p):
            zf.write(p, rel)
    for folder in ['android', 'dist', 'src', 'public', 'scripts']:
        base = os.path.join(root, folder)
        if not os.path.isdir(base):
            continue
        for dirpath, dirnames, filenames in os.walk(base):
            dirnames[:] = [d for d in dirnames if d not in ('.gradle', 'build', 'node_modules')]
            for fn in filenames:
                fp = os.path.join(dirpath, fn)
                arc = os.path.relpath(fp, root)
                zf.write(fp, arc)
`;
    await execFileAsync('python3', ['-c', pyScript], { timeout: 60000 });
    const zipBuffer = await fs.readFile(outZip);
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="mr-jarvis-beast-android-apk-project.zip"');
    return res.send(zipBuffer);
  } catch (err: any) {
    console.error('Failed to package APK source zip:', err);
    return res.status(500).json({ error: err?.message || 'Failed to package Android project zip' });
  }
});

// Beast Utilities Endpoint (Real-time Clock, Jokes, Dialers)
app.get('/api/status', (req: Request, res: Response) => {
  res.json({
    status: 'online',
    assistant: 'Mr Jarvis Beast',
    dedicatedTo: 'Aijay Boss',
    localTime: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    version: '3.8.0-BeastEdition',
  });
});

async function start() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`⚡ Mr Jarvis Beast is fully active on http://0.0.0.0:${PORT} dedicated to Aijay Boss!`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
