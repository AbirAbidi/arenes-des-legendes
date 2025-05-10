document.addEventListener('DOMContentLoaded', function() { // Attendre que le DOM soit complètement chargé


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


});