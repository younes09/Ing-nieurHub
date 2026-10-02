import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { analyzeCalculations } from '../services/aiService';
import { AiAnalysisResult } from '../types';
import { X, Sparkles, AlertCircle, CheckCircle2, AlertTriangle, Lightbulb, Play } from 'lucide-react';

export const AiErrorAgentModal: React.FC = () => {
  const { aiModalOpen, closeAiModal } = useApp();
  const [calcText, setCalcText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AiAnalysisResult | null>(null);

  if (!aiModalOpen) return null;

  const handleRunAnalysis = (textToAnalyze?: string) => {
    const text = textToAnalyze || calcText;
    if (!text.trim()) return;

    setAnalyzing(true);
    setTimeout(() => {
      const res = analyzeCalculations(text);
      setResult(res);
      setAnalyzing(false);
    }, 450);
  };

  const loadPreset = (preset: 'low_velocity' | 'high_pressure' | 'optimal') => {
    let sample = '';
    if (preset === 'low_velocity') {
      sample = `Collecteur assainissement gravitaire DN 300 mm
Pente radier I = 0.0015 m/m
Débit pointe eaux usées Q = 18.5 L/s
Vitesse calculée V = 0.38 m/s
Rugosité Manning-Strickler K = 70
Béton de calage fc28 = 25 MPa`;
    } else if (preset === 'high_pressure') {
      sample = `Refoulement AEP station de reprise vers réservoir R2
Débit pompé Q = 85 m3/h
Diamètre conduite PEHD DN 160 mm PN 10
Vitesse d'écoulement V = 3.4 m/s
Pression statique amont P = 7.8 bar
Dénivelée géométrique H = 65 mCE`;
    } else {
      sample = `Réseau distribution AEP maillé EPANET (Commune Meftah)
Conduites PEHD 100 PN 16, formule Hazen-Williams C = 140
Débit horaire de pointe Q = 42 L/s
Vitesses aux nœuds V = 1.15 m/s (plage 0.8 - 1.8 m/s)
Pression résiduelle au sol P = 3.2 bar
Béton réservoir fc28 = 30 MPa dosé à 400 kg/m³ avec adjuvant hydrofuge`;
    }

    setCalcText(sample);
    handleRunAnalysis(sample);
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-500 border-emerald-500 bg-emerald-50';
    if (score >= 70) return 'text-amber-500 border-amber-500 bg-amber-50';
    return 'text-red-500 border-red-500 bg-red-50';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-600 via-brand-700 to-indigo-700 p-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-xl">
              🔍
            </div>
            <div>
              <h3 className="font-bold text-lg flex items-center gap-2">
                AI Agent — Détection d'Erreurs Hydrauliques
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-400 text-brand-950">
                  Algérie Normes
                </span>
              </h3>
              <p className="text-xs text-sky-100">
                Audit automatique de vos calculs hydrauliques (vitesses, pressions, Manning, fc28)
              </p>
            </div>
          </div>
          <button
            onClick={closeAiModal}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* Quick presets */}
          <div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-500" />
              Exemples rapides à tester en 1 clic :
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => loadPreset('low_velocity')}
                className="text-xs font-medium px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 transition-colors"
              >
                ⚠️ Vitesse critique (&lt; 0.5 m/s)
              </button>
              <button
                type="button"
                onClick={() => loadPreset('high_pressure')}
                className="text-xs font-medium px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 transition-colors"
              >
                ⚡ Surpression & Bélier (&gt; 6 bar)
              </button>
              <button
                type="button"
                onClick={() => loadPreset('optimal')}
                className="text-xs font-medium px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors"
              >
                ✅ Réseau conforme EPANET
              </button>
            </div>
          </div>

          {/* Text Area */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Collez vos données techniques ou note de calcul :
            </label>
            <textarea
              value={calcText}
              onChange={e => setCalcText(e.target.value)}
              placeholder="Exemple : V = 0.42 m/s, Q = 35 L/s, PEHD DN 110, P = 2.1 bar, fc28 = 25 MPa, pente I = 0.002..."
              rows={4}
              className="w-full font-mono text-xs p-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Action button */}
          <button
            type="button"
            disabled={analyzing || !calcText.trim()}
            onClick={() => handleRunAnalysis()}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-brand-600 via-indigo-600 to-brand-700 hover:from-brand-500 hover:to-brand-600 text-white font-semibold text-sm shadow-md shadow-brand-500/20 disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
          >
            {analyzing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Audit IA en cours...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Analyser la note de calcul</span>
              </>
            )}
          </button>

          {/* Results section */}
          {result && (
            <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800 animate-fadeIn">
              {/* Score card */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className={`w-16 h-16 rounded-full border-4 flex flex-col items-center justify-center shrink-0 ${getScoreColor(result.score)}`}>
                  <span className="text-xl font-black leading-none">{result.score}</span>
                  <span className="text-[9px] font-semibold opacity-70">/100</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm text-slate-800 dark:text-slate-100">
                      Indice de Fiabilité Hydraulique
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      result.niveau === 'Excellent' || result.niveau === 'Bon'
                        ? 'bg-emerald-100 text-emerald-800'
                        : result.niveau === 'Moyen'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {result.niveau}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {result.resume}
                  </p>
                </div>
              </div>

              {/* Errors list */}
              {result.erreurs.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-red-600 flex items-center gap-1.5 uppercase tracking-wide">
                    <AlertCircle className="w-4 h-4" />
                    Erreurs & Incohérences Détectées ({result.erreurs.length})
                  </h4>
                  {result.erreurs.map((err, i) => (
                    <div key={i} className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border-l-4 border-red-500 text-xs space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-600 text-white">
                          {err.gravite}
                        </span>
                        <span className="font-semibold text-red-900 dark:text-red-200">
                          {err.type}
                        </span>
                      </div>
                      <p className="text-red-800/90 dark:text-red-300 leading-relaxed">
                        {err.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Warnings */}
              {result.avertissements.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-amber-600 flex items-center gap-1.5 uppercase tracking-wide">
                    <AlertTriangle className="w-4 h-4" />
                    Avertissements Techniques ({result.avertissements.length})
                  </h4>
                  {result.avertissements.map((warn, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-500 text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                      {warn}
                    </div>
                  ))}
                </div>
              )}

              {/* Suggestions */}
              {result.suggestions.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-emerald-600 flex items-center gap-1.5 uppercase tracking-wide">
                    <Lightbulb className="w-4 h-4" />
                    Recommandations & Bonnes Pratiques ({result.suggestions.length})
                  </h4>
                  {result.suggestions.map((sug, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border-l-4 border-emerald-500 text-xs text-emerald-900 dark:text-emerald-200 leading-relaxed flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{sug}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center text-xs text-slate-500 shrink-0">
          <span>🏛️ Algorithme calibré selon les règles ONA, ADE & ENSH</span>
          <button
            onClick={closeAiModal}
            className="px-4 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-medium transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
