import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Formation } from '../types';
import {
  GraduationCap, Clock, Award, CheckCircle2,
  BookOpen, Sparkles, X, UserCheck
} from 'lucide-react';

export const Formations: React.FC = () => {
  const { formations, enrollFormation, currentUser, addToast } = useApp();

  const [activeCategory, setActiveCategory] = useState('Tous');
  const [enrollingCourse, setEnrollingCourse] = useState<Formation | null>(null);
  const [nom, setNom] = useState(currentUser?.nom || '');
  const [email, setEmail] = useState(currentUser?.email || '');

  const categories = [
    "Tous", "AEP", "Hydraulique", "VRD", "Irrigation", "SIG",
    "Traitement des eaux", "Ouvrages hydrauliques"
  ];

  const filteredFormations = formations.filter(f => {
    return activeCategory === 'Tous' || f.domaine === activeCategory;
  });

  const handleEnrollSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enrollingCourse) return;

    enrollFormation(enrollingCourse.id, nom, email);
    setEnrollingCourse(null);
  };

  const getLevelBadge = (niveau: string) => {
    if (niveau === 'Débutant') return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200';
    if (niveau === 'Intermédiaire') return 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-blue-200';
    return 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border-purple-200';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fadeIn">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-1">
            <span>🎓 Montée en Compétences Techniques</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Formations Spécialisées & Logiciels Métiers
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Maîtrisez les logiciels de pointe (EPANET, HEC-RAS, Civil 3D, ArcGIS Pro, SEEP/W) avec attestations de réussite.
          </p>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              activeCategory === cat
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* COURSES GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {filteredFormations.map(f => (
          <div
            key={f.id}
            className="rounded-2xl p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 hover:shadow-xl transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              {/* Domain & Level Badges */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-cyan-300 border border-brand-200 dark:border-brand-800">
                  {f.domaine}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getLevelBadge(f.niveau)}`}>
                  {f.niveau}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white leading-snug mb-3 min-h-[40px]">
                {f.titre}
              </h3>

              {/* Specs */}
              <div className="space-y-2 text-xs text-slate-500 mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Durée : <strong className="text-slate-700 dark:text-slate-200">{f.duree}</strong> d'ateliers pratiques</span>
                </div>
                {f.cert && (
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold">
                    <Award className="w-3.5 h-3.5" />
                    <span>Attestation de formation incluse</span>
                  </div>
                )}
              </div>
            </div>

            {/* Price and Enroll Button */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-slate-400">Tarif session :</div>
                <div className="font-black text-brand-900 dark:text-cyan-400 text-sm">
                  {f.prix.toLocaleString()} DA
                </div>
              </div>

              <button
                onClick={() => {
                  setEnrollingCourse(f);
                  setNom(currentUser?.nom || '');
                  setEmail(currentUser?.email || '');
                }}
                className="py-1.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md shadow-brand-500/20 transition-all transform hover:scale-102"
              >
                S'inscrire
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ENROLLMENT MODAL */}
      {enrollingCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md p-6 space-y-5 animate-scaleUp">
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                  {enrollingCourse.domaine} • {enrollingCourse.duree}
                </span>
                <h3 className="font-bold text-base text-slate-900 dark:text-white mt-1">
                  Inscription : {enrollingCourse.titre}
                </h3>
                <div className="text-xs text-brand-600 font-extrabold mt-0.5">
                  Frais d'inscription : {enrollingCourse.prix.toLocaleString()} DA
                </div>
              </div>
              <button
                onClick={() => setEnrollingCourse(null)}
                className="w-7 h-7 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEnrollSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nom et Prénom du stagiaire : *
                </label>
                <input
                  type="text"
                  required
                  value={nom}
                  onChange={e => setNom(e.target.value)}
                  placeholder="Ex : Rania Meziane"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Adresse email de réception des accès : *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="student@ingenieurhub.dz"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Validation instantanée de votre place. Les supports et liens de visioconférence vous parviendront par email.</span>
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setEnrollingCourse(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold shadow-md shadow-brand-500/20"
                >
                  Confirmer mon inscription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
