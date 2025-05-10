// Liste des personnages
const personnages = [
  {
    nom: "guerrier",
    specialite: "Résistant, bon en mêlée",
    image: "/assets/characters/guerrier.png",
  },
  {
    nom: "archer",
    specialite: "Rapide, esquive facile",
    image: "/assets/characters/archer.png",
  },
  {
    nom: "mage",
    specialite: "Attaque magique puissante, à distance",
    image: "/assets/characters/mage.png",
  }
];

let currentPlayer = 0;
let index = 0 ;
let playerSelections = [];
const characterImage = document.getElementById('character-image');
const characterName = document.getElementById('character-name');
const characterSpeciality = document.getElementById('character-specialite');
const prevBtn = document.getElementById('previous');
const nextBtn = document.getElementById('next');
const selectBtn = document.getElementById('select-btn');
const playerSelection = document.getElementById('player-selection');
const characterSelection = document.getElementById('character-selection');
const selectionMessage = document.getElementById('selection-message');
const playerButtons = document.querySelectorAll('.player-btn');

function afficherPersonnage(i) {
  characterImage.src = personnages[i].image;
  characterName.textContent = personnages[i].nom;
  characterSpeciality.textContent = personnages[i].specialite;
}

prevBtn.addEventListener('click', () => {
  index = (index - 1 + personnages.length) % personnages.length;
  afficherPersonnage(index);
});

nextBtn.addEventListener('click', () => {
  index = (index + 1) % personnages.length;
  afficherPersonnage(index);
});

// show the characters for the current player
function displayCharacterSelectionScreen(playerNum) {
  characterSelection.style.display = 'block';
  playerSelection.style.display = 'none';
  selectionMessage.textContent = `Joueur ${playerNum}: choisissez votre personnage`;
  index = 0; // Reset the character index for each player
  afficherPersonnage(index);
}

playerButtons.forEach(button => {
  button.addEventListener('click', () => {
    const numPlayers = parseInt(button.getAttribute('data-players'));
    console.log(numPlayers)
    localStorage.setItem('numPlayers', JSON.stringify(numPlayers));
    currentPlayer = 1;
    playerSelections = new Array(numPlayers); // hethi bech tcreati tableau 9ad nbr of players 9ad 9ad
    displayCharacterSelectionScreen(currentPlayer);
  });
});

// Save  and move to the next player
selectBtn.addEventListener('click', () => {

  const personnageSelectionne = personnages[index];
  let confirmation = window.confirm("Vous avez choisi " + personnageSelectionne.nom + ", voulez-vous confirmer votre choix?");
  if (confirmation) {
    playerSelections[currentPlayer] = personnageSelectionne; // Store the selection in the array
    console.log(`Personnage sélectionné par Joueur ${currentPlayer}:`, personnageSelectionne);
    currentPlayer++;

    if (currentPlayer <= parseInt(localStorage.getItem('numPlayers'))) {
      displayCharacterSelectionScreen(currentPlayer);
    } else {
      characterSelection.style.display = 'none';
      playerSelections = playerSelections.filter(selection => selection !== null); // bech ken fama null fi array tna7ih idk it caused a problem
      localStorage.setItem('playerSelections', JSON.stringify(playerSelections));
       //console.log('Sélections des personnages:', playerSelections);
      window.location.href = '../jeu/jeu.html';
    }
  }
});


window.addEventListener('DOMContentLoaded', () => {
  // Start with player selection
  characterSelection.style.display = 'none';
  playerSelection.style.display = 'block';
});
