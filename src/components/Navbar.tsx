import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PageRoute, UserType } from '../types';
import {
  Menu, X, Sparkles, ChevronDown, UserCheck,
  LogOut, LayoutDashboard, RefreshCw
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentPage,
    navigateTo,
    currentUser,
    logout,
    switchUserRole,
    openAiModal,
    resetDatabase
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks: { id: PageRoute; label: string; icon: string }[] = [
    { id: 'accueil', label: 'Accueil', icon: '🏠' },
    { id: 'experts', label: 'Experts', icon: '👷' },
    { id: 'travail', label: 'Travail', icon: '💼' },
    { id: 'fournisseurs', label: 'Fournisseurs', icon: '🏪' },
    { id: 'innovation', label: 'Innovation', icon: '🚀' },
    { id: 'formations', label: 'Formations', icon: '🎓' },
    { id: 'etudes', label: 'Études', icon: '📐' },
    { id: 'recrutement', label: 'Recrutement', icon: '📋' },
    { id: 'chatbot', label: 'HydroBot', icon: '🤖' },
  ];

  const handleNav = (page: PageRoute) => {
    navigateTo(page);
    setMobileMenuOpen(false);
  };

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const roles: UserType[] = ['Client', 'Expert', 'Bureau', 'Étudiant', 'Admin'];

  return (
    <header className="sticky top-0 z-40 bg-brand-900/95 backdrop-blur-md border-b border-brand-800 text-white shadow-lg shadow-brand-950/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNav('accueil')}
              className="flex items-center gap-2 group text-left transition-transform hover:scale-102"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-brand-400 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
                <span className="text-xl">💧</span>
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-white">
                  Ingénieur<span className="text-cyan-400">Hub</span>
                </span>
                <span className="hidden sm:inline-block ml-2 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-brand-800/80 text-cyan-200 border border-brand-700">
                  ENSH Blida
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navLinks.map(link => {
              const active = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNav(link.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    active
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                      : 'text-slate-200 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="text-sm">{link.icon}</span>
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Action CTAs & Auth */}
          <div className="flex items-center gap-2">
            {/* AI Error Agent Button */}
            <button
              onClick={openAiModal}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-md shadow-purple-600/20 transition-all hover:scale-102"
              title="Audit automatique de vos calculs hydrauliques"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
              <span>AI Agent</span>
            </button>

            {/* User Session Dropdown */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(prev => !prev)}
                  className="flex items-center gap-2 py-1 px-2.5 rounded-xl bg-brand-800/90 hover:bg-brand-700/90 border border-brand-700 text-white text-xs font-medium transition-all"
                >
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 font-bold flex items-center justify-center text-xs">
                    {getInitials(currentUser.nom)}
                  </div>
                  <div className="text-left hidden md:block">
                    <div className="font-semibold leading-none truncate max-w-[100px] text-white">
                      {currentUser.nom}
                    </div>
                    <div className="text-[10px] text-cyan-300 mt-0.5">
                      {currentUser.type}
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-64 rounded-2xl bg-white text-slate-800 shadow-2xl border border-slate-200 py-2 z-50 text-xs animate-scaleUp"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <div className="font-bold text-sm text-brand-900">{currentUser.nom}</div>
                      <div className="text-slate-500 text-[11px] truncate">{currentUser.email}</div>
                      <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-100 text-brand-800">
                        Rôle actif : {currentUser.type}
                      </span>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => handleNav('dashboard')}
                        className="w-full px-4 py-2 text-left font-semibold text-brand-700 hover:bg-brand-50 flex items-center gap-2"
                      >
                        <LayoutDashboard className="w-4 h-4 text-brand-500" />
                        Mon Tableau de bord
                      </button>
                    </div>

                    {/* Quick Persona Switcher for easy testing */}
                    <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/70">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <UserCheck className="w-3 h-3 text-brand-500" />
                        Tester un autre rôle :
                      </div>
                      <div className="grid grid-cols-2 gap-1 mt-1">
                        {roles.map(r => (
                          <button
                            key={r}
                            onClick={e => {
                              e.stopPropagation();
                              switchUserRole(r);
                              setUserDropdownOpen(false);
                            }}
                            className={`px-2 py-1 rounded text-[11px] font-medium text-left transition-colors ${
                              currentUser.type === r
                                ? 'bg-brand-600 text-white font-bold'
                                : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
                            }`}
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-1 border-t border-slate-100">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          if (confirm('Voulez-vous réinitialiser toutes les données de test ?')) {
                            resetDatabase();
                            setUserDropdownOpen(false);
                          }
                        }}
                        className="w-full px-4 py-2 text-left text-slate-500 hover:bg-slate-100 flex items-center gap-2 text-[11px]"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
                        Réinitialiser données démo
                      </button>

                      <button
                        onClick={logout}
                        className="w-full px-4 py-2 text-left font-medium text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Déconnexion
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => handleNav('connexion')}
                className="px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-brand-950 font-bold text-xs shadow-md shadow-cyan-500/20 transition-all hover:scale-102"
              >
                Connexion
              </button>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="xl:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-brand-950 border-t border-brand-800 px-4 pt-3 pb-5 space-y-2">
          <div className="grid grid-cols-2 gap-1.5 mb-3">
            {navLinks.map(link => {
              const active = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNav(link.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-left transition-all ${
                    active
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-200 hover:bg-white/5'
                  }`}
                >
                  <span className="text-base">{link.icon}</span>
                  <span>{link.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-brand-850 flex gap-2">
            <button
              onClick={() => {
                openAiModal();
                setMobileMenuOpen(false);
              }}
              className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-xs flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-cyan-300" />
              <span>AI Agent Calculs</span>
            </button>
            {currentUser && (
              <button
                onClick={() => handleNav('dashboard')}
                className="py-2 px-4 rounded-xl bg-brand-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Tableau de bord</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
