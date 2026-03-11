// ---------------------- Initialisation ----------------------
const welcome = document.querySelector("#welcome");
const soldeDisplay = document.querySelector("#solde-display");
const inputMontant = document.querySelector("#montant");
const btnDeposer = document.querySelector("#btnDeposer");
const btnRetirer = document.querySelector("#btnRetirer");
const historique = document.querySelector("#historique");
const message = document.querySelector("#message");
const logout = document.querySelector("#logout");

// Récupérer tous les utilisateurs
let users = JSON.parse(localStorage.getItem("users")) || [];

// Récupérer l'utilisateur connecté
let connectedUsername = sessionStorage.getItem("ConnectedUser");
if (!connectedUsername) {
    window.location.href = "login.html";
}

// Chercher l'utilisateur
let user = users.find(u => u.username === connectedUsername);
if (!user) {
    window.location.href = "login.html";
}

// Variables de suivi
let solde = user.solde || 0;
let totalDepot = 0;
let totalRetrait = 0;

// Afficher le nom et le solde
welcome.textContent = `Bienvenue ${user.username} 👋, Déposez le montant que vous avez sur vous !`;
soldeDisplay.textContent = solde + " FCFA";

// Formatage des nombres
const fmt = n => n.toLocaleString('fr-FR');

// ---------------------- Fonctions ----------------------

// Mettre à jour le solde à l'écran et dans localStorage
function updateSolde(newSolde) {
    soldeDisplay.innerHTML = fmt(newSolde) + '<span class="currency">FCFA</span>';
    soldeDisplay.classList.remove('flash');
    void soldeDisplay.offsetWidth; // reset animation
    soldeDisplay.classList.add('flash');

    user.solde = newSolde;

    // Mettre à jour le tableau users et sauvegarder
    users = users.map(u => u.username === user.username ? user : u);
    localStorage.setItem("users", JSON.stringify(users));
}

// Afficher un message temporaire
function showMessage(txt, type) {
    message.textContent = txt;
    message.className = 'show ' + type;
    clearTimeout(message._t);
    message._t = setTimeout(() => { message.className = ''; }, 3000);
}

// Afficher une transaction (ne touche pas au stockage)
function displayTransaction(label, amount, type, dateObj = new Date()) {
    const empty = historique.querySelector('.empty-state');
    if (empty) empty.remove();

    const date = dateObj.toLocaleDateString('fr-FR');
    const time = dateObj.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

    const li = document.createElement('li');
    li.innerHTML = `
        <div class="tx-left">
            <span class="tx-dot ${type}"></span>
            <div>
                <div class="tx-label">${label}</div>
                <div class="tx-time">${date} ${time}</div>
            </div>
        </div>
        <div class="tx-amount ${type}">${type === 'dep' ? '+' : '−'} ${fmt(amount)} FCFA</div>
    `;
    historique.insertBefore(li, historique.firstChild);
}

// Ajouter une transaction et sauvegarder
function addTransaction(label, amount, type) {
    const dateObj = new Date();

    if (!user.transactions) user.transactions = [];

    user.transactions.unshift({
        label,
        amount,
        type,
        date: dateObj.toISOString()
    });

    // Mettre à jour le tableau users et sauvegarder
    users = users.map(u => u.username === user.username ? user : u);
    localStorage.setItem("users", JSON.stringify(users));

    displayTransaction(label, amount, type, dateObj);
}

// ---------------------- Charger l'historique existant ----------------------
if (user.transactions && user.transactions.length > 0) {
    user.transactions.forEach(tx => {
        displayTransaction(tx.label, tx.amount, tx.type, new Date(tx.date));
    });
}

// ---------------------- Gestion des opérations ----------------------

// Déposer
btnDeposer.addEventListener('click', (e) => {
    e.preventDefault();
    const val = parseFloat(inputMontant.value);
    if (!val || val <= 0) return showMessage('Veuillez entrer un montant valide.', 'error');

    solde += val;
    totalDepot += val;

    updateSolde(solde);
    document.getElementById('total-depot').textContent = fmt(totalDepot);
    document.getElementById('balance-change').textContent = `+ ${fmt(val)} FCFA déposés`;
    document.getElementById('balance-change').style.color = 'green';

    addTransaction('Dépôt', val, 'dep');
    showMessage(`${fmt(val)} FCFA déposés avec succès.`, 'success');

    inputMontant.value = '';
});

// Retirer
btnRetirer.addEventListener('click', (e) => {
    e.preventDefault();
    const val = parseFloat(inputMontant.value);
    if (!val || val <= 0) return showMessage('Veuillez entrer un montant valide.', 'error');
    if (val > solde) return showMessage('Solde insuffisant pour ce retrait.', 'error');

    solde -= val;
    totalRetrait += val;

    updateSolde(solde);
    document.getElementById('total-retrait').textContent = fmt(totalRetrait);
    document.getElementById('balance-change').textContent = `− ${fmt(val)} FCFA retirés`;
    document.getElementById('balance-change').style.color = 'var(--red)';

    addTransaction('Retrait', val, 'ret');
    showMessage(`${fmt(val)} FCFA retirés avec succès.`, 'success');

    inputMontant.value = '';
});

// ---------------------- Déconnexion ----------------------
logout.addEventListener('click', () => {
    if (confirm('Voulez-vous vous déconnecter ?')) {
        sessionStorage.removeItem("ConnectedUser");
        window.location.href = "login.html";
    }
});

// Bloquer soumission par Enter
inputMontant.addEventListener('keydown', (e) => {
    if (e.key === "Enter") e.preventDefault();
});

// Afficher le solde au démarrage
updateSolde(solde);