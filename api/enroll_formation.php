<?php
session_start();
header('Content-Type: application/json');
require_once __DIR__ . '/../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['error' => 'Méthode non autorisée.']);
    exit;
}

$formation_id = isset($_POST['formation_id']) ? intval($_POST['formation_id']) : 0;
$nom = isset($_POST['nom']) ? trim($_POST['nom']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';

if ($formation_id <= 0 || empty($nom) || empty($email)) {
    echo json_encode(['error' => 'Veuillez remplir tous les champs requis.']);
    exit;
}

try {
    $db = getDB();
    
    $stmt = $db->prepare("INSERT INTO formations_inscriptions (formation_id, nom, email) VALUES (:f_id, :nom, :email)");
    $stmt->execute([
        ':f_id' => $formation_id,
        ':nom' => $nom,
        ':email' => $email
    ]);

    echo json_encode(['success' => true, 'message' => "Inscription validée ! Un conseiller d'IngénieurHub va vous contacter par email pour les détails de paiement."]);
} catch (PDOException $e) {
    echo json_encode(['error' => 'Erreur de base de données : ' . $e->getMessage()]);
}
?>
