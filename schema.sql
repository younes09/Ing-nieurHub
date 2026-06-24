-- Database creation query
CREATE DATABASE IF NOT EXISTS `ingenieur_hub` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `ingenieur_hub`;

-- Drop tables in reverse order of foreign key dependencies
DROP TABLE IF EXISTS `recrutement_candidatures`;
DROP TABLE IF EXISTS `recrutement_offres`;
DROP TABLE IF EXISTS `formations_inscriptions`;
DROP TABLE IF EXISTS `formations`;
DROP TABLE IF EXISTS `innovations`;
DROP TABLE IF EXISTS `fournisseurs_materiaux`;
DROP TABLE IF EXISTS `candidatures_projets`;
DROP TABLE IF EXISTS `etudes_techniques`;
DROP TABLE IF EXISTS `problematiques`;
DROP TABLE IF EXISTS `experts`;
DROP TABLE IF EXISTS `users`;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS `users` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `nom` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `type` ENUM('Client', 'Expert', 'Bureau', 'Étudiant', 'Admin') NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed default users for testing
INSERT INTO `users` (`id`, `nom`, `email`, `password`, `type`) VALUES
(1, 'Test User', 'test@ingenieurhub.dz', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Client'),
(2, 'Karim Boudiaf', 'karim@ingenieurhub.dz', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Expert'),
(3, 'Saci Bureau', 'bureau@ingenieurhub.dz', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Bureau'),
(4, 'Rania Meziane', 'student@ingenieurhub.dz', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Étudiant'),
(5, 'Hub Admin', 'admin@ingenieurhub.dz', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin');

-- 2. Experts Table
CREATE TABLE IF NOT EXISTS `experts` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `nom` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NULL UNIQUE,
    `spec` VARCHAR(255) NOT NULL,
    `wilaya` VARCHAR(50) NOT NULL,
    `note` DECIMAL(2,1) NOT NULL,
    `avis` INT NOT NULL DEFAULT 0,
    `prix` INT NOT NULL,
    `dispo` TINYINT(1) NOT NULL DEFAULT 1,
    `online` TINYINT(1) NOT NULL DEFAULT 0,
    `certifie` TINYINT(1) NOT NULL DEFAULT 1,
    `img` VARCHAR(5) NOT NULL, -- Initials
    `ensh` TINYINT(1) NOT NULL DEFAULT 0,
    `grade` VARCHAR(100) NOT NULL,
    `domaines` VARCHAR(255) NOT NULL, -- Comma-separated domains
    `projets` INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `experts` (`id`, `nom`, `email`, `spec`, `wilaya`, `note`, `avis`, `prix`, `dispo`, `online`, `certifie`, `img`, `ensh`, `grade`, `domaines`, `projets`) VALUES
(1, 'Pr. Ammari Abdelhadi', 'ammari@ingenieurhub.dz', 'Hydraulique / Mécanique des fluides', 'Blida', 5.0, 210, 6000, 1, 1, 1, 'AA', 1, 'Professeur — ENSH Blida', 'Hydraulique,GC', 8),
(2, 'Dr. Bouanani Abderrahmane', 'bouanani@ingenieurhub.dz', 'Hydrologie / Ressources en eau', 'Blida', 4.9, 185, 5500, 1, 0, 1, 'BA', 1, 'MCF A — ENSH Blida', 'Hydraulique', 5),
(3, 'Dr. Meddi Mohamed', 'meddi@ingenieurhub.dz', 'Climatologie / SIG & Hydrologie', 'Blida', 4.9, 163, 5500, 0, 1, 1, 'MM', 1, 'Professeur — ENSH Blida', 'SIG,Hydraulique', 11),
(4, 'Dr. Remini Boualem', 'remini@ingenieurhub.dz', 'Irrigation / Gestion des barrages', 'Blida', 4.8, 142, 5000, 1, 1, 1, 'RB', 1, 'Professeur — ENSH Blida', 'Irrigation,Hydraulique', 9),
(5, 'Dr. Bouziane Ahmed', 'bouziane@ingenieurhub.dz', 'AEP / Assainissement / VRD', 'Blida', 4.8, 130, 5000, 1, 0, 1, 'BZ', 1, 'MCF A — ENSH Blida', 'AEP,Assainissement', 7),
(6, 'M. Mihoubie M.K.', 'mihoubi@ingenieurhub.dz', 'Ouvrages hydrauliques / Barrages / Digues', 'Blida', 4.9, 98, 5500, 1, 1, 1, 'MK', 1, 'Enseignant — ENSH Blida', 'Ouvrages hydrauliques,GC', 6),
(7, 'M. Hachmie', 'hachmi@ingenieurhub.dz', 'Traitement des eaux / Potabilisation', 'Blida', 4.8, 87, 5000, 1, 0, 1, 'HA', 1, 'Enseignant — ENSH Blida', 'Traitement des eaux,AEP', 4),
(8, 'Karim Boudiaf', 'karim@ingenieurhub.dz', 'Hydraulique / AEP', 'Blida', 4.9, 87, 3500, 1, 1, 1, 'KB', 0, 'Ingénieur Hydraulicien', 'AEP,Hydraulique', 12),
(9, 'Amira Meziane', 'amira@ingenieurhub.dz', 'VRD / Assainissement', 'Alger', 4.8, 124, 4500, 1, 0, 1, 'AM', 0, 'Ingénieure VRD', 'VRD,Assainissement', 9),
(10, 'Youcef Aït Ouméziane', 'youcef@ingenieurhub.dz', 'Topographie / SIG / ArcGIS', 'Tizi-Ouzou', 4.7, 63, 2500, 0, 1, 1, 'YA', 0, 'Ingénieur Topographe', 'SIG,Topographie', 6),
(11, 'Sofiane Chabane', 'sofiane@ingenieurhub.dz', 'Irrigation / Hydraulique agricole', 'Constantine', 4.8, 92, 3000, 1, 0, 1, 'SC', 0, 'Ingénieur Irrigation', 'Irrigation', 8),
(12, 'Hamza Djaballah', 'hamza@ingenieurhub.dz', 'HEC-RAS / Hydrologie', 'Blida', 4.9, 110, 4000, 1, 1, 1, 'HD', 0, 'Expert HEC-RAS', 'Hydraulique', 15);

-- 3. Problématiques Table (Appels à projets)
CREATE TABLE IF NOT EXISTS `problematiques` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NULL,
    `titre` VARCHAR(255) NOT NULL,
    `entreprise` VARCHAR(150) NOT NULL,
    `secteur` ENUM('Étatique', 'Privé', 'International') NOT NULL,
    `wilaya` VARCHAR(50) NOT NULL,
    `budget` VARCHAR(50) NOT NULL,
    `delai` VARCHAR(50) NOT NULL,
    `domaine` VARCHAR(100) NOT NULL,
    `urgent` TINYINT(1) NOT NULL DEFAULT 0,
    `candidats` INT NOT NULL DEFAULT 0,
    `desc` TEXT NOT NULL,
    `date` VARCHAR(15) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `problematiques` (`id`, `user_id`, `titre`, `entreprise`, `secteur`, `wilaya`, `budget`, `delai`, `domaine`, `urgent`, `candidats`, `desc`, `date`) VALUES
(1, 1, 'Étude AEP réseau Boumerdès Nord', 'ADE — Agence Nationale', 'Étatique', 'Boumerdès', '450 000 DA', '30 jours', 'AEP', 1, 4, 'Dimensionnement complet d\'un réseau de distribution AEP pour 3 000 abonnés. Logiciel : EPANET. Livraison : rapport + plans AutoCAD.', '14/04/2025'),
(2, 1, 'Diagnostic réseau assainissement — Alger Centre', 'SEAAL', 'Étatique', 'Alger', '620 000 DA', '45 jours', 'Assainissement', 0, 7, 'Diagnostic et proposition de réhabilitation du réseau unitaire — méthode Caquot, plans de recollement.', '10/04/2025'),
(3, 1, 'Modélisation hydraulique oued Chiffa', 'ANRH', 'Étatique', 'Blida', '380 000 DA', '21 jours', 'Hydraulique', 1, 2, 'Modélisation HEC-RAS 2D du comportement en crue pour dimensionner les protections de berges.', '12/04/2025'),
(4, 1, 'Plan d\'irrigation périmètre Mitidja', 'ONID', 'Étatique', 'Blida', '520 000 DA', '60 jours', 'Irrigation', 0, 5, 'Calcul des besoins en eau (ETM/ETP/Kc), dimensionnement réseau goutte-à-goutte, bilan hydrique annuel.', '08/04/2025'),
(5, 1, 'Carte SIG réseau AEP Constantine', 'ADE Constantine', 'Étatique', 'Constantine', '290 000 DA', '15 jours', 'SIG', 1, 3, 'Numérisation et cartographie SIG (ArcGIS Pro) du réseau AEP existant, attributs et topologie.', '15/04/2025'),
(6, 1, 'Étude traitement eau — station Baraki', 'Seor SPA', 'Privé', 'Alger', '700 000 DA', '50 jours', 'Traitement des eaux', 0, 1, 'Audit et dimensionnement filière de traitement eau de surface : coagulation, floculation, filtration, chloration.', '11/04/2025'),
(7, 1, 'VRD lotissement Oran Est', 'AADL Oran', 'Étatique', 'Oran', '480 000 DA', '35 jours', 'VRD', 0, 6, 'Étude VRD complète (voirie, AEP, assainissement, éclairage) pour 200 logements. Profils en long/travers.', '09/04/2025'),
(8, 1, 'Étude barrage collinaire — Tizi-Ouzou', 'ANBT', 'Étatique', 'Tizi-Ouzou', '850 000 DA', '90 jours', 'Ouvrages hydrauliques', 0, 2, 'Avant-projet sommaire : hydrogramme de crue, dimensionnement digue, évacuateur de crues, note de calcul SEEP/W.', '07/04/2025');

-- 4. Candidatures Projets Table (Experts applying to client projects)
CREATE TABLE IF NOT EXISTS `candidatures_projets` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `problematique_id` INT NOT NULL,
    `nom` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `exp` VARCHAR(50) NOT NULL,
    `lettre` TEXT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`problematique_id`) REFERENCES `problematiques`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Fournisseurs Matériaux Table
CREATE TABLE IF NOT EXISTS `fournisseurs_materiaux` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `nom` VARCHAR(150) NOT NULL,
    `categorie` VARCHAR(100) NOT NULL,
    `fournisseur` VARCHAR(100) NOT NULL,
    `wilaya` VARCHAR(50) NOT NULL,
    `prix` INT NOT NULL,
    `unite` VARCHAR(20) NOT NULL,
    `stock` VARCHAR(50) NOT NULL,
    `offre` VARCHAR(255) NULL,
    `ref` VARCHAR(50) NOT NULL,
    `norm` VARCHAR(50) NOT NULL,
    `img` VARCHAR(10) NOT NULL -- Emoji used as icon
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `fournisseurs_materiaux` (`id`, `nom`, `categorie`, `fournisseur`, `wilaya`, `prix`, `unite`, `stock`, `offre`, `ref`, `norm`, `img`) VALUES
(1, 'TUYAUX PEHD PN10 DN110', 'Tuyauterie', 'AlgéPipe Matériaux', 'Blida', 1850, 'ml', 'En stock', 'Remise 10% ≥ 500ml', 'PEHD-PN10-110', 'ISO 4427', '🔵'),
(2, 'TUYAUX PEHD PN16 DN63', 'Tuyauterie', 'AlgéPipe Matériaux', 'Blida', 980, 'ml', 'En stock', NULL, 'PEHD-PN16-63', 'ISO 4427', '🔵'),
(3, 'Vanne papillon DN200 PN10', 'Vannes & Robinetterie', 'HydroFit Algérie', 'Alger', 42000, 'unité', 'En stock', 'Livraison gratuite Alger', 'VP-200-PN10', 'EN 593', '🔧'),
(4, 'Compteur eau volumétrique DN50', 'Comptage & Mesure', 'AquaMesure DZ', 'Alger', 18500, 'unité', 'Délai 7j', NULL, 'CM-VOL-50', 'ISO 4064', '📊'),
(5, 'Pompe centrifuge 7.5 kW Q=25m³/h', 'Pompes', 'PumpTech Oran', 'Oran', 185000, 'unité', 'En stock', 'Garantie 2 ans', 'PC-75-25', 'ISO 9906', '⚙️'),
(6, 'Regard béton préfabriqué 1x1m', 'Ouvrages préfabriqués', 'BétonPro Constantine', 'Constantine', 12800, 'unité', 'En stock', 'Remise 5% ≥ 20 unités', 'RB-1000-1000', 'NF EN 1917', '⬛'),
(7, 'Géomembrane HDPE 1mm', 'Étanchéité', 'SeaFlex Algérie', 'Alger', 480, 'm²', 'En stock', 'Remise 8% ≥ 500m²', 'GEO-HDPE-1', 'ASTM D7176', '🟫'),
(8, 'Chlore granulé 70% — sac 25kg', 'Traitement des eaux', 'ChemWater DZ', 'Blida', 8500, 'sac', 'En stock', NULL, 'CHL-GR-70-25', 'NF EN 901', '🧪'),
(9, 'Tube acier galvanisé DN100 PN16', 'Tuyauterie', 'SteelPipe Annaba', 'Annaba', 2200, 'ml', 'Délai 14j', NULL, 'TAG-100-PN16', 'EN 10255', '⚫'),
(10, 'Filtre à sable pressurisé ø1200', 'Traitement des eaux', 'AquaPur Pro', 'Alger', 320000, 'unité', 'Délai 21j', 'Installation incluse', 'FSP-1200', 'EN 60335', '🔘'),
(11, 'Grille avaloir fonte DN315', 'Assainissement', 'FonCast Algérie', 'Oran', 4200, 'unité', 'En stock', 'Remise 12% ≥ 50 unités', 'GAF-315', 'EN 124', '🟤'),
(12, 'Coude PEHD 90° DN110 PN10', 'Accessoires', 'AlgéPipe Matériaux', 'Blida', 3600, 'unité', 'En stock', NULL, 'CPE-90-110', 'ISO 4427', '↩️');

-- 6. Innovations Table
CREATE TABLE IF NOT EXISTS `innovations` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `titre` VARCHAR(255) NOT NULL,
    `auteur` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NULL,
    `type` VARCHAR(100) NOT NULL,
    `univ` VARCHAR(150) NOT NULL,
    `domaine` VARCHAR(100) NOT NULL,
    `prix` VARCHAR(50) NOT NULL,
    `tags` VARCHAR(255) NOT NULL, -- Comma-separated tags
    `desc` TEXT NOT NULL,
    `note` DECIMAL(2,1) NOT NULL,
    `vues` INT NOT NULL DEFAULT 0,
    `statut` VARCHAR(50) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `innovations` (`id`, `titre`, `auteur`, `email`, `type`, `univ`, `domaine`, `prix`, `tags`, `desc`, `note`, `vues`, `statut`) VALUES
(1, 'AquaPredict — IA de prédiction de ruptures AEP', 'Meziane Rania', 'student@ingenieurhub.dz', 'Agent IA', 'ENSH Blida', 'Hydraulique', 'Incubation', 'ML,Python,EPANET', 'Agent IA basé sur le ML pour prédire les zones de rupture dans les réseaux AEP avant qu\'elles ne surviennent. Dataset : 10 000 incidents réels ONA/ADE.', 4.8, 234, 'Cherche incubateur'),
(2, 'IrriBot — Chatbot d\'aide à l\'irrigation intelligente', 'Chabane Yacine', 'yacine@ingenieurhub.dz', 'Agent IA', 'ENSA Alger', 'Irrigation', '85 000 DA', 'NLP,API,Python', 'Assistant conversationnel qui calcule automatiquement les besoins en eau des cultures selon le climat et la wilaya. Intégré aux données météo DZA.', 4.6, 189, 'À vendre'),
(3, 'SIG-Auto — Génération automatique de cartes AEP', 'Aït Slimane Hamza', 'hamza.ait@ingenieurhub.dz', 'Outil SIG', 'USTHB', 'SIG', '120 000 DA', 'ArcGIS,Python,Automatisation', 'Script Python/ArcPy qui automatise la création de cartes de réseaux AEP à partir des données de terrain (CSV, shapefile).', 4.7, 312, 'À vendre'),
(4, 'HydroCheck — Vérification auto de notes de calcul', 'Boumediene Sara', 'sara@ingenieurhub.dz', 'Application Web', 'ENSH Blida', 'Hydraulique', 'Incubation', 'React,Claude AI,Vérification', 'Application web qui vérifie automatiquement les notes de calcul hydraulique (Manning, Bernoulli, EPANET) et détecte les erreurs de dimensionnement.', 4.9, 421, 'Cherche incubateur'),
(5, 'BarrageViewer — Surveillance en temps réel', 'Djaballah Nassim', 'nassim@ingenieurhub.dz', 'Dashboard IoT', 'ENP Alger', 'Ouvrages hydrauliques', '200 000 DA', 'IoT,Dashboard,Alertes', 'Dashboard de surveillance des barrages connecté aux capteurs de niveau. Alertes automatiques SMS/email en cas de dépassement de seuil critique.', 4.7, 267, 'À vendre'),
(6, 'TraitEau IA — Optimisation filière traitement', 'Khelil Amira', 'amira.khelil@ingenieurhub.dz', 'Agent IA', 'ENSH Blida', 'Traitement des eaux', 'Incubation', 'IA,Optimisation,Chimie', 'Agent IA qui optimise les dosages de réactifs (coagulant, chlore) en temps réel selon la turbidité mesurée. Économies estimées : 25% des réactifs.', 4.8, 198, 'Cherche incubateur');

-- 7. Formations Table
CREATE TABLE IF NOT EXISTS `formations` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `titre` VARCHAR(255) NOT NULL,
    `domaine` VARCHAR(100) NOT NULL,
    `duree` VARCHAR(20) NOT NULL,
    `niveau` VARCHAR(50) NOT NULL,
    `prix` INT NOT NULL,
    `cert` TINYINT(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `formations` (`id`, `titre`, `domaine`, `duree`, `niveau`, `prix`, `cert`) VALUES
(1, 'EPANET pour réseaux AEP', 'AEP', '12h', 'Débutant', 2500, 1),
(2, 'HEC-RAS — Modélisation hydraulique', 'Hydraulique', '20h', 'Avancé', 4500, 1),
(3, 'Civil 3D — Conception VRD', 'VRD', '30h', 'Intermédiaire', 5000, 1),
(4, 'Irrigation — ETM/ETP/Kc calculs complets', 'Irrigation', '10h', 'Débutant', 2000, 1),
(5, 'ArcGIS Pro — SIG hydraulique', 'SIG', '20h', 'Intermédiaire', 4000, 1),
(6, 'Traitement des eaux — coagulation-chloration', 'Traitement', '14h', 'Intermédiaire', 3500, 1),
(7, 'Ouvrages hydrauliques — barrages & digues', 'Ouvrages', '18h', 'Avancé', 4800, 1),
(8, 'SEEP/W — analyse de filtration', 'Ouvrages', '10h', 'Avancé', 3800, 1);

-- 8. Formations Inscriptions Table
CREATE TABLE IF NOT EXISTS `formations_inscriptions` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `formation_id` INT NOT NULL,
    `nom` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`formation_id`) REFERENCES `formations`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9. Recrutement Offres Table
CREATE TABLE IF NOT EXISTS `recrutement_offres` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `titre` VARCHAR(255) NOT NULL,
    `entreprise` VARCHAR(150) NOT NULL,
    `type` VARCHAR(50) NOT NULL,
    `wilaya` VARCHAR(50) NOT NULL,
    `domaine` VARCHAR(100) NOT NULL,
    `desc` TEXT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `recrutement_offres` (`id`, `titre`, `entreprise`, `type`, `wilaya`, `domaine`, `desc`) VALUES
(1, 'Ingénieur Hydraulicien', 'ADE Blida', 'CDI', 'Blida', 'Hydraulique', 'Supervision réseaux AEP et assainissement'),
(2, 'Stage Génie Civil', 'COSIDER Alger', 'Stage', 'Alger', 'GC', 'Bureau d\'études, suivi de chantier'),
(3, 'Topographe junior / SIG', 'SONATOPO', 'CDD', 'Oran', 'Topographie', 'Levés topographiques, plans, ArcGIS'),
(4, 'Ingénieur Traitement des eaux', 'Seor SPA', 'CDI', 'Alger', 'Traitement', 'Station de potabilisation, audit qualité eau'),
(5, 'Stage Irrigation / ONID', 'ONID', 'Stage', 'Tizi-Ouzou', 'Irrigation', 'Calcul besoins irrigation, suivi terrain');

-- 10. Recrutement Candidatures Table
CREATE TABLE IF NOT EXISTS `recrutement_candidatures` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `offre_id` INT NOT NULL,
    `nom` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `tel` VARCHAR(20) NOT NULL,
    `msg` TEXT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`offre_id`) REFERENCES `recrutement_offres`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 11. Études Techniques Table
CREATE TABLE IF NOT EXISTS `etudes_techniques` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NULL,
    `titre` VARCHAR(255) NOT NULL,
    `type` VARCHAR(100) NOT NULL,
    `logiciel` VARCHAR(100) NOT NULL,
    `wilaya` VARCHAR(50) NOT NULL,
    `desc` TEXT NOT NULL,
    `statut` VARCHAR(50) NOT NULL DEFAULT 'Reçue',
    `date` VARCHAR(15) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `etudes_techniques` (`id`, `user_id`, `titre`, `type`, `logiciel`, `wilaya`, `desc`, `statut`, `date`) VALUES
(1, 1, 'Réseau AEP Commune de Meftah', 'AEP', 'EPANET', 'Blida', 'Réseau de distribution principal', 'En cours', '10/04/2025'),
(2, 1, 'Carte SIG réseau hydraulique Blida', 'SIG / ArcGIS', 'ArcGIS Pro', 'Blida', 'Cartographie des vannes et conduites', 'Reçue', '15/04/2025'),
(3, 1, 'Barrage collinaire — étude SEEP/W', 'Ouvrages hydrauliques', 'SEEP/W', 'Blida', 'Analyse de filtration digue', 'Livrée', '01/04/2025');
