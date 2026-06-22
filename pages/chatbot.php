<div class="container py-5 px-3" style="max-width: 820px;">
    <!-- HEADER -->
    <div class="text-center mb-4">
        <div class="fs-1 mb-2">🤖</div>
        <h2 class="fs-4 fw-extrabold text-dark mb-1">HydroBot — Assistant IA</h2>
        <p class="text-muted small">Hydraulique • Traitement des eaux • Ouvrages hydrauliques • Irrigation • SIG • VRD</p>
    </div>

    <!-- CHAT BOX -->
    <div class="bg-white rounded-4 shadow-sm border border-light-subtle overflow-hidden">
        <!-- Messages Log -->
        <div class="p-4 overflow-y-auto d-flex flex-column gap-3" id="page-chatbot-messages" style="height: 380px; background: #f8fafc;">
            <div class="d-flex justify-content-start gap-2">
                <div class="rounded-circle d-flex align-items-center justify-content-center text-white" style="width: 30px; height: 30px; background: linear-gradient(135deg, var(--primary), var(--secondary)); font-size: 13px; flex-shrink: 0;">🤖</div>
                <div class="p-3 small rounded-3" style="max-width: 76%; background: var(--light); color: var(--primary); line-height: 1.6;">
                    Bonjour ! Je suis <b>HydroBot</b> 🤖<br><br>
                    Assistant technique : hydraulique, traitement des eaux, ouvrages hydrauliques, irrigation, SIG, VRD en Algérie. Posez vos questions !
                </div>
            </div>
        </div>
        
        <!-- Suggestions -->
        <div class="px-4 pb-3 pt-1 bg-white" id="page-chatbot-suggestions">
            <div class="d-flex flex-wrap gap-2">
                <?php 
                $sug = [
                    "Dimensionnement réseau AEP — EPANET ?",
                    "Calcul hydrogramme de crue HEC-HMS ?",
                    "Filière traitement eau de surface ?",
                    "Carte SIG réseau hydraulique ArcGIS ?",
                    "Calcul ETM irrigation blé ?",
                    "Dimensionnement barrage collinaire ?"
                ];
                foreach ($sug as $s):
                ?>
                    <button class="btn btn-sm text-primary fw-semibold rounded-pill py-1 px-3 fs-8" 
                            style="background: var(--light); border: 1px solid var(--accent);" 
                            onclick="sendPageChatMessage('<?php echo htmlspecialchars(addslashes($s)); ?>')">
                        <?php echo htmlspecialchars($s); ?>
                    </button>
                <?php endforeach; ?>
            </div>
        </div>
        
        <!-- Input Form -->
        <div class="p-3 border-top d-flex gap-2 bg-white">
            <input type="text" id="page-chatbot-input" class="form-control form-control-sm py-2 px-3 fs-7" placeholder="Votre question technique..." onkeydown="if(event.key==='Enter') sendPageChatMessage()">
            <button class="btn text-white py-2 px-4 fs-7 border-0" style="background: linear-gradient(135deg, var(--primary), var(--secondary));" onclick="sendPageChatMessage()">➤</button>
        </div>
    </div>
</div>
