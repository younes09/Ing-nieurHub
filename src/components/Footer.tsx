import React from 'react';
import { useApp } from '../context/AppContext';
import { PageRoute } from '../types';
import { Mail, MapPin, Phone, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigateTo } = useApp();

  const handleNav = (p: PageRoute) => {
    navigateTo(p);
  };

  return (
    <footer className="bg-brand-950 text-slate-300 pt-16 pb-12 border-t border-brand-850 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Col 1: Brand & ENSH */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">💧</span>
              <span className="font-extrabold text-2xl text-white tracking-tight">
                Ingénieur<span className="text-cyan-400">Hub</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              La marketplace algérienne du génie civil, hydraulique, VRD, SIG et innovation technologique. Connectant les meilleurs ingénieurs aux projets d'envergure nationale.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-brand-900/80 border border-brand-800 text-xs font-semibold text-cyan-300">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Partenaire ENSH Blida</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Plateforme
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => handleNav('experts')} className="hover:text-cyan-300 transition-colors">
                  👷 Experts & Professeurs ENSH
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('travail')} className="hover:text-cyan-300 transition-colors">
                  💼 Travail & Appels à projets
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('fournisseurs')} className="hover:text-cyan-300 transition-colors">
                  🏪 Fournisseurs de matériaux
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('innovation')} className="hover:text-cyan-300 transition-colors">
                  🚀 Innovation & Agents IA
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('formations')} className="hover:text-cyan-300 transition-colors">
                  🎓 Formations spécialisées
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('etudes')} className="hover:text-cyan-300 transition-colors">
                  📐 Dépôt d'études techniques
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('recrutement')} className="hover:text-cyan-300 transition-colors">
                  📋 Offres de recrutement
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Spécialités */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Domaines d'expertise
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                Hydraulique Urbaine & AEP (EPANET)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                Modélisation des Crues (HEC-RAS 2D)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                Traitement des eaux & Potabilisation
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                Ouvrages hydrauliques & Barrages (SEEP/W)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                SIG & Cartographie Réseaux (ArcGIS Pro)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                VRD & Assainissement (Méthode Caquot)
              </li>
            </ul>
          </div>

          {/* Col 4: Contact */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Contact & Support
            </h4>
            <ul className="space-y-3 text-xs text-slate-400">
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>contact@ingenieurhub.dz</span>
              </li>
              <li className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Blida / Alger, Algérie</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>+213 (0) 25 00 00 00</span>
              </li>
            </ul>
            <div className="pt-2">
              <div className="p-3 rounded-xl bg-brand-900/60 border border-brand-800 text-[11px] text-slate-300">
                💡 <span className="font-semibold text-white">Besoin d'un audit express ?</span> Contactez nos enseignants ENSH certifiés pour valider vos notes de calcul.
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-brand-900/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} IngénieurHub — Tous droits réservés.
          </div>
          <div className="flex items-center gap-1">
            Développé pour l'ingénierie et l'innovation technologique en Algérie 🇩🇿
          </div>
        </div>
      </div>
    </footer>
  );
};
