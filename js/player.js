// player.js
// Gestion du joueur et de ses animations

let joueurDiv; // Déclaration de la variable joueur

// Création du joueur
function creerJoueur() {
  joueurDiv = document.createElement('div');
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
  img.src = characterOne;
  
  return joueurDiv;
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
