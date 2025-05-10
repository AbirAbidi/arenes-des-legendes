// utils.js
// Fonctions utilitaires pour le jeu

// Fonction pour générer des positions aléatoires
function positionAleatoire() {
    let pos;
    do {
      pos = Math.floor(Math.random() * TOTAL_CASES);
    } while (positionsUtilisées.has(pos));
    positionsUtilisées.add(pos);
    return pos;
  }
  
  // Système de notification pour remplacer les alertes
  function afficherNotification(message, duration = 2000) {
    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Animation d'entrée
    setTimeout(() => {
      notification.classList.add('visible');
    }, 10);
    
    // Auto-suppression après un délai
    setTimeout(() => {
      notification.classList.remove('visible');
      setTimeout(() => document.body.removeChild(notification), 500);
    }, duration);
  }
function isCaseOccupee(position, joueurs) {
  // Vérifier si la position est hors des limites
  if (position < 0 || position >= TOTAL_CASES) return true;

  // Vérifier si un joueur occupe déjà cette position
  for (let joueur of joueurs) {
    if (joueur.position === position) {
      return true; // La case est occupée par un joueur
    }
  }

  // Vérifier si la case contient un obstacle
  if (cases[position].element.classList.contains('obstacle')) {
    return true; // La case est occupée par un obstacle
  }

  // Si aucune condition n'est remplie, la case est libre
  return false;
}

  function afficherInstructions() {
  const instructions = document.createElement('div');
  instructions.style.position = 'absolute';
  instructions.style.top = '150px';
  instructions.style.left = '20px';
  instructions.style.width = '200px';
  instructions.style.padding = '10px';
  instructions.style.backgroundColor = '#f1f1f1';
  instructions.style.border = '1px solid #ddd';
  instructions.style.borderRadius = '5px';
  instructions.style.zIndex = '100';
  instructions.innerHTML = `
    <h3>Instructions:</h3>
    <p>1. Cliquez sur la case DÉPART pour commencer</p>
    <p>2. Joueur 1: Flèches du clavier</p>
    <p>3. Joueur 1: ESPACE pour sauter</p>
    <p>4. Joueur 2: Z,Q,S,D pour déplacer</p>
    <p>5. Joueur 2: V pour sauter</p>
    <p>6. Collectez les bonus (★) et évitez les pièges (☠)</p>
  `;
  document.body.appendChild(instructions);
}
function afficherDe() {
  const elementDe = document.createElement('div');
  elementDe.style.width = '100px';
  elementDe.style.height = '100px';
  elementDe.style.display = 'flex';
  elementDe.style.alignItems = 'center';
  elementDe.style.justifyContent = 'center';
  elementDe.style.backgroundColor = '#fff';
  elementDe.style.border = '2px solid #333';
  elementDe.style.borderRadius = '8px';
  elementDe.style.fontSize = '36px';
  elementDe.style.fontWeight = 'bold';
  elementDe.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
  elementDe.style.position = 'absolute';
  elementDe.style.top = '20px';
  elementDe.style.left = '20px';
  elementDe.style.cursor = 'pointer';
  elementDe.textContent = '?'; // Affichage initial

  document.body.appendChild(elementDe);
}
 function lancerDe() {
    return Math.floor(Math.random() * 6) + 1; // Retourne un nombre entre 1 et 6
  }