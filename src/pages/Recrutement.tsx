import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { JobOffer } from '../types';
import {
  Briefcase, MapPin, Building, Clock, Send,
  CheckCircle2, X, Filter, UserCheck
} from 'lucide-react';

export const Recrutement: React.FC = () => {
  const { jobs, applyToJob, currentUser } = useApp();

  const [selectedType, setSelectedType] = useState('Tous');
  const [selectedWilaya, setSelectedWilaya] = useState('Toutes');

  // Application modal
  const [activeJob, setActiveJob] = useState<JobOffer | null>(null);
  const [nom, setNom] = useState(currentUser?.nom || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [tel, setTel] = useState('');
  const [msg, setMsg] = useState('');

  const types = ["Tous", "CDI", "CDD", "Stage"];
  const wilayas = ["Toutes", "Alger", "Blida", "Oran", "Tizi-Ouzou", "Constantine"];

  const filteredJobs = jobs.filter(j => {
    const typeMatch = selectedType === 'Tous' || j.type === selectedType;
    const wilayaMatch = selectedWilaya === 'Toutes' || j.wilaya === selectedWilaya;
    return typeMatch && wilayaMatch;
  });

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeJob) return;

    applyToJob(activeJob.id, nom, email, tel, msg);
    setActiveJob(null);
    setTel('');
    setMsg('');
  };

  const getTypeBadge = (type: string) => {
    if (type === 'CDI') return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200';
    if (type === 'CDD') return 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-blue-200';
    return 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border-purple-200';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fadeIn">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mb-1">
            <span>📋 Carrières & Stages en Génie Civil</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Recrutement & Opportunités Professionnelles
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Rejoignez les plus grands groupes du BTPH (COSIDER, ADE, SEAAL, bureaux d'études d'ingénierie).
          </p>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {types.map(t => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedType === t
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-semibold">Wilaya :</span>
          <select
            value={selectedWilaya}
            onChange={e => setSelectedWilaya(e.target.value)}
            className="font-medium py-1.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            {wilayas.map(w => (
              <option key={w} value={w}>{w === 'Toutes' ? 'Toutes les wilayas' : w}</option>
            ))}
          </select>
        </div>
      </div>

      {/* JOBS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredJobs.map(job => (
          <div
            key={job.id}
            className="rounded-2xl p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getTypeBadge(job.type)}`}>
                  {job.type}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {job.domaine}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white leading-snug">
                  {job.titre}
                </h3>
                <div className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    🏢 {job.entreprise}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {job.wilaya}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                {job.desc}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4 flex items-center justify-end">
              <button
                onClick={() => {
                  setActiveJob(job);
                  setNom(currentUser?.nom || '');
                  setEmail(currentUser?.email || '');
                }}
                className="py-1.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5"
              >
                <span>Postuler</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* APPLICATION MODAL */}
      {activeJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg p-6 sm:p-8 space-y-5 animate-scaleUp">
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {activeJob.type}
                </span>
                <h3 className="font-bold text-base text-slate-900 dark:text-white mt-1">
                  Postuler à l'offre : {activeJob.titre}
                </h3>
                <div className="text-xs text-slate-500">
                  {activeJob.entreprise} ({activeJob.wilaya})
                </div>
              </div>
              <button
                onClick={() => setActiveJob(null)}
                className="w-7 h-7 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleApplySubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nom et Prénom : *
                </label>
                <input
                  type="text"
                  required
                  value={nom}
                  onChange={e => setNom(e.target.value)}
                  placeholder="Ex : Karim Boudiaf"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Email de contact : *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="contact@exemple.dz"
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Numéro de téléphone : *
                  </label>
                  <input
                    type="tel"
                    required
                    value={tel}
                    onChange={e => setTel(e.target.value)}
                    placeholder="05 50 00 00 00"
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Message de motivation / Résumé de compétences : *
                </label>
                <textarea
                  required
                  rows={4}
                  value={msg}
                  onChange={e => setMsg(e.target.value)}
                  placeholder="Précisez votre formation (diplôme ENSH, USTHB...), vos projets réalisés et votre disponibilité..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setActiveJob(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold shadow-md shadow-brand-500/20"
                >
                  Transmettre ma candidature
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
