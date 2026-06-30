<?php
require_once __DIR__ . '/../db.php';
$db = getDB();

// Fetch studies
$stmt = $db->query("SELECT * FROM etudes_techniques ORDER BY id DESC");
$etudes = $stmt->fetchAll();

$wilayas = ["Alger","Blida","Oran","Constantine","Tizi-Ouzou","Boumerdès","Annaba"];
$types = ["AEP","Assainissement","Irrigation","SIG / ArcGIS","VRD","Topographie","Structure","Hydrologie","Traitement des eaux","Ouvrages hydrauliques"];
$softwares = ["EPANET","HEC-RAS","ArcGIS Pro","QGIS","Civil 3D","AutoCAD","HEC-HMS","SEEP/W","Autre"];

$statusColors = [
    "Reçue" => "#64748b",
    "En cours" => "#f59e0b",
    "Livrée" => "#22c55e"
];

$statusWidths = [
    "Reçue" => "20%",
    "En cours" => "65%",
    "Livrée" => "100%"
];
?>

<div class="container py-5 px-3" style="max-width: 1000px;">
    <!-- HEADER -->
    <div class="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
        <div>
            <h2 class="fs-4 fw-extrabold mb-1" style="color: var(--primary);">Études Techniques</h2>
            <p class="text-muted small mb-0">AEP, Irrigation, SIG, Ouvrages hydrauliques, Traitement des eaux...</p>
        </div>
        <button class="btn text-white fw-bold btn-sm py-2 px-3 border-0" style="background: linear-gradient(135deg, var(--primary), #7c3aed);" onclick="openAiAgentModal()">
            🔍 Vérifier avec AI Agent
        </button>
    </div>

    <!-- MAIN CONTAINER -->
    <div class="row g-4">
        <!-- SUBMISSION FORM -->
        <div class="col-md-6">
            <div class="bg-white rounded-4 p-4 shadow-sm border border-light-subtle h-100">
                <h3 class="fw-bold fs-6 mb-3" style="color: var(--primary);">📋 Nouvelle étude</h3>
                <form id="submit-study-form" onsubmit="submitNewStudy(event)">
                    <div class="mb-2">
                        <select name="type" class="form-select form-select-sm py-2 fs-7" required>
                            <option value="">-- Type d'étude --</option>
                            <?php foreach ($types as $t): ?>
                                <option value="<?php echo htmlspecialchars($t); ?>"><?php echo htmlspecialchars($t); ?></option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    
                    <div class="mb-2">
                        <select name="logiciel" class="form-select form-select-sm py-2 fs-7">
                            <option value="">-- Logiciel utilisé --</option>
                            <?php foreach ($softwares as $l): ?>
                                <option value="<?php echo htmlspecialchars($l); ?>"><?php echo htmlspecialchars($l); ?></option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    
                    <div class="mb-2">
                        <input type="text" name="titre" class="form-control form-control-sm py-2 fs-7" placeholder="Titre de l'étude" required>
                    </div>
                    
                    <div class="mb-2">
                        <select name="wilaya" class="form-select form-select-sm py-2 fs-7" required>
                            <option value="">-- Wilaya concernée --</option>
                            <?php foreach ($wilayas as $w): ?>
                                <option value="<?php echo htmlspecialchars($w); ?>"><?php echo htmlspecialchars($w); ?></option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    
                    <div class="mb-3">
                        <textarea name="desc" class="form-control form-control-sm py-2 fs-7" rows="3" placeholder="Description du projet..." required></textarea>
                    </div>
                    
                    <!-- Real file upload zone -->
                    <div class="mb-3">
                        <label class="form-label fs-8 fw-bold text-secondary text-uppercase mb-1">Document ou plan technique (Optionnel)</label>
                        <div id="file-dropzone" class="p-3 text-center rounded-3 position-relative" style="background: var(--light); border: 2px dashed #b3d6f0; color: var(--gray-600); font-size: 11px; cursor: pointer; transition: border-color 0.2s;">
                            <i class="fa fa-paperclip me-1"></i> <span id="dropzone-text">Glissez vos fichiers (shapefile, PDF, plans) ou cliquez pour charger</span>
                            <input type="file" name="study_file" id="study_file" class="position-absolute top-0 start-0 w-100 h-100 opacity-0" style="cursor: pointer;" onchange="handleFileSelect(this)">
                        </div>
                        <div id="file-info" class="mt-2 d-none text-muted fs-8 d-flex justify-content-between align-items-center bg-light p-2 rounded border border-light-subtle">
                            <span>📂 <span id="file-name" class="fw-bold"></span> (<span id="file-size"></span>)</span>
                            <button type="button" class="btn btn-sm btn-link text-danger p-0 text-decoration-none" onclick="removeSelectedFile()"><i class="fa fa-trash-alt"></i> Retirer</button>
                        </div>
                    </div>
                    
                    <div id="study-status-alert" class="alert d-none mb-3 py-2 fs-7"></div>
                    
                    <button type="submit" class="btn btn-premium w-100 py-2 fs-7 border-0">Soumettre l'étude</button>
                </form>
            </div>
        </div>

        <!-- TRACKING LIST -->
        <div class="col-md-6">
            <div class="bg-white rounded-4 p-4 shadow-sm border border-light-subtle h-100">
                <h3 class="fw-bold fs-6 mb-3" style="color: var(--primary);">📊 Suivi des dossiers</h3>
                
                <div class="d-flex flex-column gap-3" id="studies-list-container">
                    <?php if (count($etudes) == 0): ?>
                        <div class="text-center py-4 text-muted small">Aucune étude en cours d'analyse.</div>
                    <?php endif; ?>
                    
                    <?php foreach ($etudes as $e): ?>
                        <?php 
                        $badgeColor = isset($statusColors[$e['statut']]) ? $statusColors[$e['statut']] : '#0a4f8a';
                        $width = isset($statusWidths[$e['statut']]) ? $statusWidths[$e['statut']] : '0%';
                        ?>
                        <div class="p-3 bg-white rounded-3 border" style="box-shadow: var(--shadow-sm);">
                            <div class="d-flex justify-content-between align-items-start mb-2 gap-2">
                                <div class="fw-bold text-dark fs-7 lh-sm" style="color: var(--primary) !important;"><?php echo htmlspecialchars($e['titre']); ?></div>
                                <span class="custom-badge text-white" style="background-color: <?php echo $badgeColor; ?>;"><?php echo htmlspecialchars($e['statut']); ?></span>
                            </div>
                            
                            <div class="text-muted mb-2" style="font-size: 10px;">
                                <?php echo htmlspecialchars($e['type']); ?>
                                <?php if ($e['logiciel']): ?>
                                    • <?php echo htmlspecialchars($e['logiciel']); ?>
                                <?php endif; ?>
                                • <?php echo htmlspecialchars($e['date']); ?>
                            </div>
                            
                            <div class="progress" style="height: 4px; background-color: var(--gray-200);">
                                <div class="progress-bar" role="progressbar" style="width: <?php echo $width; ?>; background-color: <?php echo $badgeColor; ?>;"></div>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>
        </div>
    </div>
</div>
