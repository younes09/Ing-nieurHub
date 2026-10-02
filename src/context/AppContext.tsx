import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User, Expert, Project, ProjectCandidature, SupplierMaterial,
  Innovation, Formation, FormationInscription, JobOffer, JobCandidature,
  TechnicalStudy, PageRoute, UserType
} from '../types';
import {
  SEED_USERS, SEED_EXPERTS, SEED_PROJECTS, SEED_MATERIALS,
  SEED_INNOVATIONS, SEED_FORMATIONS, SEED_JOBS, SEED_STUDIES
} from '../data/seedData';

export interface ToastItem {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  currentUser: User | null;
  users: User[];
  experts: Expert[];
  projects: Project[];
  candidatures: ProjectCandidature[];
  materials: SupplierMaterial[];
  innovations: Innovation[];
  formations: Formation[];
  inscriptions: FormationInscription[];
  jobs: JobOffer[];
  jobCandidatures: JobCandidature[];
  studies: TechnicalStudy[];
  
  // Navigation
  currentPage: PageRoute;
  pageParams: Record<string, string>;
  navigateTo: (page: PageRoute, params?: Record<string, string>) => void;

  // Auth
  login: (email: string, password?: string) => { success: boolean; message: string };
  register: (nom: string, email: string, type: UserType) => { success: boolean; message: string };
  logout: () => void;
  switchUserRole: (type: UserType) => void;

  // Actions
  toggleExpertOnline: (expertId: number) => void;
  toggleExpertCertifie: (expertId: number) => void;
  toggleExpertDispo: (expertId: number) => void;
  updateExpertProfile: (expertId: number, data: Partial<Expert>) => void;
  
  addProject: (p: Omit<Project, 'id' | 'user_id' | 'candidats' | 'date'>) => void;
  applyToProject: (projectId: number, nom: string, email: string, exp: string, lettre: string) => void;
  
  addInnovation: (inn: Omit<Innovation, 'id' | 'note' | 'vues'>) => void;
  incrementInnovationVues: (id: number) => void;
  
  enrollFormation: (formationId: number, nom: string, email: string) => void;
  
  applyToJob: (offreId: number, nom: string, email: string, tel: string, msg: string) => void;
  
  submitTechnicalStudy: (study: Omit<TechnicalStudy, 'id' | 'user_id' | 'statut' | 'date'>) => void;
  
  resetDatabase: () => void;

  // Global Modals / Drawers
  aiModalOpen: boolean;
  openAiModal: () => void;
  closeAiModal: () => void;

  floatingChatOpen: boolean;
  setFloatingChatOpen: (open: boolean) => void;
  toggleFloatingChat: () => void;

  // Toasts
  toasts: ToastItem[];
  addToast: (title: string, message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_PREFIX = 'ingenieur_hub_v2_';

function getStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(STORAGE_PREFIX + key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setStorage<T>(key: string, val: T): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(val));
  } catch (err) {
    console.warn('Storage save failed:', err);
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation State
  const [currentPage, setCurrentPage] = useState<PageRoute>('accueil');
  const [pageParams, setPageParams] = useState<Record<string, string>>({});

  // DB State initialized with localStorage or fallback to SEED
  const [users, setUsers] = useState<User[]>(() => getStorage('users', SEED_USERS));
  const [currentUser, setCurrentUser] = useState<User | null>(() => getStorage('current_user', SEED_USERS[0]));
  const [experts, setExperts] = useState<Expert[]>(() => getStorage('experts', SEED_EXPERTS));
  const [projects, setProjects] = useState<Project[]>(() => getStorage('projects', SEED_PROJECTS));
  const [candidatures, setCandidatures] = useState<ProjectCandidature[]>(() => getStorage('candidatures', [
    { id: 1, problematique_id: 1, nom: 'Karim Boudiaf', email: 'karim@ingenieurhub.dz', exp: '8 ans en dimensionnement AEP', lettre: 'Disponible immédiatement pour modéliser le réseau sous EPANET.', created_at: '2025-04-14 10:30' },
    { id: 2, problematique_id: 1, nom: 'Amira Meziane', email: 'amira@ingenieurhub.dz', exp: '6 ans en VRD & AEP', lettre: 'Expérience confirmée sur les réseaux ADE de Boumerdès.', created_at: '2025-04-14 14:15' },
    { id: 3, problematique_id: 3, nom: 'Hamza Djaballah', email: 'hamza@ingenieurhub.dz', exp: '10 ans en modélisation HEC-RAS 2D', lettre: 'J\'ai déjà réalisé les études hydrologiques sur le bassin versant de la Chiffa.', created_at: '2025-04-12 11:00' }
  ]));
  const [materials] = useState<SupplierMaterial[]>(() => getStorage('materials', SEED_MATERIALS));
  const [innovations, setInnovations] = useState<Innovation[]>(() => getStorage('innovations', SEED_INNOVATIONS));
  const [formations] = useState<Formation[]>(() => getStorage('formations', SEED_FORMATIONS));
  const [inscriptions, setInscriptions] = useState<FormationInscription[]>(() => getStorage('inscriptions', [
    { id: 1, formation_id: 1, nom: 'Rania Meziane', email: 'student@ingenieurhub.dz', created_at: '2025-04-05' },
    { id: 2, formation_id: 5, nom: 'Rania Meziane', email: 'student@ingenieurhub.dz', created_at: '2025-04-08' }
  ]));
  const [jobs] = useState<JobOffer[]>(() => getStorage('jobs', SEED_JOBS));
  const [jobCandidatures, setJobCandidatures] = useState<JobCandidature[]>(() => getStorage('job_candidatures', [
    { id: 1, offre_id: 2, nom: 'Rania Meziane', email: 'student@ingenieurhub.dz', tel: '0550123456', msg: 'Étudiante en Master 2 Hydraulique Urbaine à l\'ENSH Blida, très motivée par un stage chez COSIDER.', created_at: '2025-04-02' }
  ]));
  const [studies, setStudies] = useState<TechnicalStudy[]>(() => getStorage('studies', SEED_STUDIES));

  // Modals & UI States
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [floatingChatOpen, setFloatingChatOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Sync to localStorage
  useEffect(() => setStorage('users', users), [users]);
  useEffect(() => setStorage('current_user', currentUser), [currentUser]);
  useEffect(() => setStorage('experts', experts), [experts]);
  useEffect(() => setStorage('projects', projects), [projects]);
  useEffect(() => setStorage('candidatures', candidatures), [candidatures]);
  useEffect(() => setStorage('innovations', innovations), [innovations]);
  useEffect(() => setStorage('inscriptions', inscriptions), [inscriptions]);
  useEffect(() => setStorage('job_candidatures', jobCandidatures), [jobCandidatures]);
  useEffect(() => setStorage('studies', studies), [studies]);

  // Toast Helper
  const addToast = (title: string, message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 4);
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Navigation
  const navigateTo = (page: PageRoute, params: Record<string, string> = {}) => {
    setCurrentPage(page);
    setPageParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Auth
  const login = (email: string) => {
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setCurrentUser(found);
      addToast('Connexion réussie', `Bienvenue ${found.nom} (${found.type}) !`, 'success');
      return { success: true, message: 'Connexion réussie' };
    }
    return { success: false, message: 'Utilisateur introuvable avec cet email.' };
  };

  const register = (nom: string, email: string, type: UserType) => {
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return { success: false, message: 'Un compte existe déjà avec cette adresse email.' };
    }
    const newUser: User = {
      id: Date.now(),
      nom,
      email,
      type,
      created_at: new Date().toISOString().split('T')[0]
    };
    setUsers(prev => [newUser, ...prev]);
    setCurrentUser(newUser);
    addToast('Compte créé !', `Bienvenue sur IngénieurHub, ${nom} !`, 'success');
    return { success: true, message: 'Compte créé avec succès' };
  };

  const logout = () => {
    setCurrentUser(null);
    addToast('Déconnexion', 'Vous avez été déconnecté.', 'info');
    navigateTo('accueil');
  };

  const switchUserRole = (type: UserType) => {
    const user = users.find(u => u.type === type);
    if (user) {
      setCurrentUser(user);
      addToast('Changement de profil', `Connecté en tant que : ${user.nom} (${user.type})`, 'info');
    }
  };

  // Expert Actions
  const toggleExpertOnline = (expertId: number) => {
    setExperts(prev => prev.map(e => e.id === expertId ? { ...e, online: !e.online } : e));
  };

  const toggleExpertCertifie = (expertId: number) => {
    setExperts(prev => prev.map(e => e.id === expertId ? { ...e, certifie: !e.certifie } : e));
    addToast('Statut mis à jour', 'Certification de l\'expert modifiée.', 'success');
  };

  const toggleExpertDispo = (expertId: number) => {
    setExperts(prev => prev.map(e => e.id === expertId ? { ...e, dispo: !e.dispo } : e));
  };

  const updateExpertProfile = (expertId: number, data: Partial<Expert>) => {
    setExperts(prev => prev.map(e => e.id === expertId ? { ...e, ...data } : e));
    addToast('Profil mis à jour', 'Vos modifications ont été enregistrées avec succès.', 'success');
  };

  // Projects
  const addProject = (p: Omit<Project, 'id' | 'user_id' | 'candidats' | 'date'>) => {
    const newProject: Project = {
      ...p,
      id: Date.now(),
      user_id: currentUser ? currentUser.id : 1,
      candidats: 0,
      date: new Date().toLocaleDateString('fr-FR'),
      created_at: new Date().toISOString()
    };
    setProjects(prev => [newProject, ...prev]);
    addToast('Projet publié !', 'Votre appel d\'offres technique est maintenant visible par les experts.', 'success');
  };

  const applyToProject = (projectId: number, nom: string, email: string, exp: string, lettre: string) => {
    const newCand: ProjectCandidature = {
      id: Date.now(),
      problematique_id: projectId,
      nom,
      email,
      exp,
      lettre,
      created_at: new Date().toLocaleString('fr-FR')
    };
    setCandidatures(prev => [newCand, ...prev]);
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, candidats: p.candidats + 1 } : p));
    addToast('Candidature envoyée !', 'Le porteur du projet a bien reçu votre dossier technique.', 'success');
  };

  // Innovations
  const addInnovation = (inn: Omit<Innovation, 'id' | 'note' | 'vues'>) => {
    const newInn: Innovation = {
      ...inn,
      id: Date.now(),
      note: 5.0,
      vues: 1,
      created_at: new Date().toISOString()
    };
    setInnovations(prev => [newInn, ...prev]);
    addToast('Innovation soumise !', 'Votre solution IA/technique est désormais répertoriée.', 'success');
  };

  const incrementInnovationVues = (id: number) => {
    setInnovations(prev => prev.map(inn => inn.id === id ? { ...inn, vues: inn.vues + 1 } : inn));
  };

  // Formations
  const enrollFormation = (formationId: number, nom: string, email: string) => {
    const newInsc: FormationInscription = {
      id: Date.now(),
      formation_id: formationId,
      nom,
      email,
      created_at: new Date().toLocaleDateString('fr-FR')
    };
    setInscriptions(prev => [newInsc, ...prev]);
    addToast('Inscription validée !', 'Votre accès aux modules et supports de formation est actif.', 'success');
  };

  // Jobs
  const applyToJob = (offreId: number, nom: string, email: string, tel: string, msg: string) => {
    const newCand: JobCandidature = {
      id: Date.now(),
      offre_id: offreId,
      nom,
      email,
      tel,
      msg,
      created_at: new Date().toLocaleDateString('fr-FR')
    };
    setJobCandidatures(prev => [newCand, ...prev]);
    addToast('Candidature transmise', 'L\'entreprise a bien reçu votre CV et lettre de motivation.', 'success');
  };

  // Studies
  const submitTechnicalStudy = (study: Omit<TechnicalStudy, 'id' | 'user_id' | 'statut' | 'date'>) => {
    const newStudy: TechnicalStudy = {
      ...study,
      id: Date.now(),
      user_id: currentUser ? currentUser.id : 1,
      statut: 'Reçue',
      date: new Date().toLocaleDateString('fr-FR'),
      created_at: new Date().toISOString()
    };
    setStudies(prev => [newStudy, ...prev]);
    addToast('Étude reçue !', 'Votre dossier technique a été pris en charge par notre bureau d\'études partenaire.', 'success');
  };

  // Reset to seed data
  const resetDatabase = () => {
    setUsers(SEED_USERS);
    setCurrentUser(SEED_USERS[0]);
    setExperts(SEED_EXPERTS);
    setProjects(SEED_PROJECTS);
    setCandidatures([]);
    setInnovations(SEED_INNOVATIONS);
    setInscriptions([]);
    setJobCandidatures([]);
    setStudies(SEED_STUDIES);
    addToast('Données réinitialisées', 'La base de démonstration a été restaurée à son état d\'origine.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        experts,
        projects,
        candidatures,
        materials,
        innovations,
        formations,
        inscriptions,
        jobs,
        jobCandidatures,
        studies,
        
        currentPage,
        pageParams,
        navigateTo,

        login,
        register,
        logout,
        switchUserRole,

        toggleExpertOnline,
        toggleExpertCertifie,
        toggleExpertDispo,
        updateExpertProfile,

        addProject,
        applyToProject,

        addInnovation,
        incrementInnovationVues,

        enrollFormation,
        applyToJob,
        submitTechnicalStudy,

        resetDatabase,

        aiModalOpen,
        openAiModal: () => setAiModalOpen(true),
        closeAiModal: () => setAiModalOpen(false),

        floatingChatOpen,
        setFloatingChatOpen,
        toggleFloatingChat: () => setFloatingChatOpen(prev => !prev),

        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
