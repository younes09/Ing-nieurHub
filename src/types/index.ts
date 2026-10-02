export type UserType = 'Client' | 'Expert' | 'Bureau' | 'Étudiant' | 'Admin';

export interface User {
  id: number;
  nom: string;
  email: string;
  type: UserType;
  created_at?: string;
}

export interface Expert {
  id: number;
  nom: string;
  email: string;
  spec: string;
  wilaya: string;
  note: number;
  avis: number;
  prix: number;
  dispo: boolean;
  online: boolean;
  certifie: boolean;
  img: string; // Initials or avatar symbol
  ensh: boolean;
  grade: string;
  domaines: string; // comma-separated e.g. "Hydraulique,GC"
  projets: number;
}

export interface Project {
  id: number;
  user_id: number;
  titre: string;
  entreprise: string;
  secteur: 'Étatique' | 'Privé' | 'International';
  wilaya: string;
  budget: string;
  delai: string;
  domaine: string;
  urgent: boolean;
  candidats: number;
  desc: string;
  date: string;
  created_at?: string;
}

export interface ProjectCandidature {
  id: number;
  problematique_id: number;
  nom: string;
  email: string;
  exp: string;
  lettre: string;
  created_at: string;
}

export interface SupplierMaterial {
  id: number;
  nom: string;
  categorie: string;
  fournisseur: string;
  wilaya: string;
  prix: number;
  unite: string;
  stock: string;
  offre?: string;
  ref: string;
  norm: string;
  img: string; // Emoji or icon identifier
}

export interface Innovation {
  id: number;
  titre: string;
  auteur: string;
  email: string;
  type: string; // 'Agent IA' | 'Outil SIG' | 'Application Web' | 'Dashboard IoT'
  univ: string;
  domaine: string;
  prix: string;
  tags: string;
  desc: string;
  note: number;
  vues: number;
  statut: 'Cherche incubateur' | 'À vendre';
  created_at?: string;
}

export interface Formation {
  id: number;
  titre: string;
  domaine: string;
  duree: string;
  niveau: 'Débutant' | 'Intermédiaire' | 'Avancé';
  prix: number;
  cert: boolean;
}

export interface FormationInscription {
  id: number;
  formation_id: number;
  nom: string;
  email: string;
  created_at: string;
}

export interface JobOffer {
  id: number;
  titre: string;
  entreprise: string;
  type: 'CDI' | 'CDD' | 'Stage';
  wilaya: string;
  domaine: string;
  desc: string;
  created_at?: string;
}

export interface JobCandidature {
  id: number;
  offre_id: number;
  nom: string;
  email: string;
  tel: string;
  msg: string;
  created_at: string;
}

export interface TechnicalStudy {
  id: number;
  user_id: number;
  titre: string;
  type: string;
  logiciel: string;
  wilaya: string;
  desc: string;
  statut: 'Reçue' | 'En cours' | 'Livrée';
  date: string;
  fichier?: string;
  created_at?: string;
}

export interface AiCalculationError {
  type: string;
  description: string;
  gravite: 'Critique' | 'Moyenne' | 'Faible';
}

export interface AiAnalysisResult {
  score: number;
  niveau: 'Excellent' | 'Bon' | 'Moyen' | 'Critique';
  resume: string;
  erreurs: AiCalculationError[];
  avertissements: string[];
  suggestions: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export type PageRoute = 
  | 'accueil' 
  | 'experts' 
  | 'travail' 
  | 'fournisseurs' 
  | 'innovation' 
  | 'formations' 
  | 'etudes' 
  | 'recrutement' 
  | 'chatbot' 
  | 'connexion' 
  | 'dashboard';
