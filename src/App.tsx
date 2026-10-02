import React from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { FloatingChatbot } from './components/FloatingChatbot';
import { AiErrorAgentModal } from './components/AiErrorAgentModal';
import { ToastContainer } from './components/ToastContainer';

// Pages
import { Accueil } from './pages/Accueil';
import { Experts } from './pages/Experts';
import { Travail } from './pages/Travail';
import { Fournisseurs } from './pages/Fournisseurs';
import { InnovationPage } from './pages/Innovation';
import { Formations } from './pages/Formations';
import { Etudes } from './pages/Etudes';
import { Recrutement } from './pages/Recrutement';
import { ChatbotPage } from './pages/ChatbotPage';
import { Connexion } from './pages/Connexion';
import { Dashboard } from './pages/Dashboard';

export const AppContent: React.FC = () => {
  const { currentPage } = useApp();

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'accueil':
        return <Accueil />;
      case 'experts':
        return <Experts />;
      case 'travail':
        return <Travail />;
      case 'fournisseurs':
        return <Fournisseurs />;
      case 'innovation':
        return <InnovationPage />;
      case 'formations':
        return <Formations />;
      case 'etudes':
        return <Etudes />;
      case 'recrutement':
        return <Recrutement />;
      case 'chatbot':
        return <ChatbotPage />;
      case 'connexion':
        return <Connexion />;
      case 'dashboard':
        return <Dashboard />;
      default:
        return <Accueil />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Navbar />
      <main className="flex-1">
        {renderCurrentPage()}
      </main>
      <Footer />
      <FloatingChatbot />
      <AiErrorAgentModal />
      <ToastContainer />
    </div>
  );
};
