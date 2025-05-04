const arene = document.getElementById('arene');
const TAILLE = 7;
const TOTAL_CASES = TAILLE * TAILLE;

const NB_OBSTACLES = 4;
const NB_BONUS = 4;
const NB_PIEGES = 4;
const NB_SURPRISES = 5;

const positionsUtilisées = new Set();

function positionAleatoire() {
  let pos;
  do {
    pos = Math.floor(Math.random() * TOTAL_CASES);
  } while (positionsUtilisées.has(pos));
  positionsUtilisées.add(pos);
  return pos;
}

const cases = [];

// Création des cases
for (let i = 0; i < TOTAL_CASES; i++) {
  const caseDiv = document.createElement('div');
  caseDiv.classList.add('case');
  caseDiv.id = `case-${i}`; // ID unique pour chaque case

  const decor = document.createElement('div');
  decor.classList.add('decor');

  const element = document.createElement('div');
  element.classList.add('element');

  caseDiv.appendChild(decor);
  caseDiv.appendChild(element);
  arene.appendChild(caseDiv);

  cases.push({ div: caseDiv, element, id: i });

  // Gestion de l'effet surprise
  caseDiv.addEventListener('click', () => {
    caseDiv.classList.add('surprise');
    setTimeout(() => caseDiv.classList.remove('surprise'), 500);

    const elem = cases[i].element;
    if (elem.classList.contains('bonus')) {
      alert("🎁 Vous avez découvert un BONUS !");
    } else if (elem.classList.contains('piege')) {
      alert("💥 Oh non, un PIÈGE !");
    } else if (elem.classList.contains('obstacle')) {
      alert("⛔ C'est un OBSTACLE !");
    } else if (elem.dataset.surprise === 'bonus') {
      alert("🎁 Surprise ! C'était un BONUS caché !");
    } else if (elem.dataset.surprise === 'piege') {
      alert("💥 Surprise ! C'était un PIÈGE caché !");
    } else {
      alert("🔍 Rien de spécial ici...");
    }
  });
}

// Obstacle visibles
for (let i = 0; i < NB_OBSTACLES; i++) {
  const index = positionAleatoire();
  cases[index].element.classList.add('obstacle');
}

// Bonus visibles
for (let i = 0; i < NB_BONUS; i++) {
  const index = positionAleatoire();
  cases[index].element.classList.add('bonus');
}

// Pièges visibles
for (let i = 0; i < NB_PIEGES; i++) {
  const index = positionAleatoire();
  cases[index].element.classList.add('piege');
}

// 🎁 Surprise cachée (aucune classe visible, juste data)
for (let i = 0; i < NB_SURPRISES; i++) {
  const index = positionAleatoire();
  const type = Math.random() < 0.5 ? 'bonus' : 'piege';
  cases[index].element.dataset.surprise = type;
  cases[index].element.innerText = "?"; // Pour afficher l'indice de la surprise
}

// Créer la case de départ en dehors de la grille principale
const caseDepart = document.createElement('div');
caseDepart.classList.add('case', 'depart');
caseDepart.id = 'case-depart';
document.body.appendChild(caseDepart); // Ajout au body pour une meilleure gestion

// Définir la position de départ à côté de la grille
caseDepart.style.position = 'absolute';
caseDepart.style.top = '0';
caseDepart.style.left = (arene.offsetWidth + 20) + 'px'; // 20px de marge
caseDepart.style.width = '80px';
caseDepart.style.height = '80px';
caseDepart.style.backgroundColor = '#8bc34a'; // Couleur verte pour la case départ
caseDepart.style.border = '3px solid #689f38'; // Bordure pour la case départ
caseDepart.innerHTML = 'DÉPART'; // Texte explicite

// Ajouter un joueur dans la case de départ
const joueurDiv = document.createElement('div');
joueurDiv.classList.add('joueur');
joueurDiv.style.backgroundImage = 'url("C:/Users/Mega Pc/arenes-des-legendes/interface+joueur/idl/Idle.png")';
joueurDiv.style.width = '60px';
joueurDiv.style.height = '60px';
joueurDiv.style.backgroundSize = 'contain';
joueurDiv.style.backgroundRepeat = 'no-repeat';
joueurDiv.style.backgroundPosition = 'center';
caseDepart.appendChild(joueurDiv);

// Fonction pour gérer les images de marche
const walkImages = [
  'C:/Users/Mega Pc/arenes-des-legendes/interface+joueur/walk/Walk0.png',
  'C:/Users/Mega Pc/arenes-des-legendes/interface+joueur/walk/Walk1.png',
  'C:/Users/Mega Pc/arenes-des-legendes/interface+joueur/walk/Walk2.png',
  'C:/Users/Mega Pc/arenes-des-legendes/interface+joueur/walk/Walk3.png',
  'C:/Users/Mega Pc/arenes-des-legendes/interface+joueur/walk/Walk4.png'
];

let walkIndex = 0;
let jumpIndex = 0;
let joueurPosition = null; // Initialement dans la case de départ (pas dans la grille principale)
let isMoving = false;
let isJumping = false;
let walkInterval;
let jumpInterval;

// Fonction pour animer le mouvement du joueur
function animerDeplacement() {
  if (!isMoving) return;
  
  joueurDiv.style.backgroundImage = `url(${walkImages[walkIndex]})`;
  walkIndex = (walkIndex + 1) % walkImages.length;
}

// Fonction pour démarrer l'animation de marche
function demarrerMarche() {
  isMoving = true;
  walkInterval = setInterval(animerDeplacement, 150); // Changement d'image toutes les 150ms
}

// Fonction pour arrêter l'animation de marche
function arreterMarche() {
  isMoving = false;
  clearInterval(walkInterval);
  joueurDiv.style.backgroundImage = 'url("C:/Users/Mega Pc/arenes-des-legendes/interface+joueur/idl/Idle.png")';
}

// Fonction pour animer le saut du joueur
function animerSaut() {
  if (!isJumping) return;
  
  joueurDiv.style.backgroundImage = `url(${jumpImages[jumpIndex]})`;
  jumpIndex = (jumpIndex + 1) % jumpImages.length;
}

// Fonction pour démarrer l'animation de saut
function demarrerSaut() {
  isJumping = true;
  jumpIndex = 0;
  jumpInterval = setInterval(animerSaut, 100); // Changement d'image toutes les 100ms pour le saut
}

// Fonction pour arrêter l'animation de saut
function arreterSaut() {
  isJumping = false;
  clearInterval(jumpInterval);
  joueurDiv.style.backgroundImage = 'url("C:/Users/Mega Pc/arenes-des-legendes/interface+joueur/idl/Idle.png")';
}

// Fonction pour entrer dans l'arène à partir de la case de départ
function entrerDansArene() {
  // Retirer le joueur de la case de départ
  caseDepart.removeChild(joueurDiv);
  
  // Ajouter le joueur à la case 0 de l'arène
  cases[0].div.appendChild(joueurDiv);
  joueurPosition = 0;
  
  // Mettre le joueur en mode marche pendant 0.5 seconde
  demarrerMarche();
  setTimeout(arreterMarche, 500);
  
  // Faire disparaître les instructions
  instructions.style.display = 'none';
}

// Ajouter un événement click sur la case de départ pour y entrer
caseDepart.addEventListener('click', entrerDansArene);

// Fonction de déplacement du joueur dans l'arène
function deplacerJoueur(nouvellePosition) {
  if (joueurPosition === null) return; // Ne pas déplacer si le joueur n'est pas encore dans l'arène
  
  const ancienneCase = cases[joueurPosition].div;
  const nouvelleCase = cases[nouvellePosition].div;

  // Retirer le joueur de l'ancienne case
  ancienneCase.removeChild(joueurDiv);

  // Démarrer l'animation de marche
  demarrerMarche();

  // Ajouter le joueur à la nouvelle case après un court délai (pour l'animation)
  setTimeout(() => {
    nouvelleCase.appendChild(joueurDiv);
    joueurPosition = nouvellePosition;
    
    // Arrêter l'animation de marche
    setTimeout(arreterMarche, 300);
    
    // Vérifier si la case contient un élément spécial
    interagirAvecCase(nouvellePosition);
  }, 300);
}

// Gérer l'interaction avec une case
function interagirAvecCase(position) {
  const element = cases[position].element;

  if (element.classList.contains('bonus')) {
    alert("🎁 Vous avez trouvé un BONUS !");
    element.classList.remove('bonus'); // Retirer le bonus une fois collecté
  } else if (element.classList.contains('piege')) {
    alert("💥 Vous êtes tombé sur un PIÈGE !");
  } else if (element.classList.contains('obstacle')) {
    alert("⛔ Vous avez rencontré un OBSTACLE !");
  } else if (element.dataset.surprise === 'bonus') {
    alert("🎁 Surprise ! C'était un BONUS caché !");
    delete element.dataset.surprise; // Retirer la surprise une fois découverte
    element.innerText = ""; // Supprimer le point d'interrogation
  } else if (element.dataset.surprise === 'piege') {
    alert("💥 Surprise ! C'était un PIÈGE caché !");
    delete element.dataset.surprise; // Retirer la surprise une fois découverte
    element.innerText = ""; // Supprimer le point d'interrogation
  }
}

// Fonction pour faire sauter le joueur
function sauterJoueur(direction) {
  if (joueurPosition === null) return;
  if (isMoving || isJumping) return;
  
  let nouvellePosition;
  
  // Calcul de la position après le saut (2 cases dans la direction spécifiée)
  switch(direction) {
    case 'haut':
      // Vérifier si le saut est possible (pas trop près du bord)
      if (joueurPosition >= TAILLE * 2) {
        nouvellePosition = joueurPosition - (TAILLE * 2);
      } else {
        return; // Impossible de sauter
      }
      break;
    case 'bas':
      if (joueurPosition < TOTAL_CASES - (TAILLE * 2)) {
        nouvellePosition = joueurPosition + (TAILLE * 2);
      } else {
        return;
      }
      break;
    case 'gauche':
      // Vérifier qu'on ne saute pas au-delà du bord gauche
      if (joueurPosition % TAILLE >= 2) {
        nouvellePosition = joueurPosition - 2;
      } else {
        return;
      }
      break;
    case 'droite':
      // Vérifier qu'on ne saute pas au-delà du bord droit
      if (joueurPosition % TAILLE <= TAILLE - 3) {
        nouvellePosition = joueurPosition + 2;
      } else {
        return;
      }
      break;
    default:
      return;
  }
  
  // Retirer le joueur de sa position actuelle
  const ancienneCase = cases[joueurPosition].div;
  ancienneCase.removeChild(joueurDiv);
  
  // Démarrer l'animation de saut
  demarrerSaut();
  
  // Ajouter le joueur à la nouvelle position après un délai
  setTimeout(() => {
    cases[nouvellePosition].div.appendChild(joueurDiv);
    joueurPosition = nouvellePosition;
    
    // Arrêter l'animation de saut
    setTimeout(arreterSaut, 100);
    
    // Vérifier interaction avec la case
    interagirAvecCase(nouvellePosition);
  }, 300);
}

// Écouter les touches du clavier pour déplacer le joueur
document.addEventListener('keydown', (event) => {
  if (joueurPosition === null) return; // Ne pas déplacer si le joueur n'est pas encore dans l'arène
  if (isMoving || isJumping) return; // Ne pas accepter de nouvelle commande pendant un mouvement
  
  if (event.key === ' ' || event.key === 'Spacebar') {
    // Détecter la dernière direction utilisée pour le saut
    // Par défaut, on saute vers la droite s'il n'y a pas eu de mouvement précédent
    const direction = localStorage.getItem('derniere_direction') || 'droite';
    sauterJoueur(direction);
  }
  else if (event.key === 'ArrowUp' && joueurPosition >= TAILLE) {
    localStorage.setItem('derniere_direction', 'haut');
    deplacerJoueur(joueurPosition - TAILLE); // Déplacer vers le haut
  }
  else if (event.key === 'ArrowDown' && joueurPosition < TOTAL_CASES - TAILLE) {
    localStorage.setItem('derniere_direction', 'bas');
    deplacerJoueur(joueurPosition + TAILLE); // Déplacer vers le bas
  }
  else if (event.key === 'ArrowLeft' && joueurPosition % TAILLE !== 0) {
    localStorage.setItem('derniere_direction', 'gauche');
    deplacerJoueur(joueurPosition - 1); // Déplacer vers la gauche
  }
  else if (event.key === 'ArrowRight' && joueurPosition % TAILLE !== TAILLE - 1) {
    localStorage.setItem('derniere_direction', 'droite');
    deplacerJoueur(joueurPosition + 1); // Déplacer vers la droite
  }
});

// Ajouter des instructions à l'écran
const instructions = document.createElement('div');
instructions.style.position = 'absolute';
instructions.style.top = '100px';
instructions.style.left = (arene.offsetWidth + 20) + 'px';
instructions.style.width = '200px';
instructions.style.padding = '10px';
instructions.style.backgroundColor = '#f1f1f1';
instructions.style.border = '1px solid #ddd';
instructions.style.borderRadius = '5px';
instructions.innerHTML = `
  <h3>Instructions:</h3>
  <p>1. Cliquez sur la case DÉPART pour commencer</p>
  <p>2. Utilisez les flèches du clavier pour vous déplacer</p>
  <p>3. Appuyez sur ESPACE pour sauter d'une case</p>
  <p>4. Collectez les bonus (★) et évitez les pièges (☠)</p>
  <p>5. Attention aux surprises cachées (?)</p>
`;
document.body.appendChild(instructions);