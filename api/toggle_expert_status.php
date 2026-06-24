<?php
session_start();
header('Content-Type: application/json');
require_once __DIR__ . '/../db.php';

if (!isset($_SESSION['user_id']) || !in_array($_SESSION['user_type'], ['Expert', 'Bureau'])) {
    echo json_encode(['error' => 'Accès non autorisé.']);
    exit;
}

$action = isset($_POST['action']) ? $_POST['action'] : '';
$email = isset($_SESSION['user_email']) ? $_SESSION['user_email'] : '';

if (empty($email)) {
    echo json_encode(['error' => 'Session utilisateur invalide.']);
    exit;
}

try {
    $db = getDB();
    
    // First, verify that the expert profile exists for this email
    $stmt = $db->prepare("SELECT id, dispo, online FROM experts WHERE email = :email");
    $stmt->execute([':email' => $email]);
    $expert = $stmt->fetch();
    
    if (!$expert) {
        echo json_encode(['error' => 'Profil d\'expert introuvable. Veuillez d\'abord configurer votre profil public.']);
        exit;
    }
    
    if ($action === 'toggle_dispo') {
        $new_val = $expert['dispo'] ? 0 : 1;
        $update = $db->prepare("UPDATE experts SET dispo = :val WHERE id = :id");
        $update->execute([':val' => $new_val, ':id' => $expert['id']]);
        echo json_encode(['success' => true, 'field' => 'dispo', 'value' => $new_val, 'message' => 'Disponibilité mise à jour !']);
        exit;
    } elseif ($action === 'toggle_online') {
        $new_val = $expert['online'] ? 0 : 1;
        $update = $db->prepare("UPDATE experts SET online = :val WHERE id = :id");
        $update->execute([':val' => $new_val, ':id' => $expert['id']]);
        echo json_encode(['success' => true, 'field' => 'online', 'value' => $new_val, 'message' => 'Statut en ligne mis à jour !']);
        exit;
    } else {
        echo json_encode(['error' => 'Action inconnue.']);
        exit;
    }
} catch (PDOException $e) {
    echo json_encode(['error' => 'Erreur de base de données : ' . $e->getMessage()]);
}
?>
