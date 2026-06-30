<?php
session_start();
header('Content-Type: application/json');
require_once __DIR__ . '/../config/db.php';

// Authentication and Authorization Check
if (!isset($_SESSION['user_id']) || $_SESSION['user_type'] !== 'Admin') {
    echo json_encode(['error' => 'Accès non autorisé. Seuls les administrateurs peuvent effectuer cette action.']);
    exit;
}

$action = isset($_POST['action']) ? $_POST['action'] : '';

try {
    $db = getDB();
    
    if ($action === 'delete_user') {
        $id = isset($_POST['id']) ? intval($_POST['id']) : 0;
        if ($id <= 0) {
            echo json_encode(['error' => 'ID utilisateur invalide.']);
            exit;
        }
        
        // Prevent deleting oneself
        if ($id === intval($_SESSION['user_id'])) {
            echo json_encode(['error' => 'Vous ne pouvez pas supprimer votre propre compte administrateur.']);
            exit;
        }
        
        $stmt = $db->prepare("DELETE FROM users WHERE id = :id");
        $stmt->execute([':id' => $id]);
        
        echo json_encode(['success' => true, 'message' => 'Utilisateur supprimé avec succès !']);
        exit;
        
    } elseif ($action === 'toggle_expert_certification') {
        $id = isset($_POST['id']) ? intval($_POST['id']) : 0;
        if ($id <= 0) {
            echo json_encode(['error' => 'ID expert invalide.']);
            exit;
        }
        
        // Fetch current status
        $stmt = $db->prepare("SELECT certifie FROM experts WHERE id = :id");
        $stmt->execute([':id' => $id]);
        $expert = $stmt->fetch();
        
        if (!$expert) {
            echo json_encode(['error' => 'Expert introuvable.']);
            exit;
        }
        
        $new_status = $expert['certifie'] ? 0 : 1;
        $update = $db->prepare("UPDATE experts SET certifie = :status WHERE id = :id");
        $update->execute([':status' => $new_status, ':id' => $id]);
        
        echo json_encode(['success' => true, 'new_status' => $new_status, 'message' => 'Statut de certification mis à jour.']);
        exit;
        
    } elseif ($action === 'delete_project') {
        $id = isset($_POST['id']) ? intval($_POST['id']) : 0;
        if ($id <= 0) {
            echo json_encode(['error' => 'ID projet invalide.']);
            exit;
        }
        
        $stmt = $db->prepare("DELETE FROM problematiques WHERE id = :id");
        $stmt->execute([':id' => $id]);
        
        echo json_encode(['success' => true, 'message' => 'Appel à projet supprimé avec succès !']);
        exit;
        
    } elseif ($action === 'update_study_status') {
        $id = isset($_POST['id']) ? intval($_POST['id']) : 0;
        $status = isset($_POST['status']) ? trim($_POST['status']) : '';
        
        if ($id <= 0 || !in_array($status, ['Reçue', 'En cours', 'Livrée'])) {
            echo json_encode(['error' => 'Données de mise à jour d\'étude invalides.']);
            exit;
        }
        
        $stmt = $db->prepare("UPDATE etudes_techniques SET statut = :status WHERE id = :id");
        $stmt->execute([':status' => $status, ':id' => $id]);
        
        echo json_encode(['success' => true, 'message' => 'Statut de l\'étude mis à jour avec succès !']);
        exit;
        
    } else {
        echo json_encode(['error' => 'Action administrative inconnue.']);
        exit;
    }
    
} catch (PDOException $e) {
    echo json_encode(['error' => 'Erreur de base de données : ' . $e->getMessage()]);
}
?>
