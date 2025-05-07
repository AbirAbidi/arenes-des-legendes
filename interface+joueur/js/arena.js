// arena.js
// Création et gestion de l'arène de jeu


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

// Modification de la fonction creerCaseDepart pour forcer un reflow
function creerCaseDepart(index, label, couleur, id, decalageX = -100) {
  const caseDepart = document.createElement('div');
  caseDepart.classList.add('case', 'depart');
  caseDepart.id = id;
  caseDepart.textContent = label;
  document.body.appendChild(caseDepart);

  // Forcer un reflow avant de calculer les positions
  document.body.offsetHeight; // Cette ligne force un reflow
  
  // Utiliser un délai plus long pour s'assurer que toutes les cases sont positionnées
  setTimeout(() => {
    const caseRef = cases[index].div.getBoundingClientRect();
    
    caseDepart.style.position = 'absolute';
    caseDepart.style.top = `${caseRef.top}px`;
    caseDepart.style.left = `${caseRef.left + decalageX}px`;
    caseDepart.style.width = '80px';
    caseDepart.style.height = '80px';
    caseDepart.style.backgroundColor = couleur;
    caseDepart.style.border = '3px solid black';
    
    // Forcer encore un reflow après avoir défini les styles
    document.body.offsetHeight;
  }, 300); // Augmenter le délai à 300ms

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
function repositionnerCasesDepart() {
  const caseDepartJ1 = document.getElementById('case-depart-j1');
  const caseDepartJ2 = document.getElementById('case-depart-j2');
  
  if (caseDepartJ1 && caseDepartJ2 && cases.length > 0) {
    const caseRef1 = cases[0].div.getBoundingClientRect();
    const caseRef2 = cases[TOTAL_CASES - 1].div.getBoundingClientRect();
    
    caseDepartJ1.style.top = `${caseRef1.top}px`;
    caseDepartJ1.style.left = `${caseRef1.left - 100}px`;
    
    caseDepartJ2.style.top = `${caseRef2.top}px`;
    caseDepartJ2.style.left = `${caseRef2.left + 100}px`;
  }
}

// Appeler cette fonction à plusieurs moments pour être sûr
setTimeout(repositionnerCasesDepart, 500);
setTimeout(repositionnerCasesDepart, 1000);
window.addEventListener('load', repositionnerCasesDepart);
window.addEventListener('resize', repositionnerCasesDepart);