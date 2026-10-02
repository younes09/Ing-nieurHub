import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Project } from '../types';
import {
  Briefcase, PlusCircle, Clock, MapPin, Building,
  AlertCircle, Send, CheckCircle2, X, Filter, Sparkles
} from 'lucide-react';

export const Travail: React.FC = () => {
  const { projects, addProject, applyToProject, currentUser } = useApp();

  const [activeTab, setActiveTab] = useState<'browse' | 'publish'>('browse');

  // Filters
  const [selectedDomain, setSelectedDomain] = useState('Tous');
  const [urgentOnly, setUrgentOnly] = useState(false);

  // Application Modal state
  const [applyingProject, setApplyingProject] = useState<Project | null>(null);
  const [candNom, setCandNom] = useState(currentUser?.nom || '');
  const [candEmail, setCandEmail] = useState(currentUser?.email || '');
  const [candExp, setCandExp] = useState('');
  const [candLettre, setCandLettre] = useState('');

  // Publish Form state
  const [pubTitre, setPubTitre] = useState('');
  const [pubEntreprise, setPubEntreprise] = useState(currentUser?.type === 'Bureau' ? currentUser.nom : '');
  const [pubSecteur, setPubSecteur] = useState<'Étatique' | 'Privé' | 'International'>('Étatique');
  const [pubWilaya, setPubWilaya] = useState('Alger');
  const [pubBudget, setPubBudget] = useState('');
  const [pubDelai, setPubDelai] = useState('30 jours');
  const [pubDomaine, setPubDomaine] = useState('AEP');
  const [pubUrgent, setPubUrgent] = useState(false);
  const [pubDesc, setPubDesc] = useState('');

  const domaines = [
    "Tous", "AEP", "Assainissement", "Hydraulique", "Irrigation",
    "SIG", "Traitement des eaux", "VRD", "Ouvrages hydrauliques"
  ];

  const wilayas = [
    "Alger", "Blida", "Boumerdès", "Tipaza", "Oran", "Constantine",
    "Annaba", "Tizi-Ouzou", "Sétif", "Batna", "Béjaïa"
  ];

  const filteredProjects = projects.filter(p => {
    const domainMatch = selectedDomain === 'Tous' || p.domaine === selectedDomain;
    const urgentMatch = !urgentOnly || p.urgent;
    return domainMatch && urgentMatch;
  });

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyingProject) return;

    applyToProject(
      applyingProject.id,
      candNom,
      candEmail,
      candExp,
      candLettre
    );

    setApplyingProject(null);
    setCandExp('');
    setCandLettre('');
  };

  const handlePublishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pubTitre.trim() || !pubEntreprise.trim() || !pubBudget.trim() || !pubDesc.trim()) {
      return;
    }

    addProject({
      titre: pubTitre,
      entreprise: pubEntreprise,
      secteur: pubSecteur,
      wilaya: pubWilaya,
      budget: pubBudget.includes('DA') ? pubBudget : `${pubBudget} DA`,
      delai: pubDelai,
      domaine: pubDomaine,
      urgent: pubUrgent,
      desc: pubDesc
    });

    // Reset form
    setPubTitre('');
    setPubBudget('');
    setPubDesc('');
    setActiveTab('browse');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fadeIn">
      {/* HEADER & TAB TOGGLE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold mb-1">
            <span>💼 Bourse de l'Ingénierie & VRD</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Travail & Appels à Projets
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Projets techniques de bureaux d'études, entreprises publiques et maîtres d'ouvrages en Algérie.
          </p>
        </div>

        {/* Tab switch buttons */}
        <div className="flex items-center p-1 rounded-xl bg-slate-200/80 dark:bg-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('browse')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'browse'
                ? 'bg-white dark:bg-slate-900 text-brand-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Missions disponibles ({projects.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('publish')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'publish'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Publier un appel d'offres</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: BROWSE MISSIONS */}
      {activeTab === 'browse' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 mr-1">
                <Filter className="w-3.5 h-3.5" /> Domaine :
              </span>
              <select
                value={selectedDomain}
                onChange={e => setSelectedDomain(e.target.value)}
                className="text-xs font-medium py-1.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {domaines.map(d => (
                  <option key={d} value={d}>{d === 'Tous' ? 'Tous les domaines' : d}</option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => setUrgentOnly(prev => !prev)}
                className={`text-xs font-bold py-1.5 px-3 rounded-xl border transition-all flex items-center gap-1.5 ${
                  urgentOnly
                    ? 'bg-red-600 text-white border-red-600 shadow-sm'
                    : 'bg-red-50 hover:bg-red-100 text-red-700 border-red-200'
                }`}
              >
                <span>⚡ Missions urgentes</span>
                {urgentOnly && <CheckCircle2 className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="text-xs font-semibold text-slate-500">
              <span className="font-bold text-brand-600 dark:text-cyan-400">{filteredProjects.length}</span> offre(s) affichée(s)
            </div>
          </div>

          {/* Projects Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredProjects.map(p => (
              <div
                key={p.id}
                className={`rounded-2xl p-6 border transition-all duration-200 flex flex-col justify-between hover:shadow-lg bg-white dark:bg-slate-850 ${
                  p.urgent
                    ? 'border-red-200 dark:border-red-900/60 shadow-sm shadow-red-500/5'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="space-y-3">
                  {/* Top Badges */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-cyan-300 border border-brand-200 dark:border-brand-800">
                        {p.domaine}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        p.secteur === 'Étatique'
                          ? 'bg-blue-50 text-blue-700'
                          : p.secteur === 'Privé'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-purple-50 text-purple-700'
                      }`}>
                        {p.secteur}
                      </span>
                      {p.urgent && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700 animate-pulse">
                          ⚡ Urgent
                        </span>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-black text-brand-900 dark:text-cyan-400 text-sm">
                        {p.budget}
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center justify-end gap-1">
                        <Clock className="w-2.5 h-2.5" /> {p.delai}
                      </div>
                    </div>
                  </div>

                  {/* Title & Organization */}
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white leading-snug">
                      {p.titre}
                    </h3>
                    <div className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        🏢 {p.entreprise}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {p.wilaya}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                    {p.desc}
                  </p>
                </div>

                {/* Footer and apply button */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-500">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-cyan-100 text-cyan-800 font-bold text-[11px]">
                      {p.candidats}
                    </span>
                    <span>candidat(s) positionné(s)</span>
                  </div>

                  <button
                    onClick={() => {
                      setApplyingProject(p);
                      setCandNom(currentUser?.nom || '');
                      setCandEmail(currentUser?.email || '');
                    }}
                    className="py-2 px-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold shadow-md shadow-brand-500/20 transition-all transform hover:scale-102 flex items-center gap-1.5"
                  >
                    <span>Postuler</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 2: PUBLISH NEW PROJECT */}
      {activeTab === 'publish' && (
        <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Publier un appel d'offres / Problématique technique
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Les ingénieurs freelances et professeurs ENSH recevront une notification pour vous soumettre leurs propositions techniques et honoraires.
            </p>
          </div>

          <form onSubmit={handlePublishSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Intitulé de la mission : *
              </label>
              <input
                type="text"
                required
                value={pubTitre}
                onChange={e => setPubTitre(e.target.value)}
                placeholder="Ex : Dimensionnement réseau AEP commune de Meftah (EPANET)..."
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Entreprise / Organisme donneur d'ordre : *
                </label>
                <input
                  type="text"
                  required
                  value={pubEntreprise}
                  onChange={e => setPubEntreprise(e.target.value)}
                  placeholder="Ex : SEAAL, ADE, COSIDER, Bureau d'études..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Secteur d'activité :
                </label>
                <select
                  value={pubSecteur}
                  onChange={e => setPubSecteur(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                >
                  <option value="Étatique">Étatique (ADE, SEAAL, ANBT...)</option>
                  <option value="Privé">Privé (Entreprise de réalisation, BET)</option>
                  <option value="International">International (Bailleurs de fonds)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Wilaya :
                </label>
                <select
                  value={pubWilaya}
                  onChange={e => setPubWilaya(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                >
                  {wilayas.map(w => (
                    <option key={w} value={w}>{w}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Budget estimatif : *
                </label>
                <input
                  type="text"
                  required
                  value={pubBudget}
                  onChange={e => setPubBudget(e.target.value)}
                  placeholder="Ex : 450 000 DA"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Délai d'exécution :
                </label>
                <input
                  type="text"
                  required
                  value={pubDelai}
                  onChange={e => setPubDelai(e.target.value)}
                  placeholder="Ex : 30 jours"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Domaine technique :
                </label>
                <select
                  value={pubDomaine}
                  onChange={e => setPubDomaine(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                >
                  {domaines.filter(d => d !== 'Tous').map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center pt-5">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={pubUrgent}
                    onChange={e => setPubUrgent(e.target.checked)}
                    className="w-4 h-4 text-brand-600 rounded"
                  />
                  <span>Marquer comme mission urgente (badge ⚡)</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Cahier des charges & spécifications requises : *
              </label>
              <textarea
                required
                rows={5}
                value={pubDesc}
                onChange={e => setPubDesc(e.target.value)}
                placeholder="Détaillez le travail : logiciels attendus (EPANET, HEC-RAS, Civil 3D), livrables (notes de calcul, plans DWG, rapports), données fournies (MNT, données de consommation)..."
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('browse')}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold shadow-md shadow-brand-500/20"
              >
                Diffuser l'appel d'offres
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: CANDIDATURE TO PROJECT */}
      {applyingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg p-6 sm:p-8 space-y-5 animate-scaleUp">
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-50 text-brand-700">
                  {applyingProject.domaine}
                </span>
                <h3 className="font-bold text-base text-slate-900 dark:text-white mt-1">
                  Postuler à : {applyingProject.titre}
                </h3>
                <div className="text-xs text-slate-500 mt-0.5">
                  🏢 {applyingProject.entreprise} • Budget : {applyingProject.budget} • Délai : {applyingProject.delai}
                </div>
              </div>
              <button
                onClick={() => setApplyingProject(null)}
                className="w-7 h-7 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleApplySubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Votre nom complet / Bureau d'études :
                </label>
                <input
                  type="text"
                  required
                  value={candNom}
                  onChange={e => setCandNom(e.target.value)}
                  placeholder="Ex : Karim Boudiaf (Ingénieur Hydraulicien)"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Votre email de contact :
                </label>
                <input
                  type="email"
                  required
                  value={candEmail}
                  onChange={e => setCandEmail(e.target.value)}
                  placeholder="contact@exemple.dz"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Expérience & Références similaires :
                </label>
                <input
                  type="text"
                  required
                  value={candExp}
                  onChange={e => setCandExp(e.target.value)}
                  placeholder="Ex : 8 ans d'expérience, 12 études AEP similaires réalisées avec l'ADE..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Proposition technique & Note méthodologique :
                </label>
                <textarea
                  required
                  rows={4}
                  value={candLettre}
                  onChange={e => setCandLettre(e.target.value)}
                  placeholder="Détaillez votre approche (modélisation Hazen-Williams, maillage EPANET, respect des contraintes horaires...)"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setApplyingProject(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold shadow-md shadow-brand-500/20"
                >
                  Valider ma candidature
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
