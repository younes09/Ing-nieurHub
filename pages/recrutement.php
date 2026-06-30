<?php
require_once __DIR__ . '/../config/db.php';
$db = getDB();

// Fetch job offers
$stmt = $db->query("SELECT * FROM recrutement_offres ORDER BY id DESC");
$offres = $stmt->fetchAll();

$cats = ["Tous", "CDI", "CDD", "Stage"];

$typeColors = [
    "CDI" => "#22c55e",
    "CDD" => "#f59e0b",
    "Stage" => "#1a7fc4"
];
?>

<div class="container py-5 px-3" style="max-width: 1100px;">
    <!-- HEADER -->
    <div>
        <h2 class="fs-4 fw-extrabold mb-1" style="color: var(--primary);">Recrutement &amp; Stages</h2>
        <p class="text-muted small mb-4">CDI, CDD, Stages — Hydraulique, Traitement des eaux, SIG, VRD, Génie Civil</p>
    </div>

    <!-- FILTER BAR -->
    <div class="d-flex gap-2 flex-wrap mb-4" id="recrutement-types-chips">
        <?php foreach ($cats as $index => $c): ?>
            <button class="btn btn-sm rounded-pill py-1 px-3 fs-7 border-info-subtle <?php echo $index === 0 ? 'btn-premium text-white' : 'btn-outline-info text-primary bg-white'; ?>" 
                    onclick="filterJobType(this, '<?php echo htmlspecialchars($c); ?>')">
                <?php echo htmlspecialchars($c); ?>
            </button>
        <?php endforeach; ?>
    </div>

    <!-- JOBS GRID -->
    <div class="row g-3" id="jobs-grid-list">
        <?php foreach ($offres as $o): ?>
            <?php $color = isset($typeColors[$o['type']]) ? $typeColors[$o['type']] : '#0a4f8a'; ?>
            <div class="col-md-6 col-lg-4 job-card-container" 
                 data-type="<?php echo htmlspecialchars($o['type']); ?>">
                <div class="card-expert p-3 h-100 d-flex flex-column justify-content-between">
                    <div>
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <span class="custom-badge text-white" style="background-color: <?php echo $color; ?>;"><?php echo htmlspecialchars($o['type']); ?></span>
                            <span class="text-muted" style="font-size: 11px;">📍 <?php echo htmlspecialchars($o['wilaya']); ?></span>
                        </div>
                        <div class="fw-bold fs-7 mb-1" style="color: var(--primary);"><?php echo htmlspecialchars($o['titre']); ?></div>
                        <div class="text-muted mb-2" style="font-size: 12px;"><?php echo htmlspecialchars($o['entreprise']); ?></div>
                        <p class="text-secondary small mb-3" style="font-size: 11px; line-height: 1.4;"><?php echo htmlspecialchars($o['desc']); ?></p>
                    </div>
                    
                    <div class="border-top pt-2">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <span class="custom-badge bg-secondary text-white"><?php echo htmlspecialchars($o['domaine']); ?></span>
                        </div>
                        <button class="btn btn-premium btn-sm w-100 py-2 fs-7" onclick="openJobCandidatureModal(<?php echo $o['id']; ?>, '<?php echo addslashes($o['titre']); ?>')">Postuler</button>
                    </div>
                </div>
            </div>
        <?php endforeach; ?>
    </div>
</div>

<!-- JOB CANDIDATURE MODAL -->
<div class="glass-modal d-none" id="job-candidature-modal">
    <div class="glass-modal-content" style="max-width: 420px;">
        <div class="p-3 text-white d-flex align-items-center justify-content-between" style="background: var(--primary); border-top-left-radius: 23px; border-top-right-radius: 23px;">
            <div class="fw-bold fs-6">Candidature — <span id="job-modal-title"></span></div>
            <button class="btn btn-link text-white p-0 fs-5" onclick="closeJobCandidatureModal()"><i class="fa fa-times"></i></button>
        </div>
        <div class="p-4 bg-white" style="border-bottom-left-radius: 23px; border-bottom-right-radius: 23px;">
            <form id="job-candidature-form" onsubmit="submitJobCandidature(event)">
                <input type="hidden" name="offre_id" id="job-modal-offre-id">
                <div class="mb-2">
                    <input type="text" name="nom" class="form-control form-control-sm py-2 fs-7" placeholder="Nom complet" required>
                </div>
                <div class="mb-2">
                    <input type="email" name="email" class="form-control form-control-sm py-2 fs-7" placeholder="Email" required>
                </div>
                <div class="mb-2">
                    <input type="text" name="tel" class="form-control form-control-sm py-2 fs-7" placeholder="Téléphone" required>
                </div>
                <div class="mb-3">
                    <textarea name="msg" class="form-control form-control-sm py-2 fs-7" rows="3" placeholder="Motivation..." required></textarea>
                </div>
                
                <div id="job-candidature-status-alert" class="alert d-none mb-3 py-2 fs-7"></div>
                
                <div class="d-flex gap-2">
                    <button type="submit" class="btn btn-premium btn-sm flex-grow-1 py-2 fs-7">Envoyer</button>
                    <button type="button" class="btn btn-premium-outline btn-sm flex-grow-1 py-2 fs-7" onclick="closeJobCandidatureModal()">Annuler</button>
                </div>
            </form>
        </div>
    </div>
</div>
