import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Expert } from '../types';
import {
  Star, MapPin, CheckCircle2, ShieldCheck, Mail,
  Search, Sparkles, X, Phone, Award, Briefcase, ExternalLink
} from 'lucide-react';

export const Experts: React.FC = () => {
  const { experts, pageParams, openAiModal, addToast } = useApp();

  const wilayas = ["Toutes", "Alger", "Blida", "Oran", "Constantine", "Tizi-Ouzou", "Boumerdès", "Annaba"];
  const domaines = [
    "Tous", "Hydraulique", "AEP", "VRD", "GC", "Topographie",
    "Assainissement", "Irrigation", "SIG", "Ouvrages hydrauliques", "Traitement des eaux"
  ];

  // Filters state
  const [selectedDomain, setSelectedDomain] = useState('Tous');
  const [selectedWilaya, setSelectedWilaya] = useState('Toutes');
  const [enshOnly, setEnshOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [activeContactExpert, setActiveContactExpert] = useState<Expert | null>(null);
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [activeProfileExpert, setActiveProfileExpert] = useState<Expert | null>(null);

  // Sync from pageParams if came from search on Accueil
  useEffect(() => {
    if (pageParams.search) {
      setSearchQuery(pageParams.search);
      // Check if matches domain directly
      const foundDom = domaines.find(d => d.toLowerCase() === pageParams.search.toLowerCase());
      if (foundDom) setSelectedDomain(foundDom);
    }
    if (pageParams.enshOnly === 'true') {
      setEnshOnly(true);
    }
  }, [pageParams]);

  // Filter experts
  const filteredExperts = experts.filter(e => {
    const domainList = e.domaines.split(',').map(s => s.trim().toLowerCase());
    const domainMatch = selectedDomain === 'Tous' ||
      domainList.includes(selectedDomain.toLowerCase()) ||
      e.spec.toLowerCase().includes(selectedDomain.toLowerCase());

    const wilayaMatch = selectedWilaya === 'Toutes' || e.wilaya === selectedWilaya;
    const enshMatch = !enshOnly || e.ensh;
    
    const searchMatch = !searchQuery.trim() ||
      e.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.spec.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.grade.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.wilaya.toLowerCase().includes(searchQuery.toLowerCase());

    return domainMatch && wilayaMatch && enshMatch && searchMatch;
  });

  const handleSendContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeContactExpert) return;
    addToast(
      'Message transmis !',
      `Votre demande de contact a été envoyée à ${activeContactExpert.nom}. Une copie a été envoyée à son email (${activeContactExpert.email}).`,
      'success'
    );
    setActiveContactExpert(null);
    setContactSubject('');
    setContactMessage('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fadeIn">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold mb-1">
            <span>👷 Réseau National d'Ingénierie</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Experts & Enseignants Chercheurs
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            <span className="font-bold text-brand-600 dark:text-cyan-400">{filteredExperts.length}</span> expert(s) disponible(s) pour consultation et validation technique.
          </p>
        </div>

        <button
          onClick={openAiModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md transition-all self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4 text-cyan-300 animate-pulse" />
          <span>🔍 AI Agent vérification</span>
        </button>
      </div>

      {/* FILTER CONTROLS BAR */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center gap-3">
        {/* Search input */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Rechercher par nom, spécialité..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        {/* Domaine select */}
        <select
          value={selectedDomain}
          onChange={e => setSelectedDomain(e.target.value)}
          className="text-xs font-medium py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          {domaines.map(d => (
            <option key={d} value={d}>{d === 'Tous' ? 'Tous les domaines' : d}</option>
          ))}
        </select>

        {/* Wilaya select */}
        <select
          value={selectedWilaya}
          onChange={e => setSelectedWilaya(e.target.value)}
          className="text-xs font-medium py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          {wilayas.map(w => (
            <option key={w} value={w}>{w === 'Toutes' ? 'Toutes les wilayas' : w}</option>
          ))}
        </select>

        {/* ENSH Only Toggle */}
        <button
          type="button"
          onClick={() => setEnshOnly(prev => !prev)}
          className={`text-xs font-bold py-2 px-3.5 rounded-xl border transition-all flex items-center gap-1.5 ${
            enshOnly
              ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
              : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-300'
          }`}
        >
          <span>🏛️ ENSH uniquement</span>
          {enshOnly && <CheckCircle2 className="w-3.5 h-3.5" />}
        </button>

        {/* Reset button */}
        {(selectedDomain !== 'Tous' || selectedWilaya !== 'Toutes' || enshOnly || searchQuery) && (
          <button
            onClick={() => {
              setSelectedDomain('Tous');
              setSelectedWilaya('Toutes');
              setEnshOnly(false);
              setSearchQuery('');
            }}
            className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 underline px-2 py-1"
          >
            Réinitialiser
          </button>
        )}
      </div>

      {/* EXPERTS GRID */}
      {filteredExperts.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-3">
          <div className="text-4xl">🔍</div>
          <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">Aucun expert ne correspond à ces critères</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Essayez d'élargir votre recherche en sélectionnant "Tous les domaines" ou en désactivant le filtre ENSH.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredExperts.map(e => (
            <div
              key={e.id}
              className={`rounded-2xl p-5 border transition-all duration-200 flex flex-col justify-between hover:shadow-lg relative overflow-hidden ${
                e.ensh
                  ? 'bg-gradient-to-b from-amber-50/50 to-white dark:from-amber-950/20 dark:to-slate-850 border-amber-300/80 dark:border-amber-800/60 shadow-sm'
                  : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-800'
              }`}
            >
              {/* ENSH Ribbon */}
              {e.ensh && (
                <div className="absolute top-0 right-0 px-2.5 py-0.5 rounded-bl-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-amber-950 font-black text-[9px] uppercase tracking-wider shadow-xs">
                  🏛️ ENSH Blida
                </div>
              )}

              <div>
                {/* Avatar and status */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="relative shrink-0">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-sm shadow-sm ${
                      e.ensh
                        ? 'bg-gradient-to-tr from-amber-400 to-yellow-300 text-amber-950 border border-amber-300'
                        : 'bg-gradient-to-tr from-brand-600 to-cyan-500 text-white'
                    }`}>
                      {e.img}
                    </div>
                    {e.online && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-800 rounded-full" title="En ligne maintenant" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                      {e.nom}
                    </h3>
                    <div className="text-[11px] text-brand-700 dark:text-cyan-300 font-semibold truncate">
                      {e.grade}
                    </div>
                    <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-2.5 h-2.5" />
                      <span>{e.wilaya}</span>
                      <span>•</span>
                      <span>{e.projets} projets</span>
                    </div>
                  </div>
                </div>

                {/* Speciality */}
                <p className="text-xs text-slate-600 dark:text-slate-300 italic mb-3 min-h-[32px] line-clamp-2">
                  {e.spec}
                </p>

                {/* Badges */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {e.certifie && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-cyan-300 border border-brand-200 dark:border-brand-800">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      Certifié
                    </span>
                  )}
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    e.dispo
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  }`}>
                    {e.dispo ? 'Disponible' : 'Occupé'}
                  </span>
                </div>
              </div>

              {/* Price & Rating */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{e.note}</span>
                    <span className="text-[10px] text-slate-400 font-normal">({e.avis})</span>
                  </div>
                  <div className="font-extrabold text-brand-900 dark:text-cyan-400 text-sm">
                    {e.prix.toLocaleString()} DA<span className="text-[10px] font-normal text-slate-400">/h</span>
                  </div>
                </div>

                {/* Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setActiveContactExpert(e)}
                    className="py-1.5 px-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs shadow-sm transition-colors text-center"
                  >
                    Contacter
                  </button>
                  <button
                    onClick={() => setActiveProfileExpert(e)}
                    className="py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-colors text-center"
                  >
                    Profil
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL 1: CONTACT EXPERT */}
      {activeContactExpert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg p-6 space-y-5 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-800 font-bold flex items-center justify-center text-sm">
                  {activeContactExpert.img}
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    Contacter {activeContactExpert.nom}
                  </h3>
                  <p className="text-xs text-slate-500">{activeContactExpert.grade}</p>
                </div>
              </div>
              <button
                onClick={() => setActiveContactExpert(null)}
                className="w-7 h-7 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSendContact} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Objet de la demande :
                </label>
                <input
                  type="text"
                  required
                  value={contactSubject}
                  onChange={e => setContactSubject(e.target.value)}
                  placeholder="Ex : Audit hydraulique réseau AEP, vérification note de calcul..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Description de votre mission ou problématique technique :
                </label>
                <textarea
                  required
                  rows={4}
                  value={contactMessage}
                  onChange={e => setContactMessage(e.target.value)}
                  placeholder="Précisez les logiciels utilisés (EPANET, HEC-RAS...), les délais souhaités et les pièces graphiques disponibles..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div className="p-3 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 text-[11px] text-sky-800 dark:text-sky-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Mise en relation directe certifiée avec protection de vos données d'ingénierie.</span>
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setActiveContactExpert(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold shadow-md shadow-brand-500/20"
                >
                  Envoyer ma demande
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: FULL EXPERT PROFILE */}
      {activeProfileExpert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto animate-scaleUp">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-black text-xl shadow-md ${
                  activeProfileExpert.ensh
                    ? 'bg-gradient-to-tr from-amber-400 to-yellow-300 text-amber-950'
                    : 'bg-gradient-to-tr from-brand-600 to-cyan-500 text-white'
                }`}>
                  {activeProfileExpert.img}
                </div>
                <div>
                  <h3 className="font-extrabold text-xl text-slate-900 dark:text-white">
                    {activeProfileExpert.nom}
                  </h3>
                  <div className="text-xs font-semibold text-brand-700 dark:text-cyan-400">
                    {activeProfileExpert.grade}
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                    <MapPin className="w-3 h-3" />
                    <span>Wilaya de {activeProfileExpert.wilaya}</span>
                    <span>•</span>
                    <span>{activeProfileExpert.projets} missions réalisées</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setActiveProfileExpert(null)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Specialties & Domains */}
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Spécialités Principales
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200">
                {activeProfileExpert.spec}
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {activeProfileExpert.domaines.split(',').map((d, i) => (
                  <span key={i} className="text-xs font-bold px-2.5 py-1 rounded-lg bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-cyan-300 border border-brand-200 dark:border-brand-800">
                    {d.trim()}
                  </span>
                ))}
              </div>
            </div>

            {/* Academic or Experience Bio */}
            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Parcours & Expérience
              </div>
              <p>
                {activeProfileExpert.ensh ? (
                  <>
                    Enseignant-chercheur à l'<strong>École Nationale Supérieure d'Hydraulique (ENSH Blida)</strong>. Spécialiste reconnu pour l'animation de travaux de recherche appliquée et la consultance auprès d'organismes étatiques (ANRH, ADE, ANBT, SEAAL).
                  </>
                ) : (
                  <>
                    Ingénieur consultant en exercice libéral et bureau d'études. Intervient sur des projets d'adduction, de voirie et de dimensionnement d'infrastructures hydrauliques majeures en Algérie.
                  </>
                )}
              </p>
            </div>

            {/* Honoraires & Evaluation */}
            <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs">
              <div>
                <div className="text-slate-400 text-[11px]">Tarif consultance :</div>
                <div className="font-extrabold text-base text-brand-900 dark:text-cyan-400 mt-0.5">
                  {activeProfileExpert.prix.toLocaleString()} DA <span className="text-[11px] font-normal text-slate-400">/ heure</span>
                </div>
              </div>
              <div>
                <div className="text-slate-400 text-[11px]">Évaluation clients :</div>
                <div className="flex items-center gap-1 text-amber-500 font-extrabold text-base mt-0.5">
                  <Star className="w-4 h-4 fill-current" />
                  <span>{activeProfileExpert.note} / 5.0</span>
                  <span className="text-slate-400 text-[11px] font-normal">({activeProfileExpert.avis} avis)</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end pt-2">
              <button
                onClick={() => setActiveProfileExpert(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs"
              >
                Fermer
              </button>
              <button
                onClick={() => {
                  const target = activeProfileExpert;
                  setActiveProfileExpert(null);
                  setActiveContactExpert(target);
                }}
                className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md shadow-brand-500/20"
              >
                Demander un devis
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
