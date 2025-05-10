class Arena {
  constructor(containerId, taille, nbBonus, nbPieges, nbObstacles, nbSurprises) {
    this.areneElement = document.getElementById(containerId);
    if (!this.areneElement) {
      throw new Error(`Conteneur '${containerId}' introuvable`);
    }

    this.taille = taille;
    this.totalCases = taille * taille;
    this.nbBonus = nbBonus;
    this.nbPieges = nbPieges;
    this.nbObstacles = nbObstacles;
    this.nbSurprises = nbSurprises;
    this.cases = [];
    this.areneCreated = false;
  }

  creerArene() {
    const arene = this.areneElement;
    if (!arene) {
      console.error("L'élément arene n'a pas été trouvé dans le DOM");
      return null;
    }

    // Style de grille
    arene.style.display = 'grid';
    arene.style.gridTemplateColumns = `repeat(${this.taille}, 1fr)`;
    arene.style.gap = '4px';

    arene.innerHTML = '';
    this.cases = [];

    for (let i = 0; i < this.totalCases; i++) {
      const caseDiv = document.createElement('div');
      caseDiv.classList.add('case');
      caseDiv.id = `case-${i}`;
      caseDiv.textContent = `ID ${i}`; // Pour le debug

      const decor = document.createElement('div');
      decor.classList.add('decor');

      const element = document.createElement('div');
      element.classList.add('element');

      caseDiv.appendChild(decor);
      caseDiv.appendChild(element);
      arene.appendChild(caseDiv);

      this.cases.push({ div: caseDiv, element, id: i });

      caseDiv.addEventListener('click', () => this.interagirAvecCase(i));
    }

    this.placerElements();
    this.areneCreated = true;
    console.log(`Arène créée avec succès, ${this.cases.length} cases`);
    return arene;
  }

  placerElements() {
    this.ajouterElements(this.nbObstacles, 'obstacle');
    this.ajouterElements(this.nbBonus, 'bonus');
    this.ajouterElements(this.nbPieges, 'piege');
    this.ajouterSurprises(this.nbSurprises);
  }

  ajouterElements(nb, type) {
    let i = 0;
    while (i < nb) {
      const index = this.positionAleatoire();
      const element = this.cases[index].element;

      const caseLibre =
        !element.classList.contains('bonus') &&
        !element.classList.contains('piege') &&
        !element.classList.contains('obstacle') &&
        !element.dataset.surprise;

      if (caseLibre) {
        element.classList.add(type);
        i++;
      }
    }
  }

  ajouterSurprises(nb) {
    let i = 0;
    while (i < nb) {
      const index = this.positionAleatoire();
      const element = this.cases[index].element;

      const caseLibre =
        !element.classList.contains('bonus') &&
        !element.classList.contains('piege') &&
        !element.classList.contains('obstacle') &&
        !element.dataset.surprise;

      if (caseLibre) {
        const type = Math.random() < 0.5 ? 'bonus' : 'piege';
        element.dataset.surprise = type;
        element.innerText = "?";
        i++;
      }
    }
  }

  interagirAvecCase(position) {
    const element = this.cases[position].element;

    if (element.classList.contains('bonus')) {
      afficherNotification("🎁 Vous avez trouvé un BONUS !");
      element.classList.remove('bonus');
    } else if (element.classList.contains('piege')) {
      afficherNotification("💥 Vous êtes tombé sur un PIÈGE !");
    } else if (element.classList.contains('obstacle')) {
      afficherNotification("⛔ Vous avez rencontré un OBSTACLE !");
    } else if (element.dataset.surprise === 'bonus') {
      afficherNotification("🎁 Surprise ! C'était un BONUS caché !");
      delete element.dataset.surprise;
      element.innerText = "";
    } else if (element.dataset.surprise === 'piege') {
      afficherNotification("💥 Surprise ! C'était un PIÈGE caché !");
      delete element.dataset.surprise;
      element.innerText = "";
    } else {
      afficherNotification("🔍 Rien de spécial ici...");
    }
  }

  positionAleatoire() {
    return Math.floor(Math.random() * this.totalCases);
  }

  initialiserCasesDepart() {
    const infos = [
      { id: 'case-depart-j1', label: 'J1', couleur: 'red' },
      { id: 'case-depart-j2', label: 'J2', couleur: 'blue' },
      { id: 'case-depart-j3', label: 'J3', couleur: 'green' },
      { id: 'case-depart-j4', label: 'J4', couleur: 'orange' }
    ];

    infos.forEach(({ id, label, couleur }) => {
      let el = document.getElementById(id);
      if (!el) {
        el = document.createElement('div');
        el.id = id;
        el.classList.add('case', 'depart');
        el.textContent = label;
        el.style.position = 'absolute';
        el.style.width = '80px';
        el.style.height = '80px';
        el.style.backgroundColor = couleur;
        el.style.border = '3px solid black';
        el.style.display = 'none';
        document.body.appendChild(el);
      }
    });
  }

  afficherCasesDepart(nbJoueurs) {
    const config = [
      { id: 'case-depart-j1', index: 0, decalageX: -100 },
      { id: 'case-depart-j2', index: this.taille - 1, decalageX: 100 },
      { id: 'case-depart-j3', index: (this.taille - 1) * this.taille, decalageX: -100 },
      { id: 'case-depart-j4', index: this.totalCases - 1, decalageX: 100 }
    ];

    for (let i = 0; i < 4; i++) {
      const el = document.getElementById(config[i].id);
      if (i < nbJoueurs && this.cases[config[i].index]) {
        const ref = this.cases[config[i].index].div.getBoundingClientRect();
        el.style.display = 'block';
        el.style.top = `${ref.top}px`;
        el.style.left = `${ref.left + config[i].decalageX}px`;
      } else if (el) {
        el.style.display = 'none';
      }
    }
  }

  repositionnerCasesDepart(nbJoueurs) {
    this.afficherCasesDepart(nbJoueurs);
  }
}
