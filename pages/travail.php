<?php
require_once __DIR__ . '/../db.php';
$db = getDB();

// Fetch projects
$projects_stmt = $db->query("SELECT * FROM problematiques ORDER BY id DESC");
$projects = $projects_stmt->fetchAll();

// Fetch experts sorted by completed projects for CV Board
$experts_stmt = $db->query("SELECT * FROM experts ORDER BY projets DESC");
$leaderboard = $experts_stmt->fetchAll();

$wilayas = ["Alger","Blida","Oran","Constantine","Tizi-Ouzou","Boumerdès","Annaba"];
$domaines = ["Tous","Hydraulique","AEP","VRD","GC","Topographie","Assainissement","Irrigation","SIG","Ouvrages hydrauliques","Traitement des eaux"];

if (!function_exists('renderStars')) {
    function renderStars($n) {
        $rounded = round($n);
        $html = '<span style="color: #f59e0b;">';
        for ($i = 1; $i <= 5; $i++) {
            $html .= $i <= $rounded ? '★' : '☆';
        }
        $html .= '</span>';
        return $html;
    }
}
?>

<div class="container py-5 px-3" style="max-width: 1100px;">
    <!-- HEADER -->
    <div class="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
        <div>
            <h2 class="fs-4 fw-extrabold mb-1" style="color: var(--primary);">💼 Espace Travail & Projets</h2>
            <p class="text-muted small mb-0">Mise en relation entreprises ↔ ingénieurs freelance — ADE, SEAAL, ONA, Sonelgaz, bureaux privés</p>
        </div>
        <button class="btn text-white fw-bold btn-sm py-2 px-3 border-0" style="background: linear-gradient(135deg, var(--primary), #7c3aed);" onclick="openAiAgentModal()">
            🔍 AI Agent vérification
        </button>
    </div>

    <!-- TABS -->
    <div class="d-flex gap-2 mb-4 border-bottom border-2 border-light-subtle">
        <button class="nav-tab-btn active" id="tab-projets-btn" onclick="switchTravailTab('projets')">📋 Appels à projets</button>
        <button class="nav-tab-btn" id="tab-publier-btn" onclick="switchTravailTab('publier')">🏢 Publier une problématique</button>
        <button class="nav-tab-btn" id="tab-cvboard-btn" onclick="switchTravailTab('cvboard')">🏆 Tableau des experts</button>
    </div>

    <!-- TAB 1: PROJECTS LIST -->
    <div id="travail-tab-projets" class="travail-tab-content">
        <div class="d-flex gap-2 flex-wrap mb-4 align-items-center">
            <select id="filter-project-domain" class="form-select border-info-subtle text-primary fw-semibold fs-7" style="width: auto; min-width: 150px;">
                <?php foreach ($domaines as $d): ?>
                    <option value="<?php echo htmlspecialchars($d); ?>"><?php echo htmlspecialchars($d); ?></option>
                <?php endforeach; ?>
            </select>
            
            <button id="btn-filter-urgent" class="btn btn-outline-danger fw-bold py-1 px-3 fs-7" onclick="toggleUrgentFilter()">
                🔥 Urgents uniquement
            </button>
            
            <div class="ms-auto small text-muted">
                <span id="projects-visible-count"><?php echo count($projects); ?></span> projet(s) disponible(s)
            </div>
        </div>

        <div class="row g-3" id="projects-grid-list">
            <?php foreach ($projects as $p): ?>
                <div class="col-md-6 col-lg-4 project-card-container" 
                     data-domaine="<?php echo htmlspecialchars($p['domaine']); ?>" 
                     data-urgent="<?php echo $p['urgent'] ? '1' : '0'; ?>">
                    <div class="card-project p-3 h-100 d-flex flex-column <?php echo $p['urgent'] ? 'border-danger-subtle' : ''; ?>" style="<?php echo $p['urgent'] ? 'box-shadow: 0 2px 8px rgba(239, 68, 68, 0.08);' : ''; ?>">
                        <div class="d-flex flex-wrap gap-1 mb-2">
                            <?php if ($p['urgent']): ?>
                                <span class="custom-badge bg-danger text-white">🔥 URGENT</span>
                            <?php endif; ?>
                            <span class="custom-badge bg-secondary text-white"><?php echo htmlspecialchars($p['domaine']); ?></span>
                            <span class="custom-badge bg-info text-dark" style="background-color: #e0f2fe !important; color: #0369a1 !important;"><?php echo htmlspecialchars($p['secteur']); ?></span>
                        </div>
                        <div class="fw-bold fs-7 mb-1" style="color: var(--primary);"><?php echo htmlspecialchars($p['titre']); ?></div>
                        <div class="text-muted mb-2" style="font-size: 11px;"><?php echo htmlspecialchars($p['entreprise']); ?></div>
                        <div class="text-muted small mb-2" style="font-size: 10px;">📍 <?php echo htmlspecialchars($p['wilaya']); ?> • 📅 <?php echo htmlspecialchars($p['date']); ?></div>
                        <p class="text-secondary small mb-3 flex-grow-1" style="font-size: 12px; line-height: 1.4;"><?php echo htmlspecialchars($p['desc']); ?></p>
                        
                        <div class="border-top pt-2 mt-auto">
                            <div class="d-flex align-items-center justify-content-between mb-3">
                                <div>
                                    <div class="fw-bold text-success fs-6"><?php echo htmlspecialchars($p['budget']); ?></div>
                                    <div class="text-muted" style="font-size: 10px;">⏱ <?php echo htmlspecialchars($p['delai']); ?> • 👥 <span class="project-candidats-count-<?php echo $p['id']; ?>"><?php echo $p['candidats']; ?></span> candidats</div>
                                </div>
                            </div>
                            <div class="d-flex gap-2">
                                <button class="btn btn-premium btn-sm flex-grow-1 py-1 fs-7" onclick="applyToProject(<?php echo $p['id']; ?>, '<?php echo addslashes($p['titre']); ?>', '<?php echo htmlspecialchars($p['budget']); ?>', '<?php echo htmlspecialchars($p['delai']); ?>', '<?php echo htmlspecialchars($p['wilaya']); ?>')">Postuler</button>
                                <button class="btn btn-premium-outline btn-sm flex-grow-1 py-1 fs-7" onclick="viewProjectDetails(<?php echo $p['id']; ?>)">Détails</button>
                            </div>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    </div>

    <!-- TAB 2: PUBLISH FORM -->
    <div id="travail-tab-publier" class="travail-tab-content d-none">
        <div class="mx-auto" style="max-width: 580px;">
            <div class="bg-white rounded-4 p-4 shadow-sm border border-light-subtle">
                <h3 class="fw-bold fs-5 mb-2" style="color: var(--primary);">🏢 Publier une problématique technique</h3>
                <p class="text-muted small mb-4">Votre appel à projet sera visible par tous les ingénieurs freelance et experts de la plateforme.</p>
                
                <form id="publish-project-form" onsubmit="submitNewProject(event)">
                    <div class="mb-3">
                        <input type="text" name="titre" class="form-control form-control-sm py-2 fs-7" placeholder="Titre de la problématique" required>
                    </div>
                    <div class="mb-3">
                        <input type="text" name="entreprise" class="form-control form-control-sm py-2 fs-7" placeholder="Nom de l'entreprise / organisme" required>
                    </div>
                    <div class="mb-3">
                        <input type="text" name="budget" class="form-control form-control-sm py-2 fs-7" placeholder="Budget estimé (ex: 450 000 DA)" required>
                    </div>
                    <div class="mb-3">
                        <input type="text" name="delai" class="form-control form-control-sm py-2 fs-7" placeholder="Délai de réalisation (ex: 30 jours)" required>
                    </div>
                    <div class="row g-2 mb-3">
                        <div class="col-6">
                            <select name="secteur" class="form-select form-select-sm py-2 fs-7">
                                <option value="Étatique">Étatique</option>
                                <option value="Privé">Privé</option>
                                <option value="International">International</option>
                            </select>
                        </div>
                        <div class="col-6">
                            <select name="wilaya" class="form-select form-select-sm py-2 fs-7">
                                <?php foreach ($wilayas as $w): ?>
                                    <option value="<?php echo htmlspecialchars($w); ?>"><?php echo htmlspecialchars($w); ?></option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                    </div>
                    <div class="mb-3">
                        <select name="domaine" class="form-select form-select-sm py-2 fs-7">
                            <?php foreach (array_filter($domaines, fn($d) => $d !== 'Tous') as $d): ?>
                                <option value="<?php echo htmlspecialchars($d); ?>"><?php echo htmlspecialchars($d); ?></option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    <div class="mb-3">
                        <textarea name="desc" class="form-control form-control-sm py-2 fs-7" rows="4" placeholder="Décrivez la problématique technique en détail (logiciels requis, livrables attendus...)" required></textarea>
                    </div>
                    <div class="form-check mb-3">
                        <input class="form-check-input" type="checkbox" name="urgent" id="publish-urgent-check" value="1">
                        <label class="form-check-label small" for="publish-urgent-check">Marquer comme urgent (🔥)</label>
                    </div>
                    
                    <div id="publish-status-alert" class="alert d-none mb-3 py-2 fs-7"></div>
                    
                    <button type="submit" class="btn btn-premium w-100 py-2 fs-7 border-0">📢 Publier la problématique</button>
                </form>
            </div>
        </div>
    </div>

    <!-- TAB 3: LEADBOARD / CV BOARD -->
    <div id="travail-tab-cvboard" class="travail-tab-content d-none">
        <p class="text-muted small mb-4">🏆 Classement des experts selon leurs projets validés sur la plateforme. Chaque projet complété enrichit automatiquement le CV numérique de l'ingénieur.</p>
        <div class="row g-3">
            <?php foreach ($leaderboard as $index => $e): ?>
                <div class="col-md-6 col-lg-4">
                    <div class="card-expert p-3 h-100 position-relative d-flex flex-column justify-content-between <?php echo $e['ensh'] ? 'card-ensh' : ''; ?>">
                        <?php if ($index < 3): ?>
                            <div class="position-absolute top-0 end-0 fs-3 p-1">
                                <?php echo $index === 0 ? '🥇' : ($index === 1 ? '🥈' : '🥉'); ?>
                            </div>
                        <?php endif; ?>
                        
                        <div>
                            <div class="d-flex gap-2 align-items-center mb-3">
                                <div class="rounded-circle d-flex align-items-center justify-content-center fw-bold <?php echo $e['ensh'] ? 'text-dark border border-2 border-warning' : 'text-white'; ?>" style="width: 42px; height: 42px; background: <?php echo $e['ensh'] ? 'linear-gradient(135deg, var(--gold), #ffd700)' : 'linear-gradient(135deg, var(--secondary), var(--accent))'; ?>; font-size: 13px; flex-shrink: 0;">
                                    <?php echo htmlspecialchars($e['img']); ?>
                                </div>
                                <div class="min-w-0">
                                    <div class="fw-bold fs-7 text-dark text-truncate" style="color: var(--primary);"><?php echo htmlspecialchars($e['nom']); ?></div>
                                    <div class="text-muted" style="font-size: 10px;"><?php echo htmlspecialchars($e['spec']); ?></div>
                                </div>
                            </div>
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <div class="small text-muted"><b class="fs-5" style="color: var(--secondary);"><?php echo $e['projets']; ?></b> projets validés</div>
                                <div class="small"><?php echo renderStars($e['note']); ?></div>
                            </div>
                        </div>
                        
                        <div class="mt-2">
                            <div class="progress" style="height: 5px; background-color: var(--gray-200);">
                                <div class="progress-bar" role="progressbar" style="width: <?php echo min(100, $e['projets'] * 6); ?>%; background: linear-gradient(90deg, var(--secondary), var(--accent));"></div>
                            </div>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</div>

<!-- PROJECT CANDIDACY MODAL -->
<div class="glass-modal d-none" id="candidature-project-modal">
    <div class="glass-modal-content" style="max-width: 440px;">
        <div class="p-3 text-white d-flex align-items-center justify-content-between" style="background: var(--primary); border-top-left-radius: 23px; border-top-right-radius: 23px;">
            <div class="fw-bold fs-6">Candidature — <span id="modal-project-title"></span></div>
            <button class="btn btn-link text-white p-0 fs-5" onclick="closeCandidatureModal()"><i class="fa fa-times"></i></button>
        </div>
        <div class="p-4">
            <div class="rounded-3 p-3 mb-3 small" style="background: var(--light); color: var(--gray-700);">
                💰 <span id="modal-project-budget"></span> • ⏱ <span id="modal-project-delai"></span> • 📍 <span id="modal-project-wilaya"></span>
            </div>
            
            <form id="project-candidature-form" onsubmit="submitProjectCandidature(event)">
                <input type="hidden" name="project_id" id="modal-project-id">
                <div class="mb-2">
                    <input type="text" name="nom" class="form-control form-control-sm py-2 fs-7" placeholder="Nom complet" required>
                </div>
                <div class="mb-2">
                    <input type="email" name="email" class="form-control form-control-sm py-2 fs-7" placeholder="Email" required>
                </div>
                <div class="mb-2">
                    <input type="text" name="exp" class="form-control form-control-sm py-2 fs-7" placeholder="Années d'expérience dans ce domaine" required>
                </div>
                <div class="mb-3">
                    <textarea name="lettre" class="form-control form-control-sm py-2 fs-7" rows="4" placeholder="Décrivez votre approche et vos compétences pour ce projet..." required></textarea>
                </div>
                
                <div id="candidature-status-alert" class="alert d-none mb-3 py-2 fs-7"></div>
                
                <div class="d-flex gap-2">
                    <button type="submit" class="btn btn-premium btn-sm flex-grow-1 py-2 fs-7">Envoyer</button>
                    <button type="button" class="btn btn-premium-outline btn-sm flex-grow-1 py-2 fs-7" onclick="closeCandidatureModal()">Annuler</button>
                </div>
            </form>
        </div>
    </div>
</div>
