// player2.js
// Gestion du deuxième joueur et de ses animations

let joueur2Div; // Déclaration de la variable pour le joueur 2

// Création du joueur 2
function creerJoueur2() {
  joueur2Div = document.createElement('div');
  joueur2Div.classList.add('joueur'); // même classe CSS
  joueur2Div.style.width = '60px';
  joueur2Div.style.height = '60px';
  joueur2Div.style.backgroundSize = 'contain';
  joueur2Div.style.backgroundRepeat = 'no-repeat';
  joueur2Div.style.backgroundPosition = 'center';
  joueur2Div.style.transition = 'all 0.3s ease-in-out';

  // Chargement de l'image du joueur 2
  const img = new Image();
  img.onload = function() {
    joueur2Div.style.backgroundImage = `url(${this.src})`;
    console.log("Image du joueur 2 chargée avec succès");
  };
  img.onerror = function() {
    console.error("Erreur de chargement de l'image du joueur 2");
    joueur2Div.textContent = '🧍'; // emoji différent pour joueur 2
    joueur2Div.style.textAlign = 'center';
    joueur2Div.style.fontSize = '40px';
    joueur2Div.style.lineHeight = '60px';
  };
  img.src = player2IdleImage; // à définir dans config.js

  return joueur2Div;
}
function animerDeplacement2() {
   // if (!isMoving2) return;
   // joueur2Div.style.backgroundImage = `url(${walkImages2[walkIndex2]})`;
   // walkIndex2 = (walkIndex2 + 1) % walkImages2.length;
  }
  
  function demarrerMarche2() {
    isMoving2 = true;
    walkInterval2 = setInterval(animerDeplacement2, 150);
  }
  
  function arreterMarche2() {
    isMoving2 = false;
    clearInterval(walkInterval2);
    joueur2Div.style.backgroundImage = `url(${player2IdleImage})`;
  }
  function animerSaut2() {
   // if (!isJumping2) return;
    //joueur2Div.style.backgroundImage = `url(${jumpImages2[jumpIndex2]})`;
   // jumpIndex2 = (jumpIndex2 + 1) % jumpImages2.length;
  }
  
  function demarrerSaut2() {
    isJumping2 = true;
    jumpIndex2 = 0;
    jumpInterval2 = setInterval(animerSaut2, 100);
  }
  
  function arreterSaut2() {
    isJumping2 = false;
    clearInterval(jumpInterval2);
    joueur2Div.style.backgroundImage = `url(${player2IdleImage})`;
  }
  
  