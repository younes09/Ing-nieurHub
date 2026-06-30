<?php
session_start();
header('Content-Type: application/json');
require_once __DIR__ . '/../config/db.php';

// Verify session authentication and role
if (!isset($_SESSION['user_id']) || !in_array($_SESSION['user_type'], ['Expert', 'Bureau'])) {
    echo json_encode(['error' => 'Accès non autorisé. Vous devez être connecté en tant qu\'Expert ou Bureau.']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['error' => 'Méthode non autorisée.']);
    exit;
}

$nom = isset($_POST['nom']) ? trim($_POST['nom']) : '';
$grade = isset($_POST['grade']) ? trim($_POST['grade']) : '';
$spec = isset($_POST['spec']) ? trim($_POST['spec']) : '';
$wilaya = isset($_POST['wilaya']) ? trim($_POST['wilaya']) : '';
$prix = isset($_POST['prix']) ? intval($_POST['prix']) : 0;
$domainesPost = isset($_POST['domaines']) ? $_POST['domaines'] : '';

// Convert domains array to comma-separated string if needed
$domaines = '';
if (is_array($domainesPost)) {
    $domaines = implode(',', array_map('trim', $domainesPost));
} else {
    $domaines = trim($domainesPost);
}

// Input validation
if (empty($nom) || empty($grade) || empty($spec) || empty($wilaya) || $prix <= 0 || empty($domaines)) {
    echo json_encode(['error' => 'Veuillez remplir correctement tous les champs obligatoires.']);
    exit;
}

$email = $_SESSION['user_email'];

// Helper function to extract expert initials for profile avatar
function getInitials($name) {
    // Remove special characters
    $nameClean = preg_replace('/[^a-zA-Z\s]/', '', $name);
    $words = preg_split("/\s+/", $nameClean);
    
    // Skip academic or generic prefixes to get actual name initials
    $prefixes = ['pr', 'dr', 'mcf', 'm', 'mme', 'professeur', 'enseignant', 'ingenieur', 'ingenieure'];
    $filtered = [];
    foreach ($words as $w) {
        if (!in_array(strtolower($w), $prefixes) && !empty($w)) {
            $filtered[] = $w;
        }
    }
    
    if (empty($filtered)) {
        $filtered = $words;
    }
    
    $initials = '';
    foreach (array_slice($filtered, 0, 2) as $w) {
        $initials .= strtoupper(substr($w, 0, 1));
    }
    
    return !empty($initials) ? substr($initials, 0, 5) : 'EX';
}

$img = getInitials($nom);

try {
    $db = getDB();
    
    // Check if expert profile exists
    $stmt = $db->prepare("SELECT id FROM experts WHERE email = :email");
    $stmt->execute([':email' => $email]);
    $existing = $stmt->fetch();
    
    $db->beginTransaction();
    
    if ($existing) {
        // Update existing profile
        $update = $db->prepare("
            UPDATE experts 
            SET nom = :nom, 
                spec = :spec, 
                grade = :grade, 
                wilaya = :wilaya, 
                prix = :prix, 
                domaines = :domaines, 
                img = :img 
            WHERE email = :email
        ");
        $update->execute([
            ':nom' => $nom,
            ':spec' => $spec,
            ':grade' => $grade,
            ':wilaya' => $wilaya,
            ':prix' => $prix,
            ':domaines' => $domaines,
            ':img' => $img,
            ':email' => $email
        ]);
    } else {
        // Create new expert profile linked to this user's email
        $insert = $db->prepare("
            INSERT INTO experts 
            (nom, email, spec, wilaya, note, avis, prix, dispo, online, certifie, img, ensh, grade, domaines, projets) 
            VALUES 
            (:nom, :email, :spec, :wilaya, 5.0, 0, :prix, 1, 0, 0, :img, 0, :grade, :domaines, 0)
        ");
        $insert->execute([
            ':nom' => $nom,
            ':email' => $email,
            ':spec' => $spec,
            ':wilaya' => $wilaya,
            ':prix' => $prix,
            ':img' => $img,
            ':grade' => $grade,
            ':domaines' => $domaines
        ]);
    }
    
    // Sync the name back to the users table
    $updateUser = $db->prepare("UPDATE users SET nom = :nom WHERE email = :email");
    $updateUser->execute([
        ':nom' => $nom,
        ':email' => $email
    ]);
    
    $db->commit();
    
    // Update session variable so it reflects immediately on header and pages
    $_SESSION['user_name'] = $nom;
    
    echo json_encode([
        'success' => true, 
        'message' => 'Votre profil expert a été mis à jour avec succès !'
    ]);
    
} catch (PDOException $e) {
    if ($db->inTransaction()) {
        $db->rollBack();
    }
    echo json_encode(['error' => 'Erreur de base de données : ' . $e->getMessage()]);
}
?>
