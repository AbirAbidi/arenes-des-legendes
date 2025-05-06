// arena.js
// Création et gestion de l'arène de jeu

let caseDepart; // Déclaration de la case de départ

// Création des cases de l'arène
function creerArene() {
  const arene = document.getElementById('arene');
  arene.style.gridTemplateColumns = `repeat(${TAILLE}, 1fr)`;
  
  // Création des cases
  for (let i = 0; i < TOTAL_CASES; i++) {
    const caseDiv = document.createElement('div');
    caseDiv.classList.add('case');
    caseDiv.id = `case-${i}`;

    const decor = document.createElement('div');
    decor.classList.add('decor');

    const element = document.createElement('div');
    element.classList.add('element');

    caseDiv.appendChild(decor);
    caseDiv.appendChild(element);
    arene.appendChild(caseDiv);

    cases.push({ div: caseDiv, element, id: i });

    // Gestion de l'effet surprise sur clic
    caseDiv.addEventListener('click', function() {
      this.classList.add('surprise');
      setTimeout(() => this.classList.remove('surprise'), 500);

      const elem = cases[i].element;
      // Utilisation de notifications au lieu des alertes pour éviter de bloquer l'animation
      if (elem.classList.contains('bonus')) {
        afficherNotification("🎁 Vous avez découvert un BONUS !");
      } else if (elem.classList.contains('piege')) {
        afficherNotification("💥 Oh non, un PIÈGE !");
      } else if (elem.classList.contains('obstacle')) {
        afficherNotification("⛔ C'est un OBSTACLE !");
      } else if (elem.dataset.surprise === 'bonus') {
        afficherNotification("🎁 Surprise ! C'était un BONUS caché !");
      } else if (elem.dataset.surprise === 'piege') {
        afficherNotification("💥 Surprise ! C'était un PIÈGE caché !");
      } else {
        afficherNotification("🔍 Rien de spécial ici...");
      }
    });
  }
  
  // Placement des éléments dans l'arène
  // Obstacles visibles
  for (let i = 0; i < NB_OBSTACLES; i++) {
    const index = positionAleatoire();
    cases[index].element.classList.add('obstacle');
  }

  // Bonus visibles
  for (let i = 0; i < NB_BONUS; i++) {
    const index = positionAleatoire();
    cases[index].element.classList.add('bonus');
  }

  // Pièges visibles
  for (let i = 0; i < NB_PIEGES; i++) {
    const index = positionAleatoire();
    cases[index].element.classList.add('piege');
  }

  // Surprises cachées
  for (let i = 0; i < NB_SURPRISES; i++) {
    const index = positionAleatoire();
    const type = Math.random() < 0.5 ? 'bonus' : 'piege';
    cases[index].element.dataset.surprise = type;
    cases[index].element.innerText = "?";
  }
  
  return arene;
}

// Création de la case de départ
function creerCaseDepart() {
  caseDepart = document.createElement('div');
  caseDepart.classList.add('case', 'depart');
  caseDepart.id = 'case-depart';
  caseDepart.textContent = 'DÉPART';
  document.body.appendChild(caseDepart);
  
  // Positionnement de la case départ relative à l'arène
  setTimeout(() => {
    const arene = document.getElementById('arene');
    const areneRect = arene.getBoundingClientRect();
    const premiereCaseRect = cases[0].div.getBoundingClientRect();
    
    caseDepart.style.position = 'absolute';
    caseDepart.style.top = premiereCaseRect.top + 'px';
    caseDepart.style.left = (premiereCaseRect.left - 100) + 'px';
    caseDepart.style.width = '80px';
    caseDepart.style.height = '80px';
    caseDepart.style.backgroundColor = '#8bc34a';
    caseDepart.style.border = '3px solid #689f38';
    
    console.log("Case départ positionnée à", caseDepart.style.left, caseDepart.style.top);
  }, 100);
  
  return caseDepart;
}

// Fonction pour gérer l'interaction avec une case
function interagirAvecCase(position) {
  const element = cases[position].element;

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
  }
}