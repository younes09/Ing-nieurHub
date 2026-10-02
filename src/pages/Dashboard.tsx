import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserType, Expert } from '../types';
import {
  Briefcase, GraduationCap, Award, ShieldCheck, Users,
  CheckCircle2, Clock, MapPin, Star, AlertCircle,
  PlusCircle, Edit3, X, Eye, FileText, ToggleLeft, ToggleRight
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const {
    currentUser,
    projects,
    candidatures,
    studies,
    experts,
    users,
    innovations,
    inscriptions,
    formations,
    jobCandidatures,
    jobs,
    toggleExpertOnline,
    toggleExpertDispo,
    toggleExpertCertifie,
    updateExpertProfile,
    switchUserRole,
    navigateTo,
    resetDatabase,
    addToast
  } = useApp();

  const [activeCandidatesProject, setActiveCandidatesProject] = useState<number | null>(null);
  const [editExpertModal, setEditExpertModal] = useState(false);
  const [editTarif, setEditTarif] = useState('');
  const [editSpec, setEditSpec] = useState('');

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-4 shadow-xl">
        <div className="text-4xl">🔒</div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Accès Réservé</h2>
        <p className="text-xs text-slate-500">
          Veuillez vous connecter à votre compte pour accéder à votre tableau de bord.
        </p>
        <button
          onClick={() => navigateTo('connexion')}
          className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md transition-all"
        >
          Se connecter / Créer un compte
        </button>
      </div>
    );
  }

  // Current expert profile if user is expert
  const expertProfile = experts.find(e => e.email.toLowerCase() === currentUser.email.toLowerCase()) || experts[0];

  // Client filtered data
  const clientProjects = projects.filter(p => p.user_id === currentUser.id || p.user_id === 1);
  const clientStudies = studies.filter(s => s.user_id === currentUser.id || s.user_id === 1);
  const totalClientCandidates = candidatures.filter(c => clientProjects.some(p => p.id === c.problematique_id)).length;

  // Expert filtered data
  const expertApplications = candidatures.filter(c => c.email.toLowerCase() === currentUser.email.toLowerCase() || c.nom.toLowerCase().includes(currentUser.nom.toLowerCase()));
  const recommendedProjects = projects.filter(p => {
    if (!expertProfile.domaines) return true;
    const doms = expertProfile.domaines.toLowerCase().split(',');
    return doms.some(d => p.domaine.toLowerCase().includes(d.trim()));
  }).slice(0, 4);

  // Student filtered data
  const studentInscriptions = inscriptions.filter(i => i.email.toLowerCase() === currentUser.email.toLowerCase() || i.nom.toLowerCase().includes(currentUser.nom.toLowerCase()));
  const studentJobs = jobCandidatures.filter(j => j.email.toLowerCase() === currentUser.email.toLowerCase() || j.nom.toLowerCase().includes(currentUser.nom.toLowerCase()));
  const studentInnovations = innovations.filter(inn => inn.email.toLowerCase() === currentUser.email.toLowerCase() || inn.auteur.toLowerCase().includes(currentUser.nom.toLowerCase()));

  const roles: UserType[] = ['Client', 'Expert', 'Bureau', 'Étudiant', 'Admin'];

  const handleUpdateProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editTarif) {
      updateExpertProfile(expertProfile.id, {
        prix: parseInt(editTarif),
        spec: editSpec || expertProfile.spec
      });
    }
    setEditExpertModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fadeIn">
      {/* TOP USER PROFILE HEADER */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-cyan-500 text-white font-black text-2xl flex items-center justify-center shadow-md">
            {currentUser.nom.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 dark:text-white">
                {currentUser.nom}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-100 text-brand-800 dark:bg-brand-950 dark:text-cyan-300 border border-brand-200 dark:border-brand-800">
                Rôle : {currentUser.type}
              </span>
            </div>
            <div className="text-xs text-slate-500 mt-1 flex items-center gap-3">
              <span>{currentUser.email}</span>
              <span>•</span>
              <span className="text-emerald-600 font-medium">Session active</span>
            </div>
          </div>
        </div>

        {/* Quick Role Tester Pills */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 self-start md:self-auto">
          <span className="text-xs font-semibold text-slate-400">Tester rôle :</span>
          <div className="flex flex-wrap gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
            {roles.map(r => (
              <button
                key={r}
                onClick={() => switchUserRole(r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  currentUser.type === r
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────
          1. CLIENT VIEW
          ─────────────────────────────────────────────────────────── */}
      {currentUser.type === 'Client' && (
        <div className="space-y-8">
          {/* Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Projets publiés</div>
                <div className="text-3xl font-extrabold text-brand-600 dark:text-cyan-400 mt-1">{clientProjects.length}</div>
              </div>
              <div className="text-3xl">💼</div>
            </div>
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Candidatures reçues</div>
                <div className="text-3xl font-extrabold text-emerald-600 mt-1">{totalClientCandidates}</div>
              </div>
              <div className="text-3xl">👷</div>
            </div>
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Études en cours</div>
                <div className="text-3xl font-extrabold text-indigo-600 mt-1">{clientStudies.length}</div>
              </div>
              <div className="text-3xl">📐</div>
            </div>
          </div>

          {/* Client Projects List */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Mes Appels à Projets & Candidatures reçues</span>
              </h2>
              <button
                onClick={() => navigateTo('travail')}
                className="text-xs font-bold text-brand-600 hover:text-brand-500 flex items-center gap-1"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Nouveau projet</span>
              </button>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {clientProjects.map(p => {
                const projectCands = candidatures.filter(c => c.problematique_id === p.id);
                return (
                  <div key={p.id} className="py-4 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-50 text-brand-700">
                            {p.domaine}
                          </span>
                          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                            {p.titre}
                          </h3>
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          Budget : <strong className="text-slate-700 dark:text-slate-300">{p.budget}</strong> • Délai : {p.delai} • Wilaya : {p.wilaya}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-500">
                          {projectCands.length} candidat(s)
                        </span>
                        {projectCands.length > 0 && (
                          <button
                            onClick={() => setActiveCandidatesProject(activeCandidatesProject === p.id ? null : p.id)}
                            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-xs"
                          >
                            {activeCandidatesProject === p.id ? 'Masquer candidats' : 'Voir candidatures'}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Candidate submissions viewer */}
                    {activeCandidatesProject === p.id && (
                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 space-y-3 animate-fadeIn">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          Candidatures pour "{p.titre}" :
                        </h4>
                        {projectCands.map(cand => (
                          <div key={cand.id} className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 space-y-1.5 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-brand-900 dark:text-cyan-300">{cand.nom}</span>
                              <span className="text-[10px] text-slate-400">{cand.created_at}</span>
                            </div>
                            <div className="text-slate-500 font-medium">Expérience : {cand.exp}</div>
                            <p className="text-slate-700 dark:text-slate-300 italic bg-slate-50 dark:bg-slate-900 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                              "{cand.lettre}"
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────
          2. EXPERT / CONSULTANT VIEW
          ─────────────────────────────────────────────────────────── */}
      {(currentUser.type === 'Expert' || currentUser.type === 'Bureau') && (
        <div className="space-y-8">
          {/* Availability and Status Toggles */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-brand-900 to-indigo-950 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xl">👷</span>
                <h3 className="font-bold text-lg">Profil Expert : {expertProfile.nom}</h3>
              </div>
              <p className="text-xs text-cyan-200">
                {expertProfile.spec} • Tarif : {expertProfile.prix.toLocaleString()} DA/h • Note : {expertProfile.note}/5.0 ({expertProfile.avis} avis)
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Online toggle */}
              <button
                onClick={() => toggleExpertOnline(expertProfile.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                  expertProfile.online
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'bg-white/10 text-slate-300 hover:bg-white/20'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${expertProfile.online ? 'bg-white animate-pulse' : 'bg-slate-400'}`} />
                <span>{expertProfile.online ? 'En ligne' : 'Hors ligne'}</span>
              </button>

              {/* Dispo toggle */}
              <button
                onClick={() => toggleExpertDispo(expertProfile.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  expertProfile.dispo
                    ? 'bg-cyan-500 text-brand-950 font-black'
                    : 'bg-amber-600 text-white'
                }`}
              >
                {expertProfile.dispo ? '✓ Disponible pour missions' : 'Occupé'}
              </button>

              {/* Edit profile */}
              <button
                onClick={() => {
                  setEditTarif(expertProfile.prix.toString());
                  setEditSpec(expertProfile.spec);
                  setEditExpertModal(true);
                }}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Modifier</span>
              </button>
            </div>
          </div>

          {/* AI Recommended Projects */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>🤖 Opportunités recommandées selon vos spécialités ({expertProfile.domaines})</span>
              </h2>
              <button
                onClick={() => navigateTo('travail')}
                className="text-xs font-semibold text-brand-600 hover:text-brand-500"
              >
                Voir tous les projets
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendedProjects.map(p => (
                <div key={p.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-50 text-brand-700">
                        {p.domaine}
                      </span>
                      <span className="font-extrabold text-xs text-brand-900 dark:text-cyan-400">{p.budget}</span>
                    </div>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">{p.titre}</h4>
                    <p className="text-xs text-slate-500 line-clamp-2">{p.desc}</p>
                  </div>
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-700 mt-3 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">Délai : {p.delai}</span>
                    <button
                      onClick={() => navigateTo('travail')}
                      className="py-1 px-3 rounded-lg bg-brand-600 text-white font-semibold text-xs"
                    >
                      Postuler
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Expert My Applications */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Mes Propositions & Candidatures Soumises ({expertApplications.length})
            </h2>
            {expertApplications.length === 0 ? (
              <p className="text-xs text-slate-500">Vous n'avez pas encore postulé à des appels d'offres.</p>
            ) : (
              <div className="space-y-3">
                {expertApplications.map(app => {
                  const project = projects.find(p => p.id === app.problematique_id);
                  return (
                    <div key={app.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                          {project?.titre || `Projet ID #${app.problematique_id}`}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          Soumis le : {app.created_at} • Expérience mentionnée : {app.exp}
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 shrink-0">
                        Transmis au client
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────
          3. STUDENT VIEW
          ─────────────────────────────────────────────────────────── */}
      {currentUser.type === 'Étudiant' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Formations inscrites</div>
                <div className="text-3xl font-extrabold text-blue-600 mt-1">{studentInscriptions.length}</div>
              </div>
              <div className="text-3xl">🎓</div>
            </div>
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Candidatures stages/jobs</div>
                <div className="text-3xl font-extrabold text-emerald-600 mt-1">{studentJobs.length}</div>
              </div>
              <div className="text-3xl">📋</div>
            </div>
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Innovations publiées</div>
                <div className="text-3xl font-extrabold text-purple-600 mt-1">{studentInnovations.length}</div>
              </div>
              <div className="text-3xl">🚀</div>
            </div>
          </div>

          {/* Student Formations */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>🎓 Mes Formations Logiciels Actives</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {studentInscriptions.map(insc => {
                const formation = formations.find(f => f.id === insc.formation_id);
                return (
                  <div key={insc.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                        {formation?.domaine || 'Hydraulique'}
                      </span>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-1">
                        {formation?.titre || `Formation #${insc.formation_id}`}
                      </h4>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Inscrit le {insc.created_at} • Durée : {formation?.duree}
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Actif
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────
          4. ADMIN SUPERVISION VIEW
          ─────────────────────────────────────────────────────────── */}
      {currentUser.type === 'Admin' && (
        <div className="space-y-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
              <div className="text-3xl font-black text-brand-600">{users.length}</div>
              <div className="text-xs font-semibold text-slate-400 mt-1 uppercase">Utilisateurs</div>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
              <div className="text-3xl font-black text-cyan-600">{experts.length}</div>
              <div className="text-xs font-semibold text-slate-400 mt-1 uppercase">Experts inscrits</div>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
              <div className="text-3xl font-black text-purple-600">{innovations.length}</div>
              <div className="text-xs font-semibold text-slate-400 mt-1 uppercase">Innovations</div>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
              <div className="text-3xl font-black text-emerald-600">{projects.length}</div>
              <div className="text-xs font-semibold text-slate-400 mt-1 uppercase">Projets globaux</div>
            </div>
          </div>

          {/* Manage Experts & Certifications */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center justify-between">
              <span>Supervision & Certification des Experts ({experts.length})</span>
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400 font-bold uppercase text-[10px]">
                    <th className="pb-3">Expert</th>
                    <th className="pb-3">Wilaya</th>
                    <th className="pb-3">Spécialité</th>
                    <th className="pb-3">ENSH</th>
                    <th className="pb-3">Statut Certification</th>
                    <th className="pb-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {experts.map(e => (
                    <tr key={e.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-3 font-bold text-slate-900 dark:text-white">{e.nom}</td>
                      <td className="py-3 text-slate-500">{e.wilaya}</td>
                      <td className="py-3 text-slate-500 truncate max-w-[200px]">{e.spec}</td>
                      <td className="py-3">
                        {e.ensh ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                            🏛️ ENSH
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[10px]">Freelance</span>
                        )}
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          e.certifie ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {e.certifie ? '✓ Certifié' : 'Non certifié'}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => toggleExpertCertifie(e.id)}
                          className={`px-3 py-1 rounded-lg font-semibold text-[11px] ${
                            e.certifie
                              ? 'bg-amber-100 hover:bg-amber-200 text-amber-800'
                              : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                          }`}
                        >
                          {e.certifie ? 'Révoquer' : 'Certifier'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Database Reset Action */}
          <div className="p-6 rounded-3xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 flex items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-sm text-red-900 dark:text-red-200">Zone d'administration de données</h4>
              <p className="text-xs text-red-700 dark:text-red-300">
                Réinitialiser toutes les données de test locales (projets, candidatures, inscriptions) à l'état d'usine.
              </p>
            </div>
            <button
              onClick={() => {
                if (confirm('Voulez-vous vraiment réinitialiser toutes les données de démonstration ?')) {
                  resetDatabase();
                }
              }}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shrink-0"
            >
              Réinitialiser Démo
            </button>
          </div>
        </div>
      )}

      {/* EDIT EXPERT PROFILE MODAL */}
      {editExpertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md p-6 space-y-4 animate-scaleUp">
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Modifier mon profil expert
              </h3>
              <button
                onClick={() => setEditExpertModal(false)}
                className="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateProfileSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tarif horaire de consultance (DA) :
                </label>
                <input
                  type="number"
                  required
                  value={editTarif}
                  onChange={e => setEditTarif(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Spécialité / Titre de présentation :
                </label>
                <input
                  type="text"
                  required
                  value={editSpec}
                  onChange={e => setEditSpec(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setEditExpertModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
