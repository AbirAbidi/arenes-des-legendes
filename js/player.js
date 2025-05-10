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
  //if (!isMoving) return;
  //joueurDiv.style.backgroundImage = `url(${walkImages[walkIndex]})`;
  //walkIndex = (walkIndex + 1) % walkImages.length;
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