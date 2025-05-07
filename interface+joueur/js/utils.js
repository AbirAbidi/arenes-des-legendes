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
  function isCaseOccupee(position) {
    // Vérifier si la position est valide
    if (position < 0 || position >= TOTAL_CASES) return true;
    
    // Vérifier si le joueur 1 occupe cette case
    if (joueurPosition === position) return true;
    
    // Vérifier si le joueur 2 occupe cette case
    if (joueur2Position === position) return true;
    
    // Vérifier si la case contient un obstacle
    if (cases[position].element.classList.contains('obstacle')) return true;
    
    return false;
  }