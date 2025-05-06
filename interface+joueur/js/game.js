// game.js
// Orchestration du jeu et gestion des événements

document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM chargé - Initialisation du jeu");
    
    // Création de l'arène
    const arene = creerArene();
    
    // Création du joueur
    joueurDiv = creerJoueur();
    
    // Création de la case départ
    const caseDepart = creerCaseDepart();
    
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