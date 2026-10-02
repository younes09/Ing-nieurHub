import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  UploadCloud, FileCheck, Clock, CheckCircle2,
  FileText, ShieldCheck, X, AlertCircle
} from 'lucide-react';

export const Etudes: React.FC = () => {
  const { studies, submitTechnicalStudy, currentUser } = useApp();

  const [titre, setTitre] = useState('');
  const [type, setType] = useState('AEP');
  const [logiciel, setLogiciel] = useState('EPANET');
  const [wilaya, setWilaya] = useState('Blida');
  const [desc, setDesc] = useState('');
  const [selectedFile, setSelectedFile] = useState<{ name: string; size: string } | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const wilayas = [
    "Alger", "Blida", "Boumerdès", "Tipaza", "Oran", "Constantine",
    "Tizi-Ouzou", "Annaba", "Sétif", "Batna", "Béjaïa"
  ];

  const types = [
    "AEP", "Assainissement", "Ouvrages hydrauliques", "SIG / ArcGIS",
    "Irrigation", "VRD", "Traitement des eaux"
  ];

  const logiciels = [
    "EPANET", "HEC-RAS", "Civil 3D", "ArcGIS Pro", "SEEP/W", "AutoCAD", "SWMM", "Autre"
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const sizeStr = file.size > 1024 * 1024
        ? (file.size / (1024 * 1024)).toFixed(2) + ' Mo'
        : (file.size / 1024).toFixed(2) + ' Ko';
      setSelectedFile({ name: file.name, size: sizeStr });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const sizeStr = file.size > 1024 * 1024
        ? (file.size / (1024 * 1024)).toFixed(2) + ' Mo'
        : (file.size / 1024).toFixed(2) + ' Ko';
      setSelectedFile({ name: file.name, size: sizeStr });
    }
  };

  const handleSubmitStudy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titre.trim() || !desc.trim()) return;

    submitTechnicalStudy({
      titre,
      type,
      logiciel,
      wilaya,
      desc,
      fichier: selectedFile ? selectedFile.name : undefined
    });

    // Reset
    setTitre('');
    setDesc('');
    setSelectedFile(null);
  };

  const getStatusBadge = (statut: string) => {
    if (statut === 'Livrée') {
      return {
        badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
        width: 'w-full',
        color: 'bg-emerald-500'
      };
    }
    if (statut === 'En cours') {
      return {
        badge: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
        width: 'w-2/3',
        color: 'bg-amber-500'
      };
    }
    return {
      badge: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
      width: 'w-1/4',
      color: 'bg-slate-500'
    };
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-fadeIn">
      {/* HEADER */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 text-cyan-800 text-xs font-bold">
          <span>📐 Pôle d'Expertise & Calculs</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Dépôt d'Études Techniques & Notes de Calcul
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          Confiez la vérification, la modélisation hydraulique ou la rédaction de vos notes de calcul à des ingénieurs certifiés et enseignants-chercheurs de l'ENSH Blida.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* SUBMISSION FORM (7 Cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="font-bold text-base text-slate-900 dark:text-white">
              Nouvelle demande d'étude technique
            </h2>
            <span className="text-[11px] text-slate-400">Délai moyen de prise en charge : 24h</span>
          </div>

          <form onSubmit={handleSubmitStudy} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Intitulé de l'étude ou du projet : *
              </label>
              <input
                type="text"
                required
                value={titre}
                onChange={e => setTitre(e.target.value)}
                placeholder="Ex : Réseau AEP 2 500 abonnés Commune de Meftah (Blida)..."
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Type d'ouvrage :
                </label>
                <select
                  value={type}
                  onChange={e => setType(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                >
                  {types.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Logiciel requis :
                </label>
                <select
                  value={logiciel}
                  onChange={e => setLogiciel(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                >
                  {logiciels.map(l => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Wilaya :
                </label>
                <select
                  value={wilaya}
                  onChange={e => setWilaya(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                >
                  {wilayas.map(w => (
                    <option key={w} value={w}>{w}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* DRAG AND DROP ZONE */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Fichiers techniques (Shapefile, INP, DWG, PDF...) :
              </label>
              <div
                onDragOver={e => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
                  dragOver
                    ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/20'
                    : selectedFile
                    ? 'border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/20'
                    : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 bg-slate-50 dark:bg-slate-800/40'
                }`}
              >
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                {selectedFile ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <FileCheck className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-slate-800 dark:text-slate-200">{selectedFile.name}</div>
                      <div className="text-slate-400 text-[11px]">{selectedFile.size}</div>
                    </div>
                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        setSelectedFile(null);
                      }}
                      className="p-1 rounded-md hover:bg-slate-200 text-slate-400"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <UploadCloud className="w-8 h-8 text-brand-500 mx-auto" />
                    <div className="font-semibold text-slate-700 dark:text-slate-200">
                      Glissez vos fichiers ici ou cliquez pour parcourir
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Formats acceptés : .inp, .prj, .dwg, .shp, .pdf, .docx, .zip (max 50 Mo)
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Détails des calculs & livrables attendus : *
              </label>
              <textarea
                required
                rows={4}
                value={desc}
                onChange={e => setDesc(e.target.value)}
                placeholder="Précisez la nature de la prestation : vérification des pertes de charge, modélisation de crue centennale, calcul des diamètres, conformité au devis programme..."
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-[11px] text-slate-500 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-600 shrink-0" />
              <span>Secret professionnel garanti. Vos pièces graphiques restent strictement confidentielles.</span>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold shadow-md shadow-brand-500/20"
              >
                Envoyer le dossier technique
              </button>
            </div>
          </form>
        </div>

        {/* TRACKING PROGRESS SECTION (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <span>📋 Suivi en temps réel des études ({studies.length})</span>
            </h3>

            <div className="space-y-4">
              {studies.map(s => {
                const badgeInfo = getStatusBadge(s.statut);
                return (
                  <div
                    key={s.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-cyan-300 border border-brand-200 dark:border-brand-800">
                          {s.type}
                        </span>
                        <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white mt-1">
                          {s.titre}
                        </h4>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Logiciel : <span className="font-semibold text-slate-700 dark:text-slate-300">{s.logiciel}</span> • {s.wilaya}
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 ${badgeInfo.badge}`}>
                        {s.statut}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                        <div className={`h-full ${badgeInfo.color} ${badgeInfo.width} transition-all duration-500`} />
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>Dépôt : {s.date}</span>
                        <span>{s.statut === 'Livrée' ? '100% — Rapport disponible' : s.statut === 'En cours' ? '65% — Calculs en cours' : '25% — Reçue'}</span>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2">
                      {s.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
