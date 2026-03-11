// Mon code
// // Inscription & Connexion
// const registerBtn = document.querySelector("#registerBtn")

// registerBtn.addEventListener("click", function(e){
//     e.preventDefault();

//     let username = document.querySelector("#reg-name").value;
//     let pin = document.querySelector("#reg-pass").value
//     let dateNaissance = document.querySelector("#date-naissance").value

//     let message = document.querySelector("#message")

//     // vérifier si compte existe
//     let existingUser = JSON.parse(localStorage.getItem("user"));

//     if (existingUser){
//         message.textContent = "Un compte existe déjà.";
//         message.style.color = "red";
//         return;
//     }
    
//     if (username === "" || pin === "" || dateNaissance === ""){
//         message.textContent = "Veuillez entrer vos données !"
//         message.style.color = "red"
//         return;
//     }

//     let user = {
//         username: username,
//         pin: pin,
//         dateNaissance : dateNaissance,
//         solde: 0,
//         transaction: []
//     }
    
//     localStorage.setItem("user", JSON.stringify(user));

//     message.textContent = "Compte crée avec succes ! Gérer votre argent comme un pro !"
//     message.style.color = "rgb(4, 61, 21)";
//     window.location.href = "dashboard.html";

// })

// // Connexion
// document.querySelector("#loginBtn").addEventListener("click", function(e){
//     e.preventDefault(); // <- parenthèses manquantes

//     let username = document.querySelector("#log-name").value;
//     let pin = document.querySelector("#log-pass").value;

//     let message2 = document.querySelector("#message2");

//     if (username === "" || pin === ""){
//         message2.textContent = "Veuillez entrer vos données !";
//         message2.style.color = "red";
//         return;
//     }

//     let user = JSON.parse(localStorage.getItem("user"));

//     if(user && username === user.username && pin === user.pin){
//         sessionStorage.setItem("ConnectedUser", username);
//         window.location.href = "dashboard.html";
//     } else{
//         message2.textContent = "Identifiant incorrect ! Si vous n'avez pas de compte, inscrivez-vous !";
//         message2.style.color = "yellow";
//     }
// });

// Ameliorer
// auth.js

// auth.js

// ---------------------- INSCRIPTION ----------------------
const registerBtn = document.querySelector("#registerBtn");

if (registerBtn) {
  registerBtn.addEventListener("click", function(e) {
    e.preventDefault();

    const username = document.querySelector("#reg-name").value.trim();
    const pin = document.querySelector("#reg-pass").value.trim();
    const dateNaissance = document.querySelector("#date-naissance").value;
    const message = document.querySelector("#message");

    // Vérifications basiques
    if (!username || !pin || !dateNaissance) {
      message.textContent = "Veuillez remplir tous les champs !";
      message.style.color = "red";
      return;
    }

    if (pin.length < 4) {
      message.textContent = "Le PIN doit contenir au moins 4 caractères !";
      message.style.color = "red";
      return;
    }

    // Récupérer les utilisateurs existants ou tableau vide
    let users = JSON.parse(localStorage.getItem("users")) || [];

    // Vérifier si le nom d'utilisateur existe déjà
    let userExists = users.find(u => u && u.username && u.username.toLowerCase() === username.toLowerCase());
    if (userExists) {
      message.textContent = "Ce nom d'utilisateur existe déjà !";
      message.style.color = "red";
      return;
    }

    // Création du nouvel utilisateur
    const user = {
      username: username,
      pin: pin,
      dateNaissance: dateNaissance,
      solde: 0,
      transactions: []
    };

    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));

    message.textContent = "Compte créé avec succès ! Redirection…";
    message.style.color = "green";

    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 1000);
  });
}

// ---------------------- CONNEXION ----------------------
const loginBtn = document.querySelector("#loginBtn");

if (loginBtn) {
  loginBtn.addEventListener("click", function(e) {
    e.preventDefault();

    const username = document.querySelector("#log-name").value.trim();
    const pin = document.querySelector("#log-pass").value.trim();
    const message2 = document.querySelector("#message2");

    if (!username || !pin) {
      message2.textContent = "Veuillez remplir tous les champs !";
      message2.style.color = "red";
      return;
    }

    // Récupérer les utilisateurs existants
    let users = JSON.parse(localStorage.getItem("users")) || [];

    // Chercher l'utilisateur correspondant
    let foundUser = users.find(u =>
      u && u.username && u.username.toLowerCase() === username.toLowerCase() && u.pin === pin
    );

    console.log("Utilisateurs :", users);
    console.log("Utilisateur trouvé :", foundUser);

    if (foundUser) {
      sessionStorage.setItem("ConnectedUser", foundUser.username);
      window.location.href = "dashboard.html"; // Assurez-vous que le chemin est correct
    } else {
      message2.textContent = "Identifiant ou PIN incorrect !";
      message2.style.color = "yellow";
    }
  });
}