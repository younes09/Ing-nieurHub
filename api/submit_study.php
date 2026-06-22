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

try {
    $db = getDB();
    $date = date('d/m/Y');
    
    $stmt = $db->prepare("INSERT INTO etudes_techniques (titre, type, logiciel, wilaya, `desc`, statut, `date`) VALUES (:titre, :type, :logiciel, :wilaya, :description, 'Reçue', :date)");
    
    $stmt->execute([
        ':titre' => $titre,
        ':type' => $type,
        ':logiciel' => $logiciel,
        ':wilaya' => $wilaya,
        ':description' => $desc,
        ':date' => $date
    ]);

    echo json_encode(['success' => true, 'message' => 'Étude technique soumise pour vérification !']);
} catch (PDOException $e) {
    echo json_encode(['error' => 'Erreur de base de données : ' . $e->getMessage()]);
}
?>
