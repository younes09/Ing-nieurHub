<?php
require_once __DIR__ . '/../db.php';
$db = getDB();

// Fetch innovations
$stmt = $db->query("SELECT * FROM innovations ORDER BY id DESC");
$innovations = $stmt->fetchAll();

$types = ["Tous", "Agent IA", "Application Web", "Outil SIG", "Dashboard IoT", "Autre"];
$domaines = ["Hydraulique","AEP","VRD","GC","Topographie","Assainissement","Irrigation","SIG","Ouvrages hydrauliques","Traitement des eaux"];

$typeColors = [
    "Agent IA" => "#7c3aed",
    "Application Web" => "#0a4f8a",
    "Outil SIG" => "#0891b2",
    "Dashboard IoT" => "#059669",
    "Autre" => "#64748b"
];

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
            <h2 class="fs-4 fw-extrabold mb-1" style="color: var(--primary);">🚀 Espace Innovation &amp; Étudiants</h2>
            <p class="text-muted small mb-0">Idées innovantes et agents IA proposés par étudiants et chercheurs — disponibles pour incubation ou achat</p>
        </div>
        <button class="btn text-white fw-bold btn-sm py-2 px-3 border-0" style="background: #7c3aed;" onclick="openInnovationSubmissionModal()">
            ➕ Soumettre mon projet
        </button>
    </div>

    <!-- BANNER -->
    <div class="rounded-4 p-4 mb-4 border-violet-subtle d-flex flex-wrap align-items-center justify-content-between gap-3" 
         style="background: linear-gradient(135deg, #fdf4ff, #ede9fe); border: 1px solid #e9d5ff;">
        <div>
            <div class="fw-bold fs-6 mb-1" style="color: #7c3aed;">🏢 Vous êtes une entreprise ?</div>
            <div class="small text-secondary" style="color: #6b21a8 !important;">Incubez un projet étudiant ou achetez une solution IA prête à l'emploi pour votre secteur.</div>
        </div>
        <div class="d-flex gap-2">
            <button class="btn btn-sm text-white px-3 fw-bold border-0 fs-7" style="background: #7c3aed;" onclick="alert('Demande générale d\'incubation envoyée ! Notre équipe vous contactera.')">Incuber un projet</button>
            <button class="btn btn-sm bg-white px-3 fw-bold fs-7" style="color: #7c3aed; border: 1px solid #7c3aed;" onclick="alert('Formulaire de contact envoyé au secrétariat.')">Contacter un porteur</button>
        </div>
    </div>

    <!-- FILTERS -->
    <div class="d-flex gap-2 flex-wrap mb-4" id="innovation-types-chips">
        <?php foreach ($types as $index => $t): ?>
            <?php $color = isset($typeColors[$t]) ? $typeColors[$t] : '#7c3aed'; ?>
            <button class="btn btn-sm rounded-pill py-1 px-3 fs-7 <?php echo $index === 0 ? 'btn-premium text-white' : 'btn-outline-secondary bg-white text-secondary'; ?>" 
                    data-type-color="<?php echo $color; ?>"
                    onclick="filterInnovationType(this, '<?php echo htmlspecialchars($t); ?>')">
                <?php echo htmlspecialchars($t); ?>
            </button>
        <?php endforeach; ?>
    </div>

    <!-- GRID -->
    <div class="row g-3" id="innovations-grid-list">
        <?php foreach ($innovations as $inn): ?>
            <?php 
            $color = isset($typeColors[$inn['type']]) ? $typeColors[$inn['type']] : '#7c3aed'; 
            $tagArray = array_filter(explode(',', $inn['tags']));
            ?>
            <div class="col-md-6 col-lg-4 innovation-card-container" 
                 data-type="<?php echo htmlspecialchars($inn['type']); ?>">
                <div class="card-innovation p-3 h-100 d-flex flex-column justify-content-between" style="border-color: #e9d5ff; box-shadow: 0 2px 12px rgba(124, 58, 237, 0.07);">
                    <div>
                        <div class="d-flex flex-wrap gap-1 mb-2">
                            <span class="custom-badge text-white" style="background: <?php echo $color; ?>;"><?php echo htmlspecialchars($inn['type']); ?></span>
                            <span class="custom-badge text-white <?php echo $inn['statut'] == 'Cherche incubateur' ? 'bg-warning' : 'bg-success'; ?>">
                                <?php echo $inn['statut'] == 'Cherche incubateur' ? '🏢 Incubation' : '💰 À vendre'; ?>
                            </span>
                            <span class="custom-badge bg-secondary text-white"><?php echo htmlspecialchars($inn['domaine']); ?></span>
                        </div>
                        <div class="fw-bold fs-7 mb-1" style="color: var(--primary);"><?php echo htmlspecialchars($inn['titre']); ?></div>
                        <div class="text-muted mb-2" style="font-size: 11px;">👤 <?php echo htmlspecialchars($inn['auteur']); ?> • 🎓 <?php echo htmlspecialchars($inn['univ']); ?></div>
                        <p class="text-secondary small mb-3" style="font-size: 11px; line-height: 1.5;"><?php echo htmlspecialchars($inn['desc']); ?></p>
                        
                        <div class="d-flex flex-wrap gap-1 mb-3">
                            <?php foreach ($tagArray as $tag): ?>
                                <span style="background: #f3f0ff; color: #7c3aed; font-size: 10px; padding: 2px 8px; border-radius: 20px; border: 1px solid #ede9fe;">
                                    <?php echo htmlspecialchars(trim($tag)); ?>
                                </span>
                            <?php endforeach; ?>
                        </div>
                    </div>
                    
                    <div class="border-top pt-2">
                        <div class="d-flex align-items-center justify-content-between mb-3">
                            <div class="small">
                                <?php echo renderStars($inn['note']); ?>
                                <span class="text-muted ms-1" style="font-size: 10px;"><?php echo $inn['note']; ?> • 👁 <?php echo $inn['vues']; ?> vues</span>
                            </div>
                            <div class="fw-bold <?php echo $inn['statut'] == 'Cherche incubateur' ? 'text-warning' : 'text-success'; ?>" style="font-size: 12px;">
                                <?php echo htmlspecialchars($inn['prix']); ?>
                            </div>
                        </div>
                        
                        <div class="d-flex gap-2">
                            <button class="btn btn-sm text-white flex-grow-1 py-1 fs-7" style="background: #7c3aed;" onclick='viewInnovationDetail(<?php echo json_encode($inn); ?>)'>Voir le projet</button>
                            <button class="btn btn-premium btn-sm flex-grow-1 py-1 fs-7" onclick="proposeIncubation(<?php echo $inn['id']; ?>, '<?php echo addslashes($inn['titre']); ?>', '<?php echo htmlspecialchars($inn['statut']); ?>')">
                                <?php echo $inn['statut'] == 'Cherche incubateur' ? '🏢 Incuber' : '💰 Acquérir'; ?>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        <?php endforeach; ?>
    </div>
</div>

<!-- DETAIL MODAL -->
<div class="glass-modal d-none" id="innovation-detail-modal">
    <div class="glass-modal-content" style="max-width: 520px;">
        <div class="p-4 bg-white" style="border-radius: 23px;">
            <div class="d-flex gap-2 mb-3">
                <span class="custom-badge text-white" id="inn-detail-badge-type"></span>
                <span class="custom-badge bg-secondary text-white" id="inn-detail-badge-domaine"></span>
            </div>
            <h3 class="fw-bold fs-5 mb-1" id="inn-detail-title" style="color: var(--primary);"></h3>
            <div class="text-muted small mb-3">👤 <span id="inn-detail-auteur"></span> • 🎓 <span id="inn-detail-univ"></span></div>
            <p class="text-secondary small mb-3 lh-base" id="inn-detail-desc"></p>
            
            <div class="d-flex flex-wrap gap-1 mb-3" id="inn-detail-tags-container"></div>
            
            <div class="p-3 rounded-3 mb-4 d-flex justify-content-between align-items-center" id="inn-detail-status-box">
                <div class="fw-bold" id="inn-detail-statut" style="font-size: 13px;"></div>
                <div class="fw-extrabold fs-6" id="inn-detail-prix"></div>
            </div>
            
            <div class="d-flex gap-2">
                <button class="btn text-white flex-grow-1 py-2 fs-7" id="inn-detail-action-btn" style="background: #7c3aed;" onclick="proposeIncubationFromDetail()"></button>
                <button class="btn btn-premium-outline flex-grow-1 py-2 fs-7" onclick="closeInnovationDetailModal()">Fermer</button>
            </div>
        </div>
    </div>
</div>

<!-- SUBMISSION MODAL -->
<div class="glass-modal d-none" id="innovation-submission-modal">
    <div class="glass-modal-content" style="max-width: 480px;">
        <div class="p-3 text-white d-flex align-items-center justify-content-between" style="background: #7c3aed; border-top-left-radius: 23px; border-top-right-radius: 23px;">
            <div class="fw-bold fs-6">🚀 Soumettre mon projet innovant</div>
            <button class="btn btn-link text-white p-0 fs-5" onclick="closeInnovationSubmissionModal()"><i class="fa fa-times"></i></button>
        </div>
        <div class="p-4 bg-white" style="border-bottom-left-radius: 23px; border-bottom-right-radius: 23px;">
            <form id="submit-innovation-form" onsubmit="submitNewInnovation(event)">
                <div class="mb-2">
                    <input type="text" name="titre" class="form-control form-control-sm py-2 fs-7" placeholder="Titre du projet" required>
                </div>
                <div class="mb-2">
                    <input type="text" name="auteur" class="form-control form-control-sm py-2 fs-7" placeholder="Votre nom" required>
                </div>
                <div class="mb-2">
                    <input type="text" name="univ" class="form-control form-control-sm py-2 fs-7" placeholder="Université / École" required>
                </div>
                <div class="row g-2 mb-2">
                    <div class="col-6">
                        <select name="type" class="form-select form-select-sm py-2 fs-7">
                            <option value="Agent IA">Agent IA</option>
                            <option value="Application Web">Application Web</option>
                            <option value="Outil SIG">Outil SIG</option>
                            <option value="Dashboard IoT">Dashboard IoT</option>
                            <option value="Autre">Autre</option>
                        </select>
                    </div>
                    <div class="col-6">
                        <select name="domaine" class="form-select form-select-sm py-2 fs-7">
                            <?php foreach ($domaines as $d): ?>
                                <option value="<?php echo htmlspecialchars($d); ?>"><?php echo htmlspecialchars($d); ?></option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                </div>
                <div class="mb-2">
                    <input type="text" name="prix" class="form-control form-control-sm py-2 fs-7" placeholder="Prix souhaité en DA (ou 'Incubation')" required>
                </div>
                <div class="mb-2">
                    <input type="text" name="tags" class="form-control form-control-sm py-2 fs-7" placeholder="Technologies (ex: Python, ArcGIS, ML)" required>
                </div>
                <div class="mb-3">
                    <textarea name="desc" class="form-control form-control-sm py-2 fs-7" rows="4" placeholder="Décrivez votre projet innovant..." required></textarea>
                </div>
                
                <div id="innovation-status-alert" class="alert d-none mb-3 py-2 fs-7"></div>
                
                <div class="d-flex gap-2">
                    <button type="submit" class="btn text-white btn-sm flex-grow-1 py-2 fs-7" style="background: #7c3aed;">Soumettre</button>
                    <button type="button" class="btn btn-premium-outline btn-sm flex-grow-1 py-2 fs-7" onclick="closeInnovationSubmissionModal()">Annuler</button>
                </div>
            </form>
        </div>
    </div>
</div>
