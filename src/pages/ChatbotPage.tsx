import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { getHydroBotAnswer } from '../services/aiService';
import {
  Send, Bot, Trash2, Sparkles, Copy, Check,
  BookOpen, HelpCircle
} from 'lucide-react';

interface Msg {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  time: string;
}

export const ChatbotPage: React.FC = () => {
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Bonjour ! Je suis **HydroBot** 🤖, l'intelligence artificielle d'**IngénieurHub**.

Spécialisé en :
- 💧 **Hydraulique urbaine & AEP** (Normes ADE, modélisation EPANET, calculs Hazen-Williams)
- 🌊 **Hydrologie & Crues** (Normes ANRH/ANBT, simulations HEC-RAS 1D/2D, formules de Manning)
- 🌱 **Irrigation & Agronomie** (Méthode FAO 56, bilans hydriques $ET_m = ET_0 \\times K_c$)
- 🧪 **Traitement des eaux** (Coagulation/floculation, filtration rapide sur sable, chloration)
- 🛡️ **Ouvrages hydrauliques & Barrages** (Digues en terre, analyses d'infiltration SEEP/W)

Posez-moi vos questions techniques ci-dessous ou cliquez sur l'un des exemples recommandés !`,
      time: 'Maintenant'
    }
  ]);

  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const quickPrompts = [
    "Comment modéliser un réseau AEP sous EPANET ?",
    "Simulation d'un oued en crue sous HEC-RAS 2D",
    "Calcul des besoins en eau d'irrigation selon FAO 56",
    "Filière de traitement et potabilisation des eaux de surface",
    "Analyse de filtration digue de barrage sous SEEP/W",
    "Intégration d'un shapefile AEP sous ArcGIS Pro"
  ];

  const handleSend = (textToSend?: string) => {
    const q = (textToSend || inputVal).trim();
    if (!q) return;

    const userMsg: Msg = {
      id: Date.now().toString(),
      role: 'user',
      content: q,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    setTimeout(() => {
      const reply = getHydroBotAnswer(q);
      const botMsg: Msg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 600);
  };

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClear = () => {
    setMessages([
      {
        id: 'reset',
        role: 'assistant',
        content: "Conversation réinitialisée. En quoi puis-je vous assister dans vos calculs techniques aujourd'hui ?",
        time: 'Maintenant'
      }
    ]);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col h-[82vh]">
        {/* CONSOLE HEADER */}
        <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-indigo-950 p-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-xl shadow-inner">
              🤖
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-base sm:text-lg">
                  HydroBot IA — Console Technique
                </h1>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-400 text-brand-950">
                  Algérie Normes
                </span>
              </div>
              <p className="text-xs text-cyan-200">
                Assistant conversationnel en génie civil, hydraulique, VRD et géomatique
              </p>
            </div>
          </div>

          <button
            onClick={handleClear}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
            title="Effacer la discussion"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Effacer</span>
          </button>
        </div>

        {/* QUICK PROMPTS HORIZONTAL SCROLLER */}
        <div className="bg-slate-50 dark:bg-slate-850 px-4 py-2.5 border-b border-slate-200 dark:border-slate-800 flex gap-2 overflow-x-auto scrollbar-none shrink-0 text-xs">
          <span className="text-slate-400 font-semibold flex items-center gap-1 shrink-0">
            <Sparkles className="w-3 h-3 text-brand-500" /> Suggestions :
          </span>
          {quickPrompts.map((p, i) => (
            <button
              key={i}
              onClick={() => handleSend(p)}
              className="whitespace-nowrap px-3 py-1 rounded-full bg-white dark:bg-slate-800 text-brand-800 dark:text-cyan-300 border border-slate-200 dark:border-slate-700 hover:bg-brand-50 transition-colors font-medium"
            >
              {p}
            </button>
          ))}
        </div>

        {/* MESSAGES THREAD */}
        <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
          {messages.map(m => {
            const isUser = m.role === 'user';
            return (
              <div key={m.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'} gap-3`}>
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-brand-600 text-white flex items-center justify-center shrink-0 text-base shadow-sm mt-1">
                    🤖
                  </div>
                )}

                <div className={`max-w-[85%] rounded-3xl p-4 sm:p-5 leading-relaxed relative group ${
                  isUser
                    ? 'bg-brand-600 text-white rounded-br-xs shadow-md shadow-brand-600/10'
                    : 'bg-slate-50 dark:bg-slate-850 text-slate-800 dark:text-slate-100 rounded-bl-xs border border-slate-200/80 dark:border-slate-700'
                }`}>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: m.content
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\*(.*?)\*/g, '<em>$1</em>')
                        .replace(/### (.*?)\n/g, '<h3 class="font-extrabold text-base mb-2 text-brand-900 dark:text-cyan-300">$1</h3>')
                        .replace(/\n\n/g, '<div class="h-2"></div>')
                        .replace(/\n/g, '<br/>')
                    }}
                  />

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-black/5 dark:border-white/5 text-[10px] opacity-70">
                    <span>{m.time}</span>
                    {!isUser && (
                      <button
                        onClick={() => handleCopy(m.content, m.id)}
                        className="hover:text-brand-600 flex items-center gap-1 transition-colors ml-4"
                        title="Copier la réponse"
                      >
                        {copiedId === m.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-500" />
                            <span className="text-emerald-500">Copié</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copier</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex justify-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-brand-600 text-white flex items-center justify-center shrink-0 text-base shadow-sm">
                🤖
              </div>
              <div className="bg-slate-50 dark:bg-slate-850 rounded-2xl rounded-bl-xs p-4 text-slate-500 text-xs flex items-center gap-2 border border-slate-200 dark:border-slate-700">
                <div className="w-2 h-2 rounded-full bg-brand-500 animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-brand-500 animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 rounded-full bg-brand-500 animate-bounce [animation-delay:0.4s]" />
                <span className="text-xs font-medium ml-1">HydroBot synthétise les règles de l'art...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* INPUT PROMPT BOX */}
        <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-3"
          >
            <input
              type="text"
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              placeholder="Posez votre question technique (ex: Quelle est la vitesse minimale d'auto-curage ?)..."
              className="flex-1 text-xs sm:text-sm py-3 px-4 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all shadow-inner"
            />
            <button
              type="submit"
              disabled={!inputVal.trim()}
              className="py-3 px-6 rounded-2xl bg-gradient-to-r from-brand-600 to-cyan-600 hover:from-brand-500 hover:to-cyan-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-brand-500/20 disabled:opacity-40 transition-all flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Envoyer</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
