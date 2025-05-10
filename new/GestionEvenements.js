class GestionnaireEvenements {
  constructor(joueurs, arena) {
    this.joueurs = Array.isArray(joueurs) ? joueurs : [joueurs]; // Accepte un joueur ou un tableau de joueurs
    this.joueurActif = 0; // Index du joueur actif dans le tableau
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

  // Obtenir le joueur actif
  getJoueurActif() {
    return this.joueurs[this.joueurActif];
  }

  // Passer au joueur suivant
  prochainJoueur() {
    this.joueurActif = (this.joueurActif + 1) % this.joueurs.length;
    afficherNotification(`C'est au tour de ${this.getJoueurActif().nom}`);
  }

  // Gérer l'événement lorsqu'une touche est enfoncée
  onToucheAppuyee(event) {
    // Empêcher le défilement de la page avec les touches fléchées
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(event.key)) {
      event.preventDefault();
    }
    
    const joueur = this.getJoueurActif();
    const key = event.key;
    
    // Si le joueur est sur une case de départ, ne rien faire
    if (joueur.position === 'depart') return;
    
    // Si la touche est un mouvement directionnel
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'z', 'q', 's', 'd'].includes(key)) {
      let deltaX = 0;
      let deltaY = 0;
      
      switch (key) {
        case 'ArrowUp':
        case 'z':
          deltaY = -1;
          break;
        case 'ArrowDown':
        case 's':
          deltaY = 1;
          break;
        case 'ArrowLeft':
        case 'q':
          deltaX = -1;
          break;
        case 'ArrowRight':
        case 'd':
          deltaX = 1;
          break;
      }
      
      // Calculer la nouvelle position
      const nouvellePosition = joueur.calculerNouvellePosition(deltaX, deltaY, this.arena.taille);
      
      if (nouvellePosition !== null) {
        // Vérifier si la case est un obstacle
        const caseElement = this.arena.cases[nouvellePosition].element;
        if (caseElement.classList.contains('obstacle')) {
          afficherNotification("Vous ne pouvez pas vous déplacer sur un obstacle !");
          return;
        }
        
        // Déplacer le joueur
        this.deplacerJoueur(joueur, nouvellePosition);
      }
    } else if (key === ' ' || key === 'v') {
      // Sauter sur place
      joueur.sauter();
    }
  }

  // Gérer l'événement lorsqu'une case est cliquée
  onCaseCliquee(index) {
    const joueur = this.getJoueurActif();
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
        // Vérifier si la case cible est un obstacle
        const caseElement = this.arena.cases[index].element;
        if (caseElement.classList.contains('obstacle')) {
          afficherNotification("Vous ne pouvez pas vous déplacer sur un obstacle !");
          return;
        }
        
        // Déplacer le joueur vers la case cliquée
        this.deplacerJoueur(joueur, index);
      } else {
        afficherNotification("Mouvement non valide: vous devez vous déplacer sur une case adjacente.");
      }
    }
  }

  // Gérer le clic sur une case de départ
  onCaseDepartCliquee(id) {
    const joueur = this.getJoueurActif();
    
    // Si le joueur est sur la case départ, le faire entrer dans l'arène
    if (joueur.position === 'depart') {
      this.arena.enterArene(joueur, id);
      afficherNotification(`${joueur.nom} entre dans l'arène !`);
    }
  }

  // Déplacer le joueur vers une nouvelle case
  deplacerJoueur(joueur, nouvellePosition) {
    // Retirer le joueur de sa position actuelle
    if (joueur.getElement().parentNode) {
      joueur.getElement().parentNode.removeChild(joueur.getElement());
    }
    
    // Ajouter le joueur à la nouvelle case
    this.arena.cases[nouvellePosition].div.appendChild(joueur.getElement());
    
    // Mettre à jour la position du joueur
    joueur.setPosition(nouvellePosition);
    
    // Interagir avec la case (bonus, piège, etc.)
    this.arena.interagirAvecCase(nouvellePosition);
    
    // Passer au joueur suivant (tour par tour)
    this.prochainJoueur();
  }
}

// Fonction auxiliaire pour afficher des notifications
function afficherNotification(message) {
  console.log(message);
  
  // Chercher un élément de notification existant ou en créer un
  let notification = document.getElementById('notification');
  
  if (!notification) {
    notification = document.createElement('div');
    notification.id = 'notification';
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.left = '50%';
    notification.style.transform = 'translateX(-50%)';
    notification.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    notification.style.color = 'white';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '5px';
    notification.style.zIndex = '1000';
    notification.style.textAlign = 'center';
    
    document.body.appendChild(notification);
  }
  
  // Mettre à jour le message
  notification.textContent = message;
  
  // Assurer que l'élément est visible
  notification.style.display = 'block';
  
  // Supprimer la notification après 3 secondes
  setTimeout(() => {
    notification.style.display = 'none';
  }, 3000);
}