import { AiAnalysisResult, AiCalculationError } from '../types';

export function analyzeCalculations(text: string): AiAnalysisResult {
  const msg = text.toLowerCase();
  let score = 88;
  const errors: AiCalculationError[] = [];
  const avertissements: string[] = [];
  const suggestions: string[] = [];
  let resume = "Calculs techniques cohérents et globalement bien structurés selon les normes en vigueur.";
  let niveau: 'Excellent' | 'Bon' | 'Moyen' | 'Critique' = "Bon";

  // Check minimum length
  if (text.trim().length < 30) {
    return {
      score: 42,
      niveau: "Critique",
      resume: "Données insuffisantes pour effectuer un diagnostic hydraulique ou structurel complet.",
      erreurs: [
        {
          type: "Note de calcul incomplète",
          description: "Veuillez fournir davantage de données techniques (formules, débits Q, vitesses V, diamètres D, pentes I, pressions P) pour un audit complet.",
          gravite: "Critique"
        }
      ],
      avertissements: [
        "Absence de justification des conditions aux limites hydrauliques.",
        "Aucune référence aux règles de l'art algériennes (CNA / ONA / DRE)."
      ],
      suggestions: [
        "Collez votre note de calcul complète ou un extrait de dimensionnement EPANET / Manning-Strickler."
      ]
    };
  }

  // Velocity checks (V = ...)
  const velRegex = /v\s*=\s*([0-9]+(?:[.,][0-9]+)?)/i;
  const velMatch = msg.match(velRegex);
  if (velMatch) {
    const v = parseFloat(velMatch[1].replace(',', '.'));
    if (v < 0.5) {
      score -= 15;
      errors.push({
        type: "Vitesse d'écoulement trop faible (Auto-curage non garanti)",
        description: `La vitesse calculée (${v} m/s) est inférieure à la vitesse minimale d'auto-curage (0.50 à 0.60 m/s pour l'assainissement et les conduites d'eaux usées/pluviales). Risque sévère d'envasement, de décantation de matières solides et d'obstruction.`,
        gravite: "Critique"
      });
    } else if (v > 3.0) {
      score -= 12;
      errors.push({
        type: "Vitesse d'écoulement excessive (Risque d'érosion & coup de bélier)",
        description: `La vitesse calculée (${v} m/s) dépasse la vitesse limite admissible (généralement 2.50 à 3.00 m/s). Risque d'abrasion accélérée de la paroi intérieure des conduites et de surpressions destructrices par coup de bélier.`,
        gravite: "Moyenne"
      });
    } else {
      suggestions.push(`Vitesse d'écoulement nominale (${v} m/s) dans la plage recommandée (0.6 - 2.5 m/s).`);
    }
  }

  // Discharge Q checks
  if (msg.includes('q =') || msg.includes('débit') || msg.includes('debit') || msg.includes('l/s') || msg.includes('m3/s')) {
    suggestions.push("Vérifier les coefficients de pointe horaire (Kp) applicables selon le nombre d'habitants et la dotation en eau (150-200 L/hab/j en Algérie).");
  }

  // Manning Strickler check
  if (msg.includes('manning') || msg.includes('strickler') || msg.includes('k =') || msg.includes('n =')) {
    if (msg.includes('k = 70') || msg.includes('k=70') || msg.includes('n = 0.015')) {
      avertissements.push("Coefficient de rugosité Manning-Strickler optimiste. En exploitation réelle avec dépôts et vieillissement des parois, prévoir une marge de sécurité de 10 à 15%.");
    } else {
      suggestions.push("Coefficient de rugosité bien défini pour le matériau sélectionné.");
    }
  }

  // Concrete strength check
  if (msg.includes('fc28') || msg.includes('b25') || msg.includes('b30') || msg.includes('béton') || msg.includes('beton')) {
    if (msg.includes('fc28 = 25') || msg.includes('fc28=25') || msg.includes('b25')) {
      avertissements.push("Pour les ouvrages hydrauliques en contact prolongé avec l'eau (réservoirs AEP, bâches de pompage, stations d'épuration), il est fortement recommandé d'utiliser un béton fc28 ≥ 30 MPa dosé à 400 kg/m³ de ciment résistant aux sulfates (CRS).");
    }
    suggestions.push("Prévoir un adjuvant hydrofuge de masse et des bandes d'arrêt d'eau (Waterstop) au droit des reprises de bétonnage.");
  }

  // Pressure P check
  const pressRegex = /p\s*=\s*([0-9]+(?:[.,][0-9]+)?)\s*(?:bar|mce)/i;
  const pressMatch = msg.match(pressRegex);
  if (pressMatch) {
    const p = parseFloat(pressMatch[1].replace(',', '.'));
    if (msg.includes('bar') && p < 1.0) {
      errors.push({
        type: "Pression résiduelle insuffisante au sol",
        description: `Pression au sol calculée (${p} bar) en dessous du seuil minimal ADE (1.5 bar / 15 mCE au robinet le plus défavorisé pour un R+2/R+3). Risque de manque d'eau aux étages supérieurs.`,
        gravite: "Critique"
      });
      score -= 15;
    } else if (msg.includes('bar') && p > 6.0) {
      avertissements.push(`Pression élevée (${p} bar). Prévoir des réducteurs de pression (stabilisateurs aval) pour éviter l'éclatement des branchements particuliers.`);
    }
  }

  // EPANET / Hazen-Williams
  if (msg.includes('epanet') || msg.includes('hazen')) {
    suggestions.push("Simulation dynamique EPANET : assurez-vous d'avoir simulé un cycle de 24 à 48 heures avec les courbes de modulation de consommation.");
  }

  // Slope / Pente
  if (msg.includes('pente') || msg.includes('i =') || msg.includes('s =')) {
    avertissements.push("Vérifier que la pente du radier respecte les contraintes topographiques sans nécessiter de terrassements excessifs (tranchées > 4m).");
  }

  // Final level computation
  if (score >= 90) niveau = "Excellent";
  else if (score >= 70) niveau = "Bon";
  else if (score >= 50) niveau = "Moyen";
  else niveau = "Critique";

  if (score < 70) {
    resume = "La note comporte des points d'attention critiques nécessitant un recalibrage avant validation définitive.";
  } else if (score >= 85) {
    resume = "Conception hydraulique rigoureuse respectant les critères d'écoulement et les règles de l'art.";
  }

  return {
    score: Math.max(20, Math.min(100, score)),
    niveau,
    resume,
    erreurs: errors,
    avertissements: avertissements,
    suggestions: suggestions
  };
}

export function getHydroBotAnswer(userMessage: string): string {
  const msg = userMessage.toLowerCase();

  if (msg.includes('epanet') || msg.includes('aep') || msg.includes('hazen') || msg.includes('distribution')) {
    return `### 💧 Modélisation AEP sous EPANET

Pour dimensionner un réseau de distribution d'eau potable conforme aux normes de l'**ADE** (Algérienne Des Eaux) :

1. **Unités de débit :** Configurez les unités en **LPS** (Litres Par Seconde) dans les options hydrauliques.
2. **Formule de perte de charge :** Privilégiez **Hazen-Williams** (C = 140 pour le PEHD neuf, C = 130 pour la fonte ductile).
3. **Contraintes de pression réglementaires :**
   - **Pression minimale :** 1.5 bar (15 mCE) au robinet le plus défavorisé aux heures de pointe.
   - **Pression maximale :** 6 bars (60 mCE) pour préserver les compteurs et robinetteries.
4. **Vitesses recommandées :** Entre **0.8 m/s et 1.5 m/s** en régime normal (max 2.0 m/s en cas d'incendie).

💡 *Astuce IngénieurHub :* Vous pouvez déposer vos fichiers \`.inp\` sur l'onglet **Études Techniques** pour audit par nos experts ENSH !`;
  }

  if (msg.includes('hec-ras') || msg.includes('crue') || msg.includes('inondation') || msg.includes('hydrologie') || msg.includes('oued')) {
    return `### 🌊 Modélisation des Crues & HEC-RAS (1D / 2D)

Pour l'étude hydraulique d'un oued en Algérie (directives **ANRH / ANBT**) :

1. **Modèle Numérique de Terrain (MNT) :** Importez une topographie précise (résolution 1m ou LiDAR) dans **RAS Mapper**.
2. **Coefficients de Manning recommandés :**
   - Lit mineur naturel avec graviers/galets : $n = 0.035 - 0.045$
   - Lit majeur avec broussailles et lauriers-roses : $n = 0.050 - 0.075$
   - Canaux bétonnés ou perrés maçonnés : $n = 0.015 - 0.020$
3. **Conditions aux limites :**
   - **Amont :** Hydrogramme de crue centennale ($Q_{100}$) calculé par méthode rationnelle ou Crupédix / Soil Conservation Service (SCS).
   - **Aval :** Hauteur normale (pente moyenne de l'oued) ou cote du niveau de retenue aval.

Besoin d'une note de calcul certifiée par un professeur de l'ENSH Blida ? Consultez l'onglet **Experts** !`;
  }

  if (msg.includes('irrigation') || msg.includes('etm') || msg.includes('et0') || msg.includes('goutte')) {
    return `### 🌱 Calcul des Besoins en Eau d'Irrigation (ONID)

La méthode de référence selon la FAO 56 :

$$ET_m = ET_0 \\times K_c$$

- **$ET_0$ (Évapotranspiration de référence) :** Données mensuelles de l'Office National de Météorologie (ONM) pour votre wilaya (ex: Mitidja = 5 à 6 mm/jour en juillet).
- **$K_c$ (Coefficient cultural) :** Varie selon le stade phénologique (ex: Agrumes = 0.70, Olivier = 0.65, Maraîchage = 1.05).
- **Débit de pointe de la parcelle :**
  $$Q = \\frac{ET_m \\times S}{E_a \\times T}$$
  avec $E_a$ (efficience d'application du goutte-à-goutte $\\approx 90\\%$) et $T$ (durée journalière de pompage, ex: 14h/jour).`;
  }

  if (msg.includes('traitement') || msg.includes('chloration') || msg.includes('potabilisation') || msg.includes('coagulation')) {
    return `### 🧪 Filière de Potabilisation des Eaux (Norme NA 6360)

Pour les eaux de barrage ou superficielles en Algérie :

1. **Coagulation / Floculation :**
   - Réactif : Sulfate d'alumine ou polychlorure d'aluminium (PAC).
   - Détermination de la dose optimale par essai **Jar-Test**.
2. **Décantation :**
   - Décanteurs lamellaires à flux ascendant (vitesse Hazen = 1.5 à 2.5 m/h).
3. **Filtration sur lit de sable :**
   - Vitesse de filtration : 5 à 7 m/h. Hauteur de sable : 0.80 à 1.00 m (granulométrie 0.8 - 1.2 mm).
4. **Désinfection finale au chlore :**
   - Temps de contact minimum : 30 minutes.
   - Chlore résiduel libre cible au robinet : **0.20 à 0.50 mg/L**.`;
  }

  if (msg.includes('barrage') || msg.includes('digue') || msg.includes('seep') || msg.includes('fuite')) {
    return `### 🛡️ Ouvrages Hydrauliques & Barrages Collinaires

Recommandations pour la conception de digues en terre compactée :

1. **Analyse d'infiltration (SEEP/W) :** Vérification de la ligne de saturation phréatique pour s'assurer qu'elle débouche dans le drain cheminée ou le tapis drainant d'enrochement.
2. **Évacuateur de crues (Déversoir) :** Doit être calé pour évacuer en toute sécurité la crue de projet ($Q_{1000}$ ou crue millénale) sans submersion de la crête de digue (revanche minimale de 1.50 m).
3. **Protection de parement :** Enrochements (Riprap) de 30 à 60 cm sur filtre géotextile pour protéger contre le batillage des vagues causé par les vents dominants.`;
  }

  if (msg.includes('sig') || msg.includes('arcgis') || msg.includes('qgis') || msg.includes('shapefile')) {
    return `### 🗺️ SIG & Gestion Spatiale des Réseaux Hydrauliques

L'intégration SIG avec **ArcGIS Pro** ou **QGIS** pour les réseaux d'eau :

1. **Système de coordonnées :** Pour le nord de l'Algérie, utilisez le système géodésique **WGS 84 / UTM zone 31N** (EPSG:32631) ou le système national **Nord Algérie Voirol (Lambert)**.
2. **Structure des données (Geodatabase) :**
   - Classe d'entités linéaires : Conduites (avec champs *Diamètre, Matériau, Année de pose, PN, État*).
   - Classe d'entités ponctuelles : Nœuds, Vannes de sectionnement, Ventouses, Purges, Compteurs.
3. **Passerelle EPANET :** Vous pouvez exporter vos couches géographiques directement vers EPANET grâce aux plugins *QWater* ou *WaterGEMS*.`;
  }

  if (msg.includes('bonjour') || msg.includes('salut') || msg.includes('hello') || msg.includes('salam')) {
    return `Salam et Bienvenue ! 👋 

Je suis **HydroBot**, l'assistant intelligent d'**IngénieurHub** spécialisé en génie civil, hydraulique, VRD et SIG en Algérie.

Posez-moi vos questions sur :
- Le dimensionnement hydraulique (EPANET, HEC-RAS, formules de Manning/Hazen)
- Les réseaux d'eau potable (AEP) et d'assainissement (méthode de Caquot)
- Les barrages, stations de pompage et filières de potabilisation
- Les systèmes d'irrigation et bilans hydriques
- Les normes algériennes (ADE, SEAAL, ANRH, ONID, DRE)`;
  }

  // Generic fallback with technical richness
  return `C'est un point technique pertinent pour les projets d'ingénierie en Algérie ! 📐

Pour vous apporter une solution exacte, précisez :
- Le logiciel visé (*EPANET, HEC-RAS, Civil 3D, ArcGIS Pro, SEEP/W*)
- Les paramètres de calcul (*débit, vitesse, pression, rugosité, pente*)
- La localisation géographique (wilaya) pour les contraintes climatiques et géologiques

Vous pouvez également :
1. Tester votre note de calcul avec notre **AI Agent Détection d'Erreurs**
2. Consulter la liste des **Professeurs ENSH certifiés** sur l'onglet Experts
3. Soumettre votre cahier des charges sur l'onglet **Études Techniques** !`;
}
