<?php
session_start();
require_once __DIR__ . '/db.php';

// Route selection
$page = isset($_GET['page']) ? $_GET['page'] : 'accueil';
$valid_pages = [
    'accueil', 'experts', 'travail', 'fournisseurs', 
    'innovation', 'formations', 'etudes', 'recrutement', 
    'chatbot', 'connexion', 'dashboard'
];

if (!in_index_array($page, $valid_pages)) {
    $page = 'accueil';
}

function in_index_array($needle, $haystack) {
    return in_array($needle, $haystack);
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>IngénieurHub — Plateforme Génie Civil & Hydraulique Algérie</title>
    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- FontAwesome Icons -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" rel="stylesheet">
    <!-- Google Fonts: Inter -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <!-- Custom Style System -->
    <link href="css/style.css" rel="stylesheet">
</head>
<body>

    <!-- NAVBAR -->
    <nav class="navbar navbar-expand-lg sticky-top py-2" style="background: var(--primary);">
        <div class="container px-3">
            <a class="navbar-brand fw-extrabold fs-4 d-flex align-items-center text-decoration-none" href="index.php?page=accueil">
                <span style="color: #fff;">Ingénieur</span><span style="color: var(--accent);">Hub</span>
            </a>
            <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation" style="filter: invert(1);">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto align-items-center gap-1">
                    <li class="nav-item">
                        <button class="btn py-1 px-2 nav-btn <?php echo $page == 'accueil' ? 'nav-btn-active' : ''; ?>" onclick="navigateTo('accueil')">🏠 Accueil</button>
                    </li>
                    <li class="nav-item">
                        <button class="btn py-1 px-2 nav-btn <?php echo $page == 'experts' ? 'nav-btn-active' : ''; ?>" onclick="navigateTo('experts')">👷 Experts</button>
                    </li>
                    <li class="nav-item">
                        <button class="btn py-1 px-2 nav-btn <?php echo $page == 'travail' ? 'nav-btn-active' : ''; ?>" onclick="navigateTo('travail')">💼 Travail</button>
                    </li>
                    <li class="nav-item">
                        <button class="btn py-1 px-2 nav-btn <?php echo $page == 'fournisseurs' ? 'nav-btn-active' : ''; ?>" onclick="navigateTo('fournisseurs')">🏪 Fournisseurs</button>
                    </li>
                    <li class="nav-item">
                        <button class="btn py-1 px-2 nav-btn <?php echo $page == 'innovation' ? 'nav-btn-active' : ''; ?>" onclick="navigateTo('innovation')">🚀 Innovation</button>
                    </li>
                    <li class="nav-item">
                        <button class="btn py-1 px-2 nav-btn <?php echo $page == 'formations' ? 'nav-btn-active' : ''; ?>" onclick="navigateTo('formations')">🎓 Formations</button>
                    </li>
                    <li class="nav-item">
                        <button class="btn py-1 px-2 nav-btn <?php echo $page == 'etudes' ? 'nav-btn-active' : ''; ?>" onclick="navigateTo('etudes')">📐 Études</button>
                    </li>
                    <li class="nav-item">
                        <button class="btn py-1 px-2 nav-btn <?php echo $page == 'recrutement' ? 'nav-btn-active' : ''; ?>" onclick="navigateTo('recrutement')">📋 Recrutement</button>
                    </li>
                    <li class="nav-item">
                        <button class="btn py-1 px-2 nav-btn <?php echo $page == 'chatbot' ? 'nav-btn-active' : ''; ?>" onclick="navigateTo('chatbot')">🤖 HydroBot</button>
                    </li>
                    <li class="nav-item ms-2">
                        <?php if (isset($_SESSION['user_id'])): ?>
                            <div class="dropdown">
                                <button class="btn btn-premium-accent btn-sm py-1 px-3 dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    👷 <?php echo htmlspecialchars($_SESSION['user_name']); ?>
                                </button>
                                <ul class="dropdown-menu dropdown-menu-end shadow border-0 mt-2">
                                    <li><span class="dropdown-item-text text-muted small">Rôle: <?php echo $_SESSION['user_type']; ?></span></li>
                                    <li><button class="dropdown-item fw-bold text-primary" onclick="navigateTo('dashboard')">📊 Mon Tableau de bord</button></li>
                                    <li><hr class="dropdown-divider"></li>
                                    <li><button class="dropdown-item text-danger" onclick="logoutUser()">Déconnexion</button></li>
                                </ul>
                            </div>
                        <?php else: ?>
                            <button class="btn btn-premium-accent btn-sm py-1 px-3" onclick="navigateTo('connexion')">Connexion</button>
                        <?php endif; ?>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <!-- MAIN APP WRAPPER -->
    <main id="app-main-content">
        <?php 
        // Require corresponding page view
        require_once __DIR__ . "/pages/{$page}.php"; 
        ?>
    </main>

    <!-- FOOTER -->
    <footer style="background: var(--primary); padding: 48px 24px 24px; margin-top: 60px;">
        <div class="container" style="max-width: 1100px;">
            <div class="row g-4">
                <div class="col-md-4">
                    <div class="fw-extrabold fs-4 mb-2" style="color: #fff;">Ingénieur<span style="color: var(--accent);">Hub</span></div>
                    <p class="small lh-base" style="color: rgba(255,255,255,0.65);">La marketplace algérienne du génie civil, hydraulique, VRD, SIG et innovation technologique.</p>
                    <div class="mt-3 small" style="color: var(--accent);">🏛️ Partenaire ENSH Blida</div>
                </div>
                <div class="col-md-2 col-6">
                    <div class="fw-bold mb-3 small" style="color: #fff;">Pages</div>
                    <ul class="list-unstyled small d-flex flex-column gap-2">
                        <li><a href="#" onclick="navigateTo('experts')" class="footer-link">Experts & Profs</a></li>
                        <li><a href="#" onclick="navigateTo('travail')" class="footer-link">Travail & Projets</a></li>
                        <li><a href="#" onclick="navigateTo('fournisseurs')" class="footer-link">Fournisseurs</a></li>
                        <li><a href="#" onclick="navigateTo('innovation')" class="footer-link">Innovation</a></li>
                        <li><a href="#" onclick="navigateTo('formations')" class="footer-link">Formations</a></li>
                        <li><a href="#" onclick="navigateTo('recrutement')" class="footer-link">Recrutement</a></li>
                    </ul>
                </div>
                <div class="col-md-3 col-6">
                    <div class="fw-bold mb-3 small" style="color: #fff;">Spécialités</div>
                    <ul class="list-unstyled small d-flex flex-column gap-2" style="color: rgba(255,255,255,0.65);">
                        <li>Hydraulique & AEP</li>
                        <li>Traitement des eaux</li>
                        <li>Ouvrages hydrauliques</li>
                        <li>SIG & ArcGIS</li>
                        <li>Irrigation</li>
                    </ul>
                </div>
                <div class="col-md-3">
                    <div class="fw-bold mb-3 small" style="color: #fff;">Contact</div>
                    <ul class="list-unstyled small d-flex flex-column gap-2" style="color: rgba(255,255,255,0.65);">
                        <li><i class="fa fa-envelope me-2"></i>contact@ingenieurhub.dz</li>
                        <li><i class="fa fa-map-marker-alt me-2"></i>Blida, Algérie</li>
                        <li><i class="fa fa-phone me-2"></i>+213 770 000 000</li>
                    </ul>
                </div>
            </div>
            <div class="text-center small mt-5 pt-3 border-top" style="border-color: rgba(255,255,255,0.08) !important; color: rgba(255,255,255,0.45);">
                © 2025 IngénieurHub — Tous droits réservés
            </div>
        </div>
    </footer>

    <!-- GLOBAL FLOATING CHATBOT WIDGET -->
    <div class="chatbot-widget">
        <!-- Floating Chatbox -->
        <div class="chatbot-box d-none" id="floating-chatbot">
            <div class="d-flex align-items-center gap-2 p-3 text-white" style="background: linear-gradient(135deg, var(--primary), var(--secondary)); border-top-left-radius: 19px; border-top-right-radius: 19px;">
                <div class="d-flex align-items-center justify-content-center bg-info rounded-circle fs-6" style="width: 32px; height: 32px;">🤖</div>
                <div class="flex-grow-1">
                    <div class="fw-bold fs-7">HydroBot</div>
                    <div class="small text-info-emphasis" style="font-size: 10px;">IngénieurHub AI</div>
                </div>
                <button class="btn btn-link text-white p-0" onclick="toggleFloatingChatbot()"><i class="fa fa-times"></i></button>
            </div>
            <div class="flex-grow-1 p-3 overflow-y-auto d-flex flex-column gap-2" id="floating-chat-messages" style="background: #f8fafc;">
                <div class="d-flex justify-content-start">
                    <div class="p-2 small rounded-3" style="max-width: 85%; background: var(--light); color: var(--primary);">
                        Bonjour ! Je suis <b>HydroBot</b> 🤖 — assistant IngénieurHub. Comment puis-je vous aider ?
                    </div>
                </div>
            </div>
            <div class="p-2 border-top d-flex gap-2 bg-white" style="border-bottom-left-radius: 19px; border-bottom-right-radius: 19px;">
                <input type="text" id="floating-chat-input" class="form-control form-control-sm border-light-subtle" placeholder="Question technique..." onkeydown="if(event.key==='Enter') sendFloatingChatMessage()">
                <button class="btn btn-premium btn-sm py-1 px-3" onclick="sendFloatingChatMessage()">➤</button>
            </div>
        </div>
        <!-- Trigger Button -->
        <button class="btn rounded-circle d-flex align-items-center justify-content-center text-white border-0 shadow-lg" onclick="toggleFloatingChatbot()" style="width: 52px; height: 52px; background: linear-gradient(135deg, var(--primary), var(--secondary)); font-size: 22px;">
            <span id="chatbot-trigger-icon">🤖</span>
        </button>
    </div>

    <!-- AI ERROR AGENT MODAL -->
    <div class="glass-modal d-none" id="ai-agent-modal">
        <div class="glass-modal-content" style="max-width: 660px;">
            <div class="p-3 text-white d-flex align-items-center justify-content-between" style="background: linear-gradient(135deg, var(--primary), #7c3aed); border-top-left-radius: 23px; border-top-right-radius: 23px;">
                <div>
                    <div class="fw-bold fs-6">🔍 AI Agent — Détection d'Erreurs</div>
                    <div class="small text-violet-200" style="font-size: 11px; color: #c4b5fd;">Analyse automatique de vos calculs techniques</div>
                </div>
                <button class="btn btn-link text-white p-0 fs-5" onclick="closeAiAgentModal()"><i class="fa fa-times"></i></button>
            </div>
            <div class="p-4">
                <textarea id="ai-agent-textarea" class="form-control mb-3" rows="6" placeholder="Collez vos calculs techniques ici (débits, diamètres, vitesses, pressions...)" style="font-family: monospace; font-size: 12px;"></textarea>
                <button class="btn btn-premium w-100 py-2 fs-6 text-white border-0 mb-3" onclick="runAiAgentAnalysis()" style="background: linear-gradient(135deg, var(--primary), #7c3aed);">
                    <span id="ai-agent-btn-text">🔍 Analyser avec l'IA</span>
                </button>

                <!-- Analysis Results Section -->
                <div id="ai-agent-results" class="d-none">
                    <div class="d-flex align-items-center gap-3 p-3 rounded-3 mb-3" style="background: #f8fafc; border: 1px solid var(--gray-200);">
                        <div class="rounded-circle border border-4 d-flex flex-column align-items-center justify-content-center" id="ai-score-ring" style="width: 68px; height: 68px;">
                            <div class="fw-extrabold fs-5 lh-1" id="ai-score-val">80</div>
                            <div class="text-muted" style="font-size: 8px;">/100</div>
                        </div>
                        <div>
                            <div class="fw-bold fs-6 text-dark" id="ai-resume-text">Diagnostic satisfaisant</div>
                            <span class="custom-badge" id="ai-level-badge">Bon</span>
                        </div>
                    </div>

                    <div id="ai-errors-container" class="mb-3">
                        <!-- Errors go here -->
                    </div>
                    <div id="ai-warnings-container" class="mb-3">
                        <!-- Warnings go here -->
                    </div>
                    <div id="ai-suggestions-container" class="mb-3">
                        <!-- Suggestions go here -->
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- jQuery & Bootstrap 5 JS -->
    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <!-- Custom Application JS -->
    <script src="js/app.js"></script>
</body>
</html>
