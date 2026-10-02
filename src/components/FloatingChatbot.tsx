import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { getHydroBotAnswer } from '../services/aiService';
import { Bot, X, Send, Sparkles, Trash2, ArrowUpRight } from 'lucide-react';

interface Msg {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  time: string;
}

export const FloatingChatbot: React.FC = () => {
  const { floatingChatOpen, toggleFloatingChat, navigateTo } = useApp();
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: 'init',
      role: 'assistant',
      content: "Bonjour ! Je suis **HydroBot** 🤖, votre assistant spécialisé en hydraulique, AEP, assainissement, VRD et barrages en Algérie. Comment puis-je vous aider ?",
      time: 'Maintenant'
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (floatingChatOpen) {
      scrollToBottom();
    }
  }, [messages, floatingChatOpen]);

  const handleSend = (userText?: string) => {
    const q = (userText || inputVal).trim();
    if (!q) return;

    const userMsg: Msg = {
      id: Date.now().toString(),
      role: 'user',
      content: q,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal('');
    setTyping(true);

    setTimeout(() => {
      const reply = getHydroBotAnswer(q);
      const botMsg: Msg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
      setTyping(false);
    }, 600);
  };

  const handleClear = () => {
    setMessages([
      {
        id: 'init',
        role: 'assistant',
        content: "Conversation réinitialisée. Posez vos questions techniques sur vos projets d'ingénierie !",
        time: 'Maintenant'
      }
    ]);
  };

  return (
    <div className="fixed bottom-5 right-5 z-40">
      {/* Floating Chat Drawer */}
      {floatingChatOpen && (
        <div className="mb-3 w-[360px] sm:w-[400px] h-[520px] max-h-[82vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-scaleUp">
          {/* Header */}
          <div className="bg-gradient-to-r from-brand-700 via-brand-600 to-cyan-600 p-4 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-lg backdrop-blur-sm">
                🤖
              </div>
              <div>
                <h4 className="font-bold text-sm leading-tight flex items-center gap-1.5">
                  HydroBot IA
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </h4>
                <p className="text-[11px] text-cyan-100">Génie Civil & Hydraulique Algérie</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={handleClear}
                title="Effacer la conversation"
                className="w-7 h-7 rounded-lg hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  toggleFloatingChat();
                  navigateTo('chatbot');
                }}
                title="Agrandir en plein écran"
                className="w-7 h-7 rounded-lg hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors"
              >
                <ArrowUpRight className="w-4 h-4" />
              </button>
              <button
                onClick={toggleFloatingChat}
                className="w-7 h-7 rounded-lg hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick suggestions pills */}
          <div className="bg-slate-50 dark:bg-slate-800/80 px-3 py-2 border-b border-slate-100 dark:border-slate-800 flex gap-1.5 overflow-x-auto text-[11px] scrollbar-none shrink-0">
            <button
              onClick={() => handleSend("Pression et vitesse recommandées sur EPANET ?")}
              className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white dark:bg-slate-700 text-brand-700 dark:text-brand-300 border border-slate-200 dark:border-slate-600 hover:bg-brand-50 transition-colors"
            >
              💧 EPANET
            </button>
            <button
              onClick={() => handleSend("Comment modéliser les crues sous HEC-RAS 2D ?")}
              className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white dark:bg-slate-700 text-brand-700 dark:text-brand-300 border border-slate-200 dark:border-slate-600 hover:bg-brand-50 transition-colors"
            >
              🌊 HEC-RAS
            </button>
            <button
              onClick={() => handleSend("Besoins en eau d'irrigation selon FAO 56")}
              className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white dark:bg-slate-700 text-brand-700 dark:text-brand-300 border border-slate-200 dark:border-slate-600 hover:bg-brand-50 transition-colors"
            >
              🌱 Irrigation
            </button>
          </div>

          {/* Messages list */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
            {messages.map(m => {
              const isUser = m.role === 'user';
              return (
                <div key={m.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 leading-relaxed ${
                      isUser
                        ? 'bg-brand-600 text-white rounded-br-xs shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-xs border border-slate-200/60 dark:border-slate-700'
                    }`}
                  >
                    <div
                      dangerouslySetInnerHTML={{
                        __html: m.content
                          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                          .replace(/\*(.*?)\*/g, '<em>$1</em>')
                          .replace(/### (.*?)\n/g, '<div class="font-bold text-sm mb-1">$1</div>')
                          .replace(/\n/g, '<br/>')
                      }}
                    />
                    <div className={`text-[9px] mt-1 text-right ${isUser ? 'text-brand-200' : 'text-slate-400'}`}>
                      {m.time}
                    </div>
                  </div>
                </div>
              );
            })}
            {typing && (
              <div className="flex justify-start">
                <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl rounded-bl-xs p-3 text-slate-500 text-xs flex items-center gap-1.5 border border-slate-200 dark:border-slate-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-bounce" />
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-bounce [animation-delay:0.4s]" />
                  <span className="text-[11px] ml-1">HydroBot analyse votre question...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input box */}
          <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
            <form
              onSubmit={e => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                placeholder="Posez une question technique (EPANET, Caquot...)"
                className="flex-1 text-xs py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <button
                type="submit"
                disabled={!inputVal.trim()}
                className="p-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white disabled:opacity-40 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        type="button"
        onClick={toggleFloatingChat}
        className="relative group p-3.5 rounded-2xl bg-gradient-to-r from-brand-600 to-cyan-500 hover:from-brand-500 hover:to-cyan-400 text-white shadow-xl shadow-brand-600/30 flex items-center justify-center transition-all duration-300 hover:scale-105"
        aria-label="Assistant HydroBot"
      >
        <span className="text-2xl leading-none">
          {floatingChatOpen ? '✕' : '🤖'}
        </span>
        {!floatingChatOpen && (
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-cyan-500 border-2 border-white"></span>
          </span>
        )}
      </button>
    </div>
  );
};
