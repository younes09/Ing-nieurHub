<?php
require_once __DIR__ . '/../config/db.php';
$db = getDB();

// Fetch catalog items
$stmt = $db->query("SELECT * FROM fournisseurs_materiaux ORDER BY id ASC");
$materials = $stmt->fetchAll();

$cats = ["Tous", "Tuyauterie", "Vannes & Robinetterie", "Pompes", "Traitement des eaux", "Accessoires", "Assainissement", "Comptage & Mesure", "Ouvrages préfabriqués", "Étanchéité"];
$wilayas = ["Toutes", "Alger", "Blida", "Oran", "Constantine", "Tizi-Ouzou", "Boumerdès", "Annaba"];
?>

<div class="container py-5 px-3" style="max-width: 1100px;">
    <!-- HEADER -->
    <div>
        <h2 class="fs-4 fw-extrabold mb-1" style="color: var(--primary);">🏪 Catalogue Fournisseurs</h2>
        <p class="text-muted small mb-4">Matériaux hydrauliques, tuyaux, pompes, équipements — avec prix et fiches techniques</p>
    </div>

    <!-- FILTER BAR -->
    <div class="d-flex gap-2 flex-wrap mb-3 align-items-center">
        <select id="filter-supplier-wilaya" class="form-select border-info-subtle text-primary fw-semibold fs-7" style="width: auto; min-width: 150px;">
            <?php foreach ($wilayas as $w): ?>
                <option value="<?php echo htmlspecialchars($w); ?>"><?php echo htmlspecialchars($w); ?></option>
            <?php endforeach; ?>
        </select>
        
        <div class="ms-auto small text-muted">
            <span id="materials-visible-count"><?php echo count($materials); ?></span> produit(s) disponible(s)
        </div>
    </div>

    <!-- CATEGORY CHIPS -->
    <div class="d-flex gap-2 flex-wrap mb-4" id="supplier-cats-chips">
        <?php foreach ($cats as $index => $c): ?>
            <button class="btn btn-sm rounded-pill py-1 px-3 fs-7 border-info-subtle <?php echo $index === 0 ? 'btn-premium text-white' : 'btn-outline-info text-primary bg-white'; ?>" 
                    onclick="filterSupplierCategory(this, '<?php echo htmlspecialchars($c); ?>')">
                <?php echo htmlspecialchars($c); ?>
            </button>
        <?php endforeach; ?>
    </div>

    <!-- PRODUCTS GRID -->
    <div class="row g-3" id="materials-grid-list">
        <?php foreach ($materials as $m): ?>
            <div class="col-md-6 col-lg-4 material-card-container" 
                 data-categorie="<?php echo htmlspecialchars($m['categorie']); ?>" 
                 data-wilaya="<?php echo htmlspecialchars($m['wilaya']); ?>">
                <div class="card-supplier p-3 h-100 d-flex flex-column justify-content-between">
                    <div>
                        <div class="d-flex align-items-center gap-3 mb-3">
                            <div class="fs-1 bg-light p-2 rounded-3 text-center" style="width: 54px; height: 54px; line-height: 38px;"><?php echo htmlspecialchars($m['img']); ?></div>
                            <div class="min-w-0">
                                <div class="fw-bold fs-7 text-dark text-truncate-2" style="color: var(--primary) !important; line-height: 1.3;"><?php echo htmlspecialchars($m['nom']); ?></div>
                                <div class="text-muted" style="font-size: 10px;"><?php echo htmlspecialchars($m['categorie']); ?></div>
                            </div>
                        </div>
                        <div class="text-muted mb-1" style="font-size: 11px;">🏢 <?php echo htmlspecialchars($m['fournisseur']); ?> • 📍 <?php echo htmlspecialchars($m['wilaya']); ?></div>
                        <div class="text-secondary small mb-3" style="font-size: 10px; color: var(--gray-600) !important;">Réf: <?php echo htmlspecialchars($m['ref']); ?> • Norme: <?php echo htmlspecialchars($m['norm']); ?></div>
                    </div>
                    
                    <div class="border-top pt-2">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <div>
                                <div class="fw-extrabold fs-5 text-secondary" style="color: var(--secondary) !important;"><?php echo number_format($m['prix']); ?> DA</div>
                                <div class="text-muted" style="font-size: 10px;">/<?php echo htmlspecialchars($m['unite']); ?></div>
                            </div>
                            <?php if ($m['stock'] === 'En stock'): ?>
                                <span class="custom-badge bg-success text-white">✅ En stock</span>
                            <?php else: ?>
                                <span class="custom-badge bg-warning text-dark">⏳ <?php echo htmlspecialchars($m['stock']); ?></span>
                            <?php endif; ?>
                        </div>
                        
                        <?php if ($m['offre']): ?>
                            <div class="p-2 rounded-3 mb-3 small text-warning-emphasis fw-semibold" style="background-color: #fef9c3; font-size: 11px;">
                                🎁 <?php echo htmlspecialchars($m['offre']); ?>
                            </div>
                        <?php endif; ?>
                        
                        <div class="d-flex gap-2">
                            <button class="btn btn-premium btn-sm flex-grow-1 py-1 fs-7" onclick="orderMaterial('<?php echo addslashes($m['nom']); ?>', '<?php echo addslashes($m['fournisseur']); ?>')">Commander</button>
                            <button class="btn btn-premium-outline btn-sm flex-grow-1 py-1 fs-7" onclick='viewFicheTechnique(<?php echo json_encode($m); ?>)'>Fiche technique</button>
                        </div>
                    </div>
                </div>
            </div>
        <?php endforeach; ?>
    </div>
</div>

<!-- TECHNICAL DATASHEET MODAL -->
<div class="glass-modal d-none" id="fiche-technique-modal">
    <div class="glass-modal-content" style="max-width: 480px;">
        <div class="p-4 border-bottom d-flex align-items-center gap-3 bg-white" style="border-top-left-radius: 23px; border-top-right-radius: 23px;">
            <div class="fs-1 bg-light p-2 rounded-3 text-center" id="fiche-modal-img" style="width: 60px; height: 60px; line-height: 44px;"></div>
            <div class="flex-grow-1">
                <div class="fw-bold fs-6 text-dark" id="fiche-modal-title"></div>
                <div class="text-muted small" id="fiche-modal-supplier"></div>
            </div>
            <button class="btn btn-link text-muted p-0 fs-5" onclick="closeFicheTechniqueModal()"><i class="fa fa-times"></i></button>
        </div>
        <div class="p-4 bg-white">
            <div class="d-flex justify-content-between py-2 border-bottom fs-7">
                <span class="text-muted">Catégorie</span>
                <span class="fw-bold text-dark" id="fiche-modal-cat"></span>
            </div>
            <div class="d-flex justify-content-between py-2 border-bottom fs-7">
                <span class="text-muted">Référence</span>
                <span class="fw-bold text-dark" id="fiche-modal-ref"></span>
            </div>
            <div class="d-flex justify-content-between py-2 border-bottom fs-7">
                <span class="text-muted">Norme</span>
                <span class="fw-bold text-dark" id="fiche-modal-norm"></span>
            </div>
            <div class="d-flex justify-content-between py-2 border-bottom fs-7">
                <span class="text-muted">Prix unitaire</span>
                <span class="fw-bold text-dark" id="fiche-modal-price"></span>
            </div>
            <div class="d-flex justify-content-between py-2 border-bottom fs-7">
                <span class="text-muted">Disponibilité</span>
                <span class="fw-bold text-dark" id="fiche-modal-stock"></span>
            </div>
            <div class="d-flex justify-content-between py-2 border-bottom fs-7">
                <span class="text-muted">Wilaya</span>
                <span class="fw-bold text-dark" id="fiche-modal-wilaya"></span>
            </div>
            <div class="d-flex justify-content-between py-2 border-bottom fs-7">
                <span class="text-muted">Offre spéciale</span>
                <span class="fw-bold text-dark" id="fiche-modal-offre"></span>
            </div>
            
            <div class="mt-4 d-flex gap-2">
                <button class="btn btn-premium flex-grow-1 py-2 fs-7" onclick="requestQuoteFromFiche()">Demander un devis</button>
                <button class="btn btn-premium-outline flex-grow-1 py-2 fs-7" onclick="closeFicheTechniqueModal()">Fermer</button>
            </div>
        </div>
    </div>
</div>
