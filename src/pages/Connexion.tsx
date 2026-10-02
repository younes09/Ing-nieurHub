import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserType } from '../types';
import {
  Lock, Mail, User, Shield, Briefcase, GraduationCap,
  Building2, CheckCircle2, ArrowRight, UserCheck
} from 'lucide-react';

export const Connexion: React.FC = () => {
  const { login, register, switchUserRole, navigateTo } = useApp();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password123');
  const [role, setRole] = useState<UserType>('Client');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const res = login(email, password);
    if (res.success) {
      navigateTo('dashboard');
    } else {
      setErrorMessage(res.message);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!nom.trim() || !email.trim()) return;

    const res = register(nom, email, role);
    if (res.success) {
      navigateTo('dashboard');
    } else {
      setErrorMessage(res.message);
    }
  };

  const demoAccounts: { role: UserType; name: string; email: string; icon: string; desc: string }[] = [
    { role: 'Client', name: 'Test User', email: 'test@ingenieurhub.dz', icon: '👔', desc: 'Publie des appels à projets et commandes' },
    { role: 'Expert', name: 'Karim Boudiaf', email: 'karim@ingenieurhub.dz', icon: '👷', desc: 'Ingénieur consultant & freelance' },
    { role: 'Bureau', name: 'Saci Bureau', email: 'bureau@ingenieurhub.dz', icon: '🏢', desc: 'Bureau d\'études techniques (BET)' },
    { role: 'Étudiant', name: 'Rania Meziane', email: 'student@ingenieurhub.dz', icon: '🎓', desc: 'Élève-ingénieure ENSH Blida' },
    { role: 'Admin', name: 'Hub Admin', email: 'admin@ingenieurhub.dz', icon: '🛡️', desc: 'Supervision globale de la plateforme' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 animate-fadeIn space-y-10">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          Espace Membre IngénieurHub
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          Accédez à votre tableau de bord, gérez vos candidatures ou publiez vos offres techniques.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* FORM CARD (7 Cols) */}
        <div className="md:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          {/* Mode Switcher */}
          <div className="flex p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-bold">
            <button
              onClick={() => {
                setMode('login');
                setErrorMessage('');
              }}
              className={`flex-1 py-2.5 rounded-xl transition-all ${
                mode === 'login'
                  ? 'bg-white dark:bg-slate-900 text-brand-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Se connecter
            </button>
            <button
              onClick={() => {
                setMode('register');
                setErrorMessage('');
              }}
              className={`flex-1 py-2.5 rounded-xl transition-all ${
                mode === 'register'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Créer un compte
            </button>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-semibold border border-red-200">
              ⚠️ {errorMessage}
            </div>
          )}

          {/* Form */}
          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Adresse email :
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="exemple@ingenieurhub.dz"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Mot de passe :
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md shadow-brand-500/20 transition-all"
              >
                Connexion à mon compte
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nom complet ou raison sociale : *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={nom}
                    onChange={e => setNom(e.target.value)}
                    placeholder="Ex : Karim Boudiaf"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Adresse email professionnelle : *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="contact@exemple.dz"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Role selection */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Sélectionnez votre profil d'utilisateur :
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Client', 'Expert', 'Bureau', 'Étudiant'] as UserType[]).map(r => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        role === r
                          ? 'border-brand-600 bg-brand-50/70 text-brand-900 font-bold shadow-xs'
                          : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600'
                      }`}
                    >
                      <div className="text-base mb-1">
                        {r === 'Client' && '👔'}
                        {r === 'Expert' && '👷'}
                        {r === 'Bureau' && '🏢'}
                        {r === 'Étudiant' && '🎓'}
                      </div>
                      <div className="font-bold">{r}</div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md shadow-brand-500/20 transition-all"
              >
                Créer mon compte
              </button>
            </form>
          )}
        </div>

        {/* 1-CLICK DEMO ACCOUNTS (5 Cols) */}
        <div className="md:col-span-5 bg-gradient-to-br from-brand-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-7 shadow-xl space-y-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-400 text-brand-950 font-bold text-[10px] uppercase tracking-wider mb-2">
              <UserCheck className="w-3.5 h-3.5" />
              Accès Démonstration 1-Clic
            </div>
            <h3 className="font-extrabold text-base text-white">
              Tester la plateforme instantanément
            </h3>
            <p className="text-xs text-slate-300">
              Cliquez sur un profil pour vous connecter sans mot de passe :
            </p>
          </div>

          <div className="space-y-2.5">
            {demoAccounts.map(acc => (
              <button
                key={acc.role}
                onClick={() => {
                  switchUserRole(acc.role);
                  navigateTo('dashboard');
                }}
                className="w-full p-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-left transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{acc.icon}</span>
                  <div>
                    <div className="font-bold text-xs text-white flex items-center gap-1.5">
                      <span>{acc.name}</span>
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">
                        {acc.role}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-300 mt-0.5">
                      {acc.desc}
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-cyan-300 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all shrink-0" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
