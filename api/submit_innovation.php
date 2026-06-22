<?php
session_start();
header('Content-Type: application/json');
require_once __DIR__ . '/../db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['error' => 'Méthode non autorisée.']);
    exit;
}

$titre = isset($_POST['titre']) ? trim($_POST['titre']) : '';
$auteur = isset($_POST['auteur']) ? trim($_POST['auteur']) : '';
$univ = isset($_POST['univ']) ? trim($_POST['univ']) : '';
$type = isset($_POST['type']) ? trim($_POST['type']) : 'Agent IA';
$domaine = isset($_POST['domaine']) ? trim($_POST['domaine']) : 'Hydraulique';
$prix = isset($_POST['prix']) ? trim($_POST['prix']) : 'Incubation';
$tags = isset($_POST['tags']) ? trim($_POST['tags']) : '';
$desc = isset($_POST['desc']) ? trim($_POST['desc']) : '';

if (empty($titre) || empty($auteur) || empty($univ) || empty($desc)) {
    echo json_encode(['error' => 'Veuillez remplir tous les champs obligatoires.']);
    exit;
}

// Set status according to price input
$statut = (strtolower($prix) === 'incubation' || strtolower($prix) === 'cherche incubateur') ? 'Cherche incubateur' : 'À vendre';

try {
    $db = getDB();
    
    $stmt = $db->prepare("INSERT INTO innovations (titre, auteur, type, univ, domaine, prix, tags, `desc`, note, vues, statut) VALUES (:titre, :auteur, :type, :univ, :domaine, :prix, :tags, :description, 5.0, 0, :statut)");
    
    $stmt->execute([
        ':titre' => $titre,
        ':auteur' => $auteur,
        ':type' => $type,
        ':univ' => $univ,
        ':domaine' => $domaine,
        ':prix' => $prix,
        ':tags' => $tags,
        ':description' => $desc,
        ':statut' => $statut
    ]);

    echo json_encode(['success' => true, 'message' => 'Projet soumis ! Il sera examiné et publié sous 48h.']);
} catch (PDOException $e) {
    echo json_encode(['error' => 'Erreur de base de données : ' . $e->getMessage()]);
}
?>
