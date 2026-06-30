<?php
session_start();
header('Content-Type: application/json');
require_once __DIR__ . '/../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['error' => 'Méthode non autorisée.']);
    exit;
}

$titre = isset($_POST['titre']) ? trim($_POST['titre']) : '';
$entreprise = isset($_POST['entreprise']) ? trim($_POST['entreprise']) : '';
$budget = isset($_POST['budget']) ? trim($_POST['budget']) : '';
$delai = isset($_POST['delai']) ? trim($_POST['delai']) : '';
$secteur = isset($_POST['secteur']) ? trim($_POST['secteur']) : 'Étatique';
$wilaya = isset($_POST['wilaya']) ? trim($_POST['wilaya']) : 'Alger';
$domaine = isset($_POST['domaine']) ? trim($_POST['domaine']) : 'AEP';
$desc = isset($_POST['desc']) ? trim($_POST['desc']) : '';
$urgent = isset($_POST['urgent']) && $_POST['urgent'] == '1' ? 1 : 0;

if (empty($titre) || empty($entreprise) || empty($budget) || empty($delai) || empty($desc)) {
    echo json_encode(['error' => 'Veuillez remplir tous les champs obligatoires.']);
    exit;
}

try {
    $db = getDB();
    $date = date('d/m/Y');
    $user_id = isset($_SESSION['user_id']) ? intval($_SESSION['user_id']) : null;
    
    $stmt = $db->prepare("INSERT INTO problematiques (user_id, titre, entreprise, secteur, wilaya, budget, delai, domaine, urgent, candidats, `desc`, `date`) VALUES (:user_id, :titre, :entreprise, :secteur, :wilaya, :budget, :delai, :domaine, :urgent, 0, :description, :date)");
    
    $stmt->execute([
        ':user_id' => $user_id,
        ':titre' => $titre,
        ':entreprise' => $entreprise,
        ':secteur' => $secteur,
        ':wilaya' => $wilaya,
        ':budget' => $budget,
        ':delai' => $delai,
        ':domaine' => $domaine,
        ':urgent' => $urgent,
        ':description' => $desc,
        ':date' => $date
    ]);

    echo json_encode(['success' => true, 'message' => 'Problématique technique publiée avec succès !']);
} catch (PDOException $e) {
    echo json_encode(['error' => 'Erreur de base de données : ' . $e->getMessage()]);
}
?>
