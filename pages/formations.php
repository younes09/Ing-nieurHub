<?php
require_once __DIR__ . '/../config/db.php';
$db = getDB();

// Fetch formations
$stmt = $db->query("SELECT * FROM formations ORDER BY id ASC");
$formations = $stmt->fetchAll();

$cats = ["Tous", "AEP", "Hydraulique", "VRD", "Irrigation", "SIG", "Traitement", "Ouvrages", "Assainissement"];
?>

<div class="container py-5 px-3" style="max-width: 1100px;">
    <!-- HEADER -->
    <div>
        <h2 class="fs-4 fw-extrabold mb-1" style="color: var(--primary);">Catalogue de Formations</h2>
        <p class="text-muted small mb-4">Traitement des eaux, Ouvrages hydrauliques, SIG, Irrigation, EPANET, HEC-RAS...</p>
    </div>

    <!-- FILTER CHIPS -->
    <div class="d-flex gap-2 flex-wrap mb-4" id="formation-cats-chips">
        <?php foreach ($cats as $index => $c): ?>
            <button class="btn btn-sm rounded-pill py-1 px-3 fs-7 border-info-subtle <?php echo $index === 0 ? 'btn-premium text-white' : 'btn-outline-info text-primary bg-white'; ?>" 
                    onclick="filterFormationCategory(this, '<?php echo htmlspecialchars($c); ?>')">
                <?php echo htmlspecialchars($c); ?>
            </button>
        <?php endforeach; ?>
    </div>

    <!-- GRID -->
    <div class="row g-3" id="formations-grid-list">
        <?php foreach ($formations as $f): ?>
            <div class="col-md-6 col-lg-3 formation-card-container" 
                 data-domaine="<?php echo htmlspecialchars($f['domaine']); ?>">
                <div class="card-formation p-3 h-100 d-flex flex-column justify-content-between">
                    <div>
                        <div class="d-flex justify-content-between align-items-start mb-3">
                            <span class="custom-badge bg-primary text-white" style="font-size: 9px; padding: 2px 8px;"><?php echo htmlspecialchars($f['domaine']); ?></span>
                            <?php if ($f['cert']): ?>
                                <span class="custom-badge bg-secondary text-white" style="font-size: 9px; padding: 2px 8px;">🎓 Certificat</span>
                            <?php endif; ?>
                        </div>
                        <div class="fw-bold fs-7 text-dark mb-2 lh-sm" style="height: 38px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;"><?php echo htmlspecialchars($f['titre']); ?></div>
                        <div class="d-flex gap-3 text-muted mb-3" style="font-size: 11px;">
                            <span><i class="fa fa-clock me-1"></i> <?php echo htmlspecialchars($f['duree']); ?></span>
                            <span><i class="fa fa-layer-group me-1"></i> <?php echo htmlspecialchars($f['niveau']); ?></span>
                        </div>
                    </div>
                    
                    <div class="border-top pt-2">
                        <div class="d-flex align-items-center justify-content-between mb-2">
                            <div class="fw-bold text-secondary fs-6" style="color: var(--secondary) !important;"><?php echo number_format($f['prix']); ?> DA</div>
                        </div>
                        <button class="btn btn-premium btn-sm w-100 py-2 fs-7" onclick="openEnrollmentModal(<?php echo $f['id']; ?>, '<?php echo addslashes($f['titre']); ?>', '<?php echo number_format($f['prix']); ?> DA')">S'inscrire</button>
                    </div>
                </div>
            </div>
        <?php endforeach; ?>
    </div>
</div>

<!-- ENROLLMENT MODAL -->
<div class="glass-modal d-none" id="enrollment-modal">
    <div class="glass-modal-content" style="max-width: 420px;">
        <div class="p-3 text-white d-flex align-items-center justify-content-between" style="background: var(--primary); border-top-left-radius: 23px; border-top-right-radius: 23px;">
            <div class="fw-bold fs-6">S'inscrire à la formation</div>
            <button class="btn btn-link text-white p-0 fs-5" onclick="closeEnrollmentModal()"><i class="fa fa-times"></i></button>
        </div>
        <div class="p-4 bg-white" style="border-bottom-left-radius: 23px; border-bottom-right-radius: 23px;">
            <div class="p-3 bg-light rounded-3 mb-3 small">
                🎓 <b><span id="enroll-modal-title"></span></b><br>
                💵 Tarif: <span id="enroll-modal-price"></span>
            </div>
            
            <form id="enrollment-form" onsubmit="submitEnrollment(event)">
                <input type="hidden" name="formation_id" id="enroll-modal-formation-id">
                <div class="mb-2">
                    <input type="text" name="nom" class="form-control form-control-sm py-2 fs-7" placeholder="Nom complet" required>
                </div>
                <div class="mb-3">
                    <input type="email" name="email" class="form-control form-control-sm py-2 fs-7" placeholder="Email" required>
                </div>
                
                <div id="enrollment-status-alert" class="alert d-none mb-3 py-2 fs-7"></div>
                
                <div class="d-flex gap-2">
                    <button type="submit" class="btn btn-premium btn-sm flex-grow-1 py-2 fs-7">Valider l'inscription</button>
                    <button type="button" class="btn btn-premium-outline btn-sm flex-grow-1 py-2 fs-7" onclick="closeEnrollmentModal()">Annuler</button>
                </div>
            </form>
        </div>
    </div>
</div>
