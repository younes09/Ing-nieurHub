<?php
session_start();
header('Content-Type: application/json');
require_once __DIR__ . '/../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['error' => 'Méthode non autorisée.']);
    exit;
}

$project_id = isset($_POST['project_id']) ? intval($_POST['project_id']) : 0;
$nom = isset($_POST['nom']) ? trim($_POST['nom']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$exp = isset($_POST['exp']) ? trim($_POST['exp']) : '';
$lettre = isset($_POST['lettre']) ? trim($_POST['lettre']) : '';

if ($project_id <= 0 || empty($nom) || empty($email) || empty($lettre)) {
    echo json_encode(['error' => 'Veuillez remplir tous les champs requis.']);
    exit;
}

try {
    $db = getDB();
    $db->beginTransaction();

    // 1. Insert candidacy
    $stmt = $db->prepare("INSERT INTO candidatures_projets (problematique_id, nom, email, exp, lettre) VALUES (:p_id, :nom, :email, :exp, :lettre)");
    $stmt->execute([
        ':p_id' => $project_id,
        ':nom' => $nom,
        ':email' => $email,
        ':exp' => $exp,
        ':lettre' => $lettre
    ]);

    // 2. Increment applicant count
    $update = $db->prepare("UPDATE problematiques SET candidats = candidats + 1 WHERE id = :p_id");
    $update->execute([':p_id' => $project_id]);

    $db->commit();
    echo json_encode(['success' => true, 'message' => 'Candidature envoyée ! Ce projet sera ajouté à votre CV numérique si validé.']);
} catch (PDOException $e) {
    if ($db->inTransaction()) {
        $db->rollBack();
    }
    echo json_encode(['error' => 'Erreur de base de données : ' . $e->getMessage()]);
}
?>
