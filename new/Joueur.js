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
  
  // Définir la position du joueur
  setPosition(position) {
    this.position = position;
  }
  
  // Déplacer le joueur vers une nouvelle position
  deplacer(nouvellePosition) {
    if (this.isMoving || this.isJumping) return false; // Ignorer si le joueur est déjà en mouvement
    
    this.position = nouvellePosition;  // Mise à jour de la position
    this.isMoving = true;
    
    setTimeout(() => {
      this.isMoving = false;
    }, 300);  // Animation simplifiée en 300ms
    
    return true; // Le déplacement a été effectué
  }
  
  // Calculer la prochaine position en fonction du delta
  calculerNouvellePosition(deltaX, deltaY, taille) {
    // Si le joueur est sur la case départ, ne rien faire
    if (this.position === 'depart') return null;
    
    // Convertir la position actuelle en coordonnées de ligne et colonne
    const currentRow = Math.floor(this.position / taille);
    const currentCol = this.position % taille;
    
    // Calculer les nouvelles coordonnées
    const newRow = currentRow + deltaY;
    const newCol = currentCol + deltaX;
    
    // Vérifier si les nouvelles coordonnées sont valides
    if (newRow < 0 || newRow >= taille || newCol < 0 || newCol >= taille) {
      return null; // Mouvement hors limites
    }
    
    // Convertir les coordonnées en index de case
    return newRow * taille + newCol;
  }
  
  // Sauter (animation simplifiée)
  sauter() {
    if (this.isJumping || this.isMoving) return;
    
    this.isJumping = true;
    this.element.style.transform = 'translateY(-20px)';
    
    setTimeout(() => {
      this.element.style.transform = 'translateY(0)';
      setTimeout(() => {
        this.isJumping = false;
      }, 150);
    }, 350);  // Durée du saut
  }
  
  // Gérer les touches pressées
  gererTouche(key) {
    // Ignorer les commandes clavier si le joueur n'est pas sur l'arène
    if (this.position === null) return;
    
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
    
    // Si le joueur est sur la case départ, il doit entrer dans l'arène
    // Ce cas sera géré par le gestionnaire d'événements
    if (this.position === 'depart') return;
    
    // Calculer et mettre à jour la nouvelle position
    // Notez que nous ne pouvons pas calculer la nouvelle position ici car nous avons besoin
    // de la taille de l'arène. Le gestionnaire d'événements s'en chargera.
  }
}