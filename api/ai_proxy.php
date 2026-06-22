<?php
session_start();
header('Content-Type: application/json');
require_once __DIR__ . '/../config.php';

$action = isset($_POST['action']) ? $_POST['action'] : '';

// ══════════════════════════════════════════════════════════════
// HELPER: LOCAL SMART RESPONSE ENGINES
// ══════════════════════════════════════════════════════════════

// A. ChatBot Smart Rules Engine
function getLocalChatbotReply($userMessage) {
    $msg = strtolower($userMessage);
    
    if (strpos($msg, 'epanet') !== false || strpos($msg, 'aep') !== false) {
        return "Pour modéliser un réseau AEP sur **EPANET** :\n1. Configurez les unités de débit (ex: LPS pour litres par seconde) dans les options hydrauliques.\n2. Entrez les élévations des nœuds et les courbes caractéristiques des réservoirs.\n3. Utilisez la formule de **Hazzen-Williams** (coefficient 130-140 pour le PEHD neuf) pour calculer les pertes de charges.\n4. Assurez-vous que les pressions aux nœuds restent entre **1.5 bar (15 mCE)** et **6 bars** aux heures de pointe.\n\nBesoin d'une note de calcul certifiée ? Vous pouvez soumettre votre fichier sur l'onglet **Études** !";
    }
    
    if (strpos($msg, 'hec-ras') !== false || strpos($msg, 'crue') !== false || strpos($msg, 'hydrologie') !== false) {
        return "Dans **HEC-RAS** (1D ou 2D) pour la modélisation des crues :\n1. Préparez votre MNT (Modèle Numérique de Terrain) haute résolution dans RAS Mapper.\n2. Configurez les coefficients de rugosité de **Manning** (ex: oued naturel en Algérie = 0.035 à 0.050).\n3. Définissez les conditions aux limites amont (Hydrogramme de crue centennal calculé par méthode rationnelle ou Soil Conservation Service).\n4. Définissez la condition aval (Pente normale de l'oued ou hauteur critique).\n\nPour des simulations complexes d'inondation en Algérie, consultez nos experts ENSH disposant de licences certifiées !";
    }

    if (strpos($msg, 'irrigation') !== false || strpos($msg, 'besoin') !== false || strpos($msg, 'etm') !== false) {
        return "Le calcul des besoins en eau d'irrigation repose sur la formule :\n**ETm = ET0 × Kc**\n- **ET0** : Évapotranspiration de référence (données météo de l'Office National de Météorologie - ONM).\n- **Kc** : Coefficient cultural spécifique à la plante (ex: blé dur en phase de montaison = 1.15).\n\nPour un dimensionnement de goutte-à-goutte, n'oubliez pas d'inclure le rendement de l'application (généralement 90%) dans le calcul final du débit de la pompe.";
    }

    if (strpos($msg, 'traitement') !== false || strpos($msg, 'chloration') !== false || strpos($msg, 'eau') !== false) {
        return "Le traitement des eaux superficielles en Algérie (ex: station de traitement de Baraki ou Keddara) comprend généralement :\n1. **Coagulation / Floculation** : Ajout de sulfate d'alumine (dosage optimal déterminé par Jar-Test).\n2. **Décantation** (lamellaire de préférence).\n3. **Filtration sur sable** (vitesse de filtration de 5 à 8 m/h).\n4. **Désinfection finale** par chloration gazeuse ou hypochlorite de sodium pour maintenir un chlore résiduel libre de 0.2 à 0.5 mg/l au robinet de l'abonné.";
    }

    if (strpos($msg, 'barrage') !== false || strpos($msg, 'digue') !== false) {
        return "Pour les barrages en terre ou collinaires en Algérie :\n1. L'analyse de filtration (logiciel **SEEP/W**) est cruciale pour éviter l'érosion interne. Assurez-vous d'avoir un tapis drainant ou un drain cheminée.\n2. Le dimensionnement de l'évacuateur de crues doit évacuer la crue millénale (QM) en toute sécurité sans submersion de la digue.\n3. Utilisez des enrochements de protection (Riprap) sur le parement amont pour lutter contre le batillage des vagues.";
    }

    if (strpos($msg, 'sig') !== false || strpos($msg, 'arcgis') !== false || strpos($msg, 'qgis') !== false) {
        return "L'intégration de SIG (ArcGIS Pro / QGIS) pour la gestion de l'eau permet de :\n1. Modéliser la topologie des réseaux de distribution et collecteurs.\n2. Effectuer des analyses spatiales d'accumulation de flux pour délimiter les bassins versants hydrographiques.\n3. Connecter des bases de données relationnelles aux objets géographiques (ex: fiches de vannes de sectionnement, vannes de purge).";
    }

    if (strpos($msg, 'bonjour') !== false || strpos($msg, 'salut') !== false || strpos($msg, 'hello') !== false) {
        return "Bonjour ! Je suis HydroBot. Posez-moi vos questions techniques sur vos projets d'hydraulique, AEP, assainissement, VRD ou SIG en Algérie !";
    }

    return "C'est une excellente question technique ! L'ingénierie dans ce domaine nécessite souvent une analyse approfondie. \n\nJe vous conseille de poser des questions précises sur **EPANET, HEC-RAS, l'irrigation, le traitement des eaux, les SIG ou les barrages**. Vous pouvez aussi directement contacter un de nos experts ENSH certifiés sur la plateforme !";
}

// B. AI Error Agent Smart Rules Engine
function getLocalErrorAgentAnalysis($text) {
    $msg = strtolower($text);
    $score = 85;
    $errors = [];
    $warnings = [];
    $suggestions = [];
    $resume = "Calculs techniques clairs et globalement structurés.";
    $niveau = "Bon";

    // Analyze hydraulic formulas
    if (strpos($msg, 'q =') !== false || strpos($msg, 'flow') !== false || strpos($msg, 'debit') !== false) {
        $suggestions[] = "Vérifier la validité des coefficients de débit et les pointes horaires d'utilisation pour le réseau.";
    }

    if (strpos($msg, 'manning') !== false || strpos($msg, 'v =') !== false) {
        $warnings[] = "Coefficient de rugosité Manning-Strickler bas (ex: K = 70 pour le béton lisse). S'assurer de l'état de surface réel après construction.";
    }

    if (strpos($msg, 'epanet') !== false) {
        $suggestions[] = "Intégrer une analyse dynamique sur 24h avec courbes de modulation de consommation ADE.";
    }

    // Check for common errors based on values
    if (preg_match('/v\s*=\s*([0-9\.,]+)/i', $msg, $matches)) {
        $v = floatval(str_replace(',', '.', $matches[1]));
        if ($v < 0.5) {
            $score -= 10;
            $errors[] = [
                "type" => "Vitesse d'écoulement trop faible",
                "description" => "La vitesse calculée ($v m/s) est inférieure à la vitesse minimale d'auto-curage (0.5 m/s pour l'assainissement gravitaire). Risque important d'envasement et de dépôts.",
                "gravite" => "Moyenne"
            ];
        } elseif ($v > 3.0) {
            $score -= 10;
            $errors[] = [
                "type" => "Vitesse d'écoulement excessive",
                "description" => "La vitesse de $v m/s dépasse la limite d'érosion des conduites standards (habituellement max 2.5 à 3.0 m/s). Risque d'usure prématurée et de coups de bélier violents.",
                "gravite" => "Moyenne"
            ];
        }
    }

    // Check for concrete grades
    if (strpos($msg, 'fc28') !== false || strpos($msg, 'beton') !== false) {
        if (strpos($msg, 'fc28 = 25') !== false || strpos($msg, 'b25') !== false) {
            $suggestions[] = "Pour des ouvrages hydrauliques en contact permanent avec l'eau (réservoirs, bâches), privilégier un béton fc28 = 30 MPa dosé à 400 kg/m³ avec adjuvant hydrofuge.";
        }
    }

    // Default errors if text is very short
    if (strlen($text) < 30) {
        $score = 45;
        $niveau = "Critique";
        $resume = "Données insuffisantes pour effectuer une analyse hydraulique ou structurale complète.";
        $errors[] = [
            "type" => "Format de note incomplet",
            "description" => "Veuillez insérer plus de lignes de calculs (formules, débits, diamètres, pressions) pour obtenir un audit technique pertinent.",
            "gravite" => "Critique"
        ];
    }

    // Adjust level based on score
    if ($score >= 90) $niveau = "Excellent";
    elseif ($score >= 70) $niveau = "Bon";
    elseif ($score >= 50) $niveau = "Moyen";
    else $niveau = "Critique";

    if ($score < 70) {
        $resume = "Calculs techniques critiques présentant des risques structurels ou hydrauliques.";
    }

    return [
        "score" => $score,
        "niveau" => $niveau,
        "erreurs" => $errors,
        "avertissements" => $warnings,
        "suggestions" => $suggestions,
        "resume" => $resume
    ];
}

// ══════════════════════════════════════════════════════════════
// ROUTING OPERATIONS
// ══════════════════════════════════════════════════════════════

if ($action === 'chatbot') {
    $messages_json = isset($_POST['messages']) ? $_POST['messages'] : '';
    if (empty($messages_json)) {
        echo json_encode(['error' => 'Historique de messages vide.']);
        exit;
    }

    $messages = json_decode($messages_json, true);
    if (!is_array($messages) || count($messages) === 0) {
        echo json_encode(['error' => 'Format de message invalide.']);
        exit;
    }

    $lastUserMessage = end($messages)['content'];

    // 1. If Anthropic Key is configured, make call to Anthropic API
    if (defined('ANTHROPIC_API_KEY') && ANTHROPIC_API_KEY !== '') {
        // Reformat messages history for Anthropic (only keeps user and assistant roles)
        $formatted_messages = [];
        foreach ($messages as $m) {
            $formatted_messages[] = [
                'role' => $m['role'] === 'user' ? 'user' : 'assistant',
                'content' => $m['content']
            ];
        }

        $postData = [
            'model' => 'claude-3-5-sonnet-20241022',
            'max_tokens' => 800,
            'system' => "Tu es HydroBot, assistant technique expert en hydraulique, génie civil, VRD, irrigation, SIG, ArcGIS, traitement des eaux, ouvrages hydrauliques (barrages, digues, évacuateurs de crues) en Algérie. Tu réponds en français avec une précision d'ingénieur. Sois concis.",
            'messages' => $formatted_messages
        ];

        $ch = curl_init('https://api.anthropic.com/v1/messages');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'x-api-key: ' . ANTHROPIC_API_KEY,
            'anthropic-version: 2023-06-01',
            'content-type: application/json'
        ]);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($postData));
        
        $response = curl_exec($ch);
        $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($http_code === 200) {
            $resData = json_decode($response, true);
            $reply = isset($resData['content'][0]['text']) ? $resData['content'][0]['text'] : '';
            if (!empty($reply)) {
                echo json_encode(['reply' => $reply]);
                exit;
            }
        }
    }

    // 2. Otherwise (or if API call fails), run the Local Rules Engine
    $localReply = getLocalChatbotReply($lastUserMessage);
    echo json_encode(['reply' => $localReply]);
    exit;

} elseif ($action === 'error_agent') {
    $text = isset($_POST['text']) ? trim($_POST['text']) : '';
    
    if (empty($text)) {
        echo json_encode(['error' => 'Texte vide.']);
        exit;
    }

    // 1. If Anthropic Key is configured, make call to Anthropic API
    if (defined('ANTHROPIC_API_KEY') && ANTHROPIC_API_KEY !== '') {
        $postData = [
            'model' => 'claude-3-5-sonnet-20241022',
            'max_tokens' => 1000,
            'system' => "Tu es un agent expert en vérification de calculs hydrauliques et génie civil en Algérie. Analyse le texte et retourne UNIQUEMENT un JSON valide sans backticks ou markdown:\n{\"score\":<0-100>,\"niveau\":\"<Excellent|Bon|Moyen|Critique>\",\"erreurs\":[{\"type\":\"<>\",\"description\":\"<>\",\"gravite\":\"<Faible|Moyenne|Critique>\"}],\"avertissements\":[\"<\"],\"suggestions\":[\"<\"],\"resume\":\"<>\"}",
            'messages' => [
                ['role' => 'user', 'content' => "Analyse la note technique suivante:\n\n" . $text]
            ]
        ];

        $ch = curl_init('https://api.anthropic.com/v1/messages');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'x-api-key: ' . ANTHROPIC_API_KEY,
            'anthropic-version: 2023-06-01',
            'content-type: application/json'
        ]);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($postData));
        
        $response = curl_exec($ch);
        $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($http_code === 200) {
            $resData = json_decode($response, true);
            $reply = isset($resData['content'][0]['text']) ? trim($resData['content'][0]['text']) : '';
            
            // Clean markdown code blocks if any
            $reply = preg_replace('/^```json|```$/i', '', $reply);
            
            $jsonData = json_decode(trim($reply), true);
            if (is_array($jsonData)) {
                echo json_encode($jsonData);
                exit;
            }
        }
    }

    // 2. Otherwise (or if API call fails), run the Local Analyzer Rules Engine
    $localAnalysis = getLocalErrorAgentAnalysis($text);
    echo json_encode($localAnalysis);
    exit;

} else {
    echo json_encode(['error' => 'Action inconnue.']);
}
?>
