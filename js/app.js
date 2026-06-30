// ══════════════════════════════════════════════════════════════
// NAVIGATION
// ══════════════════════════════════════════════════════════════
function navigateTo(page, params = {}) {
    let url = 'index.php?page=' + page;
    for (let key in params) {
        url += '&' + key + '=' + encodeURIComponent(params[key]);
    }
    window.location.href = url;
}

function handleGlobalSearch() {
    const q = $('#global-search-input').val().trim();
    if (!q) return;
    // Go to experts or suppliers depending on content, let's route to experts with search filter
    navigateTo('experts', { search: q });
}

function tagSearch(tag) {
    navigateTo('experts', { search: tag });
}

// Check for parameters on load
$(document).ready(function() {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Auto-search filter on Experts page
    if (urlParams.get('page') === 'experts') {
        const search = urlParams.get('search');
        if (search) {
            $('#filter-expert-domain').val(search);
            // If the search tag isn't a direct domain, we can still trigger search filter logic
            filterExperts();
        }
        
        const enshOnly = urlParams.get('enshOnly');
        if (enshOnly === 'true') {
            $('#btn-filter-ensh').addClass('active').css('background-color', '#b45309').css('color', '#fff');
            filterExperts();
        }
        
        // Listen to filters changes
        $('#filter-expert-domain, #filter-expert-wilaya').on('change', filterExperts);
    }
    
    // Listen to Travail page project filters
    if (urlParams.get('page') === 'travail') {
        $('#filter-project-domain').on('change', filterProjects);
    }
    
    // Listen to Fournisseurs page filters
    if (urlParams.get('page') === 'fournisseurs') {
        $('#filter-supplier-wilaya').on('change', filterSuppliers);
    }
    
    // File upload Drag and Drop listeners
    const dropzone = $('#file-dropzone');
    if (dropzone.length > 0) {
        dropzone.on('dragover dragenter', function(e) {
            e.preventDefault();
            e.stopPropagation();
            dropzone.css('border-color', '#3b82f6').css('background-color', '#eff6ff');
        });
        dropzone.on('dragleave dragend drop', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (e.type !== 'drop') {
                dropzone.css('border-color', '#b3d6f0').css('background-color', 'var(--light)');
            }
        });
        dropzone.on('drop', function(e) {
            dropzone.css('border-color', '#22c55e').css('background-color', 'var(--light)');
            const files = e.originalEvent.dataTransfer.files;
            if (files.length > 0) {
                $('#study_file')[0].files = files;
                handleFileSelect($('#study_file')[0]);
            }
        });
    }
});

// ══════════════════════════════════════════════════════════════
// CLIENT-SIDE FILTERING LOGIC
// ══════════════════════════════════════════════════════════════

// 1. Experts Filtering
let enshFilterActive = false;
function toggleEnshFilter() {
    enshFilterActive = !enshFilterActive;
    const btn = $('#btn-filter-ensh');
    if (enshFilterActive) {
        btn.addClass('active').css('background-color', '#b45309').css('color', '#fff');
    } else {
        btn.removeClass('active').css('background-color', 'transparent').css('color', '#92400e');
    }
    filterExperts();
}

function filterExperts() {
    const selectedDomain = $('#filter-expert-domain').val();
    const selectedWilaya = $('#filter-expert-wilaya').val();
    
    let visibleCount = 0;
    $('.expert-card-container').each(function() {
        const card = $(this);
        const cardDomains = card.data('domaines').toString().split(',');
        const cardWilaya = card.data('wilaya');
        const cardEnsh = card.data('ensh') == '1';
        
        const domainMatch = (selectedDomain === 'Tous') || cardDomains.includes(selectedDomain) || card.find('.expert-card-container').prevObject.text().toLowerCase().includes(selectedDomain.toLowerCase());
        const wilayaMatch = (selectedWilaya === 'Toutes') || (cardWilaya === selectedWilaya);
        const enshMatch = !enshFilterActive || cardEnsh;
        
        if (domainMatch && wilayaMatch && enshMatch) {
            card.removeClass('d-none');
            visibleCount++;
        } else {
            card.addClass('d-none');
        }
    });
    $('#experts-count').text(visibleCount);
}

// 2. Projects Filtering
let urgentFilterActive = false;
function toggleUrgentFilter() {
    urgentFilterActive = !urgentFilterActive;
    const btn = $('#btn-filter-urgent');
    if (urgentFilterActive) {
        btn.addClass('active bg-danger text-white');
    } else {
        btn.removeClass('active bg-danger text-white');
    }
    filterProjects();
}

function filterProjects() {
    const selectedDomain = $('#filter-project-domain').val();
    
    let visibleCount = 0;
    $('.project-card-container').each(function() {
        const card = $(this);
        const cardDomaine = card.data('domaine');
        const cardUrgent = card.data('urgent') == '1';
        
        const domainMatch = (selectedDomain === 'Tous') || (cardDomaine === selectedDomain);
        const urgentMatch = !urgentFilterActive || cardUrgent;
        
        if (domainMatch && urgentMatch) {
            card.removeClass('d-none');
            visibleCount++;
        } else {
            card.addClass('d-none');
        }
    });
    $('#projects-visible-count').text(visibleCount);
}

// 3. Suppliers Filtering
let activeSupplierCat = 'Tous';
function filterSupplierCategory(element, category) {
    $('#supplier-cats-chips button').removeClass('btn-premium text-white').addClass('btn-outline-info text-primary bg-white');
    $(element).addClass('btn-premium text-white').removeClass('btn-outline-info text-primary bg-white');
    
    activeSupplierCat = category;
    filterSuppliers();
}

function filterSuppliers() {
    const selectedWilaya = $('#filter-supplier-wilaya').val();
    
    let visibleCount = 0;
    $('.material-card-container').each(function() {
        const card = $(this);
        const cardCat = card.data('categorie');
        const cardWilaya = card.data('wilaya');
        
        const catMatch = (activeSupplierCat === 'Tous') || (cardCat === activeSupplierCat);
        const wilayaMatch = (selectedWilaya === 'Toutes') || (cardWilaya === selectedWilaya);
        
        if (catMatch && wilayaMatch) {
            card.removeClass('d-none');
            visibleCount++;
        } else {
            card.addClass('d-none');
        }
    });
    $('#materials-visible-count').text(visibleCount);
}

// 4. Innovation Filtering
function filterInnovationType(element, type) {
    $('#innovation-types-chips button').removeClass('btn-premium text-white').addClass('btn-outline-secondary bg-white text-secondary');
    
    const activeColor = $(element).data('type-color') || '#7c3aed';
    $(element).addClass('btn-premium text-white').removeClass('btn-outline-secondary bg-white text-secondary').css('background-color', activeColor).css('border-color', activeColor);
    
    $('.innovation-card-container').each(function() {
        const card = $(this);
        const cardType = card.data('type');
        
        if (type === 'Tous' || cardType === type) {
            card.removeClass('d-none');
        } else {
            card.addClass('d-none');
        }
    });
}

// 5. Formations Filtering
function filterFormationCategory(element, category) {
    $('#formation-cats-chips button').removeClass('btn-premium text-white').addClass('btn-outline-info text-primary bg-white');
    $(element).addClass('btn-premium text-white').removeClass('btn-outline-info text-primary bg-white');
    
    $('.formation-card-container').each(function() {
        const card = $(this);
        const cardDomaine = card.data('domaine');
        
        if (category === 'Tous' || cardDomaine === category) {
            card.removeClass('d-none');
        } else {
            card.addClass('d-none');
        }
    });
}

// 6. Recrutement Jobs Filtering
function filterJobType(element, type) {
    $('#recrutement-types-chips button').removeClass('btn-premium text-white').addClass('btn-outline-info text-primary bg-white');
    $(element).addClass('btn-premium text-white').removeClass('btn-outline-info text-primary bg-white');
    
    $('.job-card-container').each(function() {
        const card = $(this);
        const cardType = card.data('type');
        
        if (type === 'Tous' || cardType === type) {
            card.removeClass('d-none');
        } else {
            card.addClass('d-none');
        }
    });
}

// ══════════════════════════════════════════════════════════════
// MODALS MANAGEMENT & FORM ACTIONS
// ══════════════════════════════════════════════════════════════

// 1. AI Error Agent Modal
function openAiAgentModal() {
    $('#ai-agent-modal').removeClass('d-none');
}

function closeAiAgentModal() {
    $('#ai-agent-modal').addClass('d-none');
}

function runAiAgentAnalysis() {
    const text = $('#ai-agent-textarea').val().trim();
    if (!text) {
        alert("Veuillez saisir ou coller des données techniques à analyser.");
        return;
    }
    
    const btnText = $('#ai-agent-btn-text');
    btnText.text('⏳ Analyse en cours...');
    $('#ai-agent-results').addClass('d-none');
    
    $.ajax({
        url: 'api/ai_proxy.php',
        method: 'POST',
        data: { action: 'error_agent', text: text },
        dataType: 'json',
        success: function(res) {
            btnText.text("🔍 Analyser avec l'IA");
            if (res.error) {
                alert(res.error);
                return;
            }
            
            // Render results
            $('#ai-score-val').text(res.score);
            $('#ai-resume-text').text(res.resume);
            
            // Set badge level and color
            const badge = $('#ai-level-badge').text(res.niveau);
            let color = '#94a3b8';
            if (res.niveau === 'Excellent' || res.niveau === 'Bon') color = '#22c55e';
            else if (res.niveau === 'Moyen') color = '#f59e0b';
            else if (res.niveau === 'Critique') color = '#ef4444';
            badge.css('background-color', color);
            $('#ai-score-ring').css('border-color', color + ' !important');
            
            // Render Errors
            let errorsHtml = '';
            if (res.erreurs && res.erreurs.length > 0) {
                errorsHtml += `<div class="fw-bold text-danger mb-2 fs-7">❌ Erreurs (${res.erreurs.length})</div>`;
                res.erreurs.forEach(err => {
                    let errColor = err.gravite === 'Critique' ? '#ef4444' : (err.gravite === 'Moyenne' ? '#f59e0b' : '#22c55e');
                    errorsHtml += `
                        <div class="p-2 rounded-2 mb-2" style="background: #fff5f5; border-left: 4px solid ${errColor};">
                            <div class="d-flex gap-2 align-items-center mb-1">
                                <span class="custom-badge text-white" style="background-color: ${errColor}">${err.gravite}</span>
                                <span class="fw-bold text-dark fs-8">${err.type}</span>
                            </div>
                            <div class="text-secondary" style="font-size: 11px;">${err.description}</div>
                        </div>
                    `;
                });
            }
            $('#ai-errors-container').html(errorsHtml);
            
            // Render Warnings
            let warningsHtml = '';
            if (res.avertissements && res.avertissements.length > 0) {
                warningsHtml += `<div class="fw-bold text-warning mb-2 fs-7">⚠️ Avertissements</div>`;
                res.avertissements.forEach(w => {
                    warningsHtml += `
                        <div class="p-2 rounded-2 mb-2 text-warning-emphasis" style="background: #fffbeb; border-left: 4px solid #f59e0b; font-size: 11px;">
                            ${w}
                        </div>
                    `;
                });
            }
            $('#ai-warnings-container').html(warningsHtml);
            
            // Render Suggestions
            let suggestionsHtml = '';
            if (res.suggestions && res.suggestions.length > 0) {
                suggestionsHtml += `<div class="fw-bold text-success mb-2 fs-7">💡 Suggestions</div>`;
                res.suggestions.forEach(s => {
                    suggestionsHtml += `
                        <div class="p-2 rounded-2 mb-2 text-success-emphasis" style="background: #f0fdf4; border-left: 4px solid #22c55e; font-size: 11px;">
                            ${s}
                        </div>
                    `;
                });
            }
            $('#ai-suggestions-container').html(suggestionsHtml);
            
            $('#ai-agent-results').removeClass('d-none');
        },
        error: function() {
            btnText.text("🔍 Analyser avec l'IA");
            alert("Une erreur de communication est survenue avec le proxy IA.");
        }
    });
}

// 2. Chatbot Modals / Interactions

// A. Floating Chatbot
let chatbotOpen = false;
let floatChatHistory = [
    { role: 'assistant', content: 'Bonjour ! Je suis **HydroBot** 🤖 — assistant IngénieurHub. Comment puis-je vous aider ?' }
];

function toggleFloatingChatbot() {
    chatbotOpen = !chatbotOpen;
    const box = $('#floating-chatbot');
    const icon = $('#chatbot-trigger-icon');
    if (chatbotOpen) {
        box.removeClass('d-none');
        icon.text('✕');
    } else {
        box.addClass('d-none');
        icon.text('🤖');
    }
}

function mdToHtml(txt) {
    return txt.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br/>');
}

function sendFloatingChatMessage() {
    const input = $('#floating-chat-input');
    const q = input.val().trim();
    if (!q) return;
    
    input.val('');
    
    // Add user message to log
    floatChatHistory.push({ role: 'user', content: q });
    renderFloatChat();
    
    // Add loading
    const msgsBox = $('#floating-chat-messages');
    msgsBox.append(`
        <div class="d-flex justify-content-start" id="floating-chat-loading">
            <div class="p-2 small rounded-3 text-secondary" style="max-width: 85%; background: var(--light);">
                ⏳ Réflexion...
            </div>
        </div>
    `);
    msgsBox.scrollTop(msgsBox[0].scrollHeight);
    
    $.ajax({
        url: 'api/ai_proxy.php',
        method: 'POST',
        data: { action: 'chatbot', messages: JSON.stringify(floatChatHistory) },
        dataType: 'json',
        success: function(res) {
            $('#floating-chat-loading').remove();
            if (res.error) {
                floatChatHistory.push({ role: 'assistant', content: '❌ ' + res.error });
            } else {
                floatChatHistory.push({ role: 'assistant', content: res.reply });
            }
            renderFloatChat();
        },
        error: function() {
            $('#floating-chat-loading').remove();
            floatChatHistory.push({ role: 'assistant', content: '❌ Erreur de connexion.' });
            renderFloatChat();
        }
    });
}

function renderFloatChat() {
    const msgsBox = $('#floating-chat-messages');
    let html = '';
    floatChatHistory.forEach(m => {
        let isUser = m.role === 'user';
        html += `
            <div class="d-flex ${isUser ? 'justify-content-end' : 'justify-content-start'}">
                <div class="p-2 small rounded-3" style="max-width: 85%; background: ${isUser ? 'var(--secondary)' : 'var(--light)'}; color: ${isUser ? '#fff' : 'var(--primary)'}; border-bottom-right-radius: ${isUser ? '2px' : '8px'} !important; border-bottom-left-radius: ${isUser ? '8px' : '2px'} !important;">
                    ${mdToHtml(m.content)}
                </div>
            </div>
        `;
    });
    msgsBox.html(html);
    msgsBox.scrollTop(msgsBox[0].scrollHeight);
}

// B. Page Chatbot
let pageChatHistory = [
    { role: 'assistant', content: 'Bonjour ! Je suis **HydroBot** 🤖\n\nAssistant technique : hydraulique, traitement des eaux, ouvrages hydrauliques, irrigation, SIG, VRD en Algérie. Posez vos questions !' }
];

function sendPageChatMessage(suggestedText = '') {
    const input = $('#page-chatbot-input');
    const q = suggestedText ? suggestedText : input.val().trim();
    if (!q) return;
    
    input.val('');
    $('#page-chatbot-suggestions').remove(); // Remove suggestions on first send
    
    pageChatHistory.push({ role: 'user', content: q });
    renderPageChat();
    
    const msgsBox = $('#page-chatbot-messages');
    msgsBox.append(`
        <div class="d-flex justify-content-start gap-2" id="page-chat-loading">
            <div class="rounded-circle d-flex align-items-center justify-content-center text-white" style="width: 30px; height: 30px; background: linear-gradient(135deg, var(--primary), var(--secondary)); font-size: 13px; flex-shrink: 0;">🤖</div>
            <div class="p-3 small rounded-3 text-secondary" style="max-width: 76%; background: var(--light);">
                ⏳ Analyse...
            </div>
        </div>
    `);
    msgsBox.scrollTop(msgsBox[0].scrollHeight);
    
    $.ajax({
        url: 'api/ai_proxy.php',
        method: 'POST',
        data: { action: 'chatbot', messages: JSON.stringify(pageChatHistory) },
        dataType: 'json',
        success: function(res) {
            $('#page-chat-loading').remove();
            if (res.error) {
                pageChatHistory.push({ role: 'assistant', content: '❌ ' + res.error });
            } else {
                pageChatHistory.push({ role: 'assistant', content: res.reply });
            }
            renderPageChat();
        },
        error: function() {
            $('#page-chat-loading').remove();
            pageChatHistory.push({ role: 'assistant', content: '❌ Erreur de connexion.' });
            renderPageChat();
        }
    });
}

function renderPageChat() {
    const msgsBox = $('#page-chatbot-messages');
    let html = '';
    pageChatHistory.forEach(m => {
        let isUser = m.role === 'user';
        html += `
            <div class="d-flex ${isUser ? 'justify-content-end' : 'justify-content-start'} gap-2">
                ${!isUser ? '<div class="rounded-circle d-flex align-items-center justify-content-center text-white" style="width: 30px; height: 30px; background: linear-gradient(135deg, var(--primary), var(--secondary)); font-size: 13px; flex-shrink: 0;">🤖</div>' : ''}
                <div class="p-3 small rounded-3" style="max-width: 76%; background: ${isUser ? 'var(--secondary)' : 'var(--light)'}; color: ${isUser ? '#fff' : 'var(--primary)'}; border-bottom-right-radius: ${isUser ? '4px' : '12px'} !important; border-bottom-left-radius: ${isUser ? '12px' : '4px'} !important; line-height: 1.6;">
                    ${mdToHtml(m.content)}
                </div>
            </div>
        `;
    });
    msgsBox.html(html);
    msgsBox.scrollTop(msgsBox[0].scrollHeight);
}

// 3. Project Candidature Modal
function applyToProject(id, title, budget, delai, wilaya) {
    $('#modal-project-id').val(id);
    $('#modal-project-title').text(title);
    $('#modal-project-budget').text(budget);
    $('#modal-project-delai').text(delai);
    $('#modal-project-wilaya').text(wilaya);
    
    // Clear alerts
    $('#candidature-status-alert').addClass('d-none').removeClass('alert-success alert-danger');
    
    $('#candidature-project-modal').removeClass('d-none');
}

function closeCandidatureModal() {
    $('#candidature-project-modal').addClass('d-none');
    $('#project-candidature-form')[0].reset();
}

function submitProjectCandidature(e) {
    e.preventDefault();
    const form = $('#project-candidature-form');
    const alertBox = $('#candidature-status-alert');
    const pId = $('#modal-project-id').val();
    
    alertBox.addClass('d-none');
    
    $.ajax({
        url: 'api/submit_candidature.php',
        method: 'POST',
        data: form.serialize(),
        dataType: 'json',
        success: function(res) {
            if (res.success) {
                alertBox.text(res.message).removeClass('d-none').addClass('alert-success');
                // Increment candidates count locally in the listing
                const counter = $('.project-candidats-count-' + pId);
                if (counter.length > 0) {
                    counter.text(parseInt(counter.text()) + 1);
                }
                setTimeout(closeCandidatureModal, 2000);
            } else {
                alertBox.text(res.error).removeClass('d-none').addClass('alert-danger');
            }
        },
        error: function() {
            alertBox.text("Erreur lors de la soumission de la candidature.").removeClass('d-none').addClass('alert-danger');
        }
    });
}

// 4. Submit New Project
function switchTravailTab(tabName) {
    $('.nav-tab-btn').removeClass('active');
    $('#tab-' + tabName + '-btn').addClass('active');
    
    $('.travail-tab-content').addClass('d-none');
    $('#travail-tab-' + tabName).removeClass('d-none');
}

function submitNewProject(e) {
    e.preventDefault();
    const form = $('#publish-project-form');
    const alertBox = $('#publish-status-alert');
    alertBox.addClass('d-none');
    
    $.ajax({
        url: 'api/submit_project.php',
        method: 'POST',
        data: form.serialize(),
        dataType: 'json',
        success: function(res) {
            if (res.success) {
                alertBox.text(res.message).removeClass('d-none').addClass('alert-success');
                form[0].reset();
                // We could reload or dynamically inject, but simple reload after 1.5s is solid
                setTimeout(() => {
                    navigateTo('travail');
                }, 1500);
            } else {
                alertBox.text(res.error).removeClass('d-none').addClass('alert-danger');
            }
        },
        error: function() {
            alertBox.text("Erreur réseau lors de la soumission.").removeClass('d-none').addClass('alert-danger');
        }
    });
}

// 5. Submit Study Page form
function submitNewStudy(e) {
    e.preventDefault();
    const form = $('#submit-study-form');
    const alertBox = $('#study-status-alert');
    alertBox.addClass('d-none').removeClass('alert-success alert-danger');
    
    // Create FormData object to support file upload
    const formData = new FormData(form[0]);
    
    $.ajax({
        url: 'api/submit_study.php',
        method: 'POST',
        data: formData,
        contentType: false, // Required for multipart/form-data
        processData: false, // Required for multipart/form-data
        dataType: 'json',
        success: function(res) {
            if (res.success) {
                alertBox.text(res.message).removeClass('d-none').addClass('alert-success');
                form[0].reset();
                removeSelectedFile(); // Clear file preview UI
                setTimeout(() => {
                    navigateTo('etudes');
                }, 1500);
            } else {
                alertBox.text(res.error).removeClass('d-none').addClass('alert-danger');
            }
        },
        error: function() {
            alertBox.text("Erreur réseau ou fichier trop volumineux lors de la soumission.").removeClass('d-none').addClass('alert-danger');
        }
    });
}

function handleFileSelect(input) {
    const file = input.files[0];
    if (file) {
        let sizeStr = '';
        if (file.size > 1024 * 1024) {
            sizeStr = (file.size / (1024 * 1024)).toFixed(2) + ' Mo';
        } else {
            sizeStr = (file.size / 1024).toFixed(2) + ' Ko';
        }
        $('#file-name').text(file.name);
        $('#file-size').text(sizeStr);
        $('#file-info').removeClass('d-none');
        $('#dropzone-text').text('Changer de fichier...');
        $('#file-dropzone').css('border-color', '#22c55e');
    }
}

function removeSelectedFile() {
    $('#study_file').val('');
    $('#file-info').addClass('d-none');
    $('#file-name').text('');
    $('#file-size').text('');
    $('#dropzone-text').text('Glissez vos fichiers (shapefile, PDF, plans) ou cliquez pour charger');
    $('#file-dropzone').css('border-color', '#b3d6f0');
}

// 6. Submit New Student Innovation
function openInnovationSubmissionModal() {
    $('#innovation-status-alert').addClass('d-none');
    $('#innovation-submission-modal').removeClass('d-none');
}

function closeInnovationSubmissionModal() {
    $('#innovation-submission-modal').addClass('d-none');
    $('#submit-innovation-form')[0].reset();
}

function submitNewInnovation(e) {
    e.preventDefault();
    const form = $('#submit-innovation-form');
    const alertBox = $('#innovation-status-alert');
    alertBox.addClass('d-none');
    
    $.ajax({
        url: 'api/submit_innovation.php',
        method: 'POST',
        data: form.serialize(),
        dataType: 'json',
        success: function(res) {
            if (res.success) {
                alertBox.text(res.message).removeClass('d-none').addClass('alert-success');
                form[0].reset();
                setTimeout(() => {
                    navigateTo('innovation');
                }, 1500);
            } else {
                alertBox.text(res.error).removeClass('d-none').addClass('alert-danger');
            }
        },
        error: function() {
            alertBox.text("Erreur lors de l'enregistrement.").removeClass('d-none').addClass('alert-danger');
        }
    });
}

// 7. Enrollment Modal & submit
function openEnrollmentModal(id, title, price) {
    $('#enroll-modal-formation-id').val(id);
    $('#enroll-modal-title').text(title);
    $('#enroll-modal-price').text(price);
    $('#enrollment-status-alert').addClass('d-none');
    $('#enrollment-modal').removeClass('d-none');
}

function closeEnrollmentModal() {
    $('#enrollment-modal').addClass('d-none');
    $('#enrollment-form')[0].reset();
}

function submitEnrollment(e) {
    e.preventDefault();
    const form = $('#enrollment-form');
    const alertBox = $('#enrollment-status-alert');
    alertBox.addClass('d-none');
    
    $.ajax({
        url: 'api/enroll_formation.php',
        method: 'POST',
        data: form.serialize(),
        dataType: 'json',
        success: function(res) {
            if (res.success) {
                alertBox.text(res.message).removeClass('d-none').addClass('alert-success');
                setTimeout(closeEnrollmentModal, 2000);
            } else {
                alertBox.text(res.error).removeClass('d-none').addClass('alert-danger');
            }
        },
        error: function() {
            alertBox.text("Erreur réseau.").removeClass('d-none').addClass('alert-danger');
        }
    });
}

// 8. Recrutement Job application modal
function openJobCandidatureModal(id, title) {
    $('#job-modal-offre-id').val(id);
    $('#job-modal-title').text(title);
    $('#job-candidature-status-alert').addClass('d-none');
    $('#job-candidature-modal').removeClass('d-none');
}

function closeJobCandidatureModal() {
    $('#job-candidature-modal').addClass('d-none');
    $('#job-candidature-form')[0].reset();
}

function submitJobCandidature(e) {
    e.preventDefault();
    const form = $('#job-candidature-form');
    const alertBox = $('#job-candidature-status-alert');
    alertBox.addClass('d-none');
    
    $.ajax({
        url: 'api/submit_job_candidature.php',
        method: 'POST',
        data: form.serialize(),
        dataType: 'json',
        success: function(res) {
            if (res.success) {
                alertBox.text(res.message).removeClass('d-none').addClass('alert-success');
                setTimeout(closeJobCandidatureModal, 2000);
            } else {
                alertBox.text(res.error).removeClass('d-none').addClass('alert-danger');
            }
        },
        error: function() {
            alertBox.text("Erreur de connexion.").removeClass('d-none').addClass('alert-danger');
        }
    });
}

// 9. Auth Actions
function switchAuthMode(mode) {
    if (mode === 'login') {
        $('#btn-mode-login').addClass('btn-primary').removeClass('text-primary bg-white');
        $('#btn-mode-register').removeClass('btn-primary').addClass('text-primary bg-white');
        $('#register-role-selector').addClass('d-none');
        $('#register-name-field').addClass('d-none');
        $('#auth-action-type').val('login');
        $('#auth-submit-btn').text('Se connecter');
    } else {
        $('#btn-mode-register').addClass('btn-primary').removeClass('text-primary bg-white');
        $('#btn-mode-login').removeClass('btn-primary').addClass('text-primary bg-white');
        $('#register-role-selector').removeClass('d-none');
        $('#register-name-field').removeClass('d-none');
        $('#auth-action-type').val('register');
        $('#auth-submit-btn').text('Créer mon compte');
    }
}

function setRegisterRole(element, role) {
    $('#register-role-selector button').removeClass('btn-primary border-primary text-primary').addClass('btn-light border-light-subtle text-secondary').css('background-color', '#fff');
    $(element).addClass('btn-primary border-primary text-primary').removeClass('btn-light border-light-subtle text-secondary').css('background-color', 'var(--light)');
    $('#register-role-value').val(role);
}

function handleAuthSubmit(e) {
    e.preventDefault();
    const form = $('#auth-form');
    const alertBox = $('#auth-status-alert');
    alertBox.addClass('d-none');
    
    $.ajax({
        url: 'api/auth.php',
        method: 'POST',
        data: form.serialize(),
        dataType: 'json',
        success: function(res) {
            if (res.success) {
                alertBox.text(res.message).removeClass('d-none').addClass('alert-success');
                setTimeout(() => {
                    navigateTo('dashboard');
                }, 1000);
            } else {
                alertBox.text(res.error).removeClass('d-none').addClass('alert-danger');
            }
        },
        error: function() {
            alertBox.text("Erreur d'authentification.").removeClass('d-none').addClass('alert-danger');
        }
    });
}

function logoutUser() {
    $.ajax({
        url: 'api/auth.php',
        method: 'POST',
        data: { action: 'logout' },
        dataType: 'json',
        success: function() {
            navigateTo('accueil');
        },
        error: function() {
            window.location.reload();
        }
    });
}

// 10. Secondary Helper Alerts
function contactExpert(id) {
    alert("Prise de contact initiée avec l'expert ID: " + id + ". Un email d'introduction a été envoyé.");
}

function viewExpertProfile(id) {
    alert("Consultation du profil complet pour l'expert ID: " + id);
}

function orderMaterial(name, supplier) {
    alert(`Commande initiée pour :\n- Produit : ${name}\n- Fournisseur : ${supplier}\n\nUn commercial de ${supplier} va vous contacter.`);
}

function viewFicheTechnique(m) {
    $('#fiche-modal-img').text(m.img);
    $('#fiche-modal-title').text(m.nom);
    $('#fiche-modal-supplier').text(m.fournisseur);
    $('#fiche-modal-cat').text(m.categorie);
    $('#fiche-modal-ref').text(m.ref);
    $('#fiche-modal-norm').text(m.norm);
    $('#fiche-modal-price').text(m.prix.toLocaleString() + ' DA / ' + m.unite);
    $('#fiche-modal-stock').text(m.stock);
    $('#fiche-modal-wilaya').text(m.wilaya);
    $('#fiche-modal-offre').text(m.offre || 'Aucune');
    
    $('#fiche-technique-modal').removeClass('d-none');
}

function closeFicheTechniqueModal() {
    $('#fiche-technique-modal').addClass('d-none');
}

function requestQuoteFromFiche() {
    alert("Demande de devis personnalisée envoyée au fournisseur !");
    closeFicheTechniqueModal();
}

function viewProjectDetails(id) {
    alert("Ouverture des pièces jointes et détails techniques du projet ID: " + id);
}

// Innovation Detail Modal
let activeDetailInnovation = null;
function viewInnovationDetail(inn) {
    activeDetailInnovation = inn;
    
    $('#inn-detail-badge-type').text(inn.type).css('background-color', (inn.type === 'Agent IA' ? '#7c3aed' : '#0a4f8a'));
    $('#inn-detail-badge-domaine').text(inn.domaine);
    $('#inn-detail-title').text(inn.titre);
    $('#inn-detail-auteur').text(inn.auteur);
    $('#inn-detail-univ').text(inn.univ);
    $('#inn-detail-desc').text(inn.desc);
    
    // Tags
    let tagsHtml = '';
    inn.tags.split(',').forEach(t => {
        if (t.trim()) {
            tagsHtml += `<span class="custom-badge bg-light text-primary border me-1">${t.trim()}</span>`;
        }
    });
    $('#inn-detail-tags-container').html(tagsHtml);
    
    // Status box
    const box = $('#inn-detail-status-box');
    if (inn.statut === 'Cherche incubateur') {
        box.css('background-color', '#fffbeb');
        $('#inn-detail-statut').text('🏢 Cherche incubateur').css('color', '#92400e');
        $('#inn-detail-prix').text(inn.prix).css('color', '#92400e');
        $('#inn-detail-action-btn').text('🏢 Proposer incubation');
    } else {
        box.css('background-color', '#f0fdf4');
        $('#inn-detail-statut').text('💰 À vendre').css('color', '#166534');
        $('#inn-detail-prix').text(inn.prix).css('color', '#166534');
        $('#inn-detail-action-btn').text('💰 Acquérir la solution');
    }
    
    $('#innovation-detail-modal').removeClass('d-none');
}

function closeInnovationDetailModal() {
    $('#innovation-detail-modal').addClass('d-none');
}

function proposeIncubationFromDetail() {
    if (activeDetailInnovation) {
        proposeIncubation(activeDetailInnovation.id, activeDetailInnovation.titre, activeDetailInnovation.statut);
        closeInnovationDetailModal();
    }
}

function proposeIncubation(id, title, status) {
    if (status === 'Cherche incubateur') {
        alert(`Demande d'incubation transmise pour la solution "${title}". Le porteur du projet recevra vos coordonnées.`);
    } else {
        alert(`Processus d'acquisition démarré pour "${title}". Une offre de contrat de transfert technologique va vous être envoyée.`);
    }
}

// ══════════════════════════════════════════════════════════════
// EXPERT PROFILE EDITION
// ══════════════════════════════════════════════════════════════
function openExpertProfileModal() {
    $('#profile-status-alert').addClass('d-none').removeClass('alert-success alert-danger');
    $('#expert-profile-modal').removeClass('d-none');
}

function closeExpertProfileModal() {
    $('#expert-profile-modal').addClass('d-none');
}

function submitExpertProfile(e) {
    e.preventDefault();
    const form = $('#expert-profile-form');
    const alertBox = $('#profile-status-alert');
    alertBox.addClass('d-none').removeClass('alert-success alert-danger');
    
    $.ajax({
        url: 'api/update_expert_profile.php',
        method: 'POST',
        data: form.serialize(),
        dataType: 'json',
        success: function(res) {
            if (res.success) {
                alertBox.text(res.message).removeClass('d-none').addClass('alert-success');
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                alertBox.text(res.error).removeClass('d-none').addClass('alert-danger');
            }
        },
        error: function() {
            alertBox.text("Erreur lors de la mise à jour de votre profil expert.").removeClass('d-none').addClass('alert-danger');
        }
    });
}
