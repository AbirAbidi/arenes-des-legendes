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
