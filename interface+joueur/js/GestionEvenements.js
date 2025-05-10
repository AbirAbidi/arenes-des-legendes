class GestionnaireEvenements {
  constructor(joueur, arena) {
    this.joueur = joueur; // Un seul joueur
    this.arena = arena;
    this.initialiserEvenements();
  }

  // Initialiser les événements
  initialiserEvenements() {
    // Événement pour les touches du clavier
    window.addEventListener('keydown', (e) => this.onToucheAppuyee(e));
    
    // Vérifier que l'arène a été créée avant d'ajouter des événements de clic
    if (this.arena.areneCreated) {
      this.attacherEvenementsClic();
    } else {
      console.warn("L'arène n'a pas encore été créée. Les événements de clic seront ajoutés après sa création.");
    }
  }

  // Attacher les événements de clic aux cases
  attacherEvenementsClic() {
    // Parcourir toutes les cases de l'arène et ajouter l'événement de clic
    this.arena.cases.forEach(caseObj => {
      // Nous utilisons la propriété div de chaque case pour ajouter l'écouteur
      caseObj.div.addEventListener('click', () => this.onCaseCliquee(caseObj.id));
    });
    
    // Attacher aussi des événements aux cases de départ
    const casesDepart = document.querySelectorAll('.depart');
    casesDepart.forEach(caseDepart => {
      caseDepart.addEventListener('click', () => this.onCaseDepartCliquee(caseDepart.id));
    });
  }

  // Gérer l'événement lorsqu'une touche est enfoncée
  onToucheAppuyee(event) {
    // Empêcher le défilement de la page avec les touches fléchées
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(event.key)) {
      event.preventDefault();
    }
    
    // Transmettre l'événement au joueur
    this.joueur.gererTouche(event.key);
  }

  // Gérer l'événement lorsqu'une case est cliquée
  onCaseCliquee(index) {
    const joueur = this.joueur;
    const position = joueur.position;
    
    // Vérifier si le joueur est déjà sur une case de l'arène
    if (position !== null && position !== 'depart') {
      // Calculer si le mouvement est valide (adjacent)
      const currentRow = Math.floor(position / this.arena.taille);
      const currentCol = position % this.arena.taille;
      const targetRow = Math.floor(index / this.arena.taille);
      const targetCol = index % this.arena.taille;
      
      // Vérifier si le mouvement est valide (case adjacente)
      const rowDiff = Math.abs(targetRow - currentRow);
      const colDiff = Math.abs(targetCol - currentCol);
      
      if ((rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1)) {
        // Déplacer le joueur vers la case cliquée
        this.deplacerJoueur(joueur, index);
      } else {
        afficherNotification("Mouvement non valide: vous devez vous déplacer sur une case adjacente.");
      }
    }
  }

  // Gérer le clic sur une case de départ
  onCaseDepartCliquee(id) {
    // Si le joueur est sur la case départ, le faire entrer dans l'arène
    if (this.joueur.position === 'depart') {
      this.arena.enterArene(this.joueur, id);
    }
  }

  // Déplacer le joueur vers une nouvelle case
  deplacerJoueur(joueur, nouvellePosition) {
    // Retirer le joueur de sa position actuelle
    if (joueur.element.parentNode) {
      joueur.element.parentNode.removeChild(joueur.element);
    }
    
    // Ajouter le joueur à la nouvelle case
    this.arena.cases[nouvellePosition].div.appendChild(joueur.getElement());
    
    // Mettre à jour la position du joueur
    joueur.position = nouvellePosition;
    
    // Interagir avec la case (bonus, piège, etc.)
    this.arena.interagirAvecCase(nouvellePosition);
  }
}

// Fonction auxiliaire pour afficher des notifications
function afficherNotification(message) {
  console.log(message);
  // Si une fonction afficherNotification existe déjà dans le contexte global
  if (window.afficherNotification && typeof window.afficherNotification === 'function') {
    window.afficherNotification(message);
  } else {
    // Créer un élément de notification simple si la fonction n'existe pas
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.left = '50%';
    notification.style.transform = 'translateX(-50%)';
    notification.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    notification.style.color = 'white';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '5px';
    notification.style.zIndex = '1000';
    
    document.body.appendChild(notification);
    
    // Supprimer la notification après 3 secondes
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 3000);
  }
}