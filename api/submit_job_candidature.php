<?php
session_start();
header('Content-Type: application/json');
require_once __DIR__ . '/../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['error' => 'Méthode non autorisée.']);
    exit;
}

$offre_id = isset($_POST['offre_id']) ? intval($_POST['offre_id']) : 0;
$nom = isset($_POST['nom']) ? trim($_POST['nom']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$tel = isset($_POST['tel']) ? trim($_POST['tel']) : '';
$msg = isset($_POST['msg']) ? trim($_POST['msg']) : '';

if ($offre_id <= 0 || empty($nom) || empty($email) || empty($tel) || empty($msg)) {
    echo json_encode(['error' => 'Veuillez remplir tous les champs requis.']);
    exit;
}

try {
    $db = getDB();
    
    $stmt = $db->prepare("INSERT INTO recrutement_candidatures (offre_id, nom, email, tel, msg) VALUES (:o_id, :nom, :email, :tel, :msg)");
    $stmt->execute([
        ':o_id' => $offre_id,
        ':nom' => $nom,
        ':email' => $email,
        ':tel' => $tel,
        ':msg' => $msg
    ]);

    echo json_encode(['success' => true, 'message' => "Candidature enregistrée ! Un accusé de réception vous a été envoyé à l'adresse fournie."]);
} catch (PDOException $e) {
    echo json_encode(['error' => 'Erreur de base de données : ' . $e->getMessage()]);
}
?>
