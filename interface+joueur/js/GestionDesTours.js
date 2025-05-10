class GestionDesTours {
  constructor(joueurs) {
    this.joueurs = joueurs;
    this.indexTour = 0;
  }

  determinerPremierTour() {
    let joueurPremier = null;
    let scoreMax = -1;

    for (let joueur of this.joueurs) {
      if (joueur.score > scoreMax) {
        scoreMax = joueur.score;
        joueurPremier = joueur;
      }
    }

    console.log(`${joueurPremier.nom} commence avec ${scoreMax}`);
    this.setPremierJoueur(joueurPremier);
  }

  setPremierJoueur(joueurPremier) {
    this.indexTour = this.joueurs.indexOf(joueurPremier);
  }

  getJoueurActif() {
    return this.joueurs[this.indexTour];
  }

  passerAuJoueurSuivant() {
    this.indexTour = (this.indexTour + 1) % this.joueurs.length;
  }
  demarrerJeu() {
  document.addEventListener('keydown', (event) => {
    const joueurActif = this.getJoueurActif();
    
    if (!joueurActif) {
      console.warn("Aucun joueur actif actuellement");
      return;
    }
    
    if (!this.peutAgir(joueurActif)) {
      console.log("Le joueur est occupé, impossible d'effectuer une action");
      return;
    }
    
    console.log(`Touche pressée: ${event.key} pour ${joueurActif.nom}`);
    joueurActif.gererTouche(event.key);
  });
 
  // Démarrage officiel du tour par tour
  this.gestionDesTours.demarrer();
}
demarrer() {
  this.tourEnCours = true;
  console.log("Début du système de tour par tour");
  const joueur = this.getJoueurActif();
  afficherNotification(`Le jeu commence! Au tour de ${joueur.nom}`);
}
}
