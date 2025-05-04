const arene = document.getElementById('arene');
const TAILLE = 7;
const TOTAL_CASES = TAILLE * TAILLE;

const NB_OBSTACLES = 4;
const NB_BONUS = 4;
const NB_PIEGES = 4;
const NB_SURPRISES = 5;

const positionsUtilisées = new Set();

function positionAleatoire() {
  let pos;
  do {
    pos = Math.floor(Math.random() * TOTAL_CASES);
  } while (positionsUtilisées.has(pos));
  positionsUtilisées.add(pos);
  return pos;
}

const cases = [];

// Création des cases
for (let i = 0; i < TOTAL_CASES; i++) {
  const caseDiv = document.createElement('div');
  caseDiv.classList.add('case');

  const decor = document.createElement('div');
  decor.classList.add('decor');

  const element = document.createElement('div');
  element.classList.add('element');

  caseDiv.appendChild(decor);
  caseDiv.appendChild(element);
  arene.appendChild(caseDiv);

  cases.push({ div: caseDiv, element });

  // ✅ Gestion de l'effet surprise AU BON ENDROIT
  caseDiv.addEventListener('click', () => {
    caseDiv.classList.add('surprise');
    setTimeout(() => caseDiv.classList.remove('surprise'), 500);

    const elem = cases[i].element;
    if (elem.classList.contains('bonus')) {
      alert("🎁 Vous avez découvert un BONUS !");
    } else if (elem.classList.contains('piege')) {
      alert("💥 Oh non, un PIÈGE !");
    } else if (elem.classList.contains('obstacle')) {
      alert("⛔ C'est un OBSTACLE !");
    } else if (elem.dataset.surprise === 'bonus') {
      alert("🎁 Surprise ! C'était un BONUS caché !");
    } else if (elem.dataset.surprise === 'piege') {
      alert("💥 Surprise ! C'était un PIÈGE caché !");
    } else {
      alert("🔍 Rien de spécial ici...");
    }
  });
}

// Obstacle visibles
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

// 🎁 Surprise cachée (aucune classe visible, juste data)
for (let i = 0; i < NB_SURPRISES; i++) {
  const index = positionAleatoire();
  const type = Math.random() < 0.5 ? 'bonus' : 'piege';
  cases[index].element.dataset.surprise = type;
// Pour debug uniquement : 
  cases[index].element.innerText = "?";
}
