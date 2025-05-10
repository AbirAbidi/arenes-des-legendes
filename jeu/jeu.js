// Attendre que le DOM soit complètement chargé
document.addEventListener('DOMContentLoaded', function() {
  console.log("DOM chargé - Initialisation du jeu");
  
  // Initialisation des variables globales
  const arene = document.getElementById('arene');
  const TAILLE = 7;
  const TOTAL_CASES = TAILLE * TAILLE;

  const NB_OBSTACLES = 4;
  const NB_BONUS = 4;
  const NB_PIEGES = 4;
  const NB_SURPRISES = 5;

  const positionsUtilisées = new Set();
  const cases = [];

  // Chemins d'images sans dépendance de chemin absolu
  const playerIdleImage = 'idl/Idle.png';
  const walkImages = [
    'walk/Walk0.png',
    'walk/Walk1.png',
    'walk/Walk2.png',
    'walk/Walk3.png',
    'walk/Walk4.png'
  ];
  const jumpImages = [
    'jump/Jump1.png',
    'jump/Jump2.png',
    'jump/Jump3.png',
    'jump/Jump4.png',
    'jump/Jump5.png',
    'jump/Jump6.png',
    'jump/Jump7.png',
    'jump/Jump8.png'
  ];

  let walkIndex = 0;
  let jumpIndex = 0;
  let joueurPosition = null;
  let isMoving = false;
  let isJumping = false;
  let walkInterval;
  let jumpInterval;

  // Fonction pour générer des positions aléatoires
  function positionAleatoire() {
    let pos;
    do {
      pos = Math.floor(Math.random() * TOTAL_CASES);
    } while (positionsUtilisées.has(pos));
    positionsUtilisées.add(pos);
    return pos;
  }

  // Création des cases de l'arène
  for (let i = 0; i < TOTAL_CASES; i++) {
    const caseDiv = document.createElement('div');
    caseDiv.classList.add('case');
    caseDiv.id = `case-${i}`;

    const decor = document.createElement('div');
    decor.classList.add('decor');

    const element = document.createElement('div');
    element.classList.add('element');

    caseDiv.appendChild(decor);
    caseDiv.appendChild(element);
    arene.appendChild(caseDiv);

    cases.push({ div: caseDiv, element, id: i });

    // Gestion de l'effet surprise sur clic
    caseDiv.addEventListener('click', function() {
      this.classList.add('surprise');
      setTimeout(() => this.classList.remove('surprise'), 500);

      const elem = cases[i].element;
      // Utilisation de notifications au lieu des alertes pour éviter de bloquer l'animation
      if (elem.classList.contains('bonus')) {
        afficherNotification("🎁 Vous avez découvert un BONUS !");
      } else if (elem.classList.contains('piege')) {
        afficherNotification("💥 Oh non, un PIÈGE !");
      } else if (elem.classList.contains('obstacle')) {
        afficherNotification("⛔ C'est un OBSTACLE !");
      } else if (elem.dataset.surprise === 'bonus') {
        afficherNotification("🎁 Surprise ! C'était un BONUS caché !");
      } else if (elem.dataset.surprise === 'piege') {
        afficherNotification("💥 Surprise ! C'était un PIÈGE caché !");
      } else {
        afficherNotification("🔍 Rien de spécial ici...");
      }
    });
  }

  // Système de notification pour remplacer les alertes
  function afficherNotification(message) {
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
    }, 2000);
  }

  // Placement des éléments dans l'arène
  // Obstacles visibles
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

  // Surprises cachées
  for (let i = 0; i < NB_SURPRISES; i++) {
    const index = positionAleatoire();
    const type = Math.random() < 0.5 ? 'bonus' : 'piege';
    cases[index].element.dataset.surprise = type;
    cases[index].element.innerText = "?";
  }

  // Création de la case de départ
  const caseDepart = document.createElement('div');
  caseDepart.classList.add('case', 'depart');
  caseDepart.id = 'case-depart';
  caseDepart.textContent = 'DÉPART';
  document.body.appendChild(caseDepart);

  // Positionnement de la case départ relative à l'arène
  setTimeout(() => {
    const areneRect = arene.getBoundingClientRect();
    const premiereCaseRect = cases[0].div.getBoundingClientRect();
    
    caseDepart.style.position = 'absolute';
    caseDepart.style.top = premiereCaseRect.top + 'px';
    caseDepart.style.left = (premiereCaseRect.left - 100) + 'px';
    caseDepart.style.width = '80px';
    caseDepart.style.height = '80px';
    caseDepart.style.backgroundColor = '#8bc34a';
    caseDepart.style.border = '3px solid #689f38';
    
    console.log("Case départ positionnée à", caseDepart.style.left, caseDepart.style.top);
  }, 100);

  // Création du joueur
  const joueurDiv = document.createElement('div');
  joueurDiv.classList.add('joueur');
  joueurDiv.style.width = '60px';
  joueurDiv.style.height = '60px';
  joueurDiv.style.backgroundSize = 'contain';
  joueurDiv.style.backgroundRepeat = 'no-repeat';
  joueurDiv.style.backgroundPosition = 'center';
  joueurDiv.style.transition = 'all 0.3s ease-in-out';
  
  // Chargement de l'image du joueur
  const img = new Image();
  img.onload = function() {
    joueurDiv.style.backgroundImage = `url(${this.src})`;
    console.log("Image du joueur chargée avec succès");
  };
  img.onerror = function() {
    console.error("Erreur de chargement de l'image du joueur");
    // Au lieu d'afficher un cercle orange, utiliser une icône de personnage
    joueurDiv.textContent = '👤';
    joueurDiv.style.textAlign = 'center';
    joueurDiv.style.fontSize = '40px';
    joueurDiv.style.lineHeight = '60px';
  };
  img.src = playerIdleImage;
  
  // Ajouter le joueur à la case départ
  setTimeout(() => {
    caseDepart.appendChild(joueurDiv);
    console.log("Joueur ajouté à la case départ");
  }, 200);

  // Instructions du jeu
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
    <p>2. Utilisez les flèches du clavier pour vous déplacer</p>
    <p>3. Appuyez sur ESPACE pour sauter d'une case</p>
    <p>4. Collectez les bonus (★) et évitez les pièges (☠)</p>
    <p>5. Attention aux surprises cachées (?)</p>
  `;
  document.body.appendChild(instructions);

  // Fonctions d'animation
  function animerDeplacement() {
    if (!isMoving) return;
    joueurDiv.style.backgroundImage = `url(${walkImages[walkIndex]})`;
    walkIndex = (walkIndex + 1) % walkImages.length;
  }

  function demarrerMarche() {
    isMoving = true;
    walkInterval = setInterval(animerDeplacement, 150);
  }

  function arreterMarche() {
    isMoving = false;
    clearInterval(walkInterval);
    joueurDiv.style.backgroundImage = `url(${playerIdleImage})`;
  }

  function animerSaut() {
    if (!isJumping) return;
    joueurDiv.style.backgroundImage = `url(${jumpImages[jumpIndex]})`;
    jumpIndex = (jumpIndex + 1) % jumpImages.length;
  }

  function demarrerSaut() {
    isJumping = true;
    jumpIndex = 0;
    jumpInterval = setInterval(animerSaut, 100);
  }

  function arreterSaut() {
    isJumping = false;
    clearInterval(jumpInterval);
    joueurDiv.style.backgroundImage = `url(${playerIdleImage})`;
  }

  // Fonction pour entrer dans l'arène
  function entrerDansArene() {
    console.log("Entrée dans l'arène initiée");
    
    // Si le joueur est déjà dans l'arène, ne rien faire
    if (joueurPosition !== null) {
      console.log("Le joueur est déjà dans l'arène");
      return;
    }
    
    // S'assurer que le joueur est dans la case de départ
    if (!caseDepart.contains(joueurDiv)) {
      console.log("Replacement du joueur dans la case départ");
      caseDepart.appendChild(joueurDiv);
    }
    
    // Animation de déplacement vers la première case
    demarrerMarche();
    
    const departRect = caseDepart.getBoundingClientRect();
    const caseCibleRect = cases[0].div.getBoundingClientRect();
    
    // Vérifier que les positions sont valides
    if (!departRect || !caseCibleRect) {
      console.error("Erreur: Rectangle de position non valide");
      return;
    }
    
    const deltaX = caseCibleRect.left - departRect.left;
    const deltaY = caseCibleRect.top - departRect.top;
    
    console.log("Déplacement du joueur de", deltaX, deltaY);
    
    // Créer un clone pour l'animation
    const joueurClone = joueurDiv.cloneNode(true);
    joueurClone.classList.add('joueur-clone');
    document.body.appendChild(joueurClone);
    
    const joueurRect = joueurDiv.getBoundingClientRect();
    joueurClone.style.position = 'fixed';
    joueurClone.style.top = joueurRect.top + 'px';
    joueurClone.style.left = joueurRect.left + 'px';
    joueurClone.style.zIndex = '1000';
    
    // Cacher l'original pendant l'animation
    joueurDiv.style.opacity = '0';
    
    // Animer le déplacement
    setTimeout(() => {
      joueurClone.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
      
      setTimeout(() => {
        // Fin de l'animation
        try {
          document.body.removeChild(joueurClone);
          caseDepart.removeChild(joueurDiv);
          cases[0].div.appendChild(joueurDiv);
          joueurDiv.style.opacity = '1';
          joueurPosition = 0;
          
          // Masquer les instructions
          instructions.style.display = 'none';
          
          console.log("Joueur entré dans l'arène à la position 0");
        } catch (error) {
          console.error("Erreur lors du déplacement du joueur:", error);
          // Récupération d'erreur
          joueurPosition = 0;
          joueurDiv.style.opacity = '1';
          if (joueurDiv.parentNode) joueurDiv.parentNode.removeChild(joueurDiv);
          cases[0].div.appendChild(joueurDiv);
        }
        
        arreterMarche();
      }, 300);
    }, 50);
  }

  // Fonction pour gérer l'interaction avec une case
  function interagirAvecCase(position) {
    const element = cases[position].element;

    if (element.classList.contains('bonus')) {
      afficherNotification("🎁 Vous avez trouvé un BONUS !");
      element.classList.remove('bonus');
    } else if (element.classList.contains('piege')) {
      afficherNotification("💥 Vous êtes tombé sur un PIÈGE !");
    } else if (element.classList.contains('obstacle')) {
      afficherNotification("⛔ Vous avez rencontré un OBSTACLE !");
    } else if (element.dataset.surprise === 'bonus') {
      afficherNotification("🎁 Surprise ! C'était un BONUS caché !");
      delete element.dataset.surprise;
      element.innerText = "";
    } else if (element.dataset.surprise === 'piege') {
      afficherNotification("💥 Surprise ! C'était un PIÈGE caché !");
      delete element.dataset.surprise;
      element.innerText = "";
    }
  }

  // Fonction pour déplacer le joueur dans l'arène
  function deplacerJoueur(nouvellePosition) {
    if (joueurPosition === null) return;
    if (isMoving || isJumping) return;
    
    const ancienneCase = cases[joueurPosition].div;
    const nouvelleCase = cases[nouvellePosition].div;
    
    const ancienneRect = ancienneCase.getBoundingClientRect();
    const nouvelleRect = nouvelleCase.getBoundingClientRect();
    const deltaX = nouvelleRect.left - ancienneRect.left;
    const deltaY = nouvelleRect.top - ancienneRect.top;
    
    demarrerMarche();
    
    const joueurClone = joueurDiv.cloneNode(true);
    joueurClone.classList.add('joueur-clone');
    document.body.appendChild(joueurClone);
    
    const joueurRect = joueurDiv.getBoundingClientRect();
    joueurClone.style.position = 'fixed';
    joueurClone.style.top = joueurRect.top + 'px';
    joueurClone.style.left = joueurRect.left + 'px';
    joueurClone.style.zIndex = '1000';
    
    joueurDiv.style.opacity = '0';
    
    setTimeout(() => {
      joueurClone.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
      
      setTimeout(() => {
        try {
          document.body.removeChild(joueurClone);
          ancienneCase.removeChild(joueurDiv);
          nouvelleCase.appendChild(joueurDiv);
          joueurDiv.style.opacity = '1';
          joueurPosition = nouvellePosition;
          interagirAvecCase(nouvellePosition);
        } catch (error) {
          console.error("Erreur lors du déplacement:", error);
          joueurDiv.style.opacity = '1';
          if (joueurDiv.parentNode) joueurDiv.parentNode.removeChild(joueurDiv);
          nouvelleCase.appendChild(joueurDiv);
          joueurPosition = nouvellePosition;
        }
        
        arreterMarche();
      }, 300);
    }, 50);
  }

  // Fonction pour faire sauter le joueur
  function sauterJoueur(direction) {
    if (joueurPosition === null) return;
    if (isMoving || isJumping) return;
    
    let nouvellePosition;
    
    switch(direction) {
      case 'haut':
        if (joueurPosition >= TAILLE * 2) {
          nouvellePosition = joueurPosition - (TAILLE * 2);
        } else {
          return;
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
        if (joueurPosition % TAILLE >= 2) {
          nouvellePosition = joueurPosition - 2;
        } else {
          return;
        }
        break;
      case 'droite':
        if (joueurPosition % TAILLE <= TAILLE - 3) {
          nouvellePosition = joueurPosition + 2;
        } else {
          return;
        }
        break;
      default:
        return;
    }
    
    const ancienneCase = cases[joueurPosition].div;
    const nouvelleCase = cases[nouvellePosition].div;
    
    const ancienneRect = ancienneCase.getBoundingClientRect();
    const nouvelleRect = nouvelleCase.getBoundingClientRect();
    const deltaX = nouvelleRect.left - ancienneRect.left;
    const deltaY = nouvelleRect.top - ancienneRect.top;
    
    demarrerSaut();
    
    const joueurClone = joueurDiv.cloneNode(true);
    joueurClone.classList.add('joueur-clone');
    document.body.appendChild(joueurClone);
    
    const joueurRect = joueurDiv.getBoundingClientRect();
    joueurClone.style.position = 'fixed';
    joueurClone.style.top = joueurRect.top + 'px';
    joueurClone.style.left = joueurRect.left + 'px';
    joueurClone.style.zIndex = '1000';
    
    joueurDiv.style.opacity = '0';
    
    setTimeout(() => {
      joueurClone.style.transition = 'transform 0.4s cubic-bezier(0.2, -0.6, 0.7, 1.6)';
      joueurClone.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
      
      setTimeout(() => {
        try {
          document.body.removeChild(joueurClone);
          ancienneCase.removeChild(joueurDiv);
          nouvelleCase.appendChild(joueurDiv);
          joueurDiv.style.opacity = '1';
          joueurPosition = nouvellePosition;
          interagirAvecCase(nouvellePosition);
        } catch (error) {
          console.error("Erreur lors du saut:", error);
          joueurDiv.style.opacity = '1';
          if (joueurDiv.parentNode) joueurDiv.parentNode.removeChild(joueurDiv);
          nouvelleCase.appendChild(joueurDiv);
          joueurPosition = nouvellePosition;
        }
        
        arreterSaut();
      }, 400);
    }, 50);
  }

  // Attachement des événements
  // 1. Événement pour la case départ
  caseDepart.addEventListener('click', function(e) {
    console.log("Case départ cliquée!");
    entrerDansArene();
    e.stopPropagation();
  });

  // 2. Événements clavier
  document.addEventListener('keydown', function(event) {
    console.log("Touche pressée:", event.key);
    
    if (joueurPosition === null) return;
    if (isMoving || isJumping) return;
    
    if (event.key === ' ' || event.key === 'Spacebar') {
      const direction = localStorage.getItem('derniere_direction') || 'droite';
      sauterJoueur(direction);
    }
    else if (event.key === 'ArrowUp' && joueurPosition >= TAILLE) {
      localStorage.setItem('derniere_direction', 'haut');
      deplacerJoueur(joueurPosition - TAILLE);
    }
    else if (event.key === 'ArrowDown' && joueurPosition < TOTAL_CASES - TAILLE) {
      localStorage.setItem('derniere_direction', 'bas');
      deplacerJoueur(joueurPosition + TAILLE);
    }
    else if (event.key === 'ArrowLeft' && joueurPosition % TAILLE !== 0) {
      localStorage.setItem('derniere_direction', 'gauche');
      deplacerJoueur(joueurPosition - 1);
    }
    else if (event.key === 'ArrowRight' && joueurPosition % TAILLE !== TAILLE - 1) {
      localStorage.setItem('derniere_direction', 'droite');
      deplacerJoueur(joueurPosition + 1);
    }
  });
  
  // Ajouter un bouton d'aide pour faciliter le débogage
  const debugButton = document.createElement('button');
  debugButton.textContent = "Mode Debug";
  debugButton.style.position = 'absolute';
  debugButton.style.bottom = '20px';
  debugButton.style.right = '20px';
  debugButton.style.padding = '10px';
  debugButton.style.zIndex = '1000';
  
  debugButton.addEventListener('click', function() {
    console.log("-- ÉTAT DU JEU --");
    console.log("Position joueur:", joueurPosition);
    console.log("Joueur dans l'arène:", joueurPosition !== null);
    console.log("En mouvement:", isMoving);
    console.log("En saut:", isJumping);
    
    // Si le joueur n'est pas dans l'arène, essayez de le forcer
    if (joueurPosition === null) {
      console.log("Tentative de forcer l'entrée du joueur dans l'arène...");
      
      if (joueurDiv.parentNode) joueurDiv.parentNode.removeChild(joueurDiv);
      cases[0].div.appendChild(joueurDiv);
      joueurDiv.style.opacity = '1';
      joueurPosition = 0;
      instructions.style.display = 'none';
      
      console.log("Position du joueur forcée à 0");
    }
  });
  
  document.body.appendChild(debugButton);
  
  console.log("Initialisation du jeu terminée");
});