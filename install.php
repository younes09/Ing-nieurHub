<?php
require_once __DIR__ . '/config.php';

echo "<h2>IngénieurHub Database Installer</h2>";
echo "Attempting to connect to MySQL server at " . DB_HOST . "...<br>";

try {
    // Connect without dbname first, in case it doesn't exist
    $dsn = "mysql:host=" . DB_HOST . ";charset=utf8mb4";
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];
    
    $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
    echo "<span style='color: green;'>✔ Connected to MySQL successfully.</span><br><br>";
    
    echo "Reading schema.sql file...<br>";
    $sqlFile = __DIR__ . '/schema.sql';
    if (!file_exists($sqlFile)) {
        throw new Exception("schema.sql file not found in " . __DIR__);
    }
    
    $sql = file_get_contents($sqlFile);
    echo "Executing schema commands...<br>";
    
    // We can execute the SQL script. MySQL allows multiple queries in PDO exec if emulate prepares is enabled
    // or we can split the file by semicolon. For simplicity, we enable emulation temporarily or run it query by query.
    // Splitting by semicolon is usually fine unless there are semicolons inside quotes.
    // Let's run the SQL file directly using a loop or PDO multi-query support:
    $pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, true);
    $pdo->exec($sql);
    
    echo "<br><span style='color: green; font-size: 18px; font-weight: bold;'>✔ Database 'ingenieur_hub' created and seeded successfully!</span><br><br>";
    echo "<a href='index.php' style='padding: 10px 20px; background: #0a4f8a; color: #fff; text-decoration: none; border-radius: 5px; font-weight: bold;'>Go to IngénieurHub Home</a>";
    
} catch (Exception $e) {
    echo "<br><span style='color: red; font-size: 16px; font-weight: bold;'>❌ Error: " . $e->getMessage() . "</span><br>";
    echo "Please verify your credentials in <b>config.php</b> and ensure that your XAMPP MySQL service is active.";
}
?>
