import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Innovation } from '../types';
import {
  Sparkles, PlusCircle, Rocket, Eye, Star,
  CheckCircle2, X, Building, Tag, ExternalLink, Bot
} from 'lucide-react';

export const InnovationPage: React.FC = () => {
  const { innovations, addInnovation, incrementInnovationVues, currentUser, addToast } = useApp();

  const [selectedType, setSelectedType] = useState('Tous');
  const [selectedStatus, setSelectedStatus] = useState('Tous');

  // Modals state
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [detailModalItem, setDetailModalItem] = useState<Innovation | null>(null);

  // Submit form state
  const [inTitre, setInTitre] = useState('');
  const [inAuteur, setInAuteur] = useState(currentUser?.nom || '');
  const [inEmail, setInEmail] = useState(currentUser?.email || '');
  const [inType, setInType] = useState('Agent IA');
  const [inUniv, setInUniv] = useState('ENSH Blida');
  const [inDomaine, setInDomaine] = useState('Hydraulique');
  const [inPrix, setInPrix] = useState('Incubation');
  const [inTags, setInTags] = useState('IA,EPANET,Python');
  const [inStatut, setInStatut] = useState<'Cherche incubateur' | 'À vendre'>('Cherche incubateur');
  const [inDesc, setInDesc] = useState('');

  const types = ["Tous", "Agent IA", "Outil SIG", "Application Web", "Dashboard IoT"];

  const filteredInnovations = innovations.filter(inn => {
    const typeMatch = selectedType === 'Tous' || inn.type === selectedType;
    const statusMatch = selectedStatus === 'Tous' || inn.statut === selectedStatus;
    return typeMatch && statusMatch;
  });

  const handleOpenDetail = (inn: Innovation) => {
    incrementInnovationVues(inn.id);
    setDetailModalItem(inn);
  };

  const handleProposeIncubation = (inn: Innovation) => {
    addToast(
      'Demande d\'incubation transmise !',
      `Votre proposition a été envoyée à ${inn.auteur} (${inn.univ}) pour le projet "${inn.titre}". Vous recevrez une mise en relation par email.`,
      'success'
    );
    setDetailModalItem(null);
  };

  const handleSubmitNewInnovation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inTitre.trim() || !inAuteur.trim() || !inDesc.trim()) return;

    addInnovation({
      titre: inTitre,
      auteur: inAuteur,
      email: inEmail,
      type: inType,
      univ: inUniv,
      domaine: inDomaine,
      prix: inPrix,
      tags: inTags,
      statut: inStatut,
      desc: inDesc
    });

    setSubmitModalOpen(false);
    setInTitre('');
    setInDesc('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fadeIn">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold mb-1">
            <span>🚀 R&D et Intelligence Artificielle en Algérie</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Innovation Technologique & Agents IA
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Projets d'ingénieurs diplômés (ENSH, USTHB, ENP, ENSA) prêts pour transfert technologique ou incubation.
          </p>
        </div>

        <button
          onClick={() => setSubmitModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Proposer une innovation</span>
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {types.map(t => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedType === t
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-semibold">Statut :</span>
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="font-medium py-1.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="Tous">Tous les statuts</option>
            <option value="Cherche incubateur">🏢 Cherche incubateur</option>
            <option value="À vendre">💰 À vendre</option>
          </select>
        </div>
      </div>

      {/* INNOVATIONS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInnovations.map(inn => (
          <div
            key={inn.id}
            className="rounded-3xl p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
          >
            <div className="space-y-3">
              {/* Type badge and Status */}
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                  {inn.type === 'Agent IA' ? '🤖 ' : '⚙️ '}{inn.type}
                </span>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                  inn.statut === 'Cherche incubateur'
                    ? 'bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200'
                    : 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200'
                }`}>
                  {inn.statut}
                </span>
              </div>

              {/* Title & Author */}
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white leading-snug group-hover:text-purple-600 transition-colors">
                  {inn.titre}
                </h3>
                <div className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                  <span>🎓 {inn.auteur}</span>
                  <span>•</span>
                  <span className="font-semibold text-purple-600 dark:text-purple-400">{inn.univ}</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                {inn.desc}
              </p>

              {/* Tech Tags */}
              <div className="flex flex-wrap gap-1.5">
                {inn.tags.split(',').map((t, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                  >
                    #{t.trim()}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom: Price, Views & Action */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-slate-400">Modalité :</div>
                <div className="font-extrabold text-sm text-purple-700 dark:text-purple-400">
                  {inn.prix}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" /> {inn.vues}
                </span>
                <button
                  onClick={() => handleOpenDetail(inn)}
                  className="py-1.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-500/20 transition-all"
                >
                  Découvrir
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL 1: INNOVATION DETAIL */}
      {detailModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg p-6 sm:p-8 space-y-6 animate-scaleUp">
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                  {detailModalItem.type}
                </span>
                <h3 className="font-extrabold text-lg text-slate-900 dark:text-white mt-1">
                  {detailModalItem.titre}
                </h3>
                <div className="text-xs text-slate-500 mt-0.5">
                  Par {detailModalItem.auteur} • {detailModalItem.univ} ({detailModalItem.domaine})
                </div>
              </div>
              <button
                onClick={() => setDetailModalItem(null)}
                className="w-7 h-7 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 leading-relaxed text-slate-700 dark:text-slate-200">
                <div className="font-bold text-slate-900 dark:text-white mb-2">Description complète de la solution :</div>
                {detailModalItem.desc}
              </div>

              <div className="flex flex-wrap gap-2">
                {detailModalItem.tags.split(',').map((t, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 font-mono text-[11px]">
                    #{t.trim()}
                  </span>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-purple-800 dark:text-purple-300 font-medium">Statut du projet :</div>
                  <div className="font-bold text-sm text-purple-950 dark:text-purple-100">{detailModalItem.statut}</div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] text-purple-800 dark:text-purple-300 font-medium">Conditions :</div>
                  <div className="font-black text-base text-purple-900 dark:text-purple-200">{detailModalItem.prix}</div>
                </div>
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button
                type="button"
                onClick={() => setDetailModalItem(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs"
              >
                Fermer
              </button>
              <button
                onClick={() => handleProposeIncubation(detailModalItem)}
                className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-500/20"
              >
                {detailModalItem.statut === 'Cherche incubateur' ? '🏢 Proposer incubation' : '💰 Acquérir la solution'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: SUBMIT NEW INNOVATION */}
      {submitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg p-6 sm:p-8 space-y-5 animate-scaleUp">
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Proposer une Innovation / Agent IA
                </h3>
                <p className="text-xs text-slate-500">Mettez en avant votre projet de fin d'études ou brevet.</p>
              </div>
              <button
                onClick={() => setSubmitModalOpen(false)}
                className="w-7 h-7 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitNewInnovation} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nom du projet / solution : *
                </label>
                <input
                  type="text"
                  required
                  value={inTitre}
                  onChange={e => setInTitre(e.target.value)}
                  placeholder="Ex : HydroSmart — Contrôle des vannes par LoRaWAN..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Porteur du projet :
                  </label>
                  <input
                    type="text"
                    required
                    value={inAuteur}
                    onChange={e => setInAuteur(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Université / École :
                  </label>
                  <select
                    value={inUniv}
                    onChange={e => setInUniv(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  >
                    <option value="ENSH Blida">ENSH Blida</option>
                    <option value="USTHB Alger">USTHB Alger</option>
                    <option value="ENP Alger">ENP Alger</option>
                    <option value="ENSA Alger">ENSA Alger</option>
                    <option value="Autre université">Autre université</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Type de solution :
                  </label>
                  <select
                    value={inType}
                    onChange={e => setInType(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  >
                    <option value="Agent IA">Agent IA</option>
                    <option value="Outil SIG">Outil SIG</option>
                    <option value="Application Web">Application Web</option>
                    <option value="Dashboard IoT">Dashboard IoT</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Statut / Objectif :
                  </label>
                  <select
                    value={inStatut}
                    onChange={e => setInStatut(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  >
                    <option value="Cherche incubateur">Cherche incubateur</option>
                    <option value="À vendre">À vendre</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Mots-clés / Technologies (séparés par des virgules) :
                </label>
                <input
                  type="text"
                  value={inTags}
                  onChange={e => setInTags(e.target.value)}
                  placeholder="Ex : Python, EPANET, Machine Learning, IoT..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Description synthétique & valeur ajoutée : *
                </label>
                <textarea
                  required
                  rows={4}
                  value={inDesc}
                  onChange={e => setInDesc(e.target.value)}
                  placeholder="Expliquez la problématique résolue, les algorithmes utilisés et les résultats concrets obtenus..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setSubmitModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-md shadow-purple-500/20"
                >
                  Soumettre l'innovation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
