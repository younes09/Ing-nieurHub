<?php
// Session is already started in index.php
?>
<div class="container py-5 px-3" style="max-width: 420px; margin: 30px auto;">
    <?php if (isset($_SESSION['user_id'])): ?>
        <!-- LOGGED IN VIEW -->
        <div class="bg-white rounded-4 p-5 shadow-sm border border-light-subtle text-center" id="logged-in-view">
            <div class="fs-1 mb-3">👷</div>
            <h2 class="fw-bold fs-4 mb-2" style="color: var(--primary);">Bienvenue sur IngénieurHub !</h2>
            <p class="text-muted small mb-4">Connecté en tant que <b class="text-dark"><?php echo htmlspecialchars($_SESSION['user_type']); ?></b>.</p>
            <button class="btn btn-premium px-4 py-2" onclick="logoutUser()">Déconnexion</button>
        </div>
    <?php else: ?>
        <!-- AUTH FORM -->
        <div class="bg-white rounded-4 p-4 shadow-sm border border-light-subtle">
            <!-- Tabs Header -->
            <div class="text-center mb-4">
                <div class="fw-extrabold fs-4 mb-3" style="color: var(--primary);">
                    Ingénieur<span style="color: var(--accent);">Hub</span>
                </div>
                <div class="d-flex rounded-3 overflow-hidden border border-info-subtle">
                    <button class="btn btn-sm flex-grow-1 py-2 rounded-0 fs-7 fw-bold btn-primary" id="btn-mode-login" onclick="switchAuthMode('login')">Connexion</button>
                    <button class="btn btn-sm flex-grow-1 py-2 rounded-0 fs-7 text-primary bg-white" id="btn-mode-register" onclick="switchAuthMode('register')">Inscription</button>
                </div>
            </div>

            <form id="auth-form" onsubmit="handleAuthSubmit(event)">
                <input type="hidden" name="action" id="auth-action-type" value="login">
                
                <!-- Role selector for Registration -->
                <div class="d-none mb-3" id="register-role-selector">
                    <input type="hidden" name="type" id="register-role-value" value="Client">
                    <div class="row g-1">
                        <div class="col-3">
                            <button type="button" class="btn btn-sm w-100 py-2 border-2 border-primary fw-bold text-primary" onclick="setRegisterRole(this, 'Client')" style="background-color: var(--light); font-size: 10px;">👤 Client</button>
                        </div>
                        <div class="col-3">
                            <button type="button" class="btn btn-sm w-100 py-2 border-2 border-light-subtle text-secondary" onclick="setRegisterRole(this, 'Expert')" style="background-color: #fff; font-size: 10px;">🔧 Expert</button>
                        </div>
                        <div class="col-3">
                            <button type="button" class="btn btn-sm w-100 py-2 border-2 border-light-subtle text-secondary" onclick="setRegisterRole(this, 'Bureau')" style="background-color: #fff; font-size: 10px;">🏢 Bureau</button>
                        </div>
                        <div class="col-3">
                            <button type="button" class="btn btn-sm w-100 py-2 border-2 border-light-subtle text-secondary" onclick="setRegisterRole(this, 'Étudiant')" style="background-color: #fff; font-size: 10px;">🎓 Étudiant</button>
                        </div>
                    </div>
                </div>

                <!-- Fields -->
                <div class="mb-2 d-none" id="register-name-field">
                    <input type="text" name="nom" class="form-control form-control-sm py-2 fs-7" placeholder="Nom complet">
                </div>
                <div class="mb-2">
                    <input type="email" name="email" class="form-control form-control-sm py-2 fs-7" placeholder="Email" required>
                </div>
                <div class="mb-3">
                    <input type="password" name="password" class="form-control form-control-sm py-2 fs-7" placeholder="Mot de passe" required>
                </div>
                
                <!-- Alert status container -->
                <div id="auth-status-alert" class="alert d-none mb-3 py-2 fs-7"></div>
                
                <button type="submit" class="btn btn-premium w-100 py-2 fs-7 border-0" id="auth-submit-btn">Se connecter</button>
            </form>
        </div>
    <?php endif; ?>
</div>
