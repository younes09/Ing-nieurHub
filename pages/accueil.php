<?php
require_once __DIR__ . '/../config/db.php';
$db = getDB();

// Fetch top ENSH experts
$stmt = $db->query("SELECT * FROM experts WHERE ensh = 1 LIMIT 4");
$ensh_experts = $stmt->fetchAll();

// Fetch urgent projects
$stmt = $db->query("SELECT * FROM problematiques WHERE urgent = 1 LIMIT 3");
$urgent_projects = $stmt->fetchAll();

// Fetch top innovations
$stmt = $db->query("SELECT * FROM innovations LIMIT 3");
$innovations = $stmt->fetchAll();

// Helpers for rendering
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

<!-- HERO SECTION -->
<div style="background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 65%, rgba(91, 212, 244, 0.22) 100%); padding: 60px 24px; text-align: center; color: #fff;">
    <div class="small d-inline-block text-white px-3 py-1 rounded-pill mb-3" style="background: rgba(255,255,255,0.15);">
        🏛️ Partenaire ENSH • 🇩🇿 Marketplace Génie Civil Algérie
    </div>
    <h1 class="fw-extrabold mb-3 text-white" style="font-size: clamp(24px, 4.5vw, 46px); line-height: 1.15;">
        La plateforme qui connecte<br><span style="color: var(--accent);">ingénieurs, entreprises & innovateurs</span>
    </h1>
    <p class="mb-4 mx-auto" style="font-size: 14px; opacity: 0.88; max-width: 560px;">
        Experts ENSH certifiés • Projets techniques • Fournisseurs matériaux • Innovation IA
    </p>
    
    <!-- Search Bar -->
    <div class="input-group mx-auto p-2 bg-white rounded-3 shadow" style="max-width: 560px;">
        <input type="text" id="global-search-input" class="form-control border-0 px-3 fs-7" placeholder="Expert, projet, matériau, innovation...">
        <button class="btn btn-premium fs-7 py-2 px-4 rounded-2" onclick="handleGlobalSearch()">Rechercher</button>
    </div>
    
    <!-- Fast Tags -->
    <div class="d-flex flex-wrap gap-2 justify-content-center mt-3">
        <?php foreach (['Hydraulique', 'VRD', 'Irrigation', 'SIG', 'Traitement des eaux', 'Ouvrages hydrauliques'] as $tag): ?>
            <button class="btn btn-sm text-white border-white-subtle rounded-pill py-1 px-3 fs-8" style="background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.3);" onclick="tagSearch('<?php echo htmlspecialchars($tag); ?>')">
                <?php echo $tag; ?>
            </button>
        <?php endindex_array_loop: endforeach; ?>
    </div>
</div>

<!-- STATS BAR -->
<div class="bg-white py-4 shadow-sm border-bottom">
    <div class="container px-4">
        <div class="row text-center g-3 mx-auto" style="max-width: 800px;">
            <div class="col-3">
                <div class="stat-number">200+</div>
                <div class="text-muted small fs-8">Experts & Profs</div>
            </div>
            <div class="col-3">
                <div class="stat-number">50+</div>
                <div class="text-muted small fs-8">Projets actifs</div>
            </div>
            <div class="col-3">
                <div class="stat-number">6</div>
                <div class="text-muted small fs-8">Bureaux partenaires</div>
            </div>
            <div class="col-3">
                <div class="stat-number">98%</div>
                <div class="text-muted small fs-8">Satisfaction</div>
            </div>
        </div>
    </div>
</div>

<!-- MAIN WORKSPACE SECTIONS -->
<div class="container py-5 px-3" style="max-width: 1100px;">
    <!-- Shortcuts Cards -->
    <div class="row g-3 mb-5">
        <div class="col-md-3 col-sm-6">
            <div class="p-4 card-project h-100 cursor-pointer" onclick="navigateTo('travail')" style="background: #eff6ff; border-color: #bfdbfe;">
                <div class="fs-1 mb-2">💼</div>
                <div class="fw-bold fs-6 mb-1" style="color: var(--primary);">Travail & Projets</div>
                <div class="text-muted small lh-sm">Entreprises publient des appels à projets pour ingénieurs freelance</div>
            </div>
        </div>
        <div class="col-md-3 col-sm-6">
            <div class="p-4 card-supplier h-100 cursor-pointer" onclick="navigateTo('fournisseurs')" style="background: #f0fdf4; border-color: #bbf7d0;">
                <div class="fs-1 mb-2">🏪</div>
                <div class="fw-bold fs-6 mb-1" style="color: var(--primary);">Fournisseurs</div>
                <div class="text-muted small lh-sm">Catalogue matériaux hydrauliques avec prix et fiches techniques</div>
            </div>
        </div>
        <div class="col-md-3 col-sm-6">
            <div class="p-4 card-innovation h-100 cursor-pointer" onclick="navigateTo('innovation')" style="background: #fdf4ff; border-color: #e9d5ff;">
                <div class="fs-1 mb-2">🚀</div>
                <div class="fw-bold fs-6 mb-1" style="color: var(--primary);">Innovation & IA</div>
                <div class="text-muted small lh-sm">Idées et agents IA d'étudiants disponibles pour incubation</div>
            </div>
        </div>
        <div class="col-md-3 col-sm-6">
            <div class="p-4 card-expert h-100 cursor-pointer" onclick="toggleFloatingChatbot()" style="background: #fffbeb; border-color: #fcd34d;">
                <div class="fs-1 mb-2">🤖</div>
                <div class="fw-bold fs-6 mb-1" style="color: var(--primary);">HydroBot IA</div>
                <div class="text-muted small lh-sm">Assistant technique en hydraulique, SIG, irrigation</div>
            </div>
        </div>
    </div>

    <!-- ENSH TEACHERS SECTION -->
    <div class="rounded-4 p-4 mb-5 border-warning-subtle" style="background: linear-gradient(135deg, #fffbeb, #fef3c7); border: 1px solid #fcd34d;">
        <div class="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
            <div>
                <h3 class="fw-extrabold fs-5 mb-1 text-warning-emphasis">🏛️ Professeurs & Enseignants ENSH Blida</h3>
                <p class="text-warning-emphasis small mb-0">Pr. Ammari Abdelhadi • M. Mihoubie M.K. • M. Hachmie et plus</p>
            </div>
            <button class="btn btn-warning text-white btn-sm px-3 fw-bold border-0 fs-7" style="background: #b45309;" onclick="navigateTo('experts', {enshOnly: true})">
                Voir tous →
            </button>
        </div>
        <div class="row g-3">
            <?php foreach ($ensh_experts as $e): ?>
                <div class="col-lg-3 col-md-6">
                    <div class="card-expert card-ensh p-3 h-100 position-relative overflow-hidden">
                        <div class="position-absolute top-0 end-0 px-2 py-1 small fw-bold text-warning-emphasis text-center" style="background: linear-gradient(135deg, var(--gold), #ffd700); font-size: 9px; border-bottom-left-radius: 10px;">🏛️ ENSH</div>
                        <div class="d-flex gap-2 align-items-center mb-3">
                            <div class="position-relative">
                                <!-- Avatar -->
                                <div class="rounded-circle d-flex align-items-center justify-content-center text-dark fw-bold border border-2 border-warning" style="width: 46px; height: 46px; background: linear-gradient(135deg, var(--gold), #ffd700); font-size: 15px;">
                                    <?php echo htmlspecialchars($e['img']); ?>
                                </div>
                                <?php if ($e['online']): ?>
                                    <span class="position-absolute bottom-0 end-0 bg-success rounded-circle border border-2 border-white" style="width: 10px; height: 10px;"></span>
                                <?php endif; ?>
                            </div>
                            <div class="flex-grow-1 min-w-0">
                                <div class="fw-bold fs-7 text-dark text-truncate" style="color: var(--primary);"><?php echo htmlspecialchars($e['nom']); ?></div>
                                <div class="text-muted" style="font-size: 10px;"><?php echo htmlspecialchars($e['grade']); ?></div>
                                <div class="text-muted" style="font-size: 10px;">📍 <?php echo htmlspecialchars($e['wilaya']); ?> • <?php echo $e['projets']; ?> projets</div>
                            </div>
                        </div>
                        <div class="text-secondary small mb-2 fst-italic" style="font-size: 11px;"><?php echo htmlspecialchars($e['spec']); ?></div>
                        <div class="d-flex flex-wrap gap-1 mb-3">
                            <?php if ($e['certifie']): ?>
                                <span class="custom-badge bg-primary text-white">✓ Certifié</span>
                            <?php endif; ?>
                            <?php if ($e['dispo']): ?>
                                <span class="custom-badge bg-success text-white">Disponible</span>
                            <?php else: ?>
                                <span class="custom-badge bg-warning text-white">Occupé</span>
                            <?php endif; ?>
                        </div>
                        <div class="d-flex align-items-center justify-content-between mb-3">
                            <div class="small">
                                <?php echo renderStars($e['note']); ?>
                                <span class="text-muted ms-1" style="font-size: 10px;"><?php echo $e['note']; ?></span>
                            </div>
                            <div class="fw-bold text-secondary" style="font-size: 13px; color: var(--secondary) !important;"><?php echo number_format($e['prix']); ?> DA</div>
                        </div>
                        <div class="d-flex gap-2">
                            <button class="btn btn-premium btn-sm flex-grow-1 py-1 fs-7" onclick="contactExpert(<?php echo $e['id']; ?>)">Contacter</button>
                            <button class="btn btn-premium-outline btn-sm flex-grow-1 py-1 fs-7" onclick="viewExpertProfile(<?php echo $e['id']; ?>)">Profil</button>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    </div>

    <!-- URGENT PROJECTS SECTION -->
    <div class="d-flex align-items-center justify-content-between mb-3">
        <h2 class="fs-5 fw-bold mb-0" style="color: var(--primary);">🔥 Projets urgents disponibles</h2>
        <button class="btn btn-premium-outline btn-sm px-3 fs-7" onclick="navigateTo('travail')">Voir tous →</button>
    </div>
    <div class="row g-3 mb-5">
        <?php foreach ($urgent_projects as $p): ?>
            <div class="col-md-4">
                <div class="card-project p-3 h-100 border-danger-subtle" style="box-shadow: 0 2px 8px rgba(239, 68, 68, 0.08);">
                    <div class="d-flex flex-wrap gap-1 mb-2">
                        <span class="custom-badge bg-danger text-white">🔥 URGENT</span>
                        <span class="custom-badge bg-secondary text-white"><?php echo htmlspecialchars($p['domaine']); ?></span>
                        <span class="custom-badge bg-dark text-white"><?php echo htmlspecialchars($p['delai']); ?></span>
                    </div>
                    <div class="fw-bold fs-7 mb-1" style="color: var(--primary);"><?php echo htmlspecialchars($p['titre']); ?></div>
                    <div class="text-muted mb-2" style="font-size: 11px;"><?php echo htmlspecialchars($p['entreprise']); ?> • <?php echo htmlspecialchars($p['wilaya']); ?></div>
                    <p class="text-secondary small mb-3 text-truncate-2" style="font-size: 12px; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                        <?php echo htmlspecialchars($p['desc']); ?>
                    </p>
                    <div class="fw-bold text-success mb-3 fs-6"><?php echo htmlspecialchars($p['budget']); ?></div>
                    <button class="btn btn-premium btn-sm w-100 py-2 fs-7" onclick="applyToProject(<?php echo $p['id']; ?>, '<?php echo addslashes($p['titre']); ?>', '<?php echo htmlspecialchars($p['budget']); ?>', '<?php echo htmlspecialchars($p['delai']); ?>', '<?php echo htmlspecialchars($p['wilaya']); ?>')">Postuler</button>
                </div>
            </div>
        <?php endforeach; ?>
    </div>

    <!-- INNOVATIONS SECTION -->
    <div class="d-flex align-items-center justify-content-between mb-3">
        <h2 class="fs-5 fw-bold mb-0" style="color: var(--primary);">🚀 Innovations & Agents IA récents</h2>
        <button class="btn btn-premium-outline btn-sm px-3 fs-7" onclick="navigateTo('innovation')">Voir tous →</button>
    </div>
    <div class="row g-3">
        <?php foreach ($innovations as $inn): ?>
            <div class="col-md-4">
                <div class="card-innovation p-3 h-100 border-violet-subtle" style="border-color: #e9d5ff; box-shadow: 0 2px 8px rgba(124, 58, 237, 0.07);">
                    <div class="d-flex flex-wrap gap-1 mb-2">
                        <span class="custom-badge text-white" style="background: #7c3aed;"><?php echo htmlspecialchars($inn['type']); ?></span>
                        <span class="custom-badge text-white <?php echo $inn['statut'] == 'Cherche incubateur' ? 'bg-warning' : 'bg-success'; ?>">
                            <?php echo $inn['statut'] == 'Cherche incubateur' ? '🏢 Incubation' : '💰 À vendre'; ?>
                        </span>
                        <span class="custom-badge bg-secondary text-white"><?php echo htmlspecialchars($inn['domaine']); ?></span>
                    </div>
                    <div class="fw-bold fs-7 mb-1" style="color: var(--primary);"><?php echo htmlspecialchars($inn['titre']); ?></div>
                    <div class="text-muted mb-2" style="font-size: 11px;"><?php echo htmlspecialchars($inn['auteur']); ?> • <?php echo htmlspecialchars($inn['univ']); ?></div>
                    <p class="text-secondary small mb-3 text-truncate-2" style="font-size: 11px; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                        <?php echo htmlspecialchars($inn['desc']); ?>
                    </p>
                    
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <div class="small">
                            <?php echo renderStars($inn['note']); ?>
                            <span class="text-muted ms-1" style="font-size: 10px;"><?php echo $inn['note']; ?> • 👁 <?php echo $inn['vues']; ?> vues</span>
                        </div>
                        <div class="fw-bold text-dark" style="font-size: 12px;"><?php echo htmlspecialchars($inn['prix']); ?></div>
                    </div>
                    
                    <div class="d-flex gap-2">
                        <button class="btn btn-sm text-white flex-grow-1 py-1 fs-7" style="background: #7c3aed;" onclick="viewInnovationDetails(<?php echo $inn['id']; ?>)">Découvrir</button>
                        <button class="btn btn-premium btn-sm flex-grow-1 py-1 fs-7" onclick="proposeIncubation(<?php echo $inn['id']; ?>, '<?php echo addslashes($inn['titre']); ?>', '<?php echo htmlspecialchars($inn['statut']); ?>')">
                            <?php echo $inn['statut'] == 'Cherche incubateur' ? '🏢 Incuber' : '💰 Acquérir'; ?>
                        </button>
                    </div>
                </div>
            </div>
        <?php endforeach; ?>
    </div>
</div>
