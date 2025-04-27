const arene = document.getElementById('arene');

function creerCaseTexturee() {
  const texturedCase = document.createElement('div');
  texturedCase.classList.add('case-texturee');

  for (let i = 0; i < 16; i++) {
    const pixel = document.createElement('div');
    pixel.classList.add('mini-pixel');

    const isCorner = (i === 0 || i === 3 || i === 12 || i === 15);

    if (isCorner && Math.random() < 0.6) {
      // Coin vert doux
      pixel.style.backgroundColor = `rgb(${150 + Math.floor(Math.random() * 20)}, ${180 + Math.floor(Math.random() * 40)}, ${150 + Math.floor(Math.random() * 20)})`;
    } else if (Math.random() < 0.25) {
      // Ombres / pierres
      const d = 160 + Math.floor(Math.random() * 20);
      pixel.style.backgroundColor = `rgb(${d}, ${d - 10}, ${d - 20})`;
    } else {
      // Base marron clair
      const b = 200 + Math.floor(Math.random() * 20);
      pixel.style.backgroundColor = `rgb(${b}, ${b - 15}, ${b - 30})`;
    }

    texturedCase.appendChild(pixel);
  }

  return texturedCase;
}

// Générer la grille
for (let i = 0; i < 49; i++) {
  const chance = Math.random();

  if (chance < 0.4) {
    arene.appendChild(creerCaseTexturee());
  } else {
    const simpleCase = document.createElement('div');
    simpleCase.classList.add('case');

    // Couleur de fond simple
    if (chance < 0.6) {
      simpleCase.style.backgroundColor = "#c9d8c5"; // Vert pâle
    } else if (chance < 0.8) {
      simpleCase.style.backgroundColor = "#e7d9c4"; // Beige sable
    } else {
      simpleCase.style.backgroundColor = "#b0a490"; // Taupe
    }

    arene.appendChild(simpleCase);
  }
}
