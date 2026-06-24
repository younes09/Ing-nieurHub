<?php
require_once __DIR__ . '/../db.php';

// Ensure session is active
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Redirect if not logged in
if (!isset($_SESSION['user_id'])) {
    ?>
    <div class="container py-5 px-3" style="max-width: 500px; margin: 50px auto;">
        <div class="bg-white rounded-4 p-5 shadow-sm border border-light-subtle text-center">
            <div class="fs-1 mb-3">🔒</div>
            <h2 class="fw-bold fs-4 mb-2" style="color: var(--primary);">Accès Limité</h2>
            <p class="text-muted small mb-4">Veuillez vous connecter à votre compte pour accéder à votre tableau de bord personnalisé.</p>
            <button class="btn btn-premium px-4 py-2 border-0" onclick="navigateTo('connexion')">Se connecter / S'inscrire</button>
        </div>
    </div>
    <?php
    return;
}

$db = getDB();
$userId = intval($_SESSION['user_id']);
$userName = $_SESSION['user_name'];
$userType = $_SESSION['user_type'];
$userEmail = isset($_SESSION['user_email']) ? $_SESSION['user_email'] : '';

// ---------------------------------------------------------
// DATA FETCHING BY ROLE
// ---------------------------------------------------------

if ($userType === 'Client') {
    // 1. Projects posted by client
    $stmt = $db->prepare("
        SELECT p.*, 
               (SELECT COUNT(*) FROM candidatures_projets c WHERE c.problematique_id = p.id) as candidates_count 
        FROM problematiques p 
        WHERE p.user_id = :user_id 
        ORDER BY p.id DESC
    ");
    $stmt->execute([':user_id' => $userId]);
    $projects = $stmt->fetchAll();

    // 2. Candidates details for projects posted by this client
    $stmtCandidates = $db->prepare("
        SELECT c.*, p.titre as project_title, p.id as project_id
        FROM candidatures_projets c
        JOIN problematiques p ON c.problematique_id = p.id
        WHERE p.user_id = :user_id
        ORDER BY c.id DESC
    ");
    $stmtCandidates->execute([':user_id' => $userId]);
    $allCandidates = $stmtCandidates->fetchAll();

    // Group candidates by project_id
    $projectCandidates = [];
    foreach ($allCandidates as $cand) {
        $projectCandidates[$cand['project_id']][] = $cand;
    }

    // 3. Technical study requests submitted by this client
    $stmtStudies = $db->prepare("
        SELECT * FROM etudes_techniques 
        WHERE user_id = :user_id 
        ORDER BY id DESC
    ");
    $stmtStudies->execute([':user_id' => $userId]);
    $studies = $stmtStudies->fetchAll();

    // Stats
    $totalProjects = count($projects);
    $totalCandidates = count($allCandidates);
    $totalStudies = count($studies);

} elseif ($userType === 'Expert' || $userType === 'Bureau') {
    // 1. Query Expert profile
    $stmtProfile = $db->prepare("SELECT * FROM experts WHERE email = :email");
    $stmtProfile->execute([':email' => $userEmail]);
    $expertProfile = $stmtProfile->fetch();

    // 2. Query Project Applications submitted by this expert (matched by email)
    $stmtApps = $db->prepare("
        SELECT c.*, p.titre as project_title, p.entreprise, p.budget, p.delai, p.wilaya
        FROM candidatures_projets c
        JOIN problematiques p ON c.problematique_id = p.id
        WHERE c.email = :email
        ORDER BY c.id DESC
    ");
    $stmtApps->execute([':email' => $userEmail]);
    $applications = $stmtApps->fetchAll();

    // 3. Project opportunities recommendations based on expert domains
    $recommendedProjects = [];
    if ($expertProfile && !empty($expertProfile['domaines'])) {
        $domainsList = explode(',', $expertProfile['domaines']);
        // Formulate a dynamic SQL query with ORs for domains
        $placeholders = [];
        $params = [];
        foreach ($domainsList as $idx => $dom) {
            $key = ":dom_" . $idx;
            $placeholders[] = "p.domaine LIKE " . $key;
            $params[$key] = '%' . trim($dom) . '%';
        }
        
        if (!empty($placeholders)) {
            $whereClause = implode(" OR ", $placeholders);
            $stmtRec = $db->prepare("
                SELECT p.* FROM problematiques p 
                WHERE {$whereClause} 
                ORDER BY p.id DESC LIMIT 4
            ");
            $stmtRec->execute($params);
            $recommendedProjects = $stmtRec->fetchAll();
        }
    } else {
        // Fallback: list recent projects
        $stmtRec = $db->query("SELECT * FROM problematiques ORDER BY id DESC LIMIT 4");
        $recommendedProjects = $stmtRec->fetchAll();
    }

    $totalApps = count($applications);

} elseif ($userType === 'Étudiant') {
    // 1. Registered training courses (Formations)
    $stmtCourses = $db->prepare("
        SELECT fi.*, f.titre, f.domaine, f.duree, f.niveau, f.prix, f.cert
        FROM formations_inscriptions fi
        JOIN formations f ON fi.formation_id = f.id
        WHERE fi.email = :email
        ORDER BY fi.id DESC
    ");
    $stmtCourses->execute([':email' => $userEmail]);
    $courses = $stmtCourses->fetchAll();

    // 2. Job applications submitted
    $stmtJobs = $db->prepare("
        SELECT rc.*, ro.titre as job_title, ro.entreprise, ro.type, ro.wilaya
        FROM recrutement_candidatures rc
        JOIN recrutement_offres ro ON rc.offre_id = ro.id
        WHERE rc.email = :email
        ORDER BY rc.id DESC
    ");
    $stmtJobs->execute([':email' => $userEmail]);
    $jobs = $stmtJobs->fetchAll();

    // 3. Innovations published by student
    $stmtInnov = $db->prepare("
        SELECT * FROM innovations 
        WHERE email = :email 
        ORDER BY id DESC
    ");
    $stmtInnov->execute([':email' => $userEmail]);
    $innovations = $stmtInnov->fetchAll();

    $totalCourses = count($courses);
    $totalJobs = count($jobs);
    $totalInnovations = count($innovations);
}

// Visual mapping utilities
$statusColors = [
    "Reçue" => "#64748b",
    "En cours" => "#f59e0b",
    "Livrée" => "#22c55e"
];

$statusWidths = [
    "Reçue" => "25%",
    "En cours" => "65%",
    "Livrée" => "100%"
];
?>

<div class="container py-5 px-3" style="max-width: 1100px;">
    <!-- HEADER -->
    <div class="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4 bg-white p-4 rounded-4 shadow-sm border border-light-subtle">
        <div class="d-flex align-items-center gap-3">
            <div class="bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold fs-3" style="width: 60px; height: 60px; background-color: var(--light);">
                <?php 
                $initials = '';
                $words = explode(' ', $userName);
                foreach (array_slice($words, 0, 2) as $w) {
                    $initials .= strtoupper(substr($w, 0, 1));
                }
                echo htmlspecialchars($initials);
                ?>
            </div>
            <div>
                <h1 class="fs-4 fw-extrabold mb-1" style="color: var(--primary);"><?php echo htmlspecialchars($userName); ?></h1>
                <div class="d-flex align-items-center gap-2">
                    <span class="badge bg-primary text-white py-1 px-2.5 fs-8" style="background-color: var(--primary) !important; font-size: 11px;">Rôle: <?php echo htmlspecialchars($userType); ?></span>
                    <span class="text-muted small"><i class="fa fa-envelope me-1"></i><?php echo htmlspecialchars($userEmail); ?></span>
                </div>
            </div>
        </div>
        <div>
            <span class="text-muted small">Dernière activité: Aujourd'hui</span>
        </div>
    </div>

    <!-- -------------------------------------------------------------
         CLIENT DASHBOARD
         ------------------------------------------------------------- -->
    <?php if ($userType === 'Client'): ?>
        <!-- Stat Cards -->
        <div class="row g-3 mb-4">
            <div class="col-md-4">
                <div class="bg-white rounded-4 p-4 shadow-sm border border-light-subtle d-flex align-items-center justify-content-between">
                    <div>
                        <div class="text-muted small fw-bold uppercase">Projets publiés</div>
                        <div class="fs-2 fw-extrabold text-primary"><?php echo $totalProjects; ?></div>
                    </div>
                    <div class="fs-1 text-primary-subtle" style="opacity: 0.4;">💼</div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="bg-white rounded-4 p-4 shadow-sm border border-light-subtle d-flex align-items-center justify-content-between">
                    <div>
                        <div class="text-muted small fw-bold">Candidatures reçues</div>
                        <div class="fs-2 fw-extrabold text-success"><?php echo $totalCandidates; ?></div>
                    </div>
                    <div class="fs-1 text-success-subtle" style="opacity: 0.4;">👷</div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="bg-white rounded-4 p-4 shadow-sm border border-light-subtle d-flex align-items-center justify-content-between">
                    <div>
                        <div class="text-muted small fw-bold">Études demandées</div>
                        <div class="fs-2 fw-extrabold text-warning"><?php echo $totalStudies; ?></div>
                    </div>
                    <div class="fs-1 text-warning-subtle" style="opacity: 0.4;">📐</div>
                </div>
            </div>
        </div>

        <div class="row g-4">
            <!-- Left Column: Projects & Studies -->
            <div class="col-lg-8">
                <!-- Projects Section -->
                <div class="bg-white rounded-4 p-4 shadow-sm border border-light-subtle mb-4">
                    <div class="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
                        <h3 class="fw-bold fs-5 text-dark mb-0">📁 Mes Appels à Projets</h3>
                        <button class="btn btn-premium btn-sm py-1.5 px-3 border-0" onclick="navigateTo('travail')">+ Publier un Projet</button>
                    </div>

                    <?php if (count($projects) === 0): ?>
                        <div class="text-center py-5 text-muted small">
                            <i class="fa fa-folder-open fs-2 mb-2 d-block text-muted" style="opacity: 0.5;"></i>
                            Vous n'avez publié aucun appel à projet.
                        </div>
                    <?php else: ?>
                        <div class="accordion" id="projectsAccordion">
                            <?php foreach ($projects as $idx => $p): ?>
                                <div class="accordion-item border-light-subtle mb-2 shadow-sm rounded-3 overflow-hidden">
                                    <h2 class="accordion-header">
                                        <button class="accordion-button collapsed py-3 px-3 fs-7 fw-bold text-dark" type="button" data-bs-toggle="collapse" data-bs-target="#collapseProject-<?php echo $p['id']; ?>" aria-expanded="false" aria-controls="collapseProject-<?php echo $p['id']; ?>">
                                            <div class="d-flex align-items-center justify-content-between w-100 pe-3">
                                                <span>
                                                    <span class="text-primary me-2">#<?php echo $p['id']; ?></span> 
                                                    <?php echo htmlspecialchars($p['titre']); ?>
                                                </span>
                                                <span class="badge bg-success-subtle text-success border border-success-subtle fs-9 px-2">
                                                    <?php echo $p['candidates_count']; ?> candidat(s)
                                                </span>
                                            </div>
                                        </button>
                                    </h2>
                                    <div id="collapseProject-<?php echo $p['id']; ?>" class="accordion-collapse collapse" data-bs-parent="#projectsAccordion">
                                        <div class="accordion-body bg-light-subtle p-3">
                                            <div class="row g-2 mb-3 text-muted fs-8">
                                                <div class="col-md-4">📍 <b>Wilaya:</b> <?php echo htmlspecialchars($p['wilaya']); ?></div>
                                                <div class="col-md-4">💰 <b>Budget:</b> <?php echo htmlspecialchars($p['budget']); ?></div>
                                                <div class="col-md-4">⏳ <b>Délai:</b> <?php echo htmlspecialchars($p['delai']); ?></div>
                                            </div>
                                            
                                            <h4 class="fs-8 fw-bold text-secondary mb-2 uppercase">👷 Candidats postulants</h4>
                                            <?php if (!isset($projectCandidates[$p['id']]) || count($projectCandidates[$p['id']]) === 0): ?>
                                                <p class="text-muted fs-8 mb-0">Aucune candidature reçue pour l'instant.</p>
                                            <?php else: ?>
                                                <div class="d-flex flex-column gap-2">
                                                    <?php foreach ($projectCandidates[$p['id']] as $c): ?>
                                                        <div class="bg-white p-3 rounded-3 border border-light shadow-sm">
                                                            <div class="d-flex align-items-start justify-content-between flex-wrap gap-2 mb-2">
                                                                <div>
                                                                    <div class="fw-bold text-dark fs-7"><?php echo htmlspecialchars($c['nom']); ?></div>
                                                                    <div class="text-muted fs-8"><?php echo htmlspecialchars($c['email']); ?> • Exp: <span class="badge bg-secondary-subtle text-secondary"><?php echo htmlspecialchars($c['exp']); ?></span></div>
                                                                </div>
                                                                <a href="mailto:<?php echo htmlspecialchars($c['email']); ?>" class="btn btn-outline-primary btn-sm py-1 px-2.5 fs-8"><i class="fa fa-envelope me-1"></i> Contacter</a>
                                                            </div>
                                                            <div class="p-2.5 bg-light rounded-2 text-secondary fs-8 italic border-left-3" style="border-left: 3px solid var(--secondary);">
                                                                "<?php echo nl2br(htmlspecialchars($c['lettre'])); ?>"
                                                            </div>
                                                            <div class="text-end mt-1 text-muted" style="font-size: 9px;"><?php echo date('d/m/Y H:i', strtotime($c['created_at'])); ?></div>
                                                        </div>
                                                    <?php endforeach; ?>
                                                </div>
                                            <?php endif; ?>
                                        </div>
                                    </div>
                                </div>
                            <?php endforeach; ?>
                        </div>
                    <?php endif; ?>
                </div>

                <!-- Studies Section -->
                <div class="bg-white rounded-4 p-4 shadow-sm border border-light-subtle">
                    <div class="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
                        <h3 class="fw-bold fs-5 text-dark mb-0">📐 Mes demandes d'études techniques</h3>
                        <button class="btn btn-premium btn-sm py-1.5 px-3 border-0" onclick="navigateTo('etudes')">+ Demander une Étude</button>
                    </div>

                    <?php if (count($studies) === 0): ?>
                        <div class="text-center py-5 text-muted small">
                            Vous n'avez soumis aucun dossier d'études techniques.
                        </div>
                    <?php else: ?>
                        <div class="row g-3">
                            <?php foreach ($studies as $s): ?>
                                <div class="col-md-6">
                                    <div class="p-3 bg-light rounded-4 border border-light-subtle">
                                        <div class="d-flex align-items-center justify-content-between mb-2">
                                            <span class="badge" style="background-color: <?php echo $statusColors[$s['statut']]; ?>"><?php echo htmlspecialchars($s['statut']); ?></span>
                                            <span class="text-muted fs-8"><?php echo htmlspecialchars($s['date']); ?></span>
                                        </div>
                                        <h4 class="fw-bold fs-7 text-dark mb-1"><?php echo htmlspecialchars($s['titre']); ?></h4>
                                        <p class="text-muted fs-8 mb-2"><?php echo htmlspecialchars($s['type']); ?> • Logiciel : <?php echo htmlspecialchars($s['logiciel']); ?></p>
                                        
                                        <!-- Progress bar -->
                                        <div class="progress mb-1" style="height: 6px;">
                                            <div class="progress-bar" role="progressbar" style="width: <?php echo $statusWidths[$s['statut']]; ?>; background-color: <?php echo $statusColors[$s['statut']]; ?>;"></div>
                                        </div>
                                        <div class="d-flex justify-content-between text-muted fs-9">
                                            <span>Soumis</span>
                                            <span>Analyse</span>
                                            <span>Livré</span>
                                        </div>
                                    </div>
                                </div>
                            <?php endforeach; ?>
                        </div>
                    <?php endif; ?>
                </div>
            </div>

            <!-- Right Column: Sidebar Quick Tools -->
            <div class="col-lg-4">
                <div class="bg-white rounded-4 p-4 shadow-sm border border-light-subtle mb-4">
                    <h3 class="fw-bold fs-6 text-dark mb-3">🛠️ Raccourcis & Actions</h3>
                    <div class="d-flex flex-column gap-2">
                        <a href="index.php?page=travail" class="btn btn-premium w-100 py-2.5 text-white border-0 text-start d-flex justify-content-between align-items-center">
                            <span>💼 Publier un appel d'offre</span>
                            <span>➔</span>
                        </a>
                        <a href="index.php?page=etudes" class="btn btn-premium w-100 py-2.5 text-white border-0 text-start d-flex justify-content-between align-items-center" style="background: linear-gradient(135deg, var(--primary), #7c3aed);">
                            <span>📐 Lancer une étude technique</span>
                            <span>➔</span>
                        </a>
                        <button class="btn btn-outline-secondary w-100 py-2.5 text-start d-flex justify-content-between align-items-center" onclick="openAiAgentModal()">
                            <span>🔍 Ouvrir AI Diagnostic Agent</span>
                            <span>➔</span>
                        </button>
                    </div>
                </div>

                <div class="bg-white rounded-4 p-4 shadow-sm border border-light-subtle">
                    <h3 class="fw-bold fs-6 text-dark mb-3">📜 Partenaire ENSH Blida</h3>
                    <p class="text-muted small">Les projets soumis comme <b>Étatiques</b> ou <b>Ouvrages hydrauliques</b> bénéficient d'un audit de conformité avec les chercheurs et enseignants de l'École Nationale Supérieure d'Hydraulique de Blida.</p>
                </div>
            </div>
        </div>

    <!-- -------------------------------------------------------------
         EXPERT / BUREAU DASHBOARD
         ------------------------------------------------------------- -->
    <?php elseif ($userType === 'Expert' || $userType === 'Bureau'): ?>
        <!-- Stats and Availability -->
        <div class="row g-4 mb-4">
            <!-- Profile Summary Card -->
            <div class="col-md-8">
                <div class="bg-white rounded-4 p-4 shadow-sm border border-light-subtle h-100">
                    <?php if (!$expertProfile): ?>
                        <div class="text-center py-4">
                            <h3 class="fw-bold fs-6 text-warning mb-2">⚠️ Profil public non configuré</h3>
                            <p class="text-muted small">Votre email <b><?php echo htmlspecialchars($userEmail); ?></b> n'est pas encore relié à un profil d'expert public. Pour configurer votre fiche expert publique, veuillez contacter le secrétariat ou mettre à jour vos coordonnées.</p>
                        </div>
                    <?php else: ?>
                        <div class="d-flex align-items-start justify-content-between flex-wrap gap-2">
                            <div>
                                <span class="badge bg-gold-subtle text-warning-emphasis border border-warning-subtle py-1 px-2.5 fs-8 mb-2">⭐ Expert Certifié Dz</span>
                                <h3 class="fw-bold fs-5 text-dark mb-1"><?php echo htmlspecialchars($expertProfile['nom']); ?></h3>
                                <p class="text-muted small mb-2"><?php echo htmlspecialchars($expertProfile['grade']); ?> • <b>Spécialité :</b> <?php echo htmlspecialchars($expertProfile['spec']); ?></p>
                                <div class="d-flex align-items-center gap-3 text-muted fs-8">
                                    <span>📍 <b>Wilaya:</b> <?php echo htmlspecialchars($expertProfile['wilaya']); ?></span>
                                    <span>📈 <b>Note:</b> <span class="text-warning font-bold">★ <?php echo $expertProfile['note']; ?></span> (<?php echo $expertProfile['avis']; ?> avis)</span>
                                    <span>💲 <b>Tarif journalier:</b> <?php echo number_format($expertProfile['prix'], 0, ' ', ' '); ?> DA</span>
                                </div>
                            </div>
                            <span class="fs-1">🏆</span>
                        </div>
                    <?php endif; ?>
                </div>
            </div>

            <!-- Profile Controls Card -->
            <div class="col-md-4">
                <div class="bg-white rounded-4 p-4 shadow-sm border border-light-subtle h-100">
                    <h3 class="fw-bold fs-6 text-dark mb-3">⚙️ Statut de visibilité</h3>
                    <?php if (!$expertProfile): ?>
                        <p class="text-muted small">Indisponible.</p>
                    <?php else: ?>
                        <div class="d-flex flex-column gap-3">
                            <div class="d-flex align-items-center justify-content-between">
                                <div>
                                    <div class="fw-bold fs-7 text-dark">Disponibilité</div>
                                    <div class="text-muted small" style="font-size: 11px;">Recevoir de nouveaux projets</div>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" type="checkbox" role="switch" id="switchDispo" <?php echo $expertProfile['dispo'] ? 'checked' : ''; ?> onchange="toggleExpertStatus('toggle_dispo')">
                                </div>
                            </div>
                            <hr class="my-1">
                            <div class="d-flex align-items-center justify-content-between">
                                <div>
                                    <div class="fw-bold fs-7 text-dark">Statut En Ligne</div>
                                    <div class="text-muted small" style="font-size: 11px;">Afficher un badge vert sur le site</div>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" type="checkbox" role="switch" id="switchOnline" <?php echo $expertProfile['online'] ? 'checked' : ''; ?> onchange="toggleExpertStatus('toggle_online')">
                                </div>
                            </div>
                        </div>
                    <?php endif; ?>
                </div>
            </div>
        </div>

        <div class="row g-4">
            <!-- Applications table -->
            <div class="col-lg-8">
                <div class="bg-white rounded-4 p-4 shadow-sm border border-light-subtle mb-4">
                    <h3 class="fw-bold fs-5 text-dark mb-3 border-bottom pb-2">💼 Mes Candidatures soumises</h3>
                    
                    <?php if (count($applications) === 0): ?>
                        <div class="text-center py-5 text-muted small">
                            <i class="fa fa-paper-plane fs-2 mb-2 d-block text-muted" style="opacity: 0.5;"></i>
                            Vous n'avez postulé à aucun appel à projet.
                        </div>
                    <?php else: ?>
                        <div class="table-responsive">
                            <table class="table align-middle fs-7">
                                <thead>
                                    <tr class="table-light">
                                        <th>Projet</th>
                                        <th>Client</th>
                                        <th>Conditions</th>
                                        <th>Candidature</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php foreach ($applications as $app): ?>
                                        <tr>
                                            <td>
                                                <div class="fw-bold text-dark"><?php echo htmlspecialchars($app['project_title']); ?></div>
                                                <div class="text-muted fs-8">📍 <?php echo htmlspecialchars($app['wilaya']); ?></div>
                                            </td>
                                            <td><?php echo htmlspecialchars($app['entreprise']); ?></td>
                                            <td>
                                                <div class="text-secondary"><?php echo htmlspecialchars($app['budget']); ?></div>
                                                <div class="text-muted fs-8">⏳ <?php echo htmlspecialchars($app['delai']); ?></div>
                                            </td>
                                            <td>
                                                <span class="text-muted fs-8 font-monospace d-block" style="max-width: 150px; text-overflow: ellipsis; white-space: nowrap; overflow: hidden;" title="<?php echo htmlspecialchars($app['lettre']); ?>">
                                                    "<?php echo htmlspecialchars($app['lettre']); ?>"
                                                </span>
                                                <span style="font-size: 9px;" class="text-muted"><?php echo date('d/m/Y', strtotime($app['created_at'])); ?></span>
                                            </td>
                                            <td>
                                                <button class="btn btn-outline-secondary btn-sm py-0.5 px-2 fs-8" onclick="alert('Détails de la candidature:\nExp: <?php echo addslashes($app['exp']); ?>\n\nMotivation:\n<?php echo addslashes($app['lettre']); ?>')">Voir</button>
                                            </td>
                                        </tr>
                                    <?php endforeach; ?>
                                </tbody>
                            </table>
                        </div>
                    <?php endif; ?>
                </div>
            </div>

            <!-- Right: Recommended opportunities -->
            <div class="col-lg-4">
                <div class="bg-white rounded-4 p-4 shadow-sm border border-light-subtle">
                    <h3 class="fw-bold fs-6 text-dark mb-3 border-bottom pb-2">🎯 Recommandés pour vous</h3>
                    
                    <?php if (count($recommendedProjects) === 0): ?>
                        <p class="text-muted small">Aucun projet récent trouvé.</p>
                    <?php else: ?>
                        <div class="d-flex flex-column gap-3">
                            <?php foreach ($recommendedProjects as $rp): ?>
                                <div class="p-2.5 bg-light rounded-3 border border-light-subtle">
                                    <div class="d-flex align-items-center justify-content-between mb-1">
                                        <span class="badge bg-primary-subtle text-primary border border-primary-subtle px-1.5 py-0.5" style="font-size: 9px;"><?php echo htmlspecialchars($rp['domaine']); ?></span>
                                        <span class="text-muted" style="font-size: 10px;"><?php echo htmlspecialchars($rp['date']); ?></span>
                                    </div>
                                    <h4 class="fw-bold text-dark mb-1 fs-7" style="line-height: 1.3;"><?php echo htmlspecialchars($rp['titre']); ?></h4>
                                    <div class="text-muted fs-8 mb-2">💲 Budget: <b><?php echo htmlspecialchars($rp['budget']); ?></b> • Delai: <?php echo htmlspecialchars($rp['delai']); ?></div>
                                    <button class="btn btn-premium btn-sm w-100 py-1.5 text-white border-0 fs-8" onclick="navigateTo('travail')">Postuler</button>
                                </div>
                            <?php endforeach; ?>
                        </div>
                    <?php endif; ?>
                </div>
            </div>
        </div>

    <!-- -------------------------------------------------------------
         STUDENT DASHBOARD
         ------------------------------------------------------------- -->
    <?php elseif ($userType === 'Étudiant'): ?>
        <!-- Stat Cards -->
        <div class="row g-3 mb-4">
            <div class="col-md-4">
                <div class="bg-white rounded-4 p-4 shadow-sm border border-light-subtle d-flex align-items-center justify-content-between">
                    <div>
                        <div class="text-muted small fw-bold">Formations inscrites</div>
                        <div class="fs-2 fw-extrabold text-primary"><?php echo $totalCourses; ?></div>
                    </div>
                    <div class="fs-1 text-primary-subtle" style="opacity: 0.4;">🎓</div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="bg-white rounded-4 p-4 shadow-sm border border-light-subtle d-flex align-items-center justify-content-between">
                    <div>
                        <div class="text-muted small fw-bold">Innovations publiées</div>
                        <div class="fs-2 fw-extrabold text-success"><?php echo $totalInnovations; ?></div>
                    </div>
                    <div class="fs-1 text-success-subtle" style="opacity: 0.4;">🚀</div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="bg-white rounded-4 p-4 shadow-sm border border-light-subtle d-flex align-items-center justify-content-between">
                    <div>
                        <div class="text-muted small fw-bold">Offres d'emploi postulées</div>
                        <div class="fs-2 fw-extrabold text-warning"><?php echo $totalJobs; ?></div>
                    </div>
                    <div class="fs-1 text-warning-subtle" style="opacity: 0.4;">📋</div>
                </div>
            </div>
        </div>

        <div class="row g-4">
            <!-- Left main column: Formations & Innovations -->
            <div class="col-lg-8">
                <!-- Courses -->
                <div class="bg-white rounded-4 p-4 shadow-sm border border-light-subtle mb-4">
                    <div class="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
                        <h3 class="fw-bold fs-5 text-dark mb-0">🎓 Mes Formations</h3>
                        <button class="btn btn-premium btn-sm py-1.5 px-3 border-0" onclick="navigateTo('formations')">Suivre un cours</button>
                    </div>

                    <?php if (count($courses) === 0): ?>
                        <div class="text-center py-5 text-muted small">
                            Vous n'êtes inscrit à aucune formation.
                        </div>
                    <?php else: ?>
                        <div class="row g-3">
                            <?php foreach ($courses as $c): ?>
                                <div class="col-md-6">
                                    <div class="p-3 bg-light rounded-4 border border-light-subtle h-100 d-flex flex-column justify-content-between">
                                        <div>
                                            <div class="d-flex align-items-center justify-content-between mb-2">
                                                <span class="badge bg-info text-primary border border-info px-2 py-0.5" style="font-size: 9px;"><?php echo htmlspecialchars($c['domaine']); ?></span>
                                                <span class="text-muted fs-9"><i class="fa fa-calendar-alt me-1"></i><?php echo date('d/m/Y', strtotime($c['created_at'])); ?></span>
                                            </div>
                                            <h4 class="fw-bold fs-7 text-dark mb-1"><?php echo htmlspecialchars($c['titre']); ?></h4>
                                            <p class="text-muted fs-8 mb-3">Niveau : <?php echo htmlspecialchars($c['niveau']); ?> • Durée : <?php echo htmlspecialchars($c['duree']); ?></p>
                                        </div>
                                        <div class="d-flex align-items-center justify-content-between border-top pt-2.5">
                                            <span class="fs-9 text-muted"><?php echo $c['cert'] ? '📜 Certificat inclus' : 'Aucun certif.'; ?></span>
                                            <button class="btn btn-premium btn-sm py-1 px-3 fs-8 border-0" onclick="alert('Lancement de la plateforme e-learning en cours...')">🎓 Accéder</button>
                                        </div>
                                    </div>
                                </div>
                            <?php endforeach; ?>
                        </div>
                    <?php endif; ?>
                </div>

                <!-- Innovations -->
                <div class="bg-white rounded-4 p-4 shadow-sm border border-light-subtle">
                    <div class="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
                        <h3 class="fw-bold fs-5 text-dark mb-0">🚀 Mes Innovations & Projets IA</h3>
                        <button class="btn btn-premium btn-sm py-1.5 px-3 border-0" onclick="openInnovationSubmissionModal()">+ Publier un Projet</button>
                    </div>

                    <?php if (count($innovations) === 0): ?>
                        <div class="text-center py-5 text-muted small">
                            Vous n'avez publié aucun projet d'innovation.
                        </div>
                    <?php else: ?>
                        <div class="d-flex flex-column gap-3">
                            <?php foreach ($innovations as $in): ?>
                                <div class="p-3 bg-light rounded-4 border border-light-subtle">
                                    <div class="d-flex align-items-center justify-content-between mb-2">
                                        <div>
                                            <h4 class="fw-bold fs-7 text-dark mb-0"><?php echo htmlspecialchars($in['titre']); ?></h4>
                                            <span class="text-muted fs-8"><?php echo htmlspecialchars($in['type']); ?> • <?php echo htmlspecialchars($in['univ']); ?></span>
                                        </div>
                                        <span class="badge bg-primary text-white py-1 px-2.5 fs-8" style="background-color: var(--primary) !important;"><?php echo htmlspecialchars($in['statut']); ?></span>
                                    </div>
                                    <p class="text-secondary fs-8 mb-2"><?php echo htmlspecialchars($in['desc']); ?></p>
                                    <div class="d-flex align-items-center gap-3 text-muted fs-9">
                                        <span>👁️ <b>Vues:</b> <?php echo $in['vues']; ?></span>
                                        <span>⭐ <b>Note:</b> ★ <?php echo $in['note']; ?></span>
                                        <span>💰 <b>Prix / Financement:</b> <?php echo htmlspecialchars($in['prix']); ?></span>
                                    </div>
                                </div>
                            <?php endforeach; ?>
                        </div>
                    <?php endif; ?>
                </div>
            </div>

            <!-- Right Column Sidebar: Job applications -->
            <div class="col-lg-4">
                <div class="bg-white rounded-4 p-4 shadow-sm border border-light-subtle mb-4">
                    <h3 class="fw-bold fs-6 text-dark mb-3 border-bottom pb-2">📋 Mes Demandes d'Emploi</h3>
                    
                    <?php if (count($jobs) === 0): ?>
                        <p class="text-muted small py-3 text-center">Aucune candidature soumise pour l'instant.</p>
                    <?php else: ?>
                        <div class="d-flex flex-column gap-3">
                            <?php foreach ($jobs as $j): ?>
                                <div class="p-2.5 bg-light rounded-3 border border-light-subtle">
                                    <div class="d-flex align-items-center justify-content-between mb-1">
                                        <span class="badge bg-secondary-subtle text-secondary px-1.5 py-0.5" style="font-size: 9px;"><?php echo htmlspecialchars($j['type']); ?></span>
                                        <span class="text-muted fs-9"><?php echo date('d/m', strtotime($j['created_at'])); ?></span>
                                    </div>
                                    <h4 class="fw-bold text-dark mb-1 fs-8" style="line-height: 1.3;"><?php echo htmlspecialchars($j['job_title']); ?></h4>
                                    <div class="text-muted fs-9 mb-1">🏢 <?php echo htmlspecialchars($j['entreprise']); ?> • 📍 <?php echo htmlspecialchars($j['wilaya']); ?></div>
                                    <div class="text-secondary font-monospace overflow-hidden text-truncate fs-9" style="max-height: 1.5rem;" title="<?php echo htmlspecialchars($j['msg']); ?>">
                                        "<?php echo htmlspecialchars($j['msg']); ?>"
                                    </div>
                                </div>
                            <?php endforeach; ?>
                        </div>
                    <?php endif; ?>
                </div>

                <div class="bg-white rounded-4 p-4 shadow-sm border border-light-subtle">
                    <h3 class="fw-bold fs-6 text-dark mb-3">🤖 Besoin d'aide technique ?</h3>
                    <p class="text-muted small">HydroBot est à votre service pour vous aider à dimensionner vos canalisations, choisir vos pompes, ou corriger vos calculs en génie civil.</p>
                    <button class="btn btn-premium w-100 py-2 fs-7 border-0" onclick="navigateTo('chatbot')">🤖 Lancer HydroBot</button>
                </div>
            </div>
        </div>
    <?php endif; ?>
</div>

<script>
// JS scripts local to the dashboard page if needed
function toggleExpertStatus(action) {
    const isChecked = action === 'toggle_dispo' ? $('#switchDispo').is(':checked') : $('#switchOnline').is(':checked');
    
    $.ajax({
        url: 'api/toggle_expert_status.php',
        method: 'POST',
        data: { action: action },
        dataType: 'json',
        success: function(res) {
            if (res.success) {
                // Flash success alert briefly, or just rely on state
                console.log(res.message);
            } else {
                alert(res.error);
                // Revert checkbox state
                if (action === 'toggle_dispo') {
                    $('#switchDispo').prop('checked', !isChecked);
                } else {
                    $('#switchOnline').prop('checked', !isChecked);
                }
            }
        },
        error: function() {
            alert("Erreur lors de la modification de votre statut.");
            if (action === 'toggle_dispo') {
                $('#switchDispo').prop('checked', !isChecked);
            } else {
                $('#switchOnline').prop('checked', !isChecked);
            }
        }
    });
}
</script>
