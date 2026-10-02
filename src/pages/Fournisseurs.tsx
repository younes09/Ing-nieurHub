import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SupplierMaterial } from '../types';
import {
  Package, Search, ShieldCheck, CheckCircle2,
  FileText, ShoppingBag, X, Phone, Tag, MapPin
} from 'lucide-react';

export const Fournisseurs: React.FC = () => {
  const { materials, addToast } = useApp();

  const [activeCategory, setActiveCategory] = useState('Tous');
  const [selectedWilaya, setSelectedWilaya] = useState('Toutes');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [selectedFicheMaterial, setSelectedFicheMaterial] = useState<SupplierMaterial | null>(null);
  const [quoteMaterial, setQuoteMaterial] = useState<SupplierMaterial | null>(null);
  const [quoteQuantity, setQuoteQuantity] = useState('100');
  const [quoteEmail, setQuoteEmail] = useState('');
  const [quotePhone, setQuotePhone] = useState('');

  const categories = [
    "Tous", "Tuyauterie", "Vannes & Robinetterie", "Comptage & Mesure",
    "Pompes", "Ouvrages préfabriqués", "Étanchéité", "Traitement des eaux",
    "Assainissement", "Accessoires"
  ];

  const wilayas = ["Toutes", "Alger", "Blida", "Oran", "Constantine", "Annaba"];

  const filteredMaterials = materials.filter(m => {
    const catMatch = activeCategory === 'Tous' || m.categorie === activeCategory;
    const wilayaMatch = selectedWilaya === 'Toutes' || m.wilaya === selectedWilaya;
    const searchMatch = !searchQuery.trim() ||
      m.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.fournisseur.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.ref.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.norm.toLowerCase().includes(searchQuery.toLowerCase());

    return catMatch && wilayaMatch && searchMatch;
  });

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quoteMaterial) return;

    addToast(
      'Demande de devis transmise !',
      `Le commercial de "${quoteMaterial.fournisseur}" a reçu votre demande pour ${quoteQuantity} ${quoteMaterial.unite} de "${quoteMaterial.nom}". Vous serez contacté sous 24h.`,
      'success'
    );
    setQuoteMaterial(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fadeIn">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mb-1">
            <span>🏪 Catalogue Matériaux & Équipements</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Fournisseurs Matériaux Hydrauliques & VRD
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Produits certifiés ISO/EN en stock chez les importateurs et fabricants en Algérie.
          </p>
        </div>
      </div>

      {/* FILTER BAR & CATEGORY PILLS */}
      <div className="space-y-4">
        {/* Category Pills */}
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

        {/* Search & Wilaya Controls */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Rechercher par désignation, référence (PEHD-PN10...), norme..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-semibold">Wilaya :</span>
            <select
              value={selectedWilaya}
              onChange={e => setSelectedWilaya(e.target.value)}
              className="text-xs font-medium py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {wilayas.map(w => (
                <option key={w} value={w}>{w === 'Toutes' ? 'Toutes les wilayas' : w}</option>
              ))}
            </select>
          </div>

          <div className="text-xs font-semibold text-slate-500">
            <span className="font-bold text-brand-600 dark:text-cyan-400">{filteredMaterials.length}</span> référence(s)
          </div>
        </div>
      </div>

      {/* MATERIALS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredMaterials.map(m => (
          <div
            key={m.id}
            className="rounded-2xl p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              {/* Category & Stock Status */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {m.categorie}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  m.stock === 'En stock'
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                }`}>
                  {m.stock}
                </span>
              </div>

              {/* Title with Emoji Icon */}
              <div className="flex items-start gap-3 mb-2">
                <div className="text-3xl shrink-0 p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                  {m.img}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">
                    {m.nom}
                  </h3>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Fournisseur : <span className="font-semibold text-slate-700 dark:text-slate-300">{m.fournisseur}</span> ({m.wilaya})
                  </div>
                </div>
              </div>

              {/* Technical specs badges */}
              <div className="flex flex-wrap gap-2 text-[10px] font-mono my-3">
                <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  Réf: {m.ref}
                </span>
                <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-semibold">
                  Norme: {m.norm}
                </span>
              </div>

              {/* Promotional offer badge if exists */}
              {m.offre && (
                <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-800 dark:text-amber-300 font-medium flex items-center gap-1.5 mb-3">
                  <Tag className="w-3.5 h-3.5 shrink-0 text-amber-600" />
                  <span>{m.offre}</span>
                </div>
              )}
            </div>

            {/* Price & Action Buttons */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-slate-400">Prix unitaire indicatif :</span>
                <div className="text-base font-extrabold text-brand-900 dark:text-cyan-400">
                  {m.prix.toLocaleString()} DA <span className="text-xs font-normal text-slate-400">/ {m.unite}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setSelectedFicheMaterial(m)}
                  className="py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Fiche</span>
                </button>
                <button
                  onClick={() => setQuoteMaterial(m)}
                  className="py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Devis express</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL 1: FICHE TECHNIQUE */}
      {selectedFicheMaterial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg p-6 sm:p-8 space-y-5 animate-scaleUp">
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selectedFicheMaterial.img}</span>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {selectedFicheMaterial.nom}
                  </h3>
                  <div className="text-xs text-slate-500">
                    {selectedFicheMaterial.fournisseur} • Wilaya de {selectedFicheMaterial.wilaya}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedFicheMaterial(null)}
                className="w-7 h-7 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                <div>
                  <div className="text-slate-400">Référence produit :</div>
                  <div className="font-mono font-bold text-slate-800 dark:text-slate-100">{selectedFicheMaterial.ref}</div>
                </div>
                <div>
                  <div className="text-slate-400">Norme de fabrication :</div>
                  <div className="font-mono font-bold text-blue-600 dark:text-blue-400">{selectedFicheMaterial.norm}</div>
                </div>
                <div>
                  <div className="text-slate-400">Disponibilité :</div>
                  <div className="font-semibold text-emerald-600">{selectedFicheMaterial.stock}</div>
                </div>
                <div>
                  <div className="text-slate-400">Tarif catalogue :</div>
                  <div className="font-bold text-brand-900 dark:text-cyan-400">
                    {selectedFicheMaterial.prix.toLocaleString()} DA / {selectedFicheMaterial.unite}
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 leading-relaxed">
                <div className="font-semibold text-slate-800 dark:text-slate-100 mb-1">Prescriptions de pose & conformité :</div>
                Conforme aux exigences des cahiers des charges de l'<strong>ADE</strong> et de l'<strong>ONA</strong>. Résistance certifiée aux pressions de service, étanchéité contrôlée par laboratoire accrédité.
              </div>

              {selectedFicheMaterial.offre && (
                <div className="p-3 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 font-semibold">
                  🎁 {selectedFicheMaterial.offre}
                </div>
              )}
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedFicheMaterial(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs"
              >
                Fermer
              </button>
              <button
                onClick={() => {
                  const m = selectedFicheMaterial;
                  setSelectedFicheMaterial(null);
                  setQuoteMaterial(m);
                }}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md"
              >
                Demander un devis
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: DEMANDE DE DEVIS EXPRESS */}
      {quoteMaterial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md p-6 space-y-4 animate-scaleUp">
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Demande de Devis Fournisseur
                </h3>
                <div className="text-xs text-slate-500">
                  Produit : {quoteMaterial.nom} ({quoteMaterial.fournisseur})
                </div>
              </div>
              <button
                onClick={() => setQuoteMaterial(null)}
                className="w-7 h-7 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleQuoteSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Quantité souhaitée ({quoteMaterial.unite}) :
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={quoteQuantity}
                  onChange={e => setQuoteQuantity(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Votre adresse email :
                </label>
                <input
                  type="email"
                  required
                  value={quoteEmail}
                  onChange={e => setQuoteEmail(e.target.value)}
                  placeholder="contact@entreprise.dz"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Numéro de téléphone :
                </label>
                <input
                  type="tel"
                  required
                  value={quotePhone}
                  onChange={e => setQuotePhone(e.target.value)}
                  placeholder="05 50 00 00 00"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-[11px] text-slate-500">
                Estimation immédiate : <strong className="text-slate-800 dark:text-slate-100">{(parseInt(quoteQuantity || '0') * quoteMaterial.prix).toLocaleString()} DA HT</strong> (hors remises sur volume).
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setQuoteMaterial(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md shadow-emerald-500/20"
                >
                  Envoyer au fournisseur
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
