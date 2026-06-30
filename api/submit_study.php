<?php
session_start();
header('Content-Type: application/json');
require_once __DIR__ . '/../db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['error' => 'Méthode non autorisée.']);
    exit;
}

$type = isset($_POST['type']) ? trim($_POST['type']) : '';
$logiciel = isset($_POST['logiciel']) ? trim($_POST['logiciel']) : '';
$titre = isset($_POST['titre']) ? trim($_POST['titre']) : '';
$wilaya = isset($_POST['wilaya']) ? trim($_POST['wilaya']) : '';
$desc = isset($_POST['desc']) ? trim($_POST['desc']) : '';

if (empty($type) || empty($titre) || empty($wilaya) || empty($desc)) {
    echo json_encode(['error' => 'Veuillez remplir tous les champs obligatoires.']);
    exit;
}

$fichier = null;

// Handle file upload if present
if (isset($_FILES['study_file']) && $_FILES['study_file']['error'] !== UPLOAD_ERR_NO_FILE) {
    $file = $_FILES['study_file'];
    
    // Check for upload errors
    if ($file['error'] !== UPLOAD_ERR_OK) {
        echo json_encode(['error' => 'Erreur lors du téléchargement du fichier (Code: ' . $file['error'] . ').']);
        exit;
    }
    
    // Validate file size (max 20MB)
    $maxSize = 20 * 1024 * 1024; // 20 megabytes
    if ($file['size'] > $maxSize) {
        echo json_encode(['error' => 'Le fichier est trop volumineux. La taille maximale autorisée est de 20 Mo.']);
        exit;
    }
    
    // Validate file extension
    $allowedExtensions = ['pdf', 'zip', 'shp', 'dwg', 'docx', 'doc', 'xls', 'xlsx', 'rar', '7z', 'txt', 'png', 'jpg', 'jpeg'];
    $originalName = $file['name'];
    $ext = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));
    
    if (!in_array($ext, $allowedExtensions)) {
        echo json_encode(['error' => 'Format de fichier non autorisé. Formats acceptés: ' . implode(', ', $allowedExtensions)]);
        exit;
    }
    
    // Generate clean unique file name
    $sanitizedBase = preg_replace('/[^a-zA-Z0-9_\-]/', '_', pathinfo($originalName, PATHINFO_FILENAME));
    $newFileName = 'study_' . uniqid() . '_' . substr($sanitizedBase, 0, 30) . '.' . $ext;
    
    $uploadDir = __DIR__ . '/../uploads/studies/';
    // Double check that upload directory exists
    if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }
    
    $destPath = $uploadDir . $newFileName;
    
    if (move_uploaded_file($file['tmp_name'], $destPath)) {
        $fichier = $newFileName;
    } else {
        echo json_encode(['error' => 'Impossible de sauvegarder le fichier sur le serveur. Veillez à ce que le dossier uploads soit accessible en écriture.']);
        exit;
    }
}

try {
    $db = getDB();
    $date = date('d/m/Y');
    $user_id = isset($_SESSION['user_id']) ? intval($_SESSION['user_id']) : null;
    
    $stmt = $db->prepare("
        INSERT INTO etudes_techniques 
        (user_id, titre, type, logiciel, wilaya, `desc`, statut, `date`, `fichier`) 
        VALUES 
        (:user_id, :titre, :type, :logiciel, :wilaya, :description, 'Reçue', :date, :fichier)
    ");
    
    $stmt->execute([
        ':user_id' => $user_id,
        ':titre' => $titre,
        ':type' => $type,
        ':logiciel' => $logiciel,
        ':wilaya' => $wilaya,
        ':description' => $desc,
        ':date' => $date,
        ':fichier' => $fichier
    ]);

    echo json_encode(['success' => true, 'message' => 'Étude technique soumise pour vérification avec fichier joint !']);
} catch (PDOException $e) {
    echo json_encode(['error' => 'Erreur de base de données : ' . $e->getMessage()]);
}
?>
