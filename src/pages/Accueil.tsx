import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search, ArrowRight, Star, ShieldCheck, CheckCircle2,
  Clock, MapPin, Sparkles, Building2, Bot, Calculator, Waves, Droplets, Sprout
} from 'lucide-react';

export const Accueil: React.FC = () => {
  const { experts, projects, innovations, navigateTo, openAiModal, toggleFloatingChat } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const enshExperts = experts.filter(e => e.ensh).slice(0, 4);
  const urgentProjects = projects.filter(p => p.urgent).slice(0, 3);
  const featuredInnovations = innovations.slice(0, 3);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigateTo('experts', { search: searchQuery.trim() });
  };

  const handleTagClick = (tag: string) => {
    navigateTo('experts', { search: tag });
  };

  return (
    <div className="space-y-16 animate-fadeIn">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-900 via-brand-800 to-indigo-950 text-white py-20 px-4 sm:px-6 lg:px-8">
        {/* Abstract hydraulic wave background decoration */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-cyan-400 blur-3xl" />
          <div className="absolute top-1/2 -right-24 w-96 h-96 rounded-full bg-brand-400 blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-cyan-200">
            <span>🏛️ Partenaire ENSH Blida</span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span>🇩🇿 Marketplace Génie Civil & Hydraulique Algérie</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight sm:leading-none">
            La plateforme qui connecte<br />
            <span className="bg-gradient-to-r from-cyan-300 via-cyan-400 to-sky-200 bg-clip-text text-transparent">
              ingénieurs, entreprises & innovateurs
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 leading-relaxed">
            Experts ENSH certifiés • Projets techniques & VRD • Fournisseurs matériaux • Intelligence Artificielle & Innovation
          </p>

          {/* Search Form */}
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-xl mx-auto flex items-center p-2 rounded-2xl bg-white dark:bg-slate-900 text-slate-800 shadow-2xl border border-white/20"
          >
            <div className="pl-3 text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Rechercher un expert, un projet, un matériau ou une solution IA..."
              className="w-full px-3 py-2 text-xs sm:text-sm bg-transparent border-0 focus:outline-none text-slate-800 dark:text-slate-100 placeholder-slate-400"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-cyan-600 hover:from-brand-500 hover:to-cyan-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all shrink-0"
            >
              Rechercher
            </button>
          </form>

          {/* Quick Domain Tags */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <span className="text-xs text-slate-400 mr-1">Populaire :</span>
            {['Hydraulique', 'VRD', 'Irrigation', 'SIG', 'Traitement des eaux', 'Ouvrages hydrauliques'].map(tag => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className="text-xs px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/15 backdrop-blur-sm transition-all"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-800 p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800">
            <div className="pt-2 md:pt-0">
              <div className="text-3xl font-extrabold text-brand-600 dark:text-cyan-400">200+</div>
              <div className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">Experts & Profs</div>
            </div>
            <div className="pt-2 md:pt-0">
              <div className="text-3xl font-extrabold text-cyan-600 dark:text-cyan-400">50+</div>
              <div className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">Projets Actifs</div>
            </div>
            <div className="pt-2 md:pt-0">
              <div className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">6</div>
              <div className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">Bureaux Partenaires</div>
            </div>
            <div className="pt-2 md:pt-0">
              <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">98%</div>
              <div className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">Satisfaction Client</div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE 4 FEATURE WORKSPACE CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1 */}
          <div
            onClick={() => navigateTo('travail')}
            className="group cursor-pointer p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-sky-50 dark:from-slate-800 dark:to-slate-850 border border-blue-200/80 dark:border-slate-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">💼</div>
            <h3 className="font-bold text-base text-brand-900 dark:text-white mb-1.5 flex items-center justify-between">
              <span>Travail & Projets</span>
              <ArrowRight className="w-4 h-4 text-brand-600 group-hover:translate-x-1 transition-transform" />
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Entreprises publiques et privées publient leurs appels d'offres pour ingénieurs freelances.
            </p>
          </div>

          {/* Card 2 */}
          <div
            onClick={() => navigateTo('fournisseurs')}
            className="group cursor-pointer p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-800 dark:to-slate-850 border border-emerald-200/80 dark:border-slate-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🏪</div>
            <h3 className="font-bold text-base text-emerald-950 dark:text-white mb-1.5 flex items-center justify-between">
              <span>Fournisseurs Matériaux</span>
              <ArrowRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-1 transition-transform" />
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Catalogue complet : tuyaux PEHD, vannes, pompes, compteurs avec fiches techniques ISO/EN.
            </p>
          </div>

          {/* Card 3 */}
          <div
            onClick={() => navigateTo('innovation')}
            className="group cursor-pointer p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-fuchsia-50 dark:from-slate-800 dark:to-slate-850 border border-purple-200/80 dark:border-slate-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🚀</div>
            <h3 className="font-bold text-base text-purple-950 dark:text-white mb-1.5 flex items-center justify-between">
              <span>Innovation & IA</span>
              <ArrowRight className="w-4 h-4 text-purple-600 group-hover:translate-x-1 transition-transform" />
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Solutions technologiques et agents IA d'étudiants d'élite prêts pour incubation ou acquisition.
            </p>
          </div>

          {/* Card 4 */}
          <div
            onClick={toggleFloatingChat}
            className="group cursor-pointer p-6 rounded-2xl bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-slate-800 dark:to-slate-850 border border-amber-200/80 dark:border-slate-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🤖</div>
            <h3 className="font-bold text-base text-amber-950 dark:text-white mb-1.5 flex items-center justify-between">
              <span>HydroBot IA</span>
              <Sparkles className="w-4 h-4 text-amber-600 group-hover:scale-125 transition-transform" />
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Assistant conversationnel expert en hydraulique, calculs de débits, pressions et formules FAO.
            </p>
          </div>
        </div>
      </section>

      {/* ENSH TEACHERS SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-amber-50/80 via-yellow-50/50 to-orange-50/30 dark:from-amber-950/20 dark:to-slate-900 border border-amber-300/80 dark:border-amber-900/40 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-bold text-amber-800 dark:text-amber-300 mb-2">
                🏛️ Corps Professoral d'Élite
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Experts & Enseignants ENSH Blida
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                L'École Nationale Supérieure d'Hydraulique — Références académiques et consultance de haut niveau.
              </p>
            </div>
            <button
              onClick={() => navigateTo('experts', { enshOnly: 'true' })}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-all self-start sm:self-auto"
            >
              <span>Voir tous les professeurs</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {enshExperts.map(e => (
              <div
                key={e.id}
                className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-amber-200/80 dark:border-slate-700 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 text-amber-950 font-black flex items-center justify-center text-sm shadow-sm">
                      {e.img}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                        {e.nom}
                      </h4>
                      <div className="text-[10px] text-amber-700 dark:text-amber-400 font-medium truncate">
                        {e.grade}
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-2.5 h-2.5" />
                        {e.wilaya} • {e.projets} projets
                      </div>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 italic mb-3 line-clamp-2">
                    {e.spec}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{e.note}</span>
                    <span className="text-[10px] text-slate-400 font-normal">({e.avis})</span>
                  </div>
                  <div className="font-bold text-xs text-brand-700 dark:text-cyan-400">
                    {e.prix.toLocaleString()} DA/h
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* URGENT PROJECTS & INNOVATIONS 2-COL SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Col 1: Urgent Projects */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                  <span>💼 Appels à Projets Urgents</span>
                  <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold">
                    Urgent
                  </span>
                </h3>
                <p className="text-xs text-slate-500">Missions techniques à pourvoir immédiatement</p>
              </div>
              <button
                onClick={() => navigateTo('travail')}
                className="text-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-cyan-400 flex items-center gap-1"
              >
                <span>Tout voir</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {urgentProjects.map(p => (
                <div
                  key={p.id}
                  onClick={() => navigateTo('travail')}
                  className="cursor-pointer p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-brand-500 hover:shadow-md transition-all space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-xs sm:text-sm text-brand-900 dark:text-white">
                      {p.titre}
                    </h4>
                    <span className="px-2 py-0.5 rounded-md bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-cyan-300 font-bold text-[10px] shrink-0">
                      {p.budget}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                    {p.desc}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      🏢 {p.entreprise} ({p.wilaya})
                    </span>
                    <span className="flex items-center gap-1 text-amber-600 font-medium">
                      <Clock className="w-3 h-3" /> Délai : {p.delai}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Col 2: Innovations */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                  <span>🚀 Innovations & Agents IA</span>
                  <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[10px] font-bold">
                    Universités
                  </span>
                </h3>
                <p className="text-xs text-slate-500">Projets de fin d'études et brevets prêts à l'emploi</p>
              </div>
              <button
                onClick={() => navigateTo('innovation')}
                className="text-xs font-semibold text-purple-600 hover:text-purple-700 dark:text-purple-400 flex items-center gap-1"
              >
                <span>Tout voir</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {featuredInnovations.map(inn => (
                <div
                  key={inn.id}
                  onClick={() => navigateTo('innovation')}
                  className="cursor-pointer p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-purple-500 hover:shadow-md transition-all space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 mb-1">
                        {inn.type}
                      </span>
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                        {inn.titre}
                      </h4>
                    </div>
                    <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] shrink-0 ${
                      inn.statut === 'Cherche incubateur'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {inn.statut}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                    {inn.desc}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span>🎓 {inn.auteur} • {inn.univ}</span>
                    <span className="font-bold text-purple-600">{inn.prix}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CALCULATEURS HYDRAULIQUES PROMINENT PREVIEW SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-cyan-950/20 via-brand-900/10 to-indigo-950/20 dark:from-slate-900 dark:to-slate-850 border border-cyan-500/30 dark:border-cyan-800/40 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-bold text-cyan-800 dark:text-cyan-300 mb-2">
                🧮 Outils & Formules Interactifs
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Calculateurs Hydrauliques & VRD en Libre Accès
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                Prédimensionnez vos ouvrages et vérifiez les vitesses d'auto-curage et pertes de charge selon les normes algériennes.
              </p>
            </div>
            <button
              onClick={() => navigateTo('calculateurs')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-cyan-600 hover:from-brand-500 hover:to-cyan-500 text-white font-bold text-xs shadow-md transition-all self-start sm:self-auto"
            >
              <span>Accéder aux calculateurs</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Tile 1 */}
            <div
              onClick={() => navigateTo('calculateurs')}
              className="cursor-pointer p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-cyan-500 hover:shadow-md transition-all space-y-2 group"
            >
              <div className="w-9 h-9 rounded-xl bg-cyan-100 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 flex items-center justify-center">
                <Waves className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-cyan-600 transition-colors">
                Manning-Strickler
              </h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Écoulements gravitaires, vitesse d'auto-curage (0.5 - 3.0 m/s) et débit des collecteurs.
              </p>
            </div>

            {/* Tile 2 */}
            <div
              onClick={() => navigateTo('calculateurs')}
              className="cursor-pointer p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-cyan-500 hover:shadow-md transition-all space-y-2 group"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 flex items-center justify-center">
                <Droplets className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-cyan-600 transition-colors">
                Hazen-Williams AEP
              </h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Pertes de charge linéaires (mCE/km), vitesses en conduites sous pression et puissance pompe.
              </p>
            </div>

            {/* Tile 3 */}
            <div
              onClick={() => navigateTo('calculateurs')}
              className="cursor-pointer p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-cyan-500 hover:shadow-md transition-all space-y-2 group"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
                <Sprout className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-cyan-600 transition-colors">
                Besoins d'Irrigation (FAO 56)
              </h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Calcul des volumes journaliers et débit de pompage selon les wilayas et coefficients Kc.
              </p>
            </div>

            {/* Tile 4 */}
            <div
              onClick={() => navigateTo('calculateurs')}
              className="cursor-pointer p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-cyan-500 hover:shadow-md transition-all space-y-2 group"
            >
              <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-cyan-600 transition-colors">
                Déversoirs de Crue
              </h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Largeur déversante minimale Creager/Poleni et revanche de sécurité pour barrages collinaires.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AI BANNER CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-brand-800 via-indigo-900 to-purple-900 text-white p-8 sm:p-12 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="relative z-10 space-y-3 max-w-xl text-center md:text-left">
            <span className="px-3 py-1 rounded-full bg-cyan-400 text-brand-950 font-bold text-xs uppercase tracking-wider">
              Nouveau sur IngénieurHub
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Détecteur d'Erreurs Hydrauliques par IA
            </h3>
            <p className="text-sm text-slate-200 leading-relaxed">
              Auditez vos notes de calcul en quelques secondes : conformité des vitesses d'auto-curage, coup de bélier, coefficients de Manning et prescriptions de béton fc28.
            </p>
          </div>
          <div className="relative z-10 shrink-0 flex flex-col sm:flex-row gap-3">
            <button
              onClick={openAiModal}
              className="px-6 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-brand-950 font-bold text-sm shadow-xl transition-all transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Tester le Détecteur d'Erreurs</span>
            </button>
            <button
              onClick={() => navigateTo('etudes')}
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition-all flex items-center justify-center gap-2"
            >
              <span>Déposer une étude</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
