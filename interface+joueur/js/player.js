class Joueur {
  constructor(nom, idleImage, position = null) {
    this.nom = nom || "Joueur";
    this.idleImage = idleImage;  // L'image du joueur
    this.position = position;
    this.isMoving = false;
    this.isJumping = false;
    this.element = null;
    this.creerElement();
  }

  // Créer l'élément HTML pour le joueur avec son image
  creerElement() {
    this.element = document.createElement('div');
    this.element.classList.add('joueur');
    this.element.style.width = '60px';
    this.element.style.height = '60px';
    this.element.style.backgroundSize = 'contain';
    this.element.style.backgroundRepeat = 'no-repeat';
    this.element.style.backgroundPosition = 'center';
    this.element.style.transition = 'all 0.3s ease-in-out';

    const img = new Image();
    img.onload = () => {
      this.element.style.backgroundImage = `url(${this.idleImage})`;
    };
    img.src = this.idleImage;
  }

  // Méthode pour obtenir l'élément HTML du joueur
  getElement() {
    return this.element;
  }

  // Déplacer le joueur avec des coordonnées
  deplacer(deltaX, deltaY) {
    if (this.isMoving || this.isJumping) return; // Ignorer si le joueur est déjà en mouvement ou en train de sauter
    this.position += deltaX + deltaY;  // Mise à jour simple de la position
    this.isMoving = true;
    setTimeout(() => {
      this.isMoving = false;
    }, 300);  // Animation simplifiée en 300ms
  }

  // Sauter (animation simplifiée)
  sauter() {
    if (this.isJumping || this.isMoving) return;
    this.isJumping = true;
    setTimeout(() => {
      this.isJumping = false;
    }, 500);  // Durée du saut
  }

  // Gérer les touches pressées
  gererTouche(key) {
    let deltaX = 0;
    let deltaY = 0;

    switch (key) {
      case 'ArrowUp':
      case 'z':
        deltaY = -1;  // Déplacer vers le haut
        break;
      case 'ArrowDown':
      case 's':
        deltaY = 1;  // Déplacer vers le bas
        break;
      case 'ArrowRight':
      case 'd':
        deltaX = 1;  // Déplacer vers la droite
        break;
      case 'ArrowLeft':
      case 'q':
        deltaX = -1;  // Déplacer vers la gauche
        break;
      case ' ':
      case 'v':
        this.sauter();
        return;
      default:
        return;  // Ignorer les autres touches
    }

    this.deplacer(deltaX, deltaY);
  }
}
