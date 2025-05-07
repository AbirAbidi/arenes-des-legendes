// game.js
// Orchestration du jeu et gestion des événements

document.addEventListener('DOMContentLoaded', function() {
  console.log("DOM chargé - Initialisation du jeu");
  
  // Création de l'arène
  const arene = creerArene();
  
  // Variables pour le suivi des joueurs
  let joueurPosition = null;
  let joueur2Position = null;
  let isMoving = false;
  let isJumping = false;
  let isMoving2 = false;
  let isJumping2 = false;
  
  // Création des joueurs
  const joueurDiv = creerJoueur();
  const joueur2Div = creerJoueur2();  // Ajoutez une classe différente pour le joueur 2
  
  // Création des cases de départ
  const caseDepartJ1 = creerCaseDepart(0, 'DÉPART J1', '#8bc34a', 'case-depart-j1', -100);
  const caseDepartJ2 = creerCaseDepart(TOTAL_CASES - 1, 'DÉPART J2', '#2196f3', 'case-depart-j2', 100);
  
  // Ajouter les joueurs à leurs cases départ respectives
  setTimeout(() => {
    caseDepartJ1.appendChild(joueurDiv);
    console.log("Joueur ajouté à la case départ");
  }, 200);
  
  setTimeout(() => {
    caseDepartJ2.appendChild(joueur2Div);
    console.log("Joueur 2 ajouté à la case départ");
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
    <p>2. Joueur 1: Flèches du clavier</p>
    <p>3. Joueur 1: ESPACE pour sauter</p>
    <p>4. Joueur 2: Z,Q,S,D pour déplacer</p>
    <p>5. Joueur 2: V pour sauter</p>
    <p>6. Collectez les bonus (★) et évitez les pièges (☠)</p>
  `;
  document.body.appendChild(instructions);

  // Fonction pour entrer dans l'arène - Joueur 1
  function entrerDansArene() {
    console.log("Entrée dans l'arène initiée pour joueur 1");
    
    // Si le joueur est déjà dans l'arène, ne rien faire
    if (joueurPosition !== null) {
      console.log("Le joueur est déjà dans l'arène");
      return;
    }
    
    // S'assurer que le joueur est dans la case de départ
    if (!caseDepartJ1.contains(joueurDiv)) {
      console.log("Replacement du joueur dans la case départ");
      caseDepartJ1.appendChild(joueurDiv);
    }
    
    // Animation de déplacement vers la première case
    demarrerMarche();
    const departRect = caseDepartJ1.getBoundingClientRect();
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
          caseDepartJ1.removeChild(joueurDiv);
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
  
  // Fonction pour entrer dans l'arène - Joueur 2
  function entrerDansAreneJ2() {
    console.log("Entrée dans l'arène initiée pour joueur 2");

    // Si le joueur 2 est déjà dans l'arène, ne rien faire
    if (joueur2Position !== null) {
      console.log("Le joueur 2 est déjà dans l'arène");
      return;
    }

    // S'assurer que le joueur 2 est dans la case de départ
    if (!caseDepartJ2.contains(joueur2Div)) {
      console.log("Placement du joueur 2 dans la case départ");
      caseDepartJ2.appendChild(joueur2Div);
    }
    
    // Animation de déplacement vers la dernière case
    demarrerMarche2();
    const departRect = caseDepartJ2.getBoundingClientRect();
    const caseCibleRect = cases[TOTAL_CASES - 1].div.getBoundingClientRect();
    
    // Vérifier que les positions sont valides
    if (!departRect || !caseCibleRect) {
      console.error("Erreur: Rectangle de position non valide pour joueur 2");
      return;
    }
    
    const deltaX = caseCibleRect.left - departRect.left;
    const deltaY = caseCibleRect.top - departRect.top;
    
    console.log("Déplacement du joueur 2 de", deltaX, deltaY);
    
    // Créer un clone pour l'animation
    const joueur2Clone = joueur2Div.cloneNode(true);
    joueur2Clone.classList.add('joueur2-clone');
    document.body.appendChild(joueur2Clone);
    
    const joueur2Rect = joueur2Div.getBoundingClientRect();
    joueur2Clone.style.position = 'fixed';
    joueur2Clone.style.top = joueur2Rect.top + 'px';
    joueur2Clone.style.left = joueur2Rect.left + 'px';
    joueur2Clone.style.zIndex = '1000';
    
    // Cacher l'original pendant l'animation
    joueur2Div.style.opacity = '0';
    
    // Animer le déplacement
    setTimeout(() => {
      joueur2Clone.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
      
      setTimeout(() => {
        // Fin de l'animation
        try {
          document.body.removeChild(joueur2Clone);
          caseDepartJ2.removeChild(joueur2Div);
          cases[TOTAL_CASES - 1].div.appendChild(joueur2Div);
          joueur2Div.style.opacity = '1';
          joueur2Position = TOTAL_CASES - 1;
          
          console.log("Joueur 2 entré dans l'arène à la position", TOTAL_CASES - 1);
        } catch (error) {
          console.error("Erreur lors du déplacement du joueur 2:", error);
          // Récupération d'erreur
          joueur2Position = TOTAL_CASES - 1;
          joueur2Div.style.opacity = '1';
          if (joueur2Div.parentNode) joueur2Div.parentNode.removeChild(joueur2Div);
          cases[TOTAL_CASES - 1].div.appendChild(joueur2Div);
        }
        
        arreterMarche2();
      }, 300);
    }, 50);
  }

  // Fonction pour déplacer le joueur 1 dans l'arène
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
    isMoving = true;
    
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
        isMoving = false;
      }, 300);
    }, 50);
  }
  
  // Fonction pour déplacer le joueur 2 dans l'arène
  function deplacerJoueur2(nouvellePosition) {
    if (joueur2Position === null) return;
    if (isMoving2 || isJumping2) return;
    
    const ancienneCase = cases[joueur2Position].div;
    const nouvelleCase = cases[nouvellePosition].div;
    
    const ancienneRect = ancienneCase.getBoundingClientRect();
    const nouvelleRect = nouvelleCase.getBoundingClientRect();
    const deltaX = nouvelleRect.left - ancienneRect.left;
    const deltaY = nouvelleRect.top - ancienneRect.top;
    
    demarrerMarche2();
    isMoving2 = true;
    
    const joueur2Clone = joueur2Div.cloneNode(true);
    joueur2Clone.classList.add('joueur2-clone');
    document.body.appendChild(joueur2Clone);
    
    const joueur2Rect = joueur2Div.getBoundingClientRect();
    joueur2Clone.style.position = 'fixed';
    joueur2Clone.style.top = joueur2Rect.top + 'px';
    joueur2Clone.style.left = joueur2Rect.left + 'px';
    joueur2Clone.style.zIndex = '1000';
    
    joueur2Div.style.opacity = '0';
    
    setTimeout(() => {
      joueur2Clone.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
      
      setTimeout(() => {
        try {
          document.body.removeChild(joueur2Clone);
          ancienneCase.removeChild(joueur2Div);
          nouvelleCase.appendChild(joueur2Div);
          joueur2Div.style.opacity = '1';
          joueur2Position = nouvellePosition;
          interagirAvecCase2(nouvellePosition);
        } catch (error) {
          console.error("Erreur lors du déplacement du joueur 2:", error);
          joueur2Div.style.opacity = '1';
          if (joueur2Div.parentNode) joueur2Div.parentNode.removeChild(joueur2Div);
          nouvelleCase.appendChild(joueur2Div);
          joueur2Position = nouvellePosition;
        }
        
        arreterMarche2();
        isMoving2 = false;
      }, 300);
    }, 50);
  }

  // Fonction pour faire sauter le joueur 1
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
    isJumping = true;
    
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
        isJumping = false;
      }, 400);
    }, 50);
  }

  // Fonction pour faire sauter le joueur 2
  function sauterJoueur2(direction) {
    if (joueur2Position === null) return;
    if (isMoving2 || isJumping2) return;
    
    let nouvellePosition;
    
    switch(direction) {
      case 'haut':
        if (joueur2Position >= TAILLE * 2) {
          nouvellePosition = joueur2Position - (TAILLE * 2);
        } else {
          return;
        }
        break;
      case 'bas':
        if (joueur2Position < TOTAL_CASES - (TAILLE * 2)) {
          nouvellePosition = joueur2Position + (TAILLE * 2);
        } else {
          return;
        }
        break;
      case 'gauche':
        if (joueur2Position % TAILLE >= 2) {
          nouvellePosition = joueur2Position - 2;
        } else {
          return;
        }
        break;
      case 'droite':
        if (joueur2Position % TAILLE <= TAILLE - 3) {
          nouvellePosition = joueur2Position + 2;
        } else {
          return;
        }
        break;
      default:
        return;
    }
    
    const ancienneCase = cases[joueur2Position].div;
    const nouvelleCase = cases[nouvellePosition].div;
    
    const ancienneRect = ancienneCase.getBoundingClientRect();
    const nouvelleRect = nouvelleCase.getBoundingClientRect();
    const deltaX = nouvelleRect.left - ancienneRect.left;
    const deltaY = nouvelleRect.top - ancienneRect.top;
    
    demarrerSaut2();
    isJumping2 = true;
    
    const joueur2Clone = joueur2Div.cloneNode(true);
    joueur2Clone.classList.add('joueur2-clone');
    document.body.appendChild(joueur2Clone);
    
    const joueur2Rect = joueur2Div.getBoundingClientRect();
    joueur2Clone.style.position = 'fixed';
    joueur2Clone.style.top = joueur2Rect.top + 'px';
    joueur2Clone.style.left = joueur2Rect.left + 'px';
    joueur2Clone.style.zIndex = '1000';
    
    joueur2Div.style.opacity = '0';
    
    setTimeout(() => {
      joueur2Clone.style.transition = 'transform 0.4s cubic-bezier(0.2, -0.6, 0.7, 1.6)';
      joueur2Clone.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
      
      setTimeout(() => {
        try {
          document.body.removeChild(joueur2Clone);
          ancienneCase.removeChild(joueur2Div);
          nouvelleCase.appendChild(joueur2Div);
          joueur2Div.style.opacity = '1';
          joueur2Position = nouvellePosition;
          interagirAvecCase2(nouvellePosition);
        } catch (error) {
          console.error("Erreur lors du saut du joueur 2:", error);
          joueur2Div.style.opacity = '1';
          if (joueur2Div.parentNode) joueur2Div.parentNode.removeChild(joueur2Div);
          nouvelleCase.appendChild(joueur2Div);
          joueur2Position = nouvellePosition;
        }
        
        arreterSaut2();
        isJumping2 = false;
      }, 400);
    }, 50);
  }
  
  // Fonctions d'animation pour le joueur 1
  function demarrerMarche() {
    joueurDiv.classList.add('marche');
  }
  
  function arreterMarche() {
    joueurDiv.classList.remove('marche');
  }
  
  function demarrerSaut() {
    joueurDiv.classList.add('saut');
  }
  
  function arreterSaut() {
    joueurDiv.classList.remove('saut');
  }
  
  // Fonctions d'animation pour le joueur 2
  function demarrerMarche2() {
    joueur2Div.classList.add('marche');
  }
  
  function arreterMarche2() {
    joueur2Div.classList.remove('marche');
  }
  
  function demarrerSaut2() {
    joueur2Div.classList.add('saut');
  }
  
  function arreterSaut2() {
    joueur2Div.classList.remove('saut');
  }
  
  // Fonction d'interaction avec les cases pour joueur 2
  function interagirAvecCase2(position) {
    // Vous devez implémenter cette fonction en fonction de vos besoins,
    // similaire à interagirAvecCase pour le joueur 1
    console.log("Joueur 2 interagit avec la case", position);
    // Utilisez cases[position].type pour déterminer l'action à effectuer
  }
  
  // Attachement des événements
  // 1. Événement pour la case départ joueur 1
  caseDepartJ1.addEventListener('click', function(e) {
    console.log("Case départ joueur 1 cliquée!");
    entrerDansArene();
    e.stopPropagation();
  });
  
  // Événement pour la case départ du joueur 2
  caseDepartJ2.addEventListener('click', function(e) {
    console.log("Case départ joueur 2 cliquée!");
    entrerDansAreneJ2();
    e.stopPropagation();
  });
  
  // 2. Événements clavier
  document.addEventListener('keydown', function(event) {
    console.log("Touche pressée:", event.key);
    
    // Contrôles pour le joueur 1
    if (joueurPosition !== null && !isMoving && !isJumping) {
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
    }
    
    // Contrôles pour le joueur 2
    if (joueur2Position !== null && !isMoving2 && !isJumping2) {
      if (event.key === 'v' || event.key === 'V') {
        const direction = localStorage.getItem('derniere_direction2') || 'gauche';
        sauterJoueur2(direction);
      }
      else if ((event.key === 'z' || event.key === 'Z') && joueur2Position >= TAILLE) {
        localStorage.setItem('derniere_direction2', 'haut');
        deplacerJoueur2(joueur2Position - TAILLE);
      }
      else if ((event.key === 's' || event.key === 'S') && joueur2Position < TOTAL_CASES - TAILLE) {
        localStorage.setItem('derniere_direction2', 'bas');
        deplacerJoueur2(joueur2Position + TAILLE);
      }
      else if ((event.key === 'q' || event.key === 'Q') && joueur2Position % TAILLE !== 0) {
        localStorage.setItem('derniere_direction2', 'gauche');
        deplacerJoueur2(joueur2Position - 1);
      }
      else if ((event.key === 'd' || event.key === 'D') && joueur2Position % TAILLE !== TAILLE - 1) {
        localStorage.setItem('derniere_direction2', 'droite');
        deplacerJoueur2(joueur2Position + 1);
      }
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
    console.log("Position joueur 1:", joueurPosition);
    console.log("Joueur 1 dans l'arène:", joueurPosition !== null);
    console.log("J1 en mouvement:", isMoving);
    console.log("J1 en saut:", isJumping);
    
    console.log("Position joueur 2:", joueur2Position);
    console.log("Joueur 2 dans l'arène:", joueur2Position !== null);
    console.log("J2 en mouvement:", isMoving2);
    console.log("J2 en saut:", isJumping2);
    
    // Si le joueur 1 n'est pas dans l'arène, essayez de le forcer
    if (joueurPosition === null) {
      console.log("Tentative de forcer l'entrée du joueur 1 dans l'arène...");
      
      if (joueurDiv.parentNode) joueurDiv.parentNode.removeChild(joueurDiv);
      cases[0].div.appendChild(joueurDiv);
      joueurDiv.style.opacity = '1';
      joueurPosition = 0;
      
      console.log("Position du joueur 1 forcée à 0");
    }
    
    // Si le joueur 2 n'est pas dans l'arène, essayez de le forcer
    if (joueur2Position === null) {
      console.log("Tentative de forcer l'entrée du joueur 2 dans l'arène...");
      
      if (joueur2Div.parentNode) joueur2Div.parentNode.removeChild(joueur2Div);
      cases[TOTAL_CASES - 1].div.appendChild(joueur2Div);
      joueur2Div.style.opacity = '1';
      joueur2Position = TOTAL_CASES - 1;
      
      console.log("Position du joueur 2 forcée à", TOTAL_CASES - 1);
    }
  });
  document.body.appendChild(debugButton);
  
  console.log("Initialisation du jeu terminée");
  
  // Recalculer les positions des cases de départ lors du redimensionnement
  window.addEventListener('resize', function() {
    // Recalculer la position des cases de départ
    const caseRef1 = cases[0].div.getBoundingClientRect();
    const caseRef2 = cases[TOTAL_CASES - 1].div.getBoundingClientRect();
    
    const caseDepartJ1 = document.getElementById('case-depart-j1');
    const caseDepartJ2 = document.getElementById('case-depart-j2');
    
    caseDepartJ1.style.top = `${caseRef1.top}px`;
    caseDepartJ1.style.left = `${caseRef1.left - 100}px`;
    
    caseDepartJ2.style.top = `${caseRef2.top}px`;
    caseDepartJ2.style.left = `${caseRef2.left + 100}px`;
  });
});