<?php
require_once __DIR__ . '/../db.php';
$db = getDB();

$stmt = $db->query("SELECT * FROM experts");
$experts = $stmt->fetchAll();

$wilayas = ["Toutes","Alger","Blida","Oran","Constantine","Tizi-Ouzou","Boumerdès","Annaba"];
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
            <h2 class="fs-4 fw-extrabold mb-1" style="color: var(--primary);">Nos Experts</h2>
            <p class="text-muted small mb-0"><span id="experts-count"><?php echo count($experts); ?></span> expert(s) disponible(s)</p>
        </div>
        <button class="btn text-white fw-bold btn-sm py-2 px-3 border-0" style="background: linear-gradient(135deg, var(--primary), #7c3aed);" onclick="openAiAgentModal()">
            🔍 AI Agent vérification
        </button>
    </div>

    <!-- FILTERS BAR -->
    <div class="d-flex gap-2 flex-wrap mb-4">
        <select id="filter-expert-domain" class="form-select border-info-subtle text-primary fw-semibold fs-7" style="width: auto; max-width: 200px;">
            <?php foreach ($domaines as $d): ?>
                <option value="<?php echo htmlspecialchars($d); ?>"><?php echo htmlspecialchars($d); ?></option>
            <?php endforeach; ?>
        </select>
        
        <select id="filter-expert-wilaya" class="form-select border-info-subtle text-primary fw-semibold fs-7" style="width: auto; max-width: 150px;">
            <?php foreach ($wilayas as $w): ?>
                <option value="<?php echo htmlspecialchars($w); ?>"><?php echo htmlspecialchars($w); ?></option>
            <?php endforeach; ?>
        </select>
        
        <button id="btn-filter-ensh" class="btn btn-outline-warning text-warning-emphasis fw-bold py-1 px-3 fs-7" onclick="toggleEnshFilter()" style="border: 2px solid #b45309;">
            🏛️ ENSH uniquement
        </button>
    </div>

    <!-- EXPERTS GRID -->
    <div class="row g-3" id="experts-grid">
        <?php foreach ($experts as $e): ?>
            <div class="col-lg-3 col-md-6 expert-card-container" 
                 data-domaines="<?php echo htmlspecialchars($e['domaines']); ?>" 
                 data-wilaya="<?php echo htmlspecialchars($e['wilaya']); ?>" 
                 data-ensh="<?php echo $e['ensh'] ? '1' : '0'; ?>">
                <div class="card-expert p-3 h-100 position-relative overflow-hidden <?php echo $e['ensh'] ? 'card-ensh' : ''; ?>">
                    <?php if ($e['ensh']): ?>
                        <div class="position-absolute top-0 end-0 px-2 py-1 small fw-bold text-warning-emphasis text-center" style="background: linear-gradient(135deg, var(--gold), #ffd700); font-size: 9px; border-bottom-left-radius: 10px;">🏛️ ENSH</div>
                    <?php endif; ?>
                    <div class="d-flex gap-2 align-items-center mb-3">
                        <div class="position-relative">
                            <div class="rounded-circle d-flex align-items-center justify-content-center fw-bold <?php echo $e['ensh'] ? 'text-dark border border-2 border-warning' : 'text-white'; ?>" style="width: 46px; height: 46px; background: <?php echo $e['ensh'] ? 'linear-gradient(135deg, var(--gold), #ffd700)' : 'linear-gradient(135deg, var(--secondary), var(--accent))'; ?>; font-size: 15px;">
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
