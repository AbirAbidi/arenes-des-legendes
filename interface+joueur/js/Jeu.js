class Jeu {
  constructor() {
    this.joueurs = [];
    this.gestionDesTours = null;
    this.gestionDesEvenements = null;
    this.arene = null; // Initialisé plus tard
    this.caseDepart = null; // Initialisation explicite
    this.aLance = false;
   
  }

  initialiser() {
  console.log("Initialisation du jeu...");
  
  // 1. Créer l'arène AVEC LE BON CONTENEUR DOM
  this.arene = new Arena(
    'arene',  // ID du conteneur dans le HTML
    7,        // Taille (7x7)
    5,        // nbBonus
    5,        // nbPieges
    5,        // nbObstacles
    3         // nbSurprises
  );
  
  // 2. Construire physiquement l'arène dans le DOM
  const areneCree = this.arene.creerArene();
  if (!areneCree) {
    console.error("Échec critique : création de l'arène");
    return;
  }
  
  const joueur1 = new Joueur("idl/Idle.png", "J1");
const joueur2 = new Joueur("idl/Idle2.png", "J2");
  this.joueurs = [joueur1, joueur2];
  
  // Initialiser la gestion des tours avec les joueurs créés
  this.gestionDesTours = new GestionDesTours(this.joueurs);
  this.gestionDesEvenements = new GestionEvenements(this);
  
  // Ajouter les joueurs à la gestion des événements
  this.gestionDesEvenements.ajouterJoueur(joueur1);
  this.gestionDesEvenements.ajouterJoueur(joueur2);
  
  // Créer les cases départ et lier aux joueurs dans le même contexte
  setTimeout(() => {
    const caseDepart1 = this.arene.creerCaseDepart();
    
    const caseDepart2 = this.arene.creerCaseDepart();
    
    // Vérifier que les cases départ existent
    if (!caseDepart1 || !caseDepart2) {
      console.error("Échec de création des cases départ");
      return;
    }
    
    // Lier les cases de départ aux joueurs
    if (caseDepart1 && joueur1.element) {
      caseDepart1.appendChild(joueur1.getElement());
      joueur1.caseDepart = caseDepart1; // Ajouter cette ligne
    }
    
    if (caseDepart2 && joueur2.element) {
      caseDepart2.appendChild(joueur2.getElement());
      joueur2.caseDepart = caseDepart2; // Ajouter cette ligne
    }
    
    // Initialiser les cases de départ après leur création
    this.gestionDesEvenements.initialiserCasesDepart();
  }, 500);
}

  getJoueurActif() {
    return this.gestionDesTours?.getJoueurActif(); // Ajouter "?." pour la sécurité
  }

  peutAgir(joueur) {
    return !joueur.estOccupe(); // simple vérification
  }

demarrerJeu() {
  // Initialiser les événements clavier SEULEMENT ICI
  document.addEventListener('keydown', (event) => {
    const joueurActif = this.getJoueurActif();
    if(joueurActif) joueurActif.gererTouche(event.key);
  });
  
  // Démarrage officiel du tour par tour
  this.gestionDesTours.demarrer();
}
}
