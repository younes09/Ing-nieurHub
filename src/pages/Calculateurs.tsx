import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Calculator, Waves, Droplets, Sprout, ShieldAlert,
  Copy, Check, Sparkles, ArrowRight, RefreshCw, Info, ChevronRight
} from 'lucide-react';

export const Calculateurs: React.FC = () => {
  const { openAiModal, addToast } = useApp();

  const [activeTab, setActiveTab] = useState<'manning' | 'hazen' | 'irrigation' | 'deversoir'>('manning');
  const [copied, setCopied] = useState(false);

  // ══════════════════════════════════════════════════════════════
  // 1. MANNING-STRICKLER STATE (Écoulement gravitaire)
  // ══════════════════════════════════════════════════════════════
  const [mDiametre, setMDiametre] = useState<number>(315); // mm
  const [mPente, setMPente] = useState<number>(0.003); // m/m (0.3%)
  const [mRugositeK, setMRugositeK] = useState<number>(90); // PEHD/PVC
  const [mRemplissage, setMRemplissage] = useState<number>(0.7); // 70%

  // Manning Circular Calculations
  const D_m = mDiametre / 1000; // m
  const theta = 2 * Math.acos(Math.max(-1, Math.min(1, 1 - 2 * mRemplissage))); // angle radians
  const Sm = (Math.pow(D_m, 2) / 8) * (theta - Math.sin(theta)); // section mouillée m²
  const Pm = (theta * D_m) / 2; // périmètre mouillé m
  const Rh = Pm > 0 ? Sm / Pm : D_m / 4; // rayon hydraulique m
  const V_manning = mRugositeK * Math.pow(Rh, 2 / 3) * Math.pow(mPente, 1 / 2); // m/s
  const Q_manning_m3s = V_manning * Sm; // m³/s
  const Q_manning_ls = Q_manning_m3s * 1000; // L/s

  // ══════════════════════════════════════════════════════════════
  // 2. HAZEN-WILLIAMS STATE (Conduite sous pression AEP)
  // ══════════════════════════════════════════════════════════════
  const [hDebitLs, setHDebitLs] = useState<number>(25); // L/s
  const [hDiametreIntMm, setHDiametreIntMm] = useState<number>(147.6); // DN 160 PEHD
  const [hLongueurM, setHLongueurM] = useState<number>(1200); // m
  const [hCoeffC, setHCoeffC] = useState<number>(140); // PEHD neuf

  // Hazen-Williams Calculations
  const Q_m3s = hDebitLs / 1000;
  const d_m = hDiametreIntMm / 1000;
  const section_hw = (Math.PI * Math.pow(d_m, 2)) / 4;
  const V_hazen = section_hw > 0 ? Q_m3s / section_hw : 0; // m/s
  // J = 10.67 * Q^1.852 / (C^1.852 * D^4.87)
  const J_hazen = (10.67 * Math.pow(Q_m3s, 1.852)) / (Math.pow(hCoeffC, 1.852) * Math.pow(d_m, 4.87)); // mCE/m
  const deltaH = J_hazen * hLongueurM; // mCE
  const J_km = J_hazen * 1000; // mCE/km
  const puissance_pompe_kw = (9.81 * Q_m3s * deltaH) / 0.75; // kW avec rendement 75%

  // ══════════════════════════════════════════════════════════════
  // 3. FAO 56 IRRIGATION STATE
  // ══════════════════════════════════════════════════════════════
  const [irriWilaya, setIrriWilaya] = useState<string>('Blida (Mitidja)');
  const [irriCulture, setIrriCulture] = useState<string>('Agrumes (Orangers)');
  const [irriKc, setIrriKc] = useState<number>(0.75);
  const [irriEt0, setIrriEt0] = useState<number>(5.5); // mm/j en été
  const [irriSurfaceHa, setIrriSurfaceHa] = useState<number>(10); // ha
  const [irriEfficience, setIrriEfficience] = useState<number>(0.9); // Goutte-à-goutte 90%
  const [irriHeuresPompage, setIrriHeuresPompage] = useState<number>(12); // h/j

  // Irrigation Calculations
  const ETm_mm_j = irriEt0 * irriKc; // mm/j
  const volume_brut_ha_j = (ETm_mm_j * 10) / irriEfficience; // m³/ha/jour
  const volume_total_parcelle_j = volume_brut_ha_j * irriSurfaceHa; // m³/jour
  const debit_pompe_m3h = irriHeuresPompage > 0 ? volume_total_parcelle_j / irriHeuresPompage : 0; // m³/h
  const debit_pompe_ls = debit_pompe_m3h / 3.6; // L/s

  // ══════════════════════════════════════════════════════════════
  // 4. DÉVERSOIR DE CRUE BARRAGE (Poleni / Creager)
  // ══════════════════════════════════════════════════════════════
  const [devDebitQ, setDevDebitQ] = useState<number>(45); // m³/s crue centennale
  const [devChargeH, setDevChargeH] = useState<number>(1.8); // m
  const [devCoeffCd, setDevCoeffCd] = useState<number>(0.49); // Profil Creager

  // Spillway Calculations
  // Q = Cd * L * sqrt(2g) * H^(3/2) => L = Q / (Cd * sqrt(2g) * H^(3/2))
  const sqrt2g = Math.sqrt(2 * 9.81);
  const h_pow_15 = Math.pow(devChargeH, 1.5);
  const L_deversoir = (devCoeffCd * sqrt2g * h_pow_15) > 0 ? devDebitQ / (devCoeffCd * sqrt2g * h_pow_15) : 0; // m
  const V_creme = Math.sqrt(2 * 9.81 * (devChargeH / 3)); // m/s approx
  const revancheConseillee = 0.5 + 0.05 * Math.pow(devDebitQ, 1 / 3); // m recommandation barrage

  // Presets loader
  const loadPreset = (type: 'manning_seaal' | 'hazen_ade' | 'irri_mitidja' | 'barrage_tizi') => {
    if (type === 'manning_seaal') {
      setActiveTab('manning');
      setMDiametre(400);
      setMPente(0.004);
      setMRugositeK(75);
      setMRemplissage(0.65);
      addToast('Exemple chargé', 'Collecteur assainissement gravitaire DN 400 chargé.', 'info');
    } else if (type === 'hazen_ade') {
      setActiveTab('hazen');
      setHDebitLs(35);
      setHDiametreIntMm(184.6); // DN 200 PEHD PN 10
      setHLongueurM(2500);
      setHCoeffC(140);
      addToast('Exemple chargé', 'Adduction principale ADE PEHD DN 200 chargée.', 'info');
    } else if (type === 'irri_mitidja') {
      setActiveTab('irrigation');
      setIrriWilaya('Blida (Mitidja)');
      setIrriCulture('Agrumes (Orangers)');
      setIrriKc(0.8);
      setIrriEt0(5.8);
      setIrriSurfaceHa(15);
      setIrriEfficience(0.9);
      setIrriHeuresPompage(10);
      addToast('Exemple chargé', 'Périmètre arboricole Mitidja 15 ha chargé.', 'info');
    } else {
      setActiveTab('deversoir');
      setDevDebitQ(65);
      setDevChargeH(2.2);
      setDevCoeffCd(0.49);
      addToast('Exemple chargé', 'Évacuateur de crue centennale Q=65 m³/s chargé.', 'info');
    }
  };

  const copyCalculationSummary = (calcType: string) => {
    let summary = '';
    if (calcType === 'manning') {
      summary = `NOTE DE CALCUL HYDRAULIQUE — MANNING-STRICKLER
==================================================
Diamètre intérieur D : ${mDiametre} mm
Pente radier I : ${(mPente * 100).toFixed(2)} % (${mPente} m/m)
Coefficient Strickler K : ${mRugositeK}
Taux de remplissage h/D : ${(mRemplissage * 100).toFixed(0)} %
--------------------------------------------------
Section mouillée Sm : ${Sm.toFixed(4)} m²
Périmètre mouillé Pm : ${Pm.toFixed(3)} m
Rayon hydraulique Rh : ${Rh.toFixed(4)} m
Vitesse d'écoulement V : ${V_manning.toFixed(2)} m/s (${V_manning >= 0.5 && V_manning <= 3.0 ? 'Conforme auto-curage' : 'ATTENTION NON CONFORME'})
Débit transitant Q : ${Q_manning_ls.toFixed(1)} L/s (${Q_manning_m3s.toFixed(3)} m³/s)
Règle de l'art : Normes ONA / Fascicule 70 Algérie.`;
    } else if (calcType === 'hazen') {
      summary = `NOTE DE CALCUL CONDUITE SOUS PRESSION — HAZEN-WILLIAMS
======================================================
Débit de projet Q : ${hDebitLs} L/s (${(hDebitLs * 3.6).toFixed(1)} m³/h)
Diamètre intérieur d : ${hDiametreIntMm} mm
Longueur de conduite L : ${hLongueurM} m
Coefficient Hazen-Williams C : ${hCoeffC}
------------------------------------------------------
Vitesse d'écoulement V : ${V_hazen.toFixed(2)} m/s (${V_hazen >= 0.8 && V_hazen <= 2.0 ? 'Plage recommandée ADE' : 'Hors plage usuelle'})
Perte de charge unitaire J : ${J_km.toFixed(2)} mCE/km (${J_hazen.toFixed(5)} m/m)
Perte de charge totale ΔH : ${deltaH.toFixed(2)} mCE
Puissance hydraulique estimée : ${puissance_pompe_kw.toFixed(1)} kW (η = 75%)
Règle de l'art : Normes de distribution ADE Algérie.`;
    } else if (calcType === 'irrigation') {
      summary = `BILAN BESOINS EN EAU D'IRRIGATION — MÉTHODE FAO 56
==================================================
Wilaya : ${irriWilaya}
Culture : ${irriCulture} (Kc = ${irriKc})
Évapotranspiration de référence ET0 : ${irriEt0} mm/jour
Superficie parcelle S : ${irriSurfaceHa} ha
Mode d'irrigation : Efficience ${irriEfficience * 100}%
Durée de pompage journalière : ${irriHeuresPompage} h/jour
--------------------------------------------------
Besoins en eau de la culture ETm : ${ETm_mm_j.toFixed(2)} mm/jour
Dose brute journalière : ${volume_brut_ha_j.toFixed(1)} m³/ha/jour
Volume total journalier parcelle : ${volume_total_parcelle_j.toFixed(0)} m³/jour
Débit de pompage requis : ${debit_pompe_m3h.toFixed(1)} m³/h (${debit_pompe_ls.toFixed(1)} L/s)
Consommation mensuelle estimée : ${(volume_total_parcelle_j * 30).toLocaleString()} m³/mois
Règle de l'art : Directives ONID / FAO 56.`;
    } else {
      summary = `DIMENSIONNEMENT ÉVACUATEUR DE CRUE — FORMULE POLENI / CREAGER
============================================================
Débit de crue Q : ${devDebitQ} m³/s
Charge admissible sur seuil H : ${devChargeH} m
Coefficient de débit Cd : ${devCoeffCd} (Profil Creager)
------------------------------------------------------------
Largeur déversante minimale L : ${L_deversoir.toFixed(2)} m
Vitesse théorique sur crête Vc : ${V_creme.toFixed(2)} m/s
Revanche minimale préconisée : ${revancheConseillee.toFixed(2)} m
Règle de l'art : Recommandations ANBT pour barrages collinaires en Algérie.`;
    }

    navigator.clipboard.writeText(summary);
    setCopied(true);
    addToast('Note copiée !', 'La note de calcul a été copiée dans votre presse-papiers.', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fadeIn">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 text-cyan-800 text-xs font-bold mb-1">
            <span>🧮 Outils & Formules Hydrauliques Interactifs</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Calculateurs Métiers Génie Civil & Hydraulique
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Prédimensionnement instantané, vérification d'auto-curage et bilans de pompage certifiés selon les normes algériennes.
          </p>
        </div>

        <button
          onClick={openAiModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md transition-all self-start md:self-auto"
        >
          <Sparkles className="w-4 h-4 text-cyan-300 animate-pulse" />
          <span>Auditer avec l'AI Agent</span>
        </button>
      </div>

      {/* QUICK PRESETS SCROLLER */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-400 font-semibold whitespace-nowrap">Cas réels en Algérie :</span>
        <button
          onClick={() => loadPreset('manning_seaal')}
          className="whitespace-nowrap px-3 py-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 font-medium text-slate-700 dark:text-slate-200 transition-colors"
        >
          🌊 Collecteur SEAAL Alger DN 400
        </button>
        <button
          onClick={() => loadPreset('hazen_ade')}
          className="whitespace-nowrap px-3 py-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 font-medium text-slate-700 dark:text-slate-200 transition-colors"
        >
          💧 Adduction ADE Meftah DN 200
        </button>
        <button
          onClick={() => loadPreset('irri_mitidja')}
          className="whitespace-nowrap px-3 py-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 font-medium text-slate-700 dark:text-slate-200 transition-colors"
        >
          🌱 Périmètre ONID Mitidja 15 ha
        </button>
        <button
          onClick={() => loadPreset('barrage_tizi')}
          className="whitespace-nowrap px-3 py-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 font-medium text-slate-700 dark:text-slate-200 transition-colors"
        >
          🛡️ Seuil Barrage ANBT Tizi-Ouzou Q=65 m³/s
        </button>
      </div>

      {/* NAVIGATION TABS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1.5 rounded-2xl bg-slate-200/80 dark:bg-slate-800 text-xs font-bold">
        <button
          onClick={() => setActiveTab('manning')}
          className={`py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeTab === 'manning'
              ? 'bg-white dark:bg-slate-900 text-brand-900 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Waves className="w-4 h-4 text-cyan-600" />
          <span>Manning-Strickler</span>
        </button>
        <button
          onClick={() => setActiveTab('hazen')}
          className={`py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeTab === 'hazen'
              ? 'bg-white dark:bg-slate-900 text-brand-900 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Droplets className="w-4 h-4 text-brand-600" />
          <span>Hazen-Williams AEP</span>
        </button>
        <button
          onClick={() => setActiveTab('irrigation')}
          className={`py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeTab === 'irrigation'
              ? 'bg-white dark:bg-slate-900 text-brand-900 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Sprout className="w-4 h-4 text-emerald-600" />
          <span>Besoins Irrigation (FAO)</span>
        </button>
        <button
          onClick={() => setActiveTab('deversoir')}
          className={`py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeTab === 'deversoir'
              ? 'bg-white dark:bg-slate-900 text-brand-900 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-amber-600" />
          <span>Déversoir de Crue</span>
        </button>
      </div>

      {/* ───────────────────────────────────────────────────────────
          1. MANNING-STRICKLER SECTION
          ─────────────────────────────────────────────────────────── */}
      {activeTab === 'manning' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Inputs (7 cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <Waves className="w-4 h-4 text-cyan-500" />
                  <span>Écoulement Gravitaire & Canalisations Circulaires</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Formule : V = K · Rh^(2/3) · I^(1/2) et Q = V · S</p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              {/* Diameter */}
              <div>
                <div className="flex justify-between font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  <span>Diamètre intérieur (D) :</span>
                  <span className="font-mono text-cyan-600 font-bold">{mDiametre} mm ({D_m} m)</span>
                </div>
                <input
                  type="range"
                  min="110"
                  max="1600"
                  step="10"
                  value={mDiametre}
                  onChange={e => setMDiametre(Number(e.target.value))}
                  className="w-full accent-cyan-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                  <span>110 mm (branchement)</span>
                  <span>400 mm (collecteur)</span>
                  <span>1600 mm (émissaire)</span>
                </div>
              </div>

              {/* Slope */}
              <div>
                <div className="flex justify-between font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  <span>Pente longitudinale du radier (I) :</span>
                  <span className="font-mono text-cyan-600 font-bold">{(mPente * 100).toFixed(2)} % ({mPente} m/m)</span>
                </div>
                <input
                  type="range"
                  min="0.001"
                  max="0.04"
                  step="0.0005"
                  value={mPente}
                  onChange={e => setMPente(Number(e.target.value))}
                  className="w-full accent-cyan-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                  <span>0.10 % (faible pente)</span>
                  <span>1.00 %</span>
                  <span>4.00 % (forte déclivité)</span>
                </div>
              </div>

              {/* Rugosity Strickler */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Coefficient de Strickler (K) :
                  </label>
                  <select
                    value={mRugositeK}
                    onChange={e => setMRugositeK(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-medium focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  >
                    <option value={95}>K = 95 (PEHD / PVC neuf)</option>
                    <option value={90}>K = 90 (PEHD / PVC usuel)</option>
                    <option value={75}>K = 75 (Béton lisse préfabriqué)</option>
                    <option value={65}>K = 65 (Béton ordinaire / Maçonnerie)</option>
                    <option value={45}>K = 45 (Canal en terre bien entretenu)</option>
                    <option value={30}>K = 30 (Lit d'oued naturel)</option>
                  </select>
                </div>

                <div>
                  <div className="flex justify-between font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    <span>Taux de remplissage (h/D) :</span>
                    <span className="font-mono text-cyan-600 font-bold">{(mRemplissage * 100).toFixed(0)} %</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={mRemplissage}
                    onChange={e => setMRemplissage(Number(e.target.value))}
                    className="w-full accent-cyan-600 cursor-pointer mt-2"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Outputs (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <span className="font-bold text-sm text-slate-900 dark:text-white">Résultats Hydrauliques</span>
                <span className="text-[10px] text-slate-400 font-mono">Formule Fascicule 70</span>
              </div>

              {/* Main metrics */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-cyan-50/70 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-800 text-center">
                  <div className="text-[10px] font-bold text-cyan-800 dark:text-cyan-300 uppercase tracking-wider">Vitesse (V)</div>
                  <div className="text-2xl sm:text-3xl font-black text-cyan-900 dark:text-cyan-200 mt-1">
                    {V_manning.toFixed(2)} <span className="text-xs font-normal">m/s</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-brand-50/70 dark:bg-brand-950/30 border border-brand-200 dark:border-brand-800 text-center">
                  <div className="text-[10px] font-bold text-brand-800 dark:text-cyan-300 uppercase tracking-wider">Débit liquide (Q)</div>
                  <div className="text-2xl sm:text-3xl font-black text-brand-900 dark:text-cyan-200 mt-1">
                    {Q_manning_ls.toFixed(1)} <span className="text-xs font-normal">L/s</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5 font-mono">({Q_manning_m3s.toFixed(3)} m³/s)</div>
                </div>
              </div>

              {/* Velocity Diagnostic Gauge */}
              <div className="space-y-1.5 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-200">Condition d'Auto-Curage :</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    V_manning < 0.5
                      ? 'bg-red-100 text-red-800'
                      : V_manning > 3.0
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {V_manning < 0.5 ? '⚠️ Vitesse trop faible (< 0.5 m/s)' : V_manning > 3.0 ? '⚡ Vitesse excessive (> 3 m/s)' : '✅ Conforme (0.5 - 3.0 m/s)'}
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      V_manning < 0.5 ? 'bg-red-500 w-1/4' : V_manning > 3.0 ? 'bg-amber-500 w-full' : 'bg-emerald-500 w-2/3'
                    }`}
                  />
                </div>
                <div className="text-[10px] text-slate-500">
                  {V_manning < 0.5
                    ? "Risque d'envasement et de dépôts solides par manque de vitesse d'entraînement."
                    : V_manning > 3.0
                    ? "Risque d'abrasion accélérée de la paroi et d'ondes de surpression violentes."
                    : "Vitesse optimale garantissant le transport solide sans érosion prématurée."}
                </div>
              </div>

              {/* Geometric properties */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs p-3 rounded-2xl bg-slate-50 dark:bg-slate-800">
                <div>
                  <div className="text-slate-400 text-[10px]">Section (S)</div>
                  <div className="font-bold text-slate-800 dark:text-slate-200 font-mono mt-0.5">{Sm.toFixed(4)} m²</div>
                </div>
                <div>
                  <div className="text-slate-400 text-[10px]">Périmètre (P)</div>
                  <div className="font-bold text-slate-800 dark:text-slate-200 font-mono mt-0.5">{Pm.toFixed(3)} m</div>
                </div>
                <div>
                  <div className="text-slate-400 text-[10px]">Rayon (Rh)</div>
                  <div className="font-bold text-slate-800 dark:text-slate-200 font-mono mt-0.5">{Rh.toFixed(4)} m</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => copyCalculationSummary('manning')}
                  className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copié !' : 'Copier la note'}</span>
                </button>
                <button
                  onClick={openAiModal}
                  className="flex-1 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md shadow-brand-500/20 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                  <span>Vérifier par IA</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────
          2. HAZEN-WILLIAMS SECTION
          ─────────────────────────────────────────────────────────── */}
      {activeTab === 'hazen' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Droplets className="w-4 h-4 text-brand-600" />
                <span>Réseaux d'Adduction & Distribution AEP (Hazen-Williams)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Calcul des pertes de charge linéaires et de la vitesse selon les règles de l'ADE.</p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    <span>Débit pompé ou distribué (Q) :</span>
                    <span className="font-mono text-brand-600 font-bold">{hDebitLs} L/s ({(hDebitLs * 3.6).toFixed(1)} m³/h)</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="200"
                    step="1"
                    value={hDebitLs}
                    onChange={e => setHDebitLs(Number(e.target.value))}
                    className="w-full accent-brand-600 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Matériau de conduite (C) :
                  </label>
                  <select
                    value={hCoeffC}
                    onChange={e => setHCoeffC(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  >
                    <option value={140}>PEHD 100 (C = 140)</option>
                    <option value={130}>Fonte ductile avec revêtement (C = 130)</option>
                    <option value={120}>Acier soudé (C = 120)</option>
                    <option value={110}>Béton précontraint (C = 110)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Diamètre intérieur utile (mm) :
                  </label>
                  <input
                    type="number"
                    min="20"
                    max="1200"
                    step="0.1"
                    value={hDiametreIntMm}
                    onChange={e => setHDiametreIntMm(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-mono font-bold focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                  <div className="text-[10px] text-slate-400 mt-1">Ex : DN 160 PEHD PN 10 = ~147.6 mm int.</div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Longueur de la conduite (m) :
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="50000"
                    step="10"
                    value={hLongueurM}
                    onChange={e => setHLongueurM(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-mono font-bold focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                  <div className="text-[10px] text-slate-400 mt-1">Distance linéaire du tronçon</div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <span className="font-bold text-sm text-slate-900 dark:text-white">Bilan des Pertes de Charge</span>
                <span className="text-[10px] text-slate-400 font-mono">Norme ADE</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-brand-50/70 dark:bg-brand-950/30 border border-brand-200 dark:border-brand-800 text-center">
                  <div className="text-[10px] font-bold text-brand-800 dark:text-cyan-300 uppercase tracking-wider">Perte Totale (ΔH)</div>
                  <div className="text-2xl sm:text-3xl font-black text-brand-900 dark:text-cyan-200 mt-1">
                    {deltaH.toFixed(2)} <span className="text-xs font-normal">mCE</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">({(deltaH / 10).toFixed(2)} bar)</div>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 text-center">
                  <div className="text-[10px] font-bold text-indigo-800 dark:text-indigo-300 uppercase tracking-wider">Vitesse Conduite (V)</div>
                  <div className="text-2xl sm:text-3xl font-black text-indigo-900 dark:text-indigo-200 mt-1">
                    {V_hazen.toFixed(2)} <span className="text-xs font-normal">m/s</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">({J_km.toFixed(1)} mCE/km)</div>
                </div>
              </div>

              {/* Velocity check banner */}
              <div className={`p-3 rounded-2xl text-xs flex items-center justify-between ${
                V_hazen >= 0.8 && V_hazen <= 2.0
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border border-amber-200'
              }`}>
                <span className="font-semibold">Plage normative ADE (0.8 - 2.0 m/s) :</span>
                <span className="font-bold">{V_hazen >= 0.8 && V_hazen <= 2.0 ? '✅ Optimale' : '⚠️ Hors plage'}</span>
              </div>

              {/* Power estimate */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                <div>
                  <div className="text-slate-400 text-[10px]">Puissance de pompage requise :</div>
                  <div className="font-black text-slate-800 dark:text-slate-100 text-base mt-0.5">
                    {puissance_pompe_kw.toFixed(1)} kW ({(puissance_pompe_kw * 1.36).toFixed(1)} CV)
                  </div>
                </div>
                <span className="text-[10px] text-slate-400">Rendement pompe ~ 75%</span>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => copyCalculationSummary('hazen')}
                  className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copier la note</span>
                </button>
                <button
                  onClick={openAiModal}
                  className="flex-1 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md shadow-brand-500/20 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                  <span>Vérifier par IA</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────
          3. FAO 56 IRRIGATION SECTION
          ─────────────────────────────────────────────────────────── */}
      {activeTab === 'irrigation' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Sprout className="w-4 h-4 text-emerald-600" />
                <span>Besoins en Eau des Cultures & Dimensionnement (FAO 56 / ONID)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Formule : ETm = ET0 · Kc et Débit = (ETm · S) / (Ea · T)</p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Bassin agricole / Wilaya :
                  </label>
                  <select
                    value={irriWilaya}
                    onChange={e => {
                      setIrriWilaya(e.target.value);
                      if (e.target.value.includes('Mitidja')) setIrriEt0(5.5);
                      else if (e.target.value.includes('Chélif')) setIrriEt0(6.8);
                      else if (e.target.value.includes('Constantine')) setIrriEt0(6.0);
                      else if (e.target.value.includes('Biskra')) setIrriEt0(8.2);
                    }}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="Blida (Mitidja)">Blida (Mitidja) — ET0 estival ~ 5.5 mm/j</option>
                    <option value="Aïn Defla (Chélif)">Aïn Defla (Chélif) — ET0 estival ~ 6.8 mm/j</option>
                    <option value="Constantine (Hauts Plateaux)">Constantine (Hauts Plateaux) — ET0 ~ 6.0 mm/j</option>
                    <option value="Biskra (Sud Saharien)">Biskra (Sud Saharien) — ET0 ~ 8.2 mm/j</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Culture :
                  </label>
                  <select
                    value={irriCulture}
                    onChange={e => {
                      setIrriCulture(e.target.value);
                      if (e.target.value.includes('Agrumes')) setIrriKc(0.75);
                      else if (e.target.value.includes('Olivier')) setIrriKc(0.65);
                      else if (e.target.value.includes('Blé')) setIrriKc(1.15);
                      else if (e.target.value.includes('Tomate')) setIrriKc(1.05);
                      else if (e.target.value.includes('Palmier')) setIrriKc(0.9);
                    }}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="Agrumes (Orangers)">Agrumes (Orangers) — Kc = 0.75</option>
                    <option value="Olivier">Olivier — Kc = 0.65</option>
                    <option value="Blé dur (Montaison)">Blé dur (Montaison) — Kc = 1.15</option>
                    <option value="Tomate / Maraîchage">Tomate / Maraîchage — Kc = 1.05</option>
                    <option value="Palmier dattier">Palmier dattier — Kc = 0.90</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Surface irriguée (ha) :
                  </label>
                  <input
                    type="number"
                    min="0.5"
                    max="500"
                    step="0.5"
                    value={irriSurfaceHa}
                    onChange={e => setIrriSurfaceHa(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-mono font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Système d'irrigation :
                  </label>
                  <select
                    value={irriEfficience}
                    onChange={e => setIrriEfficience(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value={0.9}>Goutte-à-goutte (Ea = 90%)</option>
                    <option value={0.75}>Aspersion (Ea = 75%)</option>
                    <option value={0.6}>Gravitaire (Ea = 60%)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Durée pompage (h/j) :
                  </label>
                  <input
                    type="number"
                    min="4"
                    max="24"
                    step="1"
                    value={irriHeuresPompage}
                    onChange={e => setIrriHeuresPompage(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-mono font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <span className="font-bold text-sm text-slate-900 dark:text-white">Besoins Hydrauliques Parcelle</span>
                <span className="text-[10px] text-slate-400 font-mono">Norme ONID / FAO</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-center">
                  <div className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">Débit Pompe Requis</div>
                  <div className="text-2xl sm:text-3xl font-black text-emerald-900 dark:text-emerald-200 mt-1">
                    {debit_pompe_m3h.toFixed(1)} <span className="text-xs font-normal">m³/h</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">({debit_pompe_ls.toFixed(1)} L/s)</div>
                </div>

                <div className="p-4 rounded-2xl bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 text-center">
                  <div className="text-[10px] font-bold text-teal-800 dark:text-teal-300 uppercase tracking-wider">Volume Journalier</div>
                  <div className="text-2xl sm:text-3xl font-black text-teal-900 dark:text-teal-200 mt-1">
                    {volume_total_parcelle_j.toFixed(0)} <span className="text-xs font-normal">m³/j</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">({volume_brut_ha_j.toFixed(1)} m³/ha/j)</div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Besoin net de la plante (ETm) :</span>
                  <span className="font-bold text-slate-800 dark:text-slate-100">{ETm_mm_j.toFixed(2)} mm/jour</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Consommation mensuelle estimée :</span>
                  <span className="font-bold text-emerald-600">{(volume_total_parcelle_j * 30).toLocaleString()} m³/mois</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => copyCalculationSummary('irrigation')}
                  className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copier la note</span>
                </button>
                <button
                  onClick={openAiModal}
                  className="flex-1 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md shadow-brand-500/20 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                  <span>Vérifier par IA</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────
          4. DÉVERSOIR DE CRUE SECTION
          ─────────────────────────────────────────────────────────── */}
      {activeTab === 'deversoir' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                <span>Évacuateur de Crue Barrage Collinaire (Poleni / Creager)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Calcul de la largeur déversante requise pour évacuer la crue centennale ou millénale en sécurité.</p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  <span>Débit de crue de projet (Q) :</span>
                  <span className="font-mono text-amber-600 font-bold">{devDebitQ} m³/s</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="250"
                  step="5"
                  value={devDebitQ}
                  onChange={e => setDevDebitQ(Number(e.target.value))}
                  className="w-full accent-amber-600 cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Hauteur de lame d'eau maximale (H) :
                  </label>
                  <input
                    type="number"
                    min="0.5"
                    max="6.0"
                    step="0.1"
                    value={devChargeH}
                    onChange={e => setDevChargeH(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-mono font-bold focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                  <div className="text-[10px] text-slate-400 mt-1">Charge sur le seuil déversant (m)</div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Profil du seuil déversant (Cd) :
                  </label>
                  <select
                    value={devCoeffCd}
                    onChange={e => setDevCoeffCd(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    <option value={0.49}>Profil Creager optimisé (Cd = 0.49)</option>
                    <option value={0.385}>Seuil à crête épaisse (Cd = 0.385)</option>
                    <option value={0.42}>Seuil déversoir profilé standard (Cd = 0.42)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <span className="font-bold text-sm text-slate-900 dark:text-white">Dimensionnement du Seuil</span>
                <span className="text-[10px] text-slate-400 font-mono">Norme ANBT</span>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-center">
                <div className="text-[10px] font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">Largeur Déversante Minimale (L)</div>
                <div className="text-3xl sm:text-4xl font-black text-amber-950 dark:text-amber-200 mt-1">
                  {L_deversoir.toFixed(2)} <span className="text-base font-normal">mètres</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Revanche de sécurité minimale :</span>
                  <span className="font-bold text-slate-800 dark:text-slate-100">≥ {revancheConseillee.toFixed(2)} m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Vitesse moyenne sur crête :</span>
                  <span className="font-bold text-amber-700 dark:text-amber-400">{V_creme.toFixed(2)} m/s</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => copyCalculationSummary('deversoir')}
                  className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copier la note</span>
                </button>
                <button
                  onClick={openAiModal}
                  className="flex-1 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md shadow-brand-500/20 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                  <span>Vérifier par IA</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
