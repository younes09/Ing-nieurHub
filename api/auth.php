<?php
session_start();
header('Content-Type: application/json');
require_once __DIR__ . '/../config/db.php';

$action = isset($_POST['action']) ? $_POST['action'] : '';

if ($action === 'login') {
    $email = isset($_POST['email']) ? trim($_POST['email']) : '';
    $password = isset($_POST['password']) ? $_POST['password'] : '';

    if (empty($email) || empty($password)) {
        echo json_encode(['error' => 'Veuillez remplir tous les champs.']);
        exit;
    }

    try {
        $db = getDB();
        $stmt = $db->prepare("SELECT * FROM users WHERE email = :email");
        $stmt->execute([':email' => $email]);
        $user = $stmt->fetch();

        if ($user && password_verify($password, $user['password'])) {
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['user_name'] = $user['nom'];
            $_SESSION['user_type'] = $user['type'];
            $_SESSION['user_email'] = $user['email'];
            echo json_encode(['success' => true, 'message' => 'Connexion réussie !']);
        } else {
            echo json_encode(['error' => 'Identifiants incorrects.']);
        }
    } catch (PDOException $e) {
        echo json_encode(['error' => 'Erreur de base de données : ' . $e->getMessage()]);
    }
} elseif ($action === 'register') {
    $nom = isset($_POST['nom']) ? trim($_POST['nom']) : '';
    $email = isset($_POST['email']) ? trim($_POST['email']) : '';
    $password = isset($_POST['password']) ? $_POST['password'] : '';
    $type = isset($_POST['type']) ? trim($_POST['type']) : 'Client';

    if (empty($nom) || empty($email) || empty($password) || empty($type)) {
        echo json_encode(['error' => 'Veuillez remplir tous les champs obligatoires.']);
        exit;
    }

    $valid_types = ['Client', 'Expert', 'Bureau', 'Étudiant'];
    if (!in_array($type, $valid_types)) {
        echo json_encode(['error' => 'Rôle invalide.']);
        exit;
    }

    try {
        $db = getDB();
        
        // Check if email already exists
        $check = $db->prepare("SELECT id FROM users WHERE email = :email");
        $check->execute([':email' => $email]);
        if ($check->fetch()) {
            echo json_encode(['error' => 'Cet email est déjà utilisé.']);
            exit;
        }

        // Insert new user
        $hashed_pwd = password_hash($password, PASSWORD_DEFAULT);
        $stmt = $db->prepare("INSERT INTO users (nom, email, password, type) VALUES (:nom, :email, :password, :type)");
        $stmt->execute([
            ':nom' => $nom,
            ':email' => $email,
            ':password' => $hashed_pwd,
            ':type' => $type
        ]);

        // Auto-login the registered user
        $_SESSION['user_id'] = $db->lastInsertId();
        $_SESSION['user_name'] = $nom;
        $_SESSION['user_type'] = $type;
        $_SESSION['user_email'] = $email;

        echo json_encode(['success' => true, 'message' => 'Inscription et connexion réussies !']);
    } catch (PDOException $e) {
        echo json_encode(['error' => 'Erreur de base de données : ' . $e->getMessage()]);
    }
} elseif ($action === 'logout') {
    session_unset();
    session_destroy();
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['error' => 'Action inconnue.']);
}
?>
